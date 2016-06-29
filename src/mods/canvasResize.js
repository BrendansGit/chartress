g.canvasResize = function(){
	g.drawChart();
	g.draw.spof();
};

var sizeCache = [parseInt(g_st(chel).width), parseInt(g_st(chel).height)];
var to;

SVG.on(window, 'resize', function() {
	if (sizeCache[0] !== parseInt(g_st(chel).width) || sizeCache[1] !== parseInt(g_st(chel).height)) {
		clearTimeout(to);
		to = setTimeout(g.canvasResize, g.options.graph.redrawTimeout || 5);
	}
});