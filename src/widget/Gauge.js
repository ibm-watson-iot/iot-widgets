var Gauge = (function Gauge(_super) {
  __extends(Gauge, _super);

  function Gauge(collection){
    _super.call(this,collection);
    this.c3 = null;
    this.data = null;
  };

  Gauge.prototype.CreateWidget =function(WIoTPConnector,id,eventType,deviceType,deviceId,dataPoint,prop,colour,config){
    var callback = this.UpdateHandler.bind(this);
    WIoTPConnector.subscribe(deviceType,deviceId,eventType, callback);
    this.unSubscribe = function (deviceType,deviceId,eventType,dataPoint){
                if(this.data)
                  WIoTPConnector.unSubscribe(this.data.deviceType,this.data.deviceId,this.data.eventName, callback);
                if(deviceType && deviceId && eventType){
                  WIoTPConnector.subscribe(deviceType,deviceId,eventType, callback);
                  this.data.deviceType = deviceType;
                  this.data.deviceId = deviceId;
                  this.data.eventName = eventType;
                  this.data.dataPoint =dataPoint;
              }
          }.bind(this)
    // if(prop && prop.type == "level")
    // {
    //   document.getElementById(id).innerHTML = '<svg id="'+id+'_svg" width="97%" height="155"></svg>'
    //     this.data = {config:config,dataPoint:dataPoint,value:0,islevel:true,deviceId:deviceId,deviceType:deviceType,eventName:eventType};
    //     this.c3 = loadLiquidFillGauge(id+"_svg", 0);
    //   return
    // }
    if(config)
    {
      config.bindto='#'+id;
    }else{
      config = {
            bindto: '#'+id,
            data: {
                columns: [
                ],
                type: 'gauge',
                // onclick: function (d, i) { console.log("onclick", d, i); },
                // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            },
            color: {
                pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
                threshold: {
                    values: [25, 50, 75, 100]
                }
              }
          }
    }
    if(prop){
      config.gauge=prop;
    }
    if(colour)
    {
      config.color.pattern = colour;
    //  config.color.threshold={unit: dataPoint,max:config.gauge.max}
      if(config.gauge){
        var range =(config.gauge.max-(config.gauge.min));
        var quate = range /4;
        config.color.threshold.values=[(config.gauge.min+quate) , (config.gauge.min+ 2* quate) , (config.gauge.min+3*quate), config.gauge.max ]
      }
    }
    this.data = {config:config,dataPoint:dataPoint,value:0,deviceId:deviceId,deviceType:deviceType,eventName:eventType};
    this.c3 = c3.generate(config);
  };

  Gauge.prototype.UpdateHandler = function (deviceType, deviceId,format,payload){
    var payload = JSON.parse(payload);
    if(this.data.value != payload.d[this.data.dataPoint])
    {
        this.data.value = payload.d[this.data.dataPoint];
        //if(!this.data.islevel){
          this.c3.load({
              columns: [[this.data.dataPoint, this.data.value]]
            })
        // }else{
        //   this.c3.update(this.data.value)
        // }
    }
  };
  Gauge.prototype.UpdateDevice = function (deviceType,deviceId,eventType,dataPoint){
    if(typeof dataPoint == typeof [])
      this.unSubscribe(deviceType,deviceId,eventType||this.data.eventName,dataPoint[0]||this.data.dataPoint);
    else {
      this.unSubscribe(deviceType,deviceId,eventType||this.data.eventName,dataPoint||this.data.dataPoint);
    }
  //  if(!this.data.islevel){
      this.c3.load({
          columns: [[this.data.dataPoint, this.data.value]]
        })
    // }else{
    //   this.c3.update(this.data.value)
    // }
  };

  return Gauge;
}
)(BaseWidget);
