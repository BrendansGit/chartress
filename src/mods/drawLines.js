/* global g */
g.drawLines = function() {
	g.draw_plots = g.draw.group().addClass(g.s.class + '__plots');

	for (var key in g.o.dataset) {

		var line = g.o.dataset[key];
		var classname = line.classname || line.name.toLowerCase().replace(/ /g, '_');
		var color = line.color || 'black';
		var width = line.width || 2;
		var pointsArr = [];
		line.__plotgroup = g.draw_plots.group();
		line.__plotgroup.addClass(g.s.class + '__plot chartress__plot--' + (classname)).attr('plot-name', classname);

		var x = 0;
		for (var plot_key in line.__plot) {
			(function() {
				var point = line.__plot[plot_key];
				var xPos = ((x / (g.s.maxLength - 1)) * g.s.width) + g.s.graph.padding.left;
				var yPos = ((point / g.s.yMax) * g.s.height);
				yPos = (g.s.height - yPos) + g.s.graph.padding.top;
				pointsArr.push([xPos, yPos]);
				x++;
			})();
		};

		line.__plotsvg = line.__plotgroup.polyline(pointsArr).fill('none').stroke({
			color: color,
			width: width
		}).addClass(g.s.class + '__line chartress__line--' + classname);
		if (line.dash) {
			line.__plotsvg.attr('stroke-dasharray', line.dash);
		}
		var rad = line.rad || 6;
		for (var pont_key in pointsArr) {
			(function() {
				var point = pointsArr[pont_key];
				line.__plotgroup.circle(rad).dx(point[0] - rad / 2).dy(point[1] - rad / 2).addClass(g.s.class + '__dot chartress__dot--' + (classname)).stroke({
					color: color,
					width: width
				}).fill('white');
			})();
		};
	};
};
