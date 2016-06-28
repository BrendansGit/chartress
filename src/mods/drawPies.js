g.drawPies = function(){
	var i = 0;
	g.pies = {};

	g.draw_pie = g.draw.group().addClass('chartress__pies');
	var size = (g.settings.width < g.settings.height ? g.settings.width : g.settings.height);
	var x = (g.settings.width / 2 - (size /2)) + g.settings.rect.left;
	var y = (g.settings.height / 2 - (size /2)) + g.settings.rect.top;

	var mask;
	for (var key in g.options.lines) {
		(function(){
			var line = g.options.lines[key];

			var classname = line.classname || 'noclass-'+i;

			var lineWidth = size;
			if (typeof line.width !== 'undefined') {
				lineWidth = line.width
			}
			g.pies[classname] = {};
			g.pies[classname].el = g.draw_pie.circle(size);
			g.pies[classname].el.attr('stroke-dasharray', '20,10').fill('transparent')
				.addClass('chartress__pie')
				.dx(x).dy(y)
				.stroke({
					width: lineWidth,
					color: line.color || '#aaa'
				}).rotate(-90);
			var dia = (2 * Math.PI *(size/2));
			g.pies[classname].el.attr('stroke-dasharray', 0+','+dia);
			
			if (line.mask !== false) {
				mask = g.draw_pie.circle(size).fill({color:'white'}).dx(x).dy(y);
				g.pies[classname].el.maskWith(mask);
			}

			g.pies[classname].set = function(nv) {
				var res = ((nv*dia) / 100);
				g.pies[classname].el.attr('stroke-dasharray', res+','+dia);
			};
			setTimeout(function(){
				g.pies[classname].set(line.value);
				g.pies[classname].el.addClass('chartress__pie--' + classname);
			});
			i++;
		})();
	};

	var title = g.settings.pie.title || false;
	if (title.text !== false) {
		g.draw_pie_title = g.draw_pie.group().addClass('chartress__pie__title');
		var maintext = g.draw_pie_title.text(title.text).addClass('chartress__pie__title--main').font({
			family: g.options.graph.fontFamily || 'Helvetica',
			size: title.size,
			anchor: 'middle',
		}).dx(g.settings.width / 2 + g.settings.padding.left).dy(g.settings.height / 2 + g.settings.padding.top);
		if (title.bold) {
			maintext.font({
				family: g.options.graph.fontFamily || 'Helvetica',
				weight: 'bold'
			});
		}
		maintext.dy(parseInt(getComputedStyle(maintext.node).height)*-0.9);

		var preTitle = title.pre || false;
		if (preTitle) {
			pretext = g.draw_pie_title.text(preTitle.text).addClass('chartress__pie__title--pre').font({
				family: g.options.graph.fontFamily || 'Helvetica',
				size: preTitle.size,
				anchor: 'middle'
			}).dx(g.settings.width / 2 + g.settings.padding.left).dy(g.settings.height / 2 - (title.size/2.7));
		}

		var subTitle = title.sub || false;
		if (subTitle) {
			subText = g.draw_pie_title.text(subTitle.text).addClass('chartress__pie__title--sub').font({
				family: g.options.graph.fontFamily || 'Helvetica',
				size: subTitle.size,
				anchor: 'middle'
			}).dx(g.settings.width / 2 + g.settings.padding.left).dy(g.settings.height / 2 + (title.size/2.5) + g.settings.padding.top);
		}
	}
};