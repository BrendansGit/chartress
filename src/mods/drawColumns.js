g.drawColumns = function(){
	g.draw_columns = [];
	maxLength++;

	var columnSpaceX = g.settings.width / maxLength;

	for (var i = 0; i < maxLength; i++) {
		g.draw_columns[i] = g.draw.group().addClass(g.settings.class+'__columns__group '+g.settings.class+'__columns__group--'+e);
		// var absPosX = ((i/maxLength) * g.settings.width) + g.settings.padding.left;
		var absPosX = (columnSpaceX * i) + g.settings.padding.left;
		var corr_label_y = g.settings.columns.labels.y;

		var e = 0;
		for (var key in g.options.dataset) {
			var line = g.options.dataset[key];
			var name = line.name || (i+1).toString();
			var color = line.color || '#222';
			var textColor = line.textColor || color;
			var classname = line.classname || name.replace(/ /g, '_').toLowerCase();

			var columnWidth = g.settings.columns.width;
			var columnSpace = g.settings.columns.space;
			var columnHeight = (line.__plot[i] / g.settings.largestcolumn) * g.settings.height;

			var position = maxLength * -0.5;
			if (maxLength%2) {
				position+=0.5;
			}
			position++;
			position += e;

			var offsetX = position* (columnWidth+columnSpace);

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

	// for (var key in g.options.dataset) {
	// 	(function(){
	// 		var line = g.options.dataset[key];
	// 		var name = line.name || (i+1).toString();
	// 		var classname = line.classname || name.replace(/ /g, '_').toLowerCase();
	// 		g.draw_columns[i] = g.draw.group().addClass(g.settings.class+'__columns__group '+g.settings.class+'__columns__group--'+classname);
	// 		var color = line.color || '#222';
	// 		var textColor = line.textColor || color;
	// 		var proc = ((100 / g.options.dataset.length) / 100) * i;
	// 		var space = g.settings.width / g.options.dataset.length;
	// 		var xcenter = (proc * g.settings.width) + space - (space/2);
	// 		var columnWidth = g.settings.columns.width;
	// 		var columnHeight = (line.value / g.settings.largestcolumn) * g.settings.height;
	// 		var corr_label_y = g.settings.columns.labels.y;

	// 		g.draw_columns[i].text(name)
	// 				.fill(textColor)
	// 				.font({
	// 					family: g.settings.fontFamily,
	// 					anchor: 'middle',
	// 					size: g.settings.columns.labels.fontsize
	// 				})
	// 				.dx(xcenter + g.settings.padding.left)
	// 				.dy(g.settings.height + corr_label_y + g.settings.padding.top)
	// 				.addClass(g.settings.class+'__columns__label '+g.settings.class+'__columns__label--'+classname);

	// 		g.draw_columns[i].rect(columnWidth, columnHeight)
	// 			.dx(xcenter - (columnWidth/2) + g.settings.padding.left)
	// 			.dy(g.settings.height - columnHeight + g.settings.padding.top)
	// 			.fill(color)
	// 			.addClass(g.settings.class+'__columns__column '+g.settings.class+'__columns__column--'+classname);

	// 		i++;
	// 	})();
	// };
};