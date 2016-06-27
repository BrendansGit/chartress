g.drawPipes = function(){
	var i = 0;
	g.draw_pipes = {
		labels: g.draw.group().addClass('chartress__pipes__labels'),
		pipes: g.draw.group().addClass('chartress__pipes__pipes')
	};

	for (var key in g.options.lines) {
		var line = g.options.lines[key];
		var proc = ((100 / g.options.lines.length) / 100) * i;
		var space = g.settings.width / g.options.lines.length;
		var xcenter = (proc * g.settings.width) + space - (space/2);
		var pipeWidth = g.options.pipes.width || 10;
		var pipeHeight = (line.value / g.settings.largestPipe) * g.settings.height;
		var corr_label_y = g.options.pipes.labels.y || 0;

		g.draw_pipes.labels.text(line.name)
				.fill('#000')
				.font({
					family: g.options.graph.fontFamily || 'Helvetica',
					anchor: 'middle',
					size: g.options.pipes.labels.fontsize || 14
				})
				.dx(xcenter + g.settings.padding.left)
				.dy(g.settings.height + corr_label_y + g.settings.padding.top)
				.addClass('chartress__pipes__label');

		g.draw_pipes.pipes.rect(pipeWidth, pipeHeight).dx(xcenter - (pipeWidth/2) + g.settings.padding.left).dy(g.settings.height - pipeHeight + g.settings.padding.top).addClass('chartress__pipes__pipe');

		i++;
	};
};