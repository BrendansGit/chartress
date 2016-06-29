g.drawColumns = function(){
	g.draw_columns = [];
	var useLength = g.settings.maxLength;

	var columnSpaceX = g.settings.width / useLength;

	for (var i = 0; i < useLength; i++) {
		g.draw_columns[i] = g.draw.group().addClass(g.settings.class+'__columns__group '+g.settings.class+'__columns__group--'+i);
		// var absPosX = ((i/maxLength) * g.settings.width) + g.settings.padding.left;
		var absPosX = (columnSpaceX * i) + g.settings.padding.left;
		var corr_label_y = g.settings.columns.labels.y;

		var e = 0;
		for (var key in g.options.dataset) {
			var line = g.options.dataset[key];
			g.log(line);
			var name = line.name || (i+1).toString();
			if (typeof name == 'object') {
				name = name[i];
			}
			var color = line.color || '#222';
			var textColor = line.textColor || color;
			var classname = line.classname || name.replace(/ /g, '_').toLowerCase();

			var columnWidth = g.settings.columns.width;
			var columnSpace = g.settings.columns.space;
			var columnHeight = (line.__plot[i] / g.settings.largestcolumn) * g.settings.height;

			var position = ((g.options.dataset.length* -0.5) + 0.5) + e;


			var offsetX = position* (columnWidth+columnSpace);
			g.log([position, offsetX])

			g.draw_columns[i].text(name)
				.fill(textColor)
				.dx((absPosX + (columnSpaceX/2)) + offsetX)
				.dy(g.settings.height + corr_label_y + g.settings.padding.top)
				.font({
					family: g.settings.fontFamily,
					anchor: 'middle',
					size: g.settings.columns.labels.fontsize
				})
				.addClass(g.settings.class+'__columns__label '+g.settings.class+'__columns__label--'+classname);

			g.draw_columns[i].rect(columnWidth, columnHeight)
				.fill(color)
				.dx(((absPosX + (columnSpaceX/2)) + offsetX) - columnWidth/2)
				.dy(g.settings.height - columnHeight + g.settings.padding.top)
				.addClass(g.settings.class+'__columns__column '+g.settings.class+'__columns__column--'+classname);

			e++;
		}
	}
};