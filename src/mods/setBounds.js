g.setBounds = function() {
	if (g.s.type === 'line' || g.s.type == 'column') {
		var longest = 0;
		for (var key in g.o.dataset) {
			(function(){
				var line = g.o.dataset[key];
				var plot = line.plot.slice(0);
				if (g.s.maxLength !== null && plot.length > g.s.maxLength) {
					plot.reverse();
					plot.length = g.s.maxLength;
					plot.reverse();
				}
				if (plot.length > longest) {
					longest = plot.length;
				}
				line.__plot = plot.slice(0);
				plot.sort(sortNumber);
				if (g.s.yMax < plot[0]) {
					g.s.yMax = plot[0];
				}
			})();
		};
		g.s.maxLength = longest;
		if (g.s.xAxis.range.to === null) {
			g.s.xAxis.range.to = longest;
		}
	}
	if (g.s.type === 'column') {
		g.s.largestcolumn = 0;
		for (var key in g.o.dataset) {
			var line = g.o.dataset[key];
			for (var i = 0; i < line.__plot.length; i++) {
				var point = line.__plot[i];
				if (g.s.largestcolumn < point) {
					g.s.largestcolumn = point;
				}
			}
		}
	}
	if (g.s.type === 'pie') {
		g.s.pie.total = g.o.pie.total || false;
		if (g.s.pie.total === false) {
			for (var key in g.o.dataset) {
				var line = g.o.dataset[key];
				g.s.pie.total += line.value;
			}
		}
	}

	g.s.outerWidth = parseInt(g_st(chel).width);
	g.s.width = g.s.outerWidth - g.s.graph.padding.right - g.s.graph.padding.left;
	g.s.outerHeight = parseInt(g_st(chel).height);
	g.s.height = g.s.outerHeight - g.s.graph.padding.top - g.s.graph.padding.bottom;

	g.s.rect = {
		top: g.s.graph.padding.top,
		left: g.s.graph.padding.left,
		right: g.s.graph.padding.left + g.s.width,
		bottom: g.s.outerHeight - g.s.graph.padding.bottom
	};

	// debug rect
	if (g.o.debug === true) {
		// g.draw.rect(g.s.width, g.s.height).fill('rgba(0,0,0,.1)').dx(g.s.rect.left).dy(g.s.rect.top);
	}
};