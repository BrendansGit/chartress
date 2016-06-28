g.canvasResize = function(){
	g.draw.spof();
	g.drawGraph();
};

var sizeCache = [parseInt(g_st(el).width), parseInt(g_st(el).height)];
var to;

SVG.on(window, 'resize', function() {
	if (sizeCache[0] !== parseInt(g_st(el).width) || sizeCache[1] !== parseInt(g_st(el).height)) {
		clearTimeout(to);
		to = setTimeout(g.canvasResize, g.options.graph.redrawTimeout || 0);
	}
});