g.drawGraph = function() {
	g.clear();
	g.setBounds();

	if (g.settings.type === 'line') {
		g.drawLabels();
		g.drawLines();
		g.drawLegend();
	}
	if (g.settings.type === 'column') {
		g.drawColumns();
	}
	if (g.settings.type === 'pie') {
		g.drawPies();
	}
};