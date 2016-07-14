/* global g */
g.drawChart = function() {
	g.clear();
	g.setBounds();

	if (g.s.type === 'line') {
		g.drawLabels();
		g.drawLines();
		g.drawLegend();
	}
	if (g.s.type === 'column') {
		g.drawLabels();
		g.drawColumns();
	}
	if (g.s.type === 'pie') {
		g.drawPies();
	}

	setTimeout(function() {
		g.draw.spof();
	});
};
