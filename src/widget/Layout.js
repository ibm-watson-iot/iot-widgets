var BaseLayout = (function BaseLayout(_super) {
  __extends(BaseLayout, _super);
  function BaseLayout(collection) {
    _super.call(this,collection);
    this.xscale = null;
    this.yscale = null;
    this.map = null;
    this.imagelayer = null;
    this.heatmap = null;
    this.vectorfield = null;
    this.pathplot = null;
    this.overlays = null;
    this.mapdata = {};
    this.element;
  };

  BaseLayout.prototype.createFloorPlan = function(WIoTPConnector , id, width, height,imageURL){
      var aspectRatio = height / width;
      this.subscribe = function(deviceType,deviceId,eventType, callback){
        WIoTPConnector.subscribe(deviceType,deviceId,eventType, callback);
        this.unSubscribe = function (){
              WIoTPConnector.unSubscribe(deviceType,deviceId,eventName, callback);
        }.bind(this);
      }.bind(this);
      this.xscale = d3.scale.linear().domain([0,50.0]).range([0,width]);
      this.yscale = d3.scale.linear().domain([0,50*aspectRatio]).range([0,height]);
      this.map = d3.floorplan().xScale(this.xscale).yScale(this.yscale);
      this.imagelayer = d3.floorplan.imagelayer();
      this.heatmap = d3.floorplan.heatmap();
      this.vectorfield = d3.floorplan.vectorfield();
      this.pathplot = d3.floorplan.pathplot();
      this.overlays = d3.floorplan.overlays().editMode(true);
      this.mapdata = {};

    this.mapdata[this.imagelayer.id()] = [{
        // url: 'Sample_Floorplan.jpg',
        url:imageURL,
        x: 0,
        y: 0,
        height: 50*aspectRatio,
        width: 50.0
         }];

    this.map.addLayer(this.imagelayer)
       .addLayer(this.heatmap)
       .addLayer(this.vectorfield)
       .addLayer(this.pathplot)
       .addLayer(this.overlays);

    this.element =d3.select("#" + id).append("svg").attr("height", height).attr("width",width)


    // d3.json("demo-data.json", function(data) {
    // 	this.mapdata[this.heatmap.id()] = data.heatmap;
    // 	this.mapdata[this.overlays.id()] = data.overlays;
    // 	this.mapdata[this.vectorfield.id()] = data.vectorfield;
    // 	this.mapdata[this.pathplot.id()] = data.pathplot;
    // //   d3.select("#" + id).append("svg")
    // //  .attr("height", height).attr("width",width)
    // this.element.datum(this.mapdata).call(this.map);
    // }.bind(this));

  }
  BaseLayout.prototype.addHeatmap = function (heatmap,deviceType,deviceId,eventName,param,range){
    if(range){
      var color = this.heatmap.customThresholds(range);
      this.heatmap.colorMode([color]);
    }
    this.param =param;
    var callback = this.updateHeatmap.bind(this);
    this.subscribe(deviceType,deviceId,eventName,callback)


    this.mapdata[this.heatmap.id()] = heatmap;
    this.element.datum(this.mapdata).call(this.map);
  }
  BaseLayout.prototype.updateHeatmap = function(deviceType, deviceId,format,payload){
    var payload = JSON.parse(payload);
    if(payload.d)
      payload = payload.d;
    this.mapdata[this.heatmap.id()].map[0].value = payload[this.param];
    this.element.datum(this.mapdata).call(this.map);
  }
  BaseLayout.prototype.addOverlays = function (overlays,deviceType,deviceId,eventName,param,range){
    this.mapdata[this.overlays.id()] = overlays;
    this.element.datum(this.mapdata).call(this.map);
  }
  BaseLayout.prototype.addVectorField = function (vectorfield,deviceType,deviceId,eventName,param,range){
    this.mapdata[this.vectorfield.id()] = vectorfield;
    this.element.datum(this.mapdata).call(this.map);
  }
  BaseLayout.prototype.addPathPlot = function (pathplot,deviceType,deviceId,eventName,param,range){
    this.mapdata[this.pathplot.id()] = pathplot;
    this.element.datum(this.mapdata).call(this.map);
  }
  BaseLayout.prototype.destructor = function(){
    this.xscale = null;
    this.yscale = null;
    this.map = null;
    this.imagelayer = null;
    this.heatmap = null;
    this.vectorfield = null;
    this.pathplot = null;
    this.overlays = null;
    this.mapdata = {};
    this.element =null;
  }
  return BaseLayout;
  }
)(BaseWidget);
