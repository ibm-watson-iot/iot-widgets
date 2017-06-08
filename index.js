const IoTWidgets = require('./connector/host.js');
const path = require('path');
IoTWidgets.api = require("./connector/api.js");
IoTWidgets.path = '/api';
IoTWidgets.ui = '/dist';
IoTWidgets.uiPath = path.join(__dirname, "dist") ;
module.exports = IoTWidgets;
