g.drawChart = function() {
	g.clear();
	g.setBounds();

	if (g.settings.type === 'line') {
		g.drawLabels();
		g.drawLines();
		g.drawLegend();
	}
	if (g.settings.type === 'column') {
		g.drawLabels();
		g.drawColumns();
	}
	if (g.settings.type === 'pie') {
		g.drawPies();
	}

	setTimeout(function(){
		g.draw.spof();
	});
};