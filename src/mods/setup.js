var that = this;
var el = $element;
if (typeof jQuery !== 'undefined' && ($element instanceof jQuery)) {
	el = el[0];
}
var g = {};
function sortNumber(a,b) {
	return b - a;
}

g.options = data;

g.draw = SVG(el).size('100%', '100%').spof();

g.clear = function(){
	g.draw.clear();
}

if (typeof g.options.graph === 'undefined')
	g.options.graph = {};
if (typeof g.options.xAxis === 'undefined')
	g.options.xAxis = {};
if (typeof g.options.xAxis.range === 'undefined')
	g.options.xAxis.range = {};
if (typeof g.options.xAxis.legend === 'undefined')
	g.options.xAxis.legend = {};
if (typeof g.options.yAxis === 'undefined')
	g.options.yAxis = {};
if (typeof g.options.yAxis.label === 'undefined')
	g.options.yAxis.label = {};
if (typeof g.options.legend === 'undefined')
	g.options.legend = {};
if (typeof g.options.xAxis.label === 'undefined')
	g.options.xAxis.label = {};
if (typeof g.options.xAxis.format === 'undefined')
	g.options.xAxis.format = function(string){return string};

if (typeof g.options.legend.padding === 'undefined')
	g.options.legend.padding = {};
if (typeof g.options.graph.padding === 'undefined')
	g.options.graph.padding = {};


var maxLength = g.options.xAxis.maxRangeLength || Infinity;

g.settings = {
	yMax: 0,
	padding: {
		top: g.options.graph.padding.top || 10,
		right: g.options.graph.padding.right || 8,
		bottom: g.options.graph.padding.bottom || 25,
		left: g.options.graph.padding.left || 35
	},
	type: g.options.type || 'normal',
	yAxis: {
		markEvery: g.options.yAxis.markEvery || 1,
		label: {
			color: g.options.yAxis.label.color || 'gray',
			x: g.options.yAxis.label.x || 0
		},
		markEvery: g.options.yAxis.markEvery || 20,
	},
	xAxis: {
		range: {
			from: g.options.xAxis.range.from || 0,
			to: g.options.xAxis.range.to || null,
		},
		markEvery: g.options.xAxis.markEvery || 1,
		label: {
			color: g.options.xAxis.label.color || 'gray',
			y: g.options.xAxis.label.y || 0
		},
	},
	legend: {
		x: g.options.legend.x || 100,
		y: g.options.legend.x || 0,
		padding: {
			top: g.options.legend.padding.top || 0,
			right: g.options.legend.padding.right || 0,
			bottom: g.options.legend.padding.bottom || 0,
			left: g.options.legend.padding.left || 0,
		}
	}
};