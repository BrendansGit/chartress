g.drawColumns = function(){
	g.draw_columns = [];
	var useLength = g.s.maxLength;

	var columnSpaceX = g.s.width / useLength;

	for (var i = 0; i < useLength; i++) {
		g.draw_columns[i] = g.draw.group().addClass(g.s.class+'__columns__group '+g.s.class+'__columns__group--'+i);
		// var absPosX = ((i/maxLength) * g.s.width) + g.s.graph.padding.left;
		var absPosX = (columnSpaceX * i) + g.s.graph.padding.left;
		var corr_label_y = g.s.columns.labels.y;

		var e = 0;
		for (var key in g.o.dataset) {
			var line = g.o.dataset[key];
			g.log(line);
			var name = line.name || (i+1).toString();
			if (typeof name == 'object') {
				name = name[i];
			}
			var color = line.color || '#222';
			var textColor = line.textColor || color;
			var classname = line.classname || name.replace(/ /g, '_').toLowerCase();

			var columnWidth = g.s.columns.width;
			var columnSpace = g.s.columns.space;
			var columnHeight = (line.__plot[i] / g.s.largestcolumn) * g.s.height;

			var position = ((g.o.dataset.length* -0.5) + 0.5) + e;


			var offsetX = position* (columnWidth+columnSpace);
			g.log([position, offsetX])

			g.draw_columns[i].text(name)
				.fill(textColor)
				.dx((absPosX + (columnSpaceX/2)) + offsetX)
				.dy(g.s.height + corr_label_y + g.s.graph.padding.top)
				.font({
					family: g.s.fontFamily,
					anchor: 'middle',
					size: g.s.columns.labels.fontsize
				})
				.addClass(g.s.class+'__columns__label '+g.s.class+'__columns__label--'+classname);

			g.draw_columns[i].rect(columnWidth, columnHeight)
				.fill(color)
				.dx(((absPosX + (columnSpaceX/2)) + offsetX) - columnWidth/2)
				.dy(g.s.height - columnHeight + g.s.graph.padding.top)
				.addClass(g.s.class+'__columns__column '+g.s.class+'__columns__column--'+classname);

			e++;
		}
	}
};