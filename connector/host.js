/**
* Web Socket impl for iot-widgets
*/
var WebSocket = require('ws');
var ibmiotf = require('ibmiotf');
var getAuthFromVCAP = require('./vcap.js');


var config = require('config');
function WebSocketInit (server){
  // credential store
  var creds = {};

  if(process.env.VCAP_SERVICES){
    console.log("[WS Host] :Running in Bluemix. Check if bound to iot service");
    creds = getAuthFromVCAP(process.env.VCAP_SERVICES);
  }


    if(Object.keys(creds).length === 0 && creds.constructor === Object) {
    	console.log("[WS Host] : Check if credentials are present in config file")
    	if(config.has('api-key') && config.has('auth-token')) {
    		creds['auth-token'] = config.get('auth-token');
    		creds['api-key'] = config.get('api-key');
    		console.log('[WS Host] : credentials found in config file')
    	} else {
    		throw "api-key and/or auth token is not present in config file";
    	}
    }

    var appClientConfig = {
      org: creds['api-key'].split('-')[1],
      id: ''+Date.now(),
      "domain": "internetofthings.ibmcloud.com",
      "auth-key": creds['api-key'],
      "auth-token": creds['auth-token']
    };

    var wss = new WebSocket.Server({ server });
    wss.on('connection', function connection(ws) {

      appClientConfig.id = ''+Date.now() //updateid before connect other details can be same
      var appClient = new ibmiotf.IotfApplication(appClientConfig);
      appClient.connect();
      appClient.log.setLevel('debug');
      var wsOpen =true;
      ws.on('message', function incoming(message) {
        if(message !== "ping"){
          message = JSON.parse(message);
          if(message.subscribe) {
            appClient.subscribeToDeviceEvents(message.deviceType,message.deviceId,message.eventName);
          } else if(!message.subscribe) {
            appClient.unsubscribeToDeviceEvents(message.deviceType,message.deviceId,message.eventName);

          }
        }else {
          //console.log("clien says i am alive");
        }
      });
      ws.on('close', function close() {
        wsOpen =false;
        console.log('[WS Host] : Client disconnected');
        //disconnecting appClient before connecting throws exception
        if(!appClient.isConnected){
          appClient.on("connect", function () {
            appClient.disconnect();
          });
        }else{
          appClient.disconnect();
        }
      });
      appClient.on("connect", function () {
        if(wsOpen)
          ws.send("connected", function(error) {
            if(error)
              console.log("[WS Host] : Error in sending connected message:"+error.message);
          });
      });
      appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
        ws.send(JSON.stringify({"deviceId":deviceId,
                   "deviceType":deviceType,
                   "eventName":eventType,
                   "format" : format,
                   "payload":payload.toString()
          }), function(error) {
            if(error)
              console.log("[WS Host] : Error in sending device event:"+error.message);
          });

      });
      //ws.send('Connected from WS');
    });
}
function init(server){
  WebSocketInit(server);
}

module.exports={init}
