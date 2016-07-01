var that = this;

// check if element is from jquery
if (typeof jQuery !== 'undefined' && ($element instanceof jQuery)) {
	// save it from jquery
	$element = $element[0];
}
var el = $element;

g.o = data;
g.s = {};

// core functions
g.log = function(e){
	if (g.o.debug === true) {
		console.log(e);
	}
}
g.clear = function(){
	g.draw.clear();
}
var g_st = function(el){
	return getComputedStyle(el);
}
function sortNumber(a,b) {
	return b - a;
}
var isU = function(e) {
	return (typeof e === 'undefined');
}

// options list and defaults
var checkOption = [
	['maxLength', null],
	['yMax', 0],
	['fontFamily', 'Helvetica'],
	['class', 'chartress'],
	['type', 'line'],

	['graph'],
	['graph.padding'],
	['graph.padding.left', 0],
	['graph.padding.right', 0],
	['graph.padding.top', 0],
	['graph.padding.bottom', 0],
	['graph.redrawTimeout', 5],

	['xAxis'],
	['xAxis.visible', true],
	['xAxis.range'],
	['xAxis.range.from', 0],
	['xAxis.range.to', null],
	['xAxis.legend'],
	['xAxis.legend.x'],
	['xAxis.legend.y'],
	['xAxis.lines'],
	['xAxis.lines.visible', false],
	['xAxis.lines.color', 'rgba(0,0,0,.1)'],
	['xAxis.lines.width', 1],
	['xAxis.label'],
	['xAxis.label.format', function(string){return string}],
	['xAxis.label.fontSize', 14],
	['xAxis.label.markEvery', 1],
	['xAxis.label.markCount', null],
	['xAxis.label.color', 'gray'],
	['xAxis.label.y', 0],
	['xAxis.label.position', 'bottom'],
	['xAxis.label.size', 14],

	['yAxis'],
	['yAxis.visible', true],
	['yAxis.lines'],
	['yAxis.lines.visible', true],
	['yAxis.lines.color', 'rgba(0,0,0,.1)'],
	['yAxis.lines.width', 1],
	['yAxis.label'],
	['yAxis.label.format', function(string){return string}],
	['yAxis.label.fontSize', 14],
	['yAxis.label.markEvery', null],
	['yAxis.label.markCount', 4],
	['yAxis.label.color', 'gray'],
	['yAxis.label.x', 0],

	['legend'],
	['legend.x', 100],
	['legend.y', 0],
	['legend.padding'],
	['legend.padding.top', 0],
	['legend.padding.right', 0],
	['legend.padding.bottom', 0],
	['legend.padding.left', 0],

	['columns'],
	['columns.width', 40],
	['columns.space', 1],
	['columns.labels'],
	['columns.labels.fontSize', 16],
	['columns.labels.y', 1],

	['pie'],
	['pie.total', null],
	['pie.title'],
	['pie.title.size', 50],
	['pie.title.bold', true],
	['pie.title.text', false],
	['pie.title.pre'],
	['pie.title.pre.text', false],
	['pie.title.pre.size', 14],
	['pie.title.sub'],
	['pie.title.sub.text', false],
	['pie.title.sub.size', 14],
];

// generate g.o and g.s
for (var i = 0; i < checkOption.length; i++) {
	var ch = checkOption[i][0].split('.');
	var dval = {};
	if (!isU(checkOption[i][1])) {
		dval = checkOption[i][1];
	}
	var objD = g.o;

	if (ch.length === 1) {
		if (isU(g.o[ch[0]])) {
			g.o[ch[0]] = dval;
			g.s[ch[0]] = dval;
		}else{
			g.s[ch[0]] = g.o[ch[0]];
		}
	}
	if (ch.length === 2) {
		if (isU(g.o[ch[0]][ch[1]])) {
			g.o[ch[0]][ch[1]] = dval;
			g.s[ch[0]][ch[1]] = dval;
		}else{
			g.s[ch[0]][ch[1]] = g.o[ch[0]][ch[1]];
		}
	}
	if (ch.length === 3) {
		if (isU(g.o[ch[0]][ch[1]][ch[2]])) {
			g.o[ch[0]][ch[1]][ch[2]] = dval;
			g.s[ch[0]][ch[1]][ch[2]] = dval;
		}else{
			g.s[ch[0]][ch[1]][ch[2]] = g.o[ch[0]][ch[1]][ch[2]];
		}
	}
}

// default padding
// TODO: clean this up
if(g.s.type === 'line') {
	g.s.graph.padding = {
		top: g.o.graph.padding.top || 10,
		right: g.o.graph.padding.right || 8,
		bottom: g.o.graph.padding.bottom || 25,
		left: g.o.graph.padding.left || 35
	}
}
if(g.s.type === 'column') {
	g.s.graph.padding = {
		top: g.o.graph.padding.top || 25,
		right: g.o.graph.padding.right || 0,
		bottom: g.o.graph.padding.bottom || 25,
		left: g.o.graph.padding.left || 35
	};
	g.s.xAxis.label.pos = g.o.xAxis.label.position || 'top';
	g.s.xAxis.label.y = g.o.xAxis.label.y || -5;
}


// generate its own div
var chel = document.createElement('div');
// append to element
el.appendChild(chel);
// default styles
chel.className = g.s.class;
chel.style.height = '100%';
chel.style.width = '100%';

// initiate svg.js
g.draw = SVG(chel).size('100%', '100%').spof();

// debug options
if (g.o.debug === true){
	console.info('chartress debug enabled for ');
	console.info(chel);
	console.info('Passed Data: ');
	console.info(g.o);
	console.log('------');
}


