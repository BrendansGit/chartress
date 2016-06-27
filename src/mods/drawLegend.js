g.drawLegend = function(){
	g.draw_legend = g.draw.group().addClass('chartress__legend').font({
		family: g.options.graph.fontFamily || 'Helvetica',
		size: 13
	});

	var pX = 0;
	var posX = (g.settings.outweWidth/100) * g.settings.legend.x;
	if (g.settings.legend.x > 50) {
		posX -= g.settings.legend.padding.right;
		pX = g.settings.legend.padding.right*-1;
	}else{
		posX += g.settings.legend.padding.left;
		pX = g.settings.legend.padding.left;
	}

	var pY = 0;
	var posY = (g.settings.outerHeight/100) * g.settings.legend.y;
	if (g.settings.legend.y < 50) {
		posY += g.settings.legend.padding.top;
		pY = g.settings.legend.padding.top;
	}else{
		posY -= g.settings.legend.padding.bottom;
		pY = g.settings.legend.padding.bottom*-1;
	}

	g.draw_legend.width(g.settings.outweWidth).dmove(posX, posY);

	var i = 0;
	for (var key in g.options.lines) {
		(function(){
			var line = g.options.lines[key];
			if (line.name) {
				var classname = line.classname || line.name.toLowerCase().replace(/ /g, '_');
				var color = line.color || 'black';
				var width = line.width || 2;
				line.__legend = g.draw_legend.group().addClass('chartress__legend__row chartress__legend--'+classname).attr('plot-name', classname);
				var string = line.name;
				var text = line.__legend.text(string)
					.fill(color)
					.font({
						family: g.options.graph.fontFamily || 'Helvetica'
					});
				var tx = (parseInt(getComputedStyle(text.node).width) + 40)*-1 - 5;
				var ty = ((parseInt(getComputedStyle(text.node).height))*i) - 9;
				text.dx(tx);
				text.dy(ty);
				var rad = line.rad || 6;
				var comp = (parseInt(getComputedStyle(text.node).height)/2);
				var pathY = (parseInt(getComputedStyle(text.node).height))*i + comp;
				var line_path = [
					[-35,pathY],
					[-5,pathY],
				];
				var polyline = line.__legend.polyline(line_path)
					.fill('none')
					.stroke({ color: color, width: width })
					.addClass('chartress__line chartress__legend__line chartress__legend__line--'+classname);
				if(line.dash){
					polyline.attr('stroke-dasharray', line.dash);
				}
				line.__legend.circle(rad)
					.stroke({width: width, color: color})
					.fill('white')
					.dx(0 - rad/2 -5)
					.dy(pathY - rad/2)
					.addClass('chartress__dot chartress__legend__dot--'+(classname));

				line.__legend.mouseover(function(){
					var t = this;
					line.__plotgroup.addClass('chartress__plot--hover');
				}).mouseout(function(){
					line.__plotgroup.removeClass('chartress__plot--hover');
				});
				i++;
			}
		})();
	};
};