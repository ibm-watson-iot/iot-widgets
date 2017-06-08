## Features
#### Grouping
Grouping is a method of creating a send of widgets to bind into a single data source. This helps to group a set of widgets in a page to show the live data of a given device when you are changing the selected or active device this will automatically update all the widgets to show the live data of the selected on change.

##### set group
@js
```javascript

var chart = WIoTPWidget.CreateChart(html_id,eventName,
  deviceType,deviceId,params,type,colour,config);

chart.setGroup("group_uid");
var gauge =  WIoTPWidget.CreateGauge(html_id,eventName,deviceType,deviceId,param,config,colour)
gauge.setGroup("group_uid");

```
##### updateing a group

```javascript

WIoTPWidget.groupUpdate("group_uid",deviceType,deviceid,eventName,params);

```
while updating eventName and params are optional if the new device is fallowing the same data structure

### Sample code
For more information please refer the sample [ grouping.html ](../../../samples/grouping.html)

For intergroup communication please refer the sample [ interGroupConnections.html ](../../../samples/interGroupConnections.html)
