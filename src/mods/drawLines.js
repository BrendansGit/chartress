g.drawLines = function(){
	g.draw_plots = g.draw.group().addClass('chartress__plots');
	for (var key in g.options.lines) {
		var line = g.options.lines[key];

		var x = 0;
		var pointsArr = [];
		line.__plotgroup = g.draw_plots.group();
		line.__plotgroup.addClass('chartress__plot chartress__plot--'+(line.classname)).attr('plot-name', line.classname);

		for (var key in line.__plot) {
			var point = line.__plot[key];
			var xPos = g.settings.xPoints[x];
			var yPos = (g.settings.height - ((point / g.settings.yMax) * g.settings.height)) + g.settings.padding.top;
			pointsArr.push([xPos, yPos]);
			x++;
		};

		line.__plotsvg = line.__plotgroup.polyline(pointsArr).fill('none').stroke({ width: 2 }).addClass('chartress__line chartress__line--'+line.classname);
		if(line.dash){
			line.__plotsvg.attr('stroke-dasharray', line.dash);
		}
		var rad = line.rad;
		for (var key in pointsArr) {
			var point = pointsArr[key];
			line.__plotgroup.circle(rad).dx(point[0] - rad/2).dy(point[1] - rad/2).addClass('chartress__dot chartress__dot--'+(line.classname));
		};
	};
};