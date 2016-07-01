g.drawLabels = function() {

	// draw yaxis
	if (g.s.yAxis.label.markEvery === null) {
		g.s.yAxis.label.markEvery = Math.round(g.s.yMax / g.s.yAxis.label.markCount);
	}
	var yPoints = [], i;
	for (i = 0; i < (g.s.yMax + g.s.yAxis.label.markEvery); i++) {
		var test = i%g.s.yAxis.label.markEvery;
		if (test === 0 && i <= g.s.yMax) {
			yPoints.push(i);
		}
	}

	// largest label is always max value
	yPoints[yPoints.length - 1] = g.s.yMax;

	if (g.s.yAxis.visible !== false || g.s.yAxis.lines.visible !== false) {
		g.yLabels = g.draw.group().addClass(g.s.class+'__labels chartress__labels--yAxis');
		g.yLines = g.draw.group().addClass(g.s.class+'__lines chartress__lines--yAxis');
		g.s.yPoints = [];
		for (i = 0; i < yPoints.length; i++) {
			(function(){
				var posY = ((1-(yPoints[i] / g.s.yMax) * g.s.height) *-1) + g.s.graph.padding.top;
				var fontSize = g.s.yAxis.label.fontSize;

				if (g.s.yAxis.lines.visible !== false) {
					g.yLines.rect(g.s.width, g.s.yAxis.lines.width)
						.fill(g.s.yAxis.lines.color)
						.dy(posY)
						.dx(g.s.rect.left);
				}
				if (g.s.yAxis.visible !== false) {
					var text = yPoints[yPoints.length-1 - i];
					text = g.s.yAxis.label.format(text);
					text = text.toString();

						var tnode = g.yLabels.text(text)
							.fill(g.s.yAxis.label.color)
							.font({
								family: g.s.fontFamily,
								size: fontSize
							})
							.dx(g.s.rect.left + g.s.yAxis.label.x)
							.dy(posY - (fontSize /3))
							.addClass(g.s.class+'__labels__label chartress__labels__label--yAxis');

						tnode.dx((parseInt(g_st(tnode.node).width))*-1 - 10);
						tnode.dy((parseInt(g_st(tnode.node).height)/2)*-1);
						g.s.yPoints.push(posY - (fontSize /3));
				}

			})();
		}
	}
	// draw xaxis
	var xPoints = g.s.longestLine,
		labelRange = g.s.xAxis.range.to - g.s.xAxis.range.from;

	if (g.s.maxLength !== null) {
		labelRange = g.s.maxLength;
	}

	g.s.xPoints = [];
	var labelPosFix = 0;
	if (g.s.type === 'column') {
		labelRange++;
		labelPosFix = (g.s.width / (labelRange)) / 2;
	}

	if (g.s.xAxis.visible !== false || g.s.xAxis.lines.visible !== false) {
		var startAt = 0;
		if (g.s.xAxis.maxRangeLength) {
			startAt = g.s.xAxis.maxRangeLength + 1;
		}

		g.xLabels = g.draw.group().addClass(g.s.class+'__labels chartress__labels--xAxis');
		g.xLines = g.draw.group().addClass(g.s.class+'__lines chartress__lines--xAxis');
		for (i = 0; i < labelRange; i++) {
			(function(){
				var text = (g.s.xAxis.range.from + i) + startAt;
				text = g.s.xAxis.label.format(text);
				text = text.toString();
				var proc = ((i) / (labelRange-1))
				var posX = ((g.s.width) * proc) + g.s.graph.padding.left;
				var posY = g.s.rect.bottom + g.s.xAxis.label.y;
				if (g.s.xAxis.label.pos === 'top') {
					posY = g.s.rect.top - (g.s.xAxis.label.size*1.5) + g.s.xAxis.label.y;
				}

				if (g.s.xAxis.lines.visible !== false) {
					g.xLines.rect(g.s.xAxis.lines.width, g.s.height)
						.fill(g.s.xAxis.lines.color)
						.dx(posX - Math.ceil(g.s.xAxis.lines.width/2) + 1)
						.dy(g.s.rect.top);
				}
				if (i%g.s.xAxis.label.markEvery === 0) {
					if (g.s.xAxis.visible !== false) {
					g.xLabels.text(text)
						.fill(g.s.xAxis.label.color)
						.font({
							family: g.s.fontFamily,
							anchor: 'middle',
							size: g.s.xAxis.label.fontSize
						})
						.dx(posX + labelPosFix)
						.dy(posY)
						.addClass(g.s.class+'__labels__label chartress__labels--xAxis');
					};
				}

				g.s.xPoints.push(posX);
			})();
		}
	}
};