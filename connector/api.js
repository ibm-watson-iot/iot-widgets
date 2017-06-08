var express = require('express');
var config = require('config');
var router = express.Router();
var ibmiotf = require('ibmiotf');
var getAuthFromVCAP = require('./vcap.js');
// credential store
var creds = {};
if(process.env.VCAP_SERVICES){
	console.log("[API Host] : Running in Bluemix. Check if bound to iot service");
	creds = getAuthFromVCAP(process.env.VCAP_SERVICES);
}

if(Object.keys(creds).length === 0 && creds.constructor === Object) {
	console.log("[API Host] : Check if credentials are present in config file")
	if(config.has('api-key') && config.has('auth-token')) {
		creds['auth-token'] = config.get('auth-token');
		creds['api-key'] = config.get('api-key');
		console.log('[API Host] : credentials found in config file')
	} else {
		throw "api-key and/or auth token is not present in config file";
	}
}

var appClientConfig = {
	org: creds['api-key'].split('-')[1],
	id: ''+Date.now(),
	"domain": "messaging.internetofthings.ibmcloud.com",
	"auth-key": creds['api-key'],
	"auth-token": creds['auth-token']
};
var appClientMessaging = new ibmiotf.IotfApplication(appClientConfig);

appClientConfig.domain = "internetofthings.ibmcloud.com";
var appClient = new ibmiotf.IotfApplication(appClientConfig);

/* GET users listing. */
router.post('/types/:typeId/devices/:deviceId/commands/:commandName', function(req, res) {
	console.log("[API Host] : Publish Device Command for %s device with body %s",req.params.deviceId,JSON.stringify(req.body));
	appClientMessaging.
	publishDeviceCommandHTTPS(req.params.typeId, req.params.deviceId, req.params.commandName, "json", JSON.stringify(req.body)). then (function onSuccess (argument) {
		res.status(200).send('Success');
	}, function onError (argument) {
		console.log("[API Host] : Failed to publishDeviceCommandHTTPS");
		console.log(argument);
		res.status(argument.status).send(argument);
	});
});

router.get('/getalldevices', function(req, res) {
	appClient.
	getAllDevices(). then (function onSuccess (argument) {
		res.status(200).send(argument);
	}, function onError (argument) {
		console.log("[API Host] : Failed to getAllDevices");
		console.log(argument);
		res.status(argument.status).send(argument);
	});
});

router.get('/getalldevicesoftype/:typeid', function(req, res) {
	appClient.
	listAllDevicesOfType(req.params.typeid). then (function onSuccess (argument) {
		res.status(200).send(argument);
	}, function onError (argument) {
		console.log("[API Host] : Failed to getalldevicesoftype");
		console.log(argument);
		res.status(argument.status).send(argument);
	});
});

router.get('/device/types/:typeid/devices/:deviceid/events', function(req, res) {
	appClient.
	getLastEvents(req.params.typeid,req.params.deviceid). then (function onSuccess (argument) {
		res.status(200).send(argument);
	}, function onError (argument) {
		console.log("[API Host] : Failed to get lastevent");
		console.log(argument);
		res.status(argument.status).send(argument);
	});
});

router.get('/getalldevicetypes', function(req, res) {
	appClient.
	getAllDeviceTypes().then(function onSuccess (argument) {
		res.status(200).send(argument);
	}, function onError (argument) {
		console.log("[API Host] : Failed to getalldevicetypes");
		console.log(argument);
		res.status(argument.status).send(argument);
	});
});


module.exports = router;
