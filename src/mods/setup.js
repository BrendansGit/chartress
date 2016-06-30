var that = this;
if (typeof jQuery !== 'undefined' && ($element instanceof jQuery)) {
	$element = $element[0];
}
var el = $element;
var chel = document.createElement('div');
el.appendChild(chel);
chel.className = 'chartress';
chel.style.height = '100%';
chel.style.width = '100%';
function sortNumber(a,b) {
	return b - a;
}

g.options = data;
g.settings = {};

g.draw = SVG(chel).size('100%', '100%').spof();

g.clear = function(){
	g.draw.clear();
}

if (g.options.debug === true){
	console.info('chartress debug enabled for ');
	console.info(chel);
	console.info('Passed Data: ');
	console.info(g.options);
	console.log('------');
}

var isU = function(e) {
	return (typeof e === 'undefined');
}

var checkOption = [
	['graph'],
	['graph.padding'],
	['graph.padding.left', 0],
	['graph.padding.right', 0],
	['graph.padding.top', 0],
	['graph.padding.bottom', 0],
	['xAxis'],
	['xAxis.range'],
	['xAxis.range.from', 0],
	['xAxis.range.to', null],
	['xAxis.legend'],
	['xAxis.legend.x'],
	['xAxis.legend.y'],
	['xAxis.lines'],
	['xAxis.lines.color', '#0f0'],
	['xAxis.lines.width', 1],
	['xAxis.label'],
	['xAxis.label.markEvery', 1],
	['xAxis.label.markCount', null],
	['xAxis.label.color', 'gray'],
	['xAxis.label.y', 0],
	['xAxis.label.position', 'bottom'],
	['xAxis.label.size', 14],
	['yAxis'],
	['yAxis.lines'],
	['yAxis.lines.color', '#00f'],
	['yAxis.lines.width', 1],
	['yAxis.label'],
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
	['pie.total', 100],
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
	['maxLength', null],
	['yMax', 0],
	['fontFamily', 'Helvetica'],
	['class', 'chartress'],
	['type', 'line'],
];

for (var i = 0; i < checkOption.length; i++) {
	var ch = checkOption[i][0].split('.');
	var dval = {};
	if (!isU(checkOption[i][1])) {
		dval = checkOption[i][1];
	}
	var objD = g.options;

	if (ch.length === 1) {
		if (isU(g.options[ch[0]])) {
			g.options[ch[0]] = dval;
			g.settings[ch[0]] = dval;
		}else{
			g.settings[ch[0]] = g.options[ch[0]];
		}
	}
	if (ch.length === 2) {
		if (isU(g.options[ch[0]][ch[1]])) {
			g.options[ch[0]][ch[1]] = dval;
			g.settings[ch[0]][ch[1]] = dval;
		}else{
			g.settings[ch[0]][ch[1]] = g.options[ch[0]][ch[1]];
		}
	}
	if (ch.length === 3) {
		if (isU(g.options[ch[0]][ch[1]][ch[2]])) {
			g.options[ch[0]][ch[1]][ch[2]] = dval;
			g.settings[ch[0]][ch[1]][ch[2]] = dval;
		}else{
			g.settings[ch[0]][ch[1]][ch[2]] = g.options[ch[0]][ch[1]][ch[2]];
		}
	}
}

if (isU(g.options.yAxis.label.format))
	g.options.yAxis.label.format = function(string){return string};

if (isU(g.options.xAxis.label.format))
	g.options.xAxis.label.format = function(string){return string};


g.log = function(e){
	if (g.options.debug === true) {
		console.log(e);
	}
}

var g_st = function(el){
	return getComputedStyle(el);
}


// if (true) {}
if(g.settings.type === 'line') {
	g.settings.graph.padding = {
		top: g.options.graph.padding.top || 10,
		right: g.options.graph.padding.right || 8,
		bottom: g.options.graph.padding.bottom || 25,
		left: g.options.graph.padding.left || 35
	}
}
if(g.settings.type === 'column') {
	g.settings.graph.padding = {
		top: g.options.graph.padding.top || 25,
		right: g.options.graph.padding.right || 0,
		bottom: g.options.graph.padding.bottom || 25,
		left: g.options.graph.padding.left || 35
	};
	g.settings.xAxis.label.pos = g.options.xAxis.label.position || 'top';
	g.settings.xAxis.label.y = g.options.xAxis.label.y || -5;
}