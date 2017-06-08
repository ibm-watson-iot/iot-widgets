var assert = chai.assert;
describe('Lib', function() {

  describe('WIoTPWidget', function() {
    it('should be defined', function() {
      assert.isObject(WIoTPWidget);
    });
    it('should have given properties', function() {
      assert.property(WIoTPWidget , "Init");
      assert.property(WIoTPWidget , "CreateGauge");
      assert.property(WIoTPWidget , "CreateChart");
      assert.property(WIoTPWidget , "CreateOMap");
      assert.property(WIoTPWidget , "CreateConnectedOMap");
      assert.property(WIoTPWidget , "createLayout");
      assert.property(WIoTPWidget , "groupUpdate");
      assert.property(WIoTPWidget , "getAllDevices");
      assert.property(WIoTPWidget , "getAllDevicesOfType");
      assert.property(WIoTPWidget , "getAllDevicetypes");
      assert.property(WIoTPWidget , "getGroupCollection");
      assert.property(WIoTPWidget , "getConnector");
    });
  });
  describe('connector', function() {
    var connector = null;
    beforeEach(function() {
    // runs before all tests in this block
    connector =WIoTPWidget.getConnector();
  });
    var cb= function(){};
    it('should be defined', function() {
      assert.isObject(connector );
    });
    it('check for connection type', function() {
      assert.isTrue(connector.connection instanceof  WebSocket);
    });
    it('disconnect connection', function() {
      connector.disconnect();
      assert.isFalse(connector.isConnected);
    });
    it('subscribe with connection false', function() {
      assert.isFalse(connector.isConnected);
      connector.subscribe("devicetype01","deviceid01","eventname01",function(){});
      assert.equal(1,connector.pendingSubscription.length);
      connector.connection.send =function(json){
        var obj = JSON.parse(json)
        assert.equal(obj.deviceType,"devicetype01");
        assert.equal(obj.deviceId,"deviceid01");
        assert.equal(obj.eventName,"eventname01");
        assert.isTrue(obj.subscribe);
      }
      connector.connection.onmessage({"data":"connected"});
      assert.equal(0,connector.pendingSubscription.length);
      assert.equal(1,connector.topicsSubscribed.length);
      assert.equal("devicetype01/deviceid01/eventname01",connector.topicsSubscribed[0]);
    });
    it('subscribe with connection true', function() {
      connector.isConnected=true;
      assert.isTrue(connector.isConnected);
      assert.equal(0,connector.pendingSubscription.length);
      connector.connection.send =function(json){
        var obj = JSON.parse(json)
        assert.equal(obj.deviceType,"devicetype02");
        assert.equal(obj.deviceId,"deviceid02");
        assert.equal(obj.eventName,"eventname02");
        assert.isTrue(obj.subscribe);
        connector.connection.send= function(){};
      }
      connector.subscribe("devicetype02","deviceid02","eventname02",cb);
      assert.equal(2,connector.topicsSubscribed.length);
      assert.equal("devicetype02/deviceid02/eventname02",connector.topicsSubscribed[1]);
    });
    it('unsubscribe with connection true', function() {
      connector.connection.send =function(json){
        var obj = JSON.parse(json)
        assert.equal(obj.deviceType,"devicetype02");
        assert.equal(obj.deviceId,"deviceid02");
        assert.equal(obj.eventName,"eventname02");
        assert.isFalse(obj.subscribe);
        connector.connection.send= function(){};
      }
      connector.unSubscribe("devicetype02","deviceid02","eventname02",cb);
      assert.equal(1,connector.topicsSubscribed.length);
      assert.equal(-1,connector.topicsSubscribed.indexOf("devicetype02/deviceid02/eventname02"));
    });
    it('subscription handelling', function() {
      var callback = function(deviceType, deviceId,format,payload){
        assert.equal(deviceType,"devicetype03");
        assert.equal(deviceId,"deviceid03");
        assert.equal(format,"json");
        assert.equal(payload,"testpayload");
      }
      connector.subscribe("devicetype03","deviceid03","eventname03",callback);
      connector.connection.onmessage({data:JSON.stringify(
                {"deviceId":"deviceid03",
                 "deviceType":"devicetype03",
                 "eventName":"eventname03",
                 "format":"json",
                 "payload":"testpayload"
               })});
    });
  });
  describe('BaseWidget', function() {
    var instance = null;
    var collection ={};

    it('should be defined', function() {
      assert.isFunction(BaseWidget);
    });
    it('setGroup', function() {
      instance = new BaseWidget(collection);
      instance.setGroup("testGroup");
      assert.equal("testGroup",instance.groupName);
      assert.isArray(collection["testGroup"]);
    });
    it('updateCollection', function() {
      instance = new BaseWidget(collection);
      instance.UpdateDevice= function(deviceType,deviceId,eventType,dataPoint){
        assert.equal(deviceType,"devicetype04");
        assert.equal(deviceId,"deviceid04");
        assert.equal(eventType,"eventtype04");
        assert.equal(dataPoint,"datapoint04");
      }
      instance.setGroup("testGroup01");
      instance.updateCollection("testGroup01","devicetype04","deviceid04","eventtype04","datapoint04")
    });
  });
});
