
### IOT data nomenclature

Before we start lets understand the following nomenclature which we will use in the entire document

| Name | Meaning | type|
| ------ | ------ |----|
|deviceType | your device type | string|
|deviceId |  your device Id to which you want to update the value of the widget as per the real time data|string|
|eventName |Name of the event that the device is emitting this will the sets of sensor values in generally| string|
| param | A event may contain multiple values like temperature ,humidity etc this specifies which sensor reading that you want to show | string|
| params | A set of sensor data that you want to plot simultaneously | array of string |
| html_id | Represents the element id to which the widget will be rendered | string|
