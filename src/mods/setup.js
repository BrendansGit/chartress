var that = this;
var el = $element;
if (typeof jQuery !== 'undefined' && ($element instanceof jQuery)) {
	el = el[0];
}
var g = {};
function sortNumber(a,b) {
	return b - a;
}

g.settings = {
	yMax: 0
};
g.options = data;

g.draw = SVG(el).size('100%', '100%').spof();

g.clear = function(){
	g.draw.clear();
}

if (typeof g.options.graph === 'undefined') {
	g.options.graph = {};
}
if (typeof g.options.graph.padding === 'undefined') {
	g.options.graph.padding = [];
}
g.settings.padding = {
	top: g.options.graph.padding[0] || 0,
	right: g.options.graph.padding[1] || 0,
	bottom: g.options.graph.padding[2] || 0,
	left: g.options.graph.padding[3] || 0
};
g.settings.type = g.options.type || 'normal';