g.drawLegend = function(){
	g.draw_legend = g.draw.group().addClass('chartress__legend').font({
		family: g.options.graph.fontFamily || 'Helvetica',
		size: 13
	});

	var pX = 0;
	var posX = (g.settings.outweWidth/100) * g.options.legend.x;
	if (g.options.legend.x > 50) {
		posX -= g.options.legend.padding[1];
		pX = g.options.legend.padding[1]*-1;
	}else{
		posX += g.options.legend.padding[3];
		pX = g.options.legend.padding[3];
	}

	var pY = 0;
	var posY = (g.settings.outerHeight/100) * g.options.legend.y;
	if (g.options.legend.y < 50) {
		posY += g.options.legend.padding[0];
		pY = g.options.legend.padding[0];
	}else{
		posY -= g.options.legend.padding[2];
		pY = g.options.legend.padding[2]*-1;
	}

	g.draw_legend.width(g.settings.outweWidth).dmove(posX, posY);

	var i = 0;
	for (var key in g.options.lines) {
		(function(){
			var line = g.options.lines[key];
			line.__legend = g.draw_legend.group().addClass('chartress__legend__row chartress__legend--'+line.classname).attr('plot-name', line.classname);
			var string = line.name;
			var text = line.__legend.text(string).font({
				family: g.options.graph.fontFamily || 'Helvetica'
			});
			var tx = (text.node.scrollWidth + 40)*-1;
			var ty = ((text.node.scrollHeight)*i) * 1.1;
			text.dx(tx);
			text.dy(ty);
			var rad = line.rad;
			var compensate = (text.node.scrollHeight * 1.1) * 0.2;
			var line_path = [
				[-30,pY+(text.node.scrollHeight-compensate) + ty],
				[0,pY+(text.node.scrollHeight-compensate) + ty],
			];
			var polyline = line.__legend.polyline(line_path).fill('none').stroke({ width: 2 }).addClass('chartress__line chartress__legend__line chartress__legend__line--'+line.classname);
			if(line.dash){
				polyline.attr('stroke-dasharray', line.dash);
			}
			line.__legend.circle(rad).dx(0 - rad/2).dy((pY + (text.node.scrollHeight-compensate) + ty) - rad/2).addClass('chartress__dot chartress__legend__dot--'+(line.classname));

			line.__legend.mouseover(function(){
				var t = this;
				// console.log(line);
				line.__plotgroup.addClass('chartress__plot--hover');
			}).mouseout(function(){
				line.__plotgroup.removeClass('chartress__plot--hover');
			});
			i++;
		})();
	};
};