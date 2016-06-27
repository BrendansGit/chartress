g.canvasResize = function(){
	g.draw.spof();
	g.drawGraph();
};

var sizeCache = [el.scrollWidth, el.scrollHeight];
var to;

SVG.on(window, 'resize', function() {
	if (sizeCache[0] !== el.scrollWidth || sizeCache[1] !== el.scrollHeight) {
		clearTimeout(to);
		to = setTimeout(g.canvasResize, g.options.graph.redrawTimeout || 100);
	}
});