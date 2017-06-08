### Custom Widgets

You can create your own widget with the help of the following  template through you can import any third party lib or use your own widgets into the existing application.

#### Template
@js
```javascript
//Template to create a custom widget
var customWidget = (function customWidget(_super) {
  __extends(customWidget, _super);

  function customWidget(){
    _super.call(this,WIoTPWidget.getGroupCollection());
  };

  customWidget.prototype.CreateWidget =function(id,deviceType,deviceId,eventType,dataPoint,config){ // also data need for your widget config
    this.callback = this.UpdateHandler.bind(this);
    var WIoTPConnector = WIoTPWidget.getConnector();
    WIoTPConnector.subscribe(deviceType,deviceId,eventType, this.callback);

    this.data = {config:config,dataPoint:dataPoint,value:0,deviceId:deviceId,deviceType:deviceType,eventName:eventType};
    //init your widget here
    this.element = document.getElementById(id);
    this.element.innerHTML ="Loading..."

  };

  customWidget.prototype.UpdateHandler = function (deviceType, deviceId,format,payload){
    var payload = JSON.parse(payload);
    if(this.data.value != payload.d[this.data.dataPoint])
    {
        this.data.value = payload.d[this.data.dataPoint];
        //update your widget with the new value
        this.element.innerHTML = this.data.value

    }
  };
  customWidget.prototype.UpdateDevice = function (deviceType,deviceId,eventType,dataPoint){
    //to handle device changes
    var WIoTPConnector = WIoTPWidget.getConnector();
    WIoTPConnector.unSubscribe(this.data.deviceType,this.data.deviceId,this.data.eventName, this.callback);
    WIoTPConnector.subscribe(deviceType,deviceId,eventType, this.callback);
    this.data.deviceType = deviceType;
    this.data.deviceId = deviceId;
    this.data.eventName = eventType;
    this.data.dataPoint =dataPoint;
    //reset your widget as per the new deviece needs
    this.element.innerHTML ="Loading..."
    this.data.value = "Loading..."
  };

  return customWidget;
}
)(BaseWidget);
```

### [Sample code](../../../samples/CustomWidget.html)
