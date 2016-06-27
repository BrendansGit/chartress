g.drawLabels = function() {

	if (true) {}
	// draw yaxis
	var yPoints = 0, i;
	for (i = 0; i < (g.settings.yMax + g.options.yAxis.markEvery); i++) {
		if (i%g.options.yAxis.markEvery === 0) {
			yPoints++;
		}
	}
	g.yLabels = g.draw.group().addClass('chartress__labels chartress__labels--yAxis');
	g.settings.yPoints = [];
	for (i = 0; i < yPoints; i++) {
		(function(){
			var proc = 1 - ((i+1) / yPoints);
			var posY = ((g.settings.height + (g.settings.height * 0.146)) * proc) + g.settings.padding.top;
			var text = i*g.options.yAxis.markEvery;
			if (text !== 0) {

				var tnode = g.yLabels.text(text.toString())
					.fill(g.options.yAxis.label.color)
					.font({
						family: g.options.graph.fontFamily || 'Helvetica',
						anchor: 'middle',
						size: 14
					})
					.dx(g.settings.rect.left + g.options.yAxis.label.x)
					.dy(posY)
					.addClass('chartress__labels__label chartress__labels__label--yAxis');

				tnode.dy((tnode.node.scrollHeight / 2)*-1)
				g.settings.yPoints.push(posY);
			};
		})();
	}

	// draw xaxis
	var xPoints = g.settings.longestLine,
		dateRange = g.options.xAxis.range.to - g.options.xAxis.range.from;

	g.settings.xPoints = [];
	g.xLabels = g.draw.group().addClass('chartress__labels chartress__labels--xAxis');
	// todo: make xAxis.markEvery work properly
	for (i = 0; i <= dateRange; i++) {
		(function(){
			var time = g.options.xAxis.range.from + i;
			if (time < 10) {
				time = '0'+time;
			}
			var text = time+':00';
			var proc = ((i) / (dateRange))
			var posX = ((g.settings.width) * proc) + g.settings.padding.left;

			if (i%g.options.xAxis.markEvery === 0) {

				g.xLabels.text(text)
					.fill(g.options.xAxis.label.color)
					.font({
						family: g.options.graph.fontFamily || 'Helvetica',
						anchor: 'middle',
						size: 14
					})
					.dx(posX)
					.dy(g.settings.rect.bottom + g.options.xAxis.label.y)
					.addClass('chartress__labels__label chartress__labels--xAxis');

			}

			g.settings.xPoints.push(posX);
		})();
	}
};