function  BaseWidget (collection){
  this.collection = collection
  this.groupName ="";
};
BaseWidget.prototype.setGroup = function(groupName){
  this.groupName = groupName;
  if(!this.collection[groupName])
      this.collection[groupName] = [];
  if(this.UpdateDevice)
    this.collection[groupName].push(this.UpdateDevice.bind(this));
};
BaseWidget.prototype.updateCollection =function(groupName,deviceType,deviceId,eventType,dataPoint){
  var callback = this.collection[groupName||this.groupName];
  for (var i = 0; i < callback.length; i++) {
      callback[i](deviceType,deviceId,eventType,dataPoint);
  }
};
BaseWidget.prototype.Destroy =function(){
  if(this.unSubscribe ){
    this.unSubscribe();
  }
  this.destructor();
};
BaseWidget.prototype.destructor =function(){

};
