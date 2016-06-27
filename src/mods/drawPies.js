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

			var lineWidth = size;
			if (typeof line.width !== 'undefined') {
				lineWidth = line.width
			}
			g.pies[line.classname] = {};
			g.pies[line.classname].el = g.draw_pie.circle(size);
			g.pies[line.classname].el.attr('stroke-dasharray', '20,10').fill('transparent')
				.addClass('chartress__pie')
				.dx(x).dy(y)
				.stroke({
					width: lineWidth
				}).rotate(-90);
			var dia = (2 * Math.PI *(size/2));
			g.pies[line.classname].el.attr('stroke-dasharray', 0+','+dia);
			
			if (line.mask !== false) {
				mask = g.draw_pie.circle(size).fill({color:'white'}).dx(x).dy(y);
				g.pies[line.classname].el.maskWith(mask);
			}

			g.pies[line.classname].set = function(nv) {
				var res = ((nv*dia) / 100);
				g.pies[line.classname].el.attr('stroke-dasharray', res+','+dia);
			};
			setTimeout(function(){
				g.pies[line.classname].set(line.value);
				g.pies[line.classname].el.addClass('chartress__pie--' + line.classname);
			});
			i++;
		})();
	};

	var title = g.options.pie.title || false;
	if (title) {
		g.draw_pie_title = g.draw_pie.group().addClass('chartress__pie__title');
		var maintext = g.draw_pie_title.text(title.text).addClass('chartress__pie__title--main').font({
			family: g.options.graph.fontFamily || 'Helvetica',
			size: title.size,
			anchor: 'middle'
		}).dx(g.settings.width / 2).dy(g.settings.height / 2);
		if (title.bold) {
			maintext.font({
				family: g.options.graph.fontFamily || 'Helvetica',
				weight: 'bold'
			});
		}
		maintext.dy(maintext.node.scrollHeight*-0.9);

		var preTitle = title.pre || false;
		if (preTitle) {
			pretext = g.draw_pie_title.text(preTitle.text).addClass('chartress__pie__title--pre').font({
				family: g.options.graph.fontFamily || 'Helvetica',
				size: preTitle.size,
				anchor: 'middle'
			}).dx(g.settings.width / 2).dy((g.settings.height/2) - (maintext.node.scrollHeight/2));
			pretext.dy(pretext.node.scrollHeight*-1.8);
		}

		var subTitle = title.sub || false;
		if (subTitle) {
			subText = g.draw_pie_title.text(subTitle.text).addClass('chartress__pie__title--sub').font({
				family: g.options.graph.fontFamily || 'Helvetica',
				size: subTitle.size,
				anchor: 'middle'
			}).dx(g.settings.width / 2).dy(g.settings.height / 2 + (g.settings.height*0.11));
		}
	}
};