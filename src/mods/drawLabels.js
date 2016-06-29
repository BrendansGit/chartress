g.drawLabels = function() {

	if (true) {}
	// draw yaxis
	var yPoints = [], i;
	for (i = 0; i < (g.settings.yMax + g.settings.yAxis.markEvery); i++) {
		if (i%g.settings.yAxis.markEvery === 0) {
			yPoints.push(i);
		}
	}
	g.yLabels = g.draw.group().addClass(g.settings.class+'__labels chartress__labels--yAxis');
	g.settings.yPoints = [];
	for (i = 0; i < yPoints.length; i++) {
		(function(){
			var posY = ((1-(yPoints[i] / g.settings.yMax) * g.settings.height) *-1) + g.settings.padding.top;
			var fontSize = 14;
			posY = posY - (fontSize /3);

			var text = yPoints[yPoints.length-1 - i];
			text = g.options.yAxis.label.format(text);
			text = text.toString();
			// if (text !== 'ex') {

				var tnode = g.yLabels.text(text)
					.fill(g.settings.yAxis.label.color)
					.font({
						family: g.settings.fontFamily,
						size: fontSize
					})
					.dx(g.settings.rect.left + g.settings.yAxis.label.x)
					.dy(posY)
					.addClass(g.settings.class+'__labels__label chartress__labels__label--yAxis');

				tnode.dx((parseInt(g_st(tnode.node).width))*-1 - 10);
				tnode.dy((parseInt(g_st(tnode.node).height)/2)*-1);
				g.settings.yPoints.push(posY);
			// };
		})();
	}
	// draw xaxis
	var xPoints = g.settings.longestLine,
		labelRange = g.settings.xAxis.range.to - g.settings.xAxis.range.from;

	if (g.settings.maxLength !== null) {
		labelRange = g.settings.maxLength;
	}

	g.settings.xPoints = [];
	var labelPosFix = 0;
	if (g.settings.type === 'column') {
		labelRange++;
		labelPosFix = (g.settings.width / (labelRange)) / 2;
	}

	if (g.options.xAxis.visible !== false) {
		var startAt = 0;
		if (g.options.xAxis.maxRangeLength) {
			startAt = g.options.xAxis.maxRangeLength + 1;
		}
		// g.log([startAt, labelRange])

		g.xLabels = g.draw.group().addClass(g.settings.class+'__labels chartress__labels--xAxis');
		for (i = 0; i <= labelRange; i++) {
			(function(){
				var text = (g.settings.xAxis.range.from + i) + startAt;
				text = g.options.xAxis.label.format(text);
				text = text.toString();
				var proc = ((i) / (labelRange))
				var posX = ((g.settings.width) * proc) + g.settings.padding.left;
				var posY = g.settings.rect.bottom + g.settings.xAxis.label.y;
				if (g.settings.xAxis.label.pos === 'top') {
					posY = g.settings.rect.top - (g.settings.xAxis.label.size*1.5) + g.settings.xAxis.label.y;
				}

				if (i%g.settings.xAxis.markEvery === 0) {
					g.xLabels.text(text)
						.fill(g.settings.xAxis.label.color)
						.font({
							family: g.settings.fontFamily,
							anchor: 'middle',
							size: g.settings.xAxis.label.size
						})
						.dx(posX + labelPosFix)
						.dy(posY)
						.addClass(g.settings.class+'__labels__label chartress__labels--xAxis');

				}

				g.settings.xPoints.push(posX);
			})();
		}
	}
};