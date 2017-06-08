### Layouts Widget

A layered map suitable for small area, local coordinate systems like building floor plans. There is no tiling or projection capabilities, just simple X-Y scaled coordinates, pan-zoom functionality, and a set of layers for data visualization over the region.


To create a layout widget add

#### Adding dependencies to header and body
@header
```html
<link href="../lib/d3-floorplan/d3.floorplan.css" rel="stylesheet" type="text/css">

```
@body end
```html
<script src="../lib/d3/d3.min.js" charset="utf-8"></script>
<script src="../lib/d3-floorplan/d3.floorplan.min.js"></script>

```
#### Adding layout into html page
@html
```html

<div id="layout1"></div>

```

@javascript

```javascript
var plainLayout =WIoTPWidget.createLayout(html_id, width,height,imageURL)

var plainLayout =WIoTPWidget.createLayout('demo',640,480,'samplePlant.png')
```
where,

|Name| Description | type|
|-----|---------|----|
|width| Image width | int |
|height| Image height | int |
|imageURL| Place where the image resides. Considering image are available in public folder| string |

Layout has following layers which can add on top of the image you have provided in the previous step

Multiple layer's are :

* Heatmap
* Overlays
* Path Plot

##### Adding heat map to Layout
Heat map helps to show the thermal layer on top of the image and the values will be updates as per the values send from the sensor in the give range

@javascript
```javascript
plainLayout.addHeatmap(heatmapConfig,deviceType,deviceId,eventName,param,range)

plainLayout.addHeatmap({
  "binSize": 3,
  "units": "\u00B0C",
  "map": [
	{"value": 0, "points": [{"x":13.3,"y":4.6},
				{"x":18.3,"y":4.6},
				{"x":18.3,"y":15},
				{"x":13.3,"y":15},
				{"x":13.3,"y":4.6}
				]}]
  },deviceType,deviceId,eventName,param,[-10,0,10,23,30,50]);

```
where,

|Name| Description | type|
|-----|---------|----|
|heatmapConfig| heatmap configration object described below | object |
|range| Array of value range for differnt heat zone of length 6 | array of int |

Heatmap config object:

|key| value | type|
|-----|---------|----|
|binSize| size of the heat cube | int |
|units| Units added as suffix of the value showing in the heatmap | string|
|map| array of Map object | array |

Map object :

Single cube of heat map
``` javascript
{"x": 21, "y": 12, "value": 20.2}
```
or

Zone of heat map

``` javascript
	{"value": 0, "points": [{"x":13.3,"y":4.6},
				{"x":18.3,"y":4.6},
				{"x":18.3,"y":15},
				{"x":13.3,"y":15},
				{"x":13.3,"y":4.6}
				]
	}
```

#### Adding overlays to Layout

Overlay is a polygon layer on top of the image

To add overlays

@javascript
```javascript
plainLayout.addOverlays(overlayconfig);

plainLayout.addOverlays({
	"polygons": [
		{"id": "unit2",  "points": [{"x":29.8,"y":4.6},
					    {"x":34.8,"y":4.6},
					    {"x":34.8,"y":15},
					    {"x":29.8,"y":15},
					    {"x":29.8,"y":4.6}
					    ]}
		]
	});

```
#### Adding Path Plot to Layout

Path plot helps to draw a path on top of the image to indicate the region on top of the image

@javascript
```javascript

plainLayout.addPathPlot(pathConfig);

plainLayout.addPathPlot( [{
	"id": "flt-1",
	"classes": "planned",
	"points": [{"x": 5, "y": 18.5},{"x": 24, "y": 18.5},{"x": 24, "y": 10.5},{"x": 19, "y": 10.5}]
	}]);
```

#### Adding Vector Field

To draw vector lines on top of the image
@javascript
```javascript
plainLayout.addVectorField(vectorConfig);

plainLayout.addVectorField({
	"binSize": 4,
	"units": "ft/s",
	"map": [
		{"x": 2.8, "y": 3.2, "value": {"x": 4, "y": 4}},
		{"x": 4.8, "y": 3.2, "value": {"x": -4, "y": 4}},
		{"x": 39.8, "y": 3.2, "value": {"x": 4, "y": 4}},
		{"x": 41.8, "y": 3.2, "value": {"x": -4, "y": 4}},
		{"x": 2.8, "y": 28.2, "value": {"x": 4, "y": 4}},
		{"x": 4.8, "y": 28.2, "value": {"x": -4, "y": 4}},
		{"x": 39.8, "y": 28.2, "value": {"x": 4, "y": 4}},
		{"x": 41.8, "y": 28.2, "value": {"x": -4, "y": 4}},
		]
	});
```
