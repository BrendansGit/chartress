/* global g g_st */

g.drawLegend = function() {
	g.draw_legend = g.draw.group().addClass(g.s.class + '__legend').font({
		family: g.s.fontFamily,
		size: 12
	});

	// var pX = 0;
	var posX = (g.s.outerWidth / 100) * g.s.legend.x;
	if (g.s.legend.x > 50) {
		posX -= g.s.legend.padding.right;
		// pX = g.s.legend.padding.right * -1;
	} else {
		posX += g.s.legend.padding.left;
		// pX = g.s.legend.padding.left;
	}

	// var pY = 0;
	var posY = (g.s.outerHeight / 100) * g.s.legend.y;
	if (g.s.legend.y < 50) {
		posY += g.s.legend.padding.top;
		// pY = g.s.legend.padding.top;
	} else {
		posY -= g.s.legend.padding.bottom;
		// pY = g.s.legend.padding.bottom * -1;
	}

	g.draw_legend.width(g.s.outerWidth).dmove(posX, posY);

	var i = 0;
	for (var key in g.o.dataset) {
		(function() {
			var line = g.o.dataset[key];
			if (line.name) {
				var classname = line.classname || line.name.toLowerCase().replace(/ /g, '_');
				var color = line.color || 'black';
				var width = line.width || 2;
				line.__legend = g.draw_legend.group().addClass(g.s.class + '__legend__row chartress__legend--' + classname).attr('plot-name', classname);
				var string = line.name;
				var text = line.__legend.text(string)
					.fill(color)
					.font({
						family: g.s.fontFamily
					});
				var tx = (parseInt(g_st(text.node).width, 10) + 40) * -1 - 5;
				var ty = ((parseInt(g_st(text.node).height, 10)) * i) - 9;
				text.dx(tx);
				text.dy(ty);
				var rad = line.rad || 6;
				var comp = (parseInt(g_st(text.node).height, 10) / 2 + 1);
				var pathY = (parseInt(g_st(text.node).height, 10)) * i + comp;
				var line_path = [
					[-35, pathY],
					[-5, pathY]
				];
				var polyline = line.__legend.polyline(line_path)
					.fill('none')
					.stroke({
						color: color,
						width: width
					})
					.addClass(g.s.class + '__line chartress__legend__line chartress__legend__line--' + classname);
				if (line.dash) {
					polyline.attr('stroke-dasharray', line.dash);
				}
				line.__legend.circle(rad)
					.stroke({
						width: width,
						color: color
					})
					.fill('white')
					.dx(0 - rad / 2 - 5)
					.dy(pathY - rad / 2)
					.addClass(g.s.class + '__dot chartress__legend__dot--' + (classname));

				line.__legend.mouseover(function() {
					// var t = this;
					line.__plotgroup.addClass(g.s.class + '__plot--hover');
				}).mouseout(function() {
					line.__plotgroup.removeClass(g.s.class + '__plot--hover');
				});
				i++;
			}
		})();
	};
};
