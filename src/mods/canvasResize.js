/* global g g_st chel SVG */

g.canvasResize = function() {
	g.drawChart();
	g.draw.spof();
};

var sizeCache = [
	parseInt(g_st(chel).width, 10),
	parseInt(g_st(chel).height, 10)
];
var to;

SVG.on(window, 'resize', function() {
	if (sizeCache[0] !== parseInt(g_st(chel).width, 10) || sizeCache[1] !== parseInt(g_st(chel).height, 10)) {
		clearTimeout(to);
		to = setTimeout(g.canvasResize, g.s.graph.redrawTimeout);
	}
});
