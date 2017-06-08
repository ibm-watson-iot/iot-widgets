var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var WIoTPWidget = (function WIoTPWidget() {
  //Connection and callback handling
    function  BaseConnector (){
      this.eventCallback = {}
      this.app = null;
    };
    BaseConnector.prototype.Init = function(){

    };
    BaseConnector.prototype.eventHandler = function(deviceType, deviceId, eventName, format, payload) {

        if( !this.eventCallback[deviceType]
            || !this.eventCallback[deviceType][deviceId]
            || !this.eventCallback[deviceType][deviceId][eventName])
          return;
        var callbacks = this.eventCallback[deviceType][deviceId][eventName];
        if(callbacks){
          for (var i = 0; i < callbacks.length; i++) {
            //queue it to provide breating space
            setTimeout(callbacks[i],0,deviceType, deviceId,format,payload);
          }
        }

      };
    BaseConnector.prototype.subscribeCallback=function(deviceType, deviceId, eventName, callback) {
      if(!this.eventCallback[deviceType]) {
        this.eventCallback[deviceType] = {}
      }
      if(!this.eventCallback[deviceType][deviceId]) {
        this.eventCallback[deviceType][deviceId] = {}
      }
      if(!this.eventCallback[deviceType][deviceId][eventName]) {
        this.eventCallback[deviceType][deviceId][eventName] = []
      }
      this.eventCallback[deviceType][deviceId][eventName].push(callback)
    };
    BaseConnector.prototype.unSubscribeCallback=function(deviceType, deviceId, eventName, callback) {
      if(!this.eventCallback[deviceType]) {
        return;
      }
      if(!this.eventCallback[deviceType][deviceId]) {
        return;
      }
      if(!this.eventCallback[deviceType][deviceId][eventName]) {
        return;
      }

      var index = this.eventCallback[deviceType][deviceId][eventName].indexOf(callback);
      if (index > -1) {
            this.eventCallback[deviceType][deviceId][eventName].splice(index, 1);
        }
    };
    BaseConnector.prototype.getDeviceList=function(deviceType, callback) {
      this.app.listAllDevicesOfType(deviceType).then(callback, function() {
        console.log("error in get list");
      })
    };

    //Direct Watson IoT Platform Connection
    var  WIoTPConnector = (function WIoTPConnector (_super) {
      __extends(WIoTPConnector, _super);
        function  WIoTPConnector (){
          _super.call(this)
        };
        WIoTPConnector.prototype.Init = function(authKey, authToken, appId){
          var config = {
            "org" : authKey.split("-")[1],
            "id" : appId || Date.now() + "",
            //This would have to be modified to support dedicated instances
            "domain": "internetofthings.ibmcloud.com",
            "auth-key" : authKey,
            "auth-token" : authToken
          }
          this.app = new IBMIoTF.IotfApplication(config)
          this.app.connect();
          this.app.on("connect", function() {
              //this.app.subscribeToDeviceEvents();
          }.bind(this));
          this.app.on("deviceEvent",this.eventHandler.bind(this));
          this.topicsSubscribed = [];
        };
        WIoTPConnector.prototype.subscribe = function(deviceType, deviceId, eventName, callback){
          var topic = deviceType+"/"+deviceId+"/"+eventName;
          if(!this.app.isConnected){
            this.app.on("connect", function() {
            //  if(!this.eventCallback[deviceType] || !this.eventCallback[deviceType][deviceId] ||!this.eventCallback[deviceType][deviceId][eventName]||!this.eventCallback[deviceType][deviceId][eventName].length )
                if (this.topicsSubscribed.indexOf(topic) === -1) {
                  this.app.subscribeToDeviceEvents(deviceType, deviceId, eventName);
                  this.topicsSubscribed.push(topic);
                }

            }.bind(this));
          }
          else{
            if (this.topicsSubscribed.indexOf(topic) === -1) {
              this.app.subscribeToDeviceEvents(deviceType, deviceId, eventName);
              this.topicsSubscribed.push(topic);

            }
          }
          this.subscribeCallback(deviceType, deviceId, eventName, callback)
        };
        WIoTPConnector.prototype.unSubscribe = function(deviceType, deviceId, eventName, callback){
          this.unSubscribeCallback(deviceType, deviceId, eventName, callback);
          //check for all listeners present
          if(!this.eventCallback[deviceType] || !this.eventCallback[deviceType][deviceId] ||!this.eventCallback[deviceType][deviceId][eventName]||!this.eventCallback[deviceType][deviceId][eventName].length ){
                  this.app.unsubscribeToDeviceEvents(deviceType, deviceId, eventName);
                  var topic = deviceType+"/"+deviceId+"/"+eventName;
                  var index = this.topicsSubscribed.indexOf(topic);
                  if (index > -1) {
                        this.topicsSubscribed.splice(index, 1);
                    }
          }
        };
        WIoTPConnector.prototype.getDeviceList=function(deviceType, callback) {
          this.app.listAllDevicesOfType(deviceType).then(callback, function() {
            console.log("error in get list");
          })
        };
      return new WIoTPConnector();
    })(BaseConnector);

    //Secure WebSocket connection the page host
    var WSConnector = (function WSConnector(_super) {
      __extends(WSConnector, _super);
      function WSConnector() {
        _super.call(this);
        this.isConnected;
        this.topicsSubscribed = [];
        this.pendingSubscription = [];
      }
      WSConnector.prototype.init =function(url){
        this.connection = new WebSocket(url,"echo-protocol")
        this.callback;

        this.connection.onopen = function (event) {
          console.log("Connected to the WS");
          //this.isConnected = true;
          this.interval = setInterval(function () {
            //console.log("telling i am alive");
            this.connection.send("ping")
          }.bind(this),60000);
        }.bind(this);
        this.connection.onclose = function(event){
          this.isConnected = false;
          clearInterval(this.interval);
        }.bind(this);
        window.addEventListener("unload",function() {
            this.connection.onclose = function () {}; // disable onclose handler first
            this.connection.close()
        }.bind(this));
        this.connection.onmessage = function (event) {
            if(event.data == "connected"){
              this.isConnected = true;
              for (var i = 0; i < this.pendingSubscription.length; i++) {
                this.pendingSubscription[i]();
              }
              this.pendingSubscription = [];
            }else{
              var obj = JSON.parse(event.data);
              this.eventHandler(obj.deviceType,obj.deviceId,obj.eventName,obj.format, obj.payload)
            }
          }.bind(this)
      };
      WSConnector.prototype.subscribe = function(deviceType, deviceId, eventName, callback){
        var topic = deviceType+"/"+deviceId+"/"+eventName;

        var publish = function(deviceType, deviceId, eventName){
          if (this.topicsSubscribed.indexOf(topic) === -1) {
                var obj = {"deviceId":deviceId,
                           "deviceType":deviceType,
                           "eventName":eventName,
                           "subscribe":true
                         }
                this.connection.send(JSON.stringify(obj));
                this.topicsSubscribed.push(topic);
            }
        }.bind(this);

        if(!this.isConnected){
        this.pendingSubscription.push( function() {
            publish(deviceType, deviceId, eventName);
          }.bind(this));
        }
        else{
            publish(deviceType, deviceId, eventName);
        }

        this.subscribeCallback(deviceType, deviceId, eventName, callback)
      };
      WSConnector.prototype.unSubscribe = function(deviceType, deviceId, eventName, callback){
        this.unSubscribeCallback(deviceType, deviceId, eventName, callback);
        //check for all listeners present
        if(!this.eventCallback[deviceType] || !this.eventCallback[deviceType][deviceId] ||!this.eventCallback[deviceType][deviceId][eventName]||!this.eventCallback[deviceType][deviceId][eventName].length ){
            var topic = deviceType+"/"+deviceId+"/"+eventName;
            var index = this.topicsSubscribed.indexOf(topic);
            if (index > -1) {
              this.topicsSubscribed.splice(index, 1);
              this.connection.send(JSON.stringify({"deviceId":deviceId,"deviceType":deviceType,"eventName":eventName,"subscribe":false}));
            }
        }
      };
      WSConnector.prototype.disconnect =function () {
        this.connection.onclose = function () {}; // disable onclose handler first
        this.connection.close()
        this.isConnected = false;
      };
      return new WSConnector();
    })(BaseConnector)

    //Store of all group
    var collection ={};
    var base = null;

    var connector = WSConnector;
    if(location.host.match("localhost")){
      connector.init("ws://"+location.host+"/ws")
    }
    else{
      connector.init("wss://"+location.host+"/ws")

    }
    var schema = {
      "gauge" :{
            "deviceType":"",
            "deviceId":"",
            "eventName":"",
            "param":""
      },
      "chart":{
            "deviceType":"",
            "deviceId":"",
            "eventName":"",
            "params":""
      },
      "map":{
            "deviceType":"",
            "deviceId":"",
            "eventName":"",
            "params":""
      },
      "layout":{
            "deviceType":"",
            "deviceId":"",
            "eventName":"",
            "params":""
      }
    };
    function Init ( authKey, authToken, appId ) {
       connector.disconnect();
       WIoTPConnector.Init( authKey, authToken, appId)
       connector = WIoTPConnector;
     }
     function CreateGauge(id,eventType, deviceType, deviceId, dataPoint, prop, colour, config) {
         var gauge = new Gauge(collection);
         gauge.CreateWidget(connector, id, eventType, deviceType, deviceId, dataPoint, prop, colour, config);
         return gauge;
     }
     function CreateChart(id, eventType, deviceType, deviceId, dataPoint, type, colour, config) {
       var chart = new Chart(collection);
       chart.CreateWidget(connector, id, eventType, deviceType, deviceId, dataPoint, type, colour, config);
       return chart;
     }
     function CreateOMap(id, latitude, longitude, config) {
       var map = new OMap(collection);
       map.CreateWidget(connector, id, latitude, longitude, config);
       return map;
     }

     function CreateConnectedOMap (id, deviceType, deviceId, eventType, config) {
       var map = new OMap(collection);
       map.CreateConnectedWidget(connector, id, deviceType, deviceId, eventType, config);
       return map;
     }
     function CreateLayout ( id, width, height, imageURL) {
       var layout = new BaseLayout(collection);
       layout.createFloorPlan(connector, id, width, height, imageURL);
       return layout;
     }
     function groupUpdate(groupName,deviceType,deviceId,eventType,dataPoint){
       if(!base)
         base = new BaseWidget(collection)
       base.updateCollection(groupName,deviceType,deviceId,eventType,dataPoint)
     }
     function getAllDevices(callback){
       d3.json(location.protocol +"//"+location.host+"/api/getalldevices",callback);
     }
     function getAllDevicesOfType (typeid,callback){
       d3.json(location.protocol +"//"+location.host+"/api/getalldevicesoftype/"+typeid,callback);
     }
     function getAllDevicetypes(callback){
       d3.json(location.protocol +"//"+ location.host+"/api/getalldevicetypes",callback);
     }
     function getAllLastEvents(deviceType,deviceId,callback){
       d3.json(location.protocol +"//"+ location.host+"/api/device/types/"+deviceType+"/devices/"+deviceId+"/events",callback);
     }
     function getGroupCollection() {
       return collection;
     }
     function getConnector(){
       return connector;
     }
     function getSchema(){
       return JSON.parse(JSON.stringify(schema));
     }
     function initWidget (id,type,config){
       switch (type) {
         case "gauge":
               return CreateGauge(id,config.eventName,config.deviceType,config.deviceId,config.param);
           break;
         case "chart":
                return CreateChart(id,config.eventName,config.deviceType,config.deviceId,config.params,[["area-spline","ActualTemperature"],["scatter","DesiredTemperature"]],['#2ca02c','#d62728']);
           break;
         case "map":
               return CreateOMap(id,12.9523877, 77.6440203);
           break;
         case "layout":
               var plainLayout = CreateLayout(id,720,487,'Sample_Floorplan.jpg')
               plainLayout.addHeatmap({
                 "binSize": 3,
                 "units": "\u00B0C",
                 "map": [
                   {"value": 0, "points": [{"x":2.513888888888882,"y":8.0},
                                  {"x":6.069444444444433,"y":8.0},
                                  {"x":6.069444444444434,"y":5.277535934291582},
                                  {"x":8.20833333333332,"y":2.208151950718685},
                                  {"x":13.958333333333323,"y":2.208151950718685},
                                  {"x":16.277777777777825,"y":5.277535934291582},
                                  {"x":16.277777777777803,"y":10.08151950718685},
                                  {"x":17.20833333333337,"y":10.012135523613962},
                                  {"x":17.27777777777782,"y":18.1387679671458},
                                  {"x":2.513888888888882,"y":18.0}]}]
                 },config.deviceType,config.deviceId,config.eventName,config.param,[-10,0,10,23,30,50]);
                 return plainLayout;
           break;
         default:

       }
     }
     function initWidgets (obj) {
       for(var k in obj)
       {
         initWidget(k,obj[k].type,obj[k].config)
       }
     }
    return {
      "Init":Init,
      "CreateGauge":CreateGauge,
      "CreateChart": CreateChart,
      "CreateOMap":CreateOMap,
      "CreateConnectedOMap" :CreateConnectedOMap,
      "createLayout" : CreateLayout,
      "groupUpdate" : groupUpdate ,
      "getAllDevices":getAllDevices,
      "getAllDevicesOfType":getAllDevicesOfType,
      "getAllDevicetypes":getAllDevicetypes,
      "getGroupCollection" : getGroupCollection,
      "getConnector":getConnector,
      "initWidget" :initWidget,
      "initWidgets":initWidgets,
      "getSchema":getSchema,
      "getAllLastEvents":getAllLastEvents
    }
})()

//BackUp for building connection to node-red
// var WSConnector = (function WSConnector() {
//   function WSConnector() {
//     this.connection = new WebSocket("wss://uifordevx.eu-gb.mybluemix.net/ws")
//     this.callback;
//     this.connection.onopen = function (event) {
//     }
//     this.connection.onmessage = function (event) {
//         this.callback(event.data)
//       }.bind(this)
//   }
//   WSConnector.prototype.setCallback=function (c){
//     this.callback =c;
//   }
//   return new WSConnector();
// })()
