## Integrate with existing Express application

1.Install the package

```
npm install wiotpwidgets --save

```

2.Follow the below sample to update the existing express app

```javascript
var http = require('http');
var express = require("express");
var bodyParser = require('body-parser');
var logger = require('morgan');

var IoTWidgets = require("iot-widgets");
// Create an Express app
var app = express();

//Add required middleware’s
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add a simple route for static content served from 'public'
app.use("/",express.static("public"));

// Create a server
var server = http.createServer(app);

// Initialise the IoTWidgets with a server
IoTWidgets.init(server);

// Serve the UI components
app.use(express.static(IoTWidgets.uiPath));

// Serve the http api for the connection

app.use(IoTWidgets.path, IoTWidgets.api);

server.listen(3000);

```

3.Add application credentials under config folder with the following json
``` javascript

    config/default.json

    {
      "api-key" : "Your app key",
      "auth-token" : "your auth-token"
    }

```

Note: You can skip step 3 if you are deploying the app in bluemix with Watson IoT Platform servies bound to this applicaiton
