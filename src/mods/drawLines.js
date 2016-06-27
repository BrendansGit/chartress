g.drawLines = function(){
	g.draw_plots = g.draw.group().addClass('chartress__plots');
	for (var key in g.options.lines) {
		var line = g.options.lines[key];
		var classname = line.classname || line.name.toLowerCase().replace(/ /g, '_');
		var color = line.color || 'black';
		var width = line.width || 2;
		var x = 0;
		var pointsArr = [];
		line.__plotgroup = g.draw_plots.group();
		line.__plotgroup.addClass('chartress__plot chartress__plot--'+(classname)).attr('plot-name', classname);

		for (var key in line.__plot) {
			(function(){
				var point = line.__plot[key];
				var xPos = g.settings.xPoints[x];
				var yPos = ((point / g.settings.yMax) * g.settings.height);
				yPos = (g.settings.height - yPos) + g.settings.padding.top;
				pointsArr.push([xPos, yPos]);
				x++;
			})();
		};

		line.__plotsvg = line.__plotgroup.polyline(pointsArr).fill('none').stroke({ color: color, width: width }).addClass('chartress__line chartress__line--'+classname);
		if(line.dash){
			line.__plotsvg.attr('stroke-dasharray', line.dash);
		}
		var rad = line.rad || 6;
		for (var key in pointsArr) {
			(function(){
				var point = pointsArr[key];
				line.__plotgroup.circle(rad).dx(point[0] - rad/2).dy(point[1] - rad/2).addClass('chartress__dot chartress__dot--'+(classname)).stroke({
					color: color,
					width: width
				}).fill('white');
			})();
		};
	};
};