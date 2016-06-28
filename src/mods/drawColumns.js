g.drawColumns = function(){
	var i = 0;
	g.draw_columns = {
		labels: g.draw.group().addClass('chartress__columns__labels'),
		columns: g.draw.group().addClass('chartress__columns__columns')
	};

	for (var key in g.options.lines) {
		(function(){
			var line = g.options.lines[key];
			var proc = ((100 / g.options.lines.length) / 100) * i;
			var space = g.settings.width / g.options.lines.length;
			var xcenter = (proc * g.settings.width) + space - (space/2);
			var columnWidth = g.settings.columns.width || 10;
			var columnHeight = (line.value / g.settings.largestcolumn) * g.settings.height;
			var corr_label_y = g.settings.columns.labels.y || 0;

			g.draw_columns.labels.text(line.name)
					.fill('#000')
					.font({
						family: g.options.graph.fontFamily || 'Helvetica',
						anchor: 'middle',
						size: g.settings.columns.labels.fontsize || 14
					})
					.dx(xcenter + g.settings.padding.left)
					.dy(g.settings.height + corr_label_y + g.settings.padding.top)
					.addClass('chartress__columns__label');

			g.draw_columns.columns.rect(columnWidth, columnHeight).dx(xcenter - (columnWidth/2) + g.settings.padding.left).dy(g.settings.height - columnHeight + g.settings.padding.top).addClass('chartress__columns__column');

			i++;
		})();
	};
};