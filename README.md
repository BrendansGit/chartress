# chartress.js
**warning this project is still in beta** 

9KB minified, Requires [svg.js](http://svgjs.com/)


## Usage

#### Download chartress
```bash
bower install chartress --save
```

#### Include chartress into your project 
```html
<script type="text/javascript" src="/bower_components/chartress/dist/chartress.min.js"></script>
```

#### Run chartress
```javascript
var graph = new chartress(element, data);
```

## Demos
- [Flowchart](http://codepen.io/jsnanigans/pen/dXNOXE)
- [Pipechart](http://codepen.io/jsnanigans/pen/XKMrYP)
- [Piechart](http://codepen.io/jsnanigans/pen/gMmYjr)


## Example data
#### Flowchart:
```javascript
var flowchart = {
	graph: {
		padding: [40, 40, 60, 60],
		redrawTimeout: 1
	},
	legend: {
		x: 100,
		y: -2,
		padding: [6,15,0,0]
	},
	xAxis: {
		label: {
			y: 20,
			color: '#000'
		},
		markEvery: 2,
		maxRangeLength: 11,
		range: {
			from: 7,
			to: 17
		}
	},
	yAxis: {
		label: {
			color: '#000',
			x: -30,
			font_size: 14
		},
		markEvery: 20
	},
	lines: [
		{
			name: 'Meeting',
			classname: 'meeting',
			plot: [0, 10, 50, 80, 53, 20, 25, 80, 70, 5, 40],
			rad: 6
		},{
			name: 'Kitchen',
			classname: 'kitchen',
			dash: '10,5',
			plot: [40, 20, 1, 50, 60, 70, 100, 70, 40, 30, 10],
			rad: 6
		}
	]
};
```
#### Pipechart:
```javascript
var pipechart = {
	type: 'pipes',
	graph: {
		padding: [35, 0, 40, 0],
		redrawTimeout: 1
	},
	pipes: {
		width: 21,
		labels: {
			fontsize: 16,
			y: 1
		}
	},
	lines: [
		{
			name: 'MO',
			value: 40 
		},{
			name: 'TU',
			value: 60
		},{
			name: 'WE',
			value: 30
		},{
			name: 'TH',
			value: 60
		},{
			name: 'FR',
			value: 90
		},{
			name: 'SA',
			value: 22
		},{
			name: 'SU',
			value: 15
		}
	]
};
```
#### Piechart:
```javascript
var piechart = {
	type: 'pie',
	graph: {
		padding: [20, 10, 20, 10],
		redrawTimeout: 1
	},
	pie: {
		total: 100,
		title: {
			text: '61%',
			size: 50,
			bold: true,
		}
	},
	lines: [
		{
			value: 100,
			classname: 'outline',
			width: 5
		},
		{
			value: 61,
			classname: 'progress',
			width: 40
			// mask: false
		}
	]
};
```