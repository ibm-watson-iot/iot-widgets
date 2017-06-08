## Widgets
### Gauge
To add a gauge widget in the web page

@html
```html
<div id="gauge1" ></div>
```
@JS
```javascript
WIoTPWidget.CreateGauge(html_id,eventName,deviceType,deviceId,param);
```
This will add a basic gauge which shows value in percentage from 0-100 as per the event

##### customizing the widget

```javascript
//dial gauge
var config = {
       label: {
           format: function(value, ratio) {
               return value;
           },
           show: true // to turn off the min/max labels.
       },
    min: -10, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
    max: 50, // 100 is default
    units: 'C'//as per the sensor,
  }
var colour = ['#FF0000', '#F97600', '#F6C600', '#60B044']

WIoTPWidget.CreateGauge(html_id,eventName,deviceType,deviceId,param,config,colour)

```

For more configuration options please refer [c3.js doc](http://c3js.org/reference.html#gauge-label-show)

Create gauge will return an c3 element object so that you can utilize all the functionality of the c3 gauge


### [Sample code](../../../samples/gauge.html)
