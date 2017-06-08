var Chart = (function Chart(_super) {
  __extends(Chart, _super);
  function Chart(collection){
    _super.call(this,collection);
    this.c3 = null;
    this.length = 50;
    this.data = null;
  };
  //Types supported currently are :
  //Data specific
  //-line
  //-spline
  //-bar
  //-area
  //-area-spline
  //-scatter
  //overall persentage based
  //-pie
  //-donut
  Chart.prototype.CreateWidget =function(WIoTPConnector,id,eventType,deviceType,deviceId,dataPoint,type,colour,config){
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
              this.data.data =[];
              for (var i = 0; i < dataPoint.length; i++)
                this.data.data.push([dataPoint[i]])

              this.data.data.push(['x']);
            }


      }.bind(this);

      if(config)
      {
        config.bindto='#'+id;
      }else{
        config = {
              bindto: '#'+id,
              data: {
                    x: 'x',
                    //xFormat: '%HH%MM%SS',
                    columns: [],
                },
              axis: {
                  x: {
                      type: 'timeseries',
                      tick: {
                          format: '%H:%M:%S'
                      }
                  }
              }
            }
        }
      if(colour){
        config.color ={pattern:colour}
      }
    this.data = {data:[],onfig:config,dataPoint:dataPoint,deviceId:deviceId,deviceType:deviceType,eventName:eventType};
    for (var i = 0; i < dataPoint.length; i++)
      this.data.data.push([dataPoint[i]])
    this.data.data.push(['x']);
    this.c3 = c3.generate(config);
    if(type){
      if (typeof type == "string") {
          this.c3.transform(type)
      }
      else if(type.length){
        for (var i = 0; i < type.length; i++) {
            this.c3.transform.apply(this.c3,type[i])
        }
      }

    }
  };

  Chart.prototype.UpdateHandler = function (deviceType, deviceId,format,payload){
      var payload = JSON.parse(payload);
      for (var i = 0; i < this.data.data.length-1; i++) {
         this.data.data[i].push(payload.d[this.data.data[i][0]])
         if(this.data.data[i].length == (this.length+1))
          this.data.data[i].splice(1,1);
       }
      var currentdate = new Date();
      var dateIndex = this.data.data.length-1;
      this.data.data[dateIndex].push(currentdate);
      if(this.data.data[dateIndex].length == (this.length+1))
        this.data.data[dateIndex].splice(1,1);
      this.c3.load({
          columns: this.data.data
      })
  }
  Chart.prototype.UpdateDevice = function (deviceType,deviceId,eventType,dataPoint){
    this.unSubscribe(deviceType,deviceId,eventType||this.data.eventName,dataPoint||this.data.dataPoint);
    this.c3.load({
        columns: this.data.data
    })
  }
  Chart.prototype.destructor = function(){
    this.c3=null;
    delete this.c3;
    this.data = null;
    delete this.data;
  }
  return Chart;
}
)(BaseWidget);
