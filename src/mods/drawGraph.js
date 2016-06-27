g.drawGraph = function() {
	g.clear();
	g.setBounds();

	if (g.settings.type === 'normal') {
		g.drawLabels();
		g.drawLines();
		g.drawLegend();
	}
	if (g.settings.type === 'pipes') {
		g.drawPipes();
	}
	if (g.settings.type === 'pie') {
		g.drawPies();
	}
};