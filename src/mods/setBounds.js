g.setBounds = function() {
	if (g.settings.type === 'line') {
		var longest = 0;
		for (var key in g.options.dataset) {
			(function(){
				var line = g.options.dataset[key];
				var plot = line.plot.slice(0);
				if (plot.length > maxLength) {
					plot.reverse();
					plot.length = maxLength;
					plot.reverse();
				}
				if (plot.length > longest) {
					longest = plot.length - 1;
				}
				line.__plot = plot.slice(0);
				plot.sort(sortNumber);
				if (g.settings.yMax < plot[0]) {
					g.settings.yMax = plot[0];
				}
			})();
		};
		maxLength = longest;
		if (g.settings.xAxis.range.to === null) {
			g.settings.xAxis.range.to = longest;
		}
	}
	if (g.settings.type === 'column') {
		g.settings.largestcolumn = 0;
		for (var key in g.options.dataset) {
			var line = g.options.dataset[key];
			if (g.settings.largestcolumn < line.value) {
				g.settings.largestcolumn = line.value;
			}
		};
	}
	if (g.settings.type === 'pie') {
		g.settings.pie.total = g.options.pie.total || false;
		if (g.settings.pie.total === false) {
			for (var key in g.options.dataset) {
				var line = g.options.dataset[key];
				g.settings.pie.total += line.value;
			}
		}
	}

	g.settings.outerWidth = parseInt(g_st(el).width);
	g.settings.width = g.settings.outerWidth - g.settings.padding.right - g.settings.padding.left;
	g.settings.outerHeight = parseInt(g_st(el).height);
	g.settings.height = g.settings.outerHeight - g.settings.padding.top - g.settings.padding.bottom;

	g.settings.rect = {
		top: g.settings.padding.top,
		left: g.settings.padding.left,
		right: g.settings.padding.left + g.settings.width,
		bottom: g.settings.outerHeight - g.settings.padding.bottom
	};

	// debug rect
	// g.draw.rect(g.settings.width, g.settings.height).fill('#eee').dx(g.settings.rect.left).dy(g.settings.rect.top);
};