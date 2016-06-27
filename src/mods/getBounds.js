g.setBounds = function() {
	if (g.settings.type === 'normal') {
		for (var key in g.options.lines) {
			var line = g.options.lines[key];
			var plot = line.plot.slice(0);
			if (plot.length > g.options.xAxis.maxRangeLength) {
				plot.reverse();
				plot.length = g.options.xAxis.maxRangeLength;
				plot.reverse();
			}
			line.__plot = plot.slice(0);
			plot.sort(sortNumber);
			if (g.settings.yMax < plot[0]) {
				g.settings.yMax = plot[0];
			}
		};
	}
	if (g.settings.type === 'pipes') {
		g.settings.largestPipe = 0;
		for (var key in g.options.lines) {
			var line = g.options.lines[key];
			if (g.settings.largestPipe < line.value) {
				g.settings.largestPipe = line.value;
			}
		};
	}
	if (g.settings.type === 'pie') {
		g.settings.pie = {};
		g.settings.pie.total = g.options.pie.total || false;
		if (g.settings.pie.total === false) {
			for (var key in g.options.lines) {
				var line = g.options.lines[key];
				g.settings.pie.total += line.value;
			}
		}
	}

	g.settings.outweWidth = el.scrollWidth;
	g.settings.width = el.scrollWidth - g.settings.padding.right - g.settings.padding.left;
	g.settings.outerHeight = el.scrollHeight;
	g.settings.height = el.scrollHeight - g.settings.padding.top - g.settings.padding.bottom;

	g.settings.rect = {
		top: g.settings.padding.top,
		left: g.settings.padding.left,
		right: g.settings.padding.left + g.settings.width,
		bottom: g.settings.outerHeight - g.settings.padding.bottom
	};

	// debug rect
	// g.draw.rect(g.settings.width, g.settings.height).fill('#eee').dx(g.settings.rect.left).dy(g.settings.rect.top);
};