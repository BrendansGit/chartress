# chartress.js
**This project is still in alpha!!** 

Requires [svg.js](http://svgjs.com/)


## Usage

#### Download chartress
```bash
bower install chartress --save
```

#### Include chartress into your project 
```html
<script type="text/javascript" src="/bower_components/chartress/dist/chartress.min.js"></script>
```

#### Prepare some html
```html
<div class="chartress"></div>
```

#### Run chartress
```javascript
var element = document.querySelector('.chartress');
var graph = new chartress(element, data);
```

## Example data
### Line Chart:
```javascript
var linechart = {
	lines: [
		{
			name: 'Red',
			color: 'red',
			plot: [0, 10, 50, 80, 53, 20, 25, 80, 70, 5, 40],
		},{
			name: 'Black',
			plot: [40, 20, 1, 50, 60, 70, 100, 70, 40, 30, 10],
		},{
			name: 'Gray',
			dash: '10,5',
			color: 'gray',
			plot: [4, 6, 20, 18, 24, 8, 0, 0, 20, 10, 5],
		}
	]
}
```

### Column Chart:
```javascript
var coumnchart = {
	type: 'column',
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

### Pie Chart:
```javascript
var piechart = {
	type: 'pie',
	lines: [
		{
			value: 80
		},
		{
			value: 61,
			color: '#1b860b'
		}
	]
};
```
