g.drawLines = function(){
	g.draw_plots = g.draw.group().addClass(g.settings.class+'__plots');

	for (var key in g.options.dataset) {

		var line = g.options.dataset[key];
		var classname = line.classname || line.name.toLowerCase().replace(/ /g, '_');
		var color = line.color || 'black';
		var width = line.width || 2;
		var pointsArr = [];
		line.__plotgroup = g.draw_plots.group();
		line.__plotgroup.addClass(g.settings.class+'__plot chartress__plot--'+(classname)).attr('plot-name', classname);

		var x = 0;
		for (var key in line.__plot) {
			(function(){
				var point = line.__plot[key];
				// var xPos = g.settings.xPoints[x];
				var xPos = ((x/maxLength) * g.settings.width) + g.settings.padding.left;
				var yPos = ((point / g.settings.yMax) * g.settings.height);
				yPos = (g.settings.height - yPos) + g.settings.padding.top;
				pointsArr.push([xPos, yPos]);
				x++;
			})();
		};

		line.__plotsvg = line.__plotgroup.polyline(pointsArr).fill('none').stroke({ color: color, width: width }).addClass(g.settings.class+'__line chartress__line--'+classname);
		if(line.dash){
			line.__plotsvg.attr('stroke-dasharray', line.dash);
		}
		var rad = line.rad || 6;
		for (var key in pointsArr) {
			(function(){
				var point = pointsArr[key];
				line.__plotgroup.circle(rad).dx(point[0] - rad/2).dy(point[1] - rad/2).addClass(g.settings.class+'__dot chartress__dot--'+(classname)).stroke({
					color: color,
					width: width
				}).fill('white');
			})();
		};
	};
};