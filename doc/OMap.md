# Maps
## Openstreet Map

This widget will add a Openstreet Map to your dashboard. There are 2 options

* Create a Connected Map, that listens for updates from the device for the GPS co-ordinates
* Create a Static Map, where you can provide static GPS co-ordinates and it will plot on the map.


### Connected Map
This map must be used when the Watson IoT Platform devices send the GPS co-ordinates as events. The event must contain *latitude* and *longitude*. It can be in the format as given below

```javascript
{
  "latitude" : 12.9523532,
  "longitude" : 77.6440377
}

OR

{
  "d" : {
    "latitude" : 12.9523532,
    "longitude" : 77.6440377
  }
}
```

To include the Google Map in your dashboard, you can use the following code snippet

@html
```html
<div id="omapdiv" />
<script src="/lib/ol2-bower/OpenLayers.js" async defer></script>

```
@JS
```javascript
var oMap = WIoTPWidget.CreateConnectedOMap("omapdiv", <deviceType>, <deviceId>, <eventType>);
```
where deviceType, deviceId and eventType correspond your credentials of your device.


### Static Map
This map can be used where you want to update the GPS co-ordinates directly. To include this, copy the following code snippet.

@html
```html
<div id="omapdiv" />
<script src="/lib/ol2-bower/OpenLayers.js" async defer></script>

```
@JS
```javascript
var oMap = WIoTPWidget.CreateOMap("omapdiv", 12.9523877,77.6440218);
setTimeout(function () {

  oMap.Update(12.958967, 77.639458);
}, 3000);
```

## Plot Multiple points on the Map
To plot multiple points on your Map, use the function `PlotMultiple`.

@html
```html
<div id="omapdiv" />
<script src="/lib/ol2-bower/OpenLayers.js" async defer></script>

```
@JS
```javascript
var oMap = WIoTPWidget.CreateOMap("omapdiv", 12.9523877,77.6440218);
setTimeout(function () {

  oMap.PlotMultiple(12.958967, 77.639458);
}, 3000);
```
