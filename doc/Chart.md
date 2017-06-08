### Chart
There are multiple types of charts in the library

The supported charts are as follows

Data specific:
 - line
 - spline
 - bar
 - area
 - area-spline
 - scatter

Overall percentage based:
 - pie
 - donut

To add basic chart in the web page
@html
```html
  <div id="chart1" style="width: 100%;float:left"></div>
```

@js
```javascript
var chart = WIoTPWidget.CreateChart(html_id,eventName,
  deviceType,deviceId,params,type,color,config);

 WIoTPWidget.CreateChart("chart1",eventName,
 deviceType,deviceId,params,[["area-spline","ActualTemperature"],
 ["scatter","DesiredTemperature"]],['#2ca02c','#d62728']);
```
where

|Name| Description | type|
|-----|---------|----|
|type| Represents which type of chart for corresponding sensor values ,different types are given above in a format [["type"," sensor name"],..] | array |
|color | Corresponding color for the sensor values | array of string|

#### changing chart type
For single data type

@js
```javascript
chart.c3.transform("your required type")
```

For multiple data points

@js
```javascript
var dataPoints = [["area-spline","ActualTemperature"],
["scatter","DesiredTemperature"]]
for (var i = 0; i < dataPoints.length; i++) {
  chart.c3.transform.apply(chart.c3,dataPoints[i])
}
```
For more configuration options please refer [c3.js doc](http://c3js.org/reference.html#bindto)

### [Sample code](../../../samples/charts.html)
