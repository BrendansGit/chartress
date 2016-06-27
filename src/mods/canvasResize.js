g.canvasResize = function(){
	g.draw.spof();
	g.drawGraph();
};

var sizeCache = [parseInt(getComputedStyle(el).width), parseInt(getComputedStyle(el).height)];
var to;

SVG.on(window, 'resize', function() {
	if (sizeCache[0] !== parseInt(getComputedStyle(el).width) || sizeCache[1] !== parseInt(getComputedStyle(el).height)) {
		clearTimeout(to);
		to = setTimeout(g.canvasResize, g.options.graph.redrawTimeout || 0);
	}
});