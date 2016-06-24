# chartress.js
the javascript svg chart library that you have beein waiting for.

## usage:
```javascript
var graph = new chartress($element, data);
```
### example data:
```javascript
var data = {
	graph: {
		padding: [50, 40, 50, 80]
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
		name: 'Workspace',
		classname: 'workspace',
		plot: [20, 40, 60, 60, 70, 100, 60, 25, 44, 36, 20],
		rad: 6
	},
	{
		name: 'Meeting',
		classname: 'meeting',
		plot: [0, 10, 50, 80, 53, 20, 25, 80, 70, 5, 40],
		rad: 6
	},
	{
		name: 'Breakout Space',
		classname: 'breakspace',
		dash: '10,5',
		plot: [10, 35, 70, 100, 65, 40, 20, 45, 90, 70, 30],
		rad: 6
	},
	{
		name: 'Kitchen',
		classname: 'kithen',
		dash: '10,5',
		plot: [40, 20, 1, 50, 60, 70, 100, 70, 40, 30, 10],
		rad: 6
	}
	]
}
```