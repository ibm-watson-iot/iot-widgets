var OMap = (function OMap(_super) {
  __extends(OMap, _super);
function OMap(collection){
  _super.call(this,collection);
  this.map = null;
  this.markers =null;
  this.onMarkerClick = null;

};

OMap.prototype.CreateWidget =function(WIoTPConnector, id, latitude, longitude,config){

  this.map = new OpenLayers.Map(id);
  this.map.addLayer(new OpenLayers.Layer.OSM());

  var lonLat = new OpenLayers.LonLat(longitude, latitude)
        .transform(
          new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
          this.map.getProjectionObject() // to Spherical Mercator Projection
        );

  var zoom=16;

  this.markers = new OpenLayers.Layer.Markers( "Markers" );
  this.map.addLayer(this.markers);

  this.markers.addMarker(new OpenLayers.Marker(lonLat));

  this.map.setCenter (lonLat, zoom);

};

OMap.prototype.Update = function (latitude, longitude){

  var lonLat = new OpenLayers.LonLat(longitude, latitude)
        .transform(
          new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
          this.map.getProjectionObject() // to Spherical Mercator Projection
        );

  var zoom=16;

  if(!this.markers)
      this.markers = new OpenLayers.Layer.Markers( "Markers" );
  this.map.addLayer(this.markers);
  this.markers.clearMarkers();

  this.markers.addMarker(new OpenLayers.Marker(lonLat));

  this.map.setCenter (lonLat, zoom);

};

OMap.prototype.PlotMultiple = function (latitude, longitude){

  var lonLat = new OpenLayers.LonLat(longitude, latitude)
        .transform(
          new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
          this.map.getProjectionObject() // to Spherical Mercator Projection
        );

  var zoom=16;

  if(!this.markers)
      this.markers = new OpenLayers.Layer.Markers( "Markers" );
  this.map.addLayer(this.markers);
  //this.markers.clearMarkers();

  this.markers.addMarker(new OpenLayers.Marker(lonLat));

  this.map.setCenter (lonLat, zoom);

};

OMap.prototype.PlotMultipleDevices = function (deviceType, deviceId, latitude, longitude){

  var lonLat = new OpenLayers.LonLat(longitude, latitude)
        .transform(
          new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
          this.map.getProjectionObject() // to Spherical Mercator Projection
        );

  var zoom=16;

  if(!this.markers)
      this.markers = new OpenLayers.Layer.Markers( "Markers" );
  this.map.addLayer(this.markers);
  //this.markers.clearMarkers();

  var marker = new OpenLayers.Marker(lonLat);
  marker.id = deviceType + deviceId;
  marker.deviceType =deviceType;
  marker.deviceId =deviceId;
  marker.events.register("click", marker, function() {

    if (this.groupName) {
      this.updateCollection(this.groupName,marker.deviceType,marker.deviceId);
    }
    if(this.onMarkerClick)
      this.onMarkerClick(marker.deviceType,marker.deviceId,marker)
  }.bind(this));

  this.markers.addMarker(marker);

  this.map.setCenter (lonLat, zoom);

};

OMap.prototype.CreateConnectedWidget = function (WIoTPConnector, id, deviceType, deviceId, eventType, config){

  var callback = this.UpdateHandler.bind(this);
  WIoTPConnector.subscribe(deviceType,deviceId,eventType, callback);

  this.unSubscribe = function (){
        WIoTPConnector.unSubscribe(deviceType,deviceId,eventType, callback);
  }.bind(this);

  // initialize with dummy map TODO: Remove this after making a proper initialize call

  this.map = new OpenLayers.Map(id);
  this.map.addLayer(new OpenLayers.Layer.OSM());

  var lonLat = new OpenLayers.LonLat(77.6440203, 12.9523877)
        .transform(
          new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
          this.map.getProjectionObject() // to Spherical Mercator Projection
        );

  var zoom=16;

  var markers = new OpenLayers.Layer.Markers( "Markers" );
  this.map.addLayer(markers);

  markers.addMarker(new OpenLayers.Marker(lonLat));

  this.map.setCenter (lonLat, zoom);


};

OMap.prototype.UpdateHandler = function (deviceType, deviceId,format,payload){

  var lat,long;
  try {
    payload = JSON.parse(payload);
    if(payload.d && payload.d.latitude && payload.d.longitude) {
      lat = payload.d.latitude;
      long = payload.d.longitude;
      this.Update(lat, long);
    } else if(payload.latitude && payload.longitude) {
      lat = payload.latitude;
      long = payload.longitude;
      this.Update(lat, long);
    } else {
      console.log("Invalid format for GPS");
    }

  } catch( exception ) {
    console.log("Error : "+exception);
  }
};

OMap.prototype.destructor = function(){
  this.map = null;
  this.markers =null;
  this.onMarkerClick = null;
}

return OMap;
}
)(BaseWidget);
