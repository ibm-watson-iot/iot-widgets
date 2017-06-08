### API
#### Get all registered  devices
To get all the devices registered in the Watson IoT Platform

@js
```javascript
WIoTPWidget.getAllDevices(function(resObj){
  var result = resObj.results;
  })
```
#### Get all device type
To get all the device type in the Watson IoT Platform

@js
```javascript
WIoTPWidget.getAllDevicetypes(function(resObj){
  var result = resObj.results;
  })
```
#### Get all Devices Of Type
To get all the Devices Of given type registered in the Watson IoT Platform

@js
```javascript
WIoTPWidget.getAllDevicesOfType(deviceType,function(resObj){
  var result = resObj.results;
  })
```

#### Get all last event for the given device
To get all the last event for the given device registered in the Watson IoT Platform

@js
```javascript
WIoTPWidget.getAllLastEvents(deviceType,deviceId,function(resObj){
  var result = resObj.results;
  })
```

#### Removing a Widget

To remove/unload a widget from the DOM you need to call the destroy method

@js

```javascript
document.getElementById(html_id).innerHTML =""
widgetObject.Destroy()

```
where

|Name| Description | type|
|-----|---------|----|
|widgetObject| Object returned when an widget is created for e.g <code> var widgetObject = WIoTPWidget.CreateChart(html_id,eventName,  deviceType,deviceId,params,type,color,config);</code>  | widget Object |

This will clean up the widget and all the associated event listeners and other resources allotted for the same
