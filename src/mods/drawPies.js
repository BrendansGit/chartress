g.drawPies = function(){
	var i = 0;
	g.pies = {};

	g.draw_pie = g.draw.group().addClass(g.s.class+'__pies');
	var size = (g.s.width < g.s.height ? g.s.width : g.s.height);
	var x = (g.s.width / 2 - (size /2)) + g.s.rect.left;
	var y = (g.s.height / 2 - (size /2)) + g.s.rect.top;

	var total = g.s.pie.total;
	var filled = 0;

	if (total === null) {
		total = 0;
		for (var key in g.o.dataset) {
			var line = g.o.dataset[key];
			total+=line.value;
		}
	}

	var circleMask;
	for (var key in g.o.dataset) {
		(function(){
			var line = g.o.dataset[key];

			var cstep = (200 - (10*i));
			var dc = 'rgb('+cstep+','+cstep+','+cstep+')';

			var gradient = false;
			if (typeof line.color == 'object') {
				gradient = g.draw_pie.gradient('radial', function(stop) {
					stop.at(0, line.color[0])
					stop.at(1, line.color[1])
				})
				gradient.from('50%', '50%').to('50%', '50%').radius('50%');
			}

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

			sliceMask = g.draw_pie.circle(size);
			sliceMask.fill('transparent')
				.addClass(g.s.class+'__pie')
				.dx(x).dy(y)
				.stroke({
					width: lineWidth,
					color: 'white'
				});

			var dia = (2 * Math.PI *(size/2));

			sliceMask.rotate(rotate);

			circleMask = g.draw_pie.circle(size).fill({color:'white'}).dx(x).dy(y);
			sliceMask.maskWith(circleMask);

			var res = ((line.value*dia) / total);
			sliceMask.attr('stroke-dasharray', (res)+','+dia);

			g.pies[classname] = g.draw_pie.circle(size)
				.fill(line.color || dc)
				.dx(x)
				.dy(y);

			if (gradient) {
				g.pies[classname].fill(gradient);
			}


			g.pies[classname].maskWith(sliceMask);

			// sliceMask.addClass(g.s.class+'__pie--' + classname);
			i++;
		})();
	};

	var title = g.s.pie.title;
	if (title.text !== false) {
		g.draw_pie_title = g.draw_pie.group().addClass(g.s.class+'__pie__title');
		var maintext = g.draw_pie_title.text(title.text).addClass(g.s.class+'__pie__title--main').font({
			family: g.s.fontFamily,
			size: title.size,
			anchor: 'middle',
		}).dx(g.s.width / 2 + g.s.graph.padding.left).dy(g.s.height / 2 + g.s.graph.padding.top - (title.size * 0.9));
		if (title.bold) {
			maintext.font({
				family: g.s.fontFamily,
				weight: 'bold'
			});
		}

		var preTitle = title.pre;
		if (title.pre.text) {
			pretext = g.draw_pie_title.text(preTitle.text).addClass(g.s.class+'__pie__title--pre').font({
				family: g.s.fontFamily,
				size: preTitle.size,
				anchor: 'middle'
			}).dx(g.s.width / 2 + g.s.graph.padding.left).dy((g.s.height / 2) - (title.size/2) - (preTitle.size) - 5 + g.s.graph.padding.top);
		}

		var subTitle = title.sub;
		if (title.sub.text) {
			subText = g.draw_pie_title.text(subTitle.text).addClass(g.s.class+'__pie__title--sub').font({
				family: g.s.fontFamily,
				size: subTitle.size,
				anchor: 'middle'
			}).dx(g.s.width / 2 + g.s.graph.padding.left).dy((g.s.height / 2) + (title.size/2.5) + g.s.graph.padding.top);
		}
	}
};