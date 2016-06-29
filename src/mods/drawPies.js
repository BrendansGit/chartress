g.drawPies = function(){
	var i = 0;
	g.pies = {};

	g.draw_pie = g.draw.group().addClass(g.settings.class+'__pies');
	var size = (g.settings.width < g.settings.height ? g.settings.width : g.settings.height);
	var x = (g.settings.width / 2 - (size /2)) + g.settings.rect.left;
	var y = (g.settings.height / 2 - (size /2)) + g.settings.rect.top;

	var total = g.options.pie.total || 'count';
	var filled = 0;

	if (total === 'count') {
		total = 0;
		for (var key in g.options.dataset) {
			var line = g.options.dataset[key];
			total+=line.value;
		}
	}

	var mask;
	for (var key in g.options.dataset) {
		(function(){
			var line = g.options.dataset[key];

			var filledProc = 0;
			var rotate = -90 + (filledProc);
			if (typeof line.position === 'number') {
				if (line.position > 1) {
					line.position = line.position / 100;
				}
				filledProc = line.position * 360;
			} else if (filled !== 0) {
				filledProc = (filled/total) * 360;
			}

			if (typeof line.position !== 'number') {
				filled += line.value;
			}
			rotate = -90 + (filledProc);
			
			var classname = line.classname || 'noclass-'+i;
			var lineWidth = size;
			if (typeof line.width !== 'undefined') {
				lineWidth = line.width
			}
			g.pies[classname] = {};
			g.pies[classname].el = g.draw_pie.circle(size);
			g.pies[classname].el.attr('stroke-dasharray', '20,10').fill('transparent')
				.addClass(g.settings.class+'__pie')
				.dx(x).dy(y)
				.stroke({
					width: lineWidth,
					color: line.color || '#aaa'
				});

			var dia = (2 * Math.PI *(size/2));
			g.pies[classname].el.attr('stroke-dasharray', 0+','+dia);

			g.pies[classname].el.rotate(rotate);
			
			if (line.mask !== false) {
				mask = g.draw_pie.circle(size).fill({color:'white'}).dx(x).dy(y);
				g.pies[classname].el.maskWith(mask);
			}

			g.pies[classname].set = function(nv) {
				var res = ((nv*dia) / total);
				g.pies[classname].el.attr('stroke-dasharray', res+','+dia);
			};
			setTimeout(function(){
				g.pies[classname].set(line.value);
				g.pies[classname].el.addClass(g.settings.class+'__pie--' + classname);
			});
			i++;
		})();
	};

	var title = g.settings.pie.title || false;
	if (title.text !== false) {
		g.draw_pie_title = g.draw_pie.group().addClass(g.settings.class+'__pie__title');
		var maintext = g.draw_pie_title.text(title.text).addClass(g.settings.class+'__pie__title--main').font({
			family: g.settings.fontFamily,
			size: title.size,
			anchor: 'middle',
		}).dx(g.settings.width / 2 + g.settings.padding.left).dy(g.settings.height / 2 + g.settings.padding.top - (title.size * 0.9));
		if (title.bold) {
			maintext.font({
				family: g.settings.fontFamily,
				weight: 'bold'
			});
		}

		var preTitle = title.pre || false;
		if (preTitle) {
			pretext = g.draw_pie_title.text(preTitle.text).addClass(g.settings.class+'__pie__title--pre').font({
				family: g.settings.fontFamily,
				size: preTitle.size,
				anchor: 'middle'
			}).dx(g.settings.width / 2 + g.settings.padding.left).dy((g.settings.height / 2) - (title.size/2) - (preTitle.size) - 5 + g.settings.padding.top);
		}

		var subTitle = title.sub || false;
		if (subTitle) {
			subText = g.draw_pie_title.text(subTitle.text).addClass(g.settings.class+'__pie__title--sub').font({
				family: g.settings.fontFamily,
				size: subTitle.size,
				anchor: 'middle'
			}).dx(g.settings.width / 2 + g.settings.padding.left).dy((g.settings.height / 2) + (title.size/2.5) + g.settings.padding.top);
		}
	}
};