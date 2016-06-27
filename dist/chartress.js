window.chartress = function($element, data){

	var that = this;
	var el = $element;
	if (typeof jQuery !== 'undefined' && ($element instanceof jQuery)) {
		el = el[0];
	}
	var g = {};
	function sortNumber(a,b) {
		return b - a;
	}
	
	g.settings = {
		yMax: 0
	};
	g.options = data;
	
	g.draw = SVG(el).size('100%', '100%').spof();
	
	g.clear = function(){
		g.draw.clear();
	}
	
	if (typeof g.options.graph === 'undefined') {
		g.options.graph = {};
	}
	if (typeof g.options.graph.padding === 'undefined') {
		g.options.graph.padding = [];
	}
	g.settings.padding = {
		top: g.options.graph.padding[0] || 0,
		right: g.options.graph.padding[1] || 0,
		bottom: g.options.graph.padding[2] || 0,
		left: g.options.graph.padding[3] || 0
	};
	g.settings.type = g.options.type || 'normal';
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
	g.drawLabels = function() {
	
		if (true) {}
		// draw yaxis
		var yPoints = 0, i;
		for (i = 0; i < (g.settings.yMax + g.options.yAxis.markEvery); i++) {
			if (i%g.options.yAxis.markEvery === 0) {
				yPoints++;
			}
		}
		g.yLabels = g.draw.group().addClass('chartress__labels chartress__labels--yAxis');
		g.settings.yPoints = [];
		for (i = 0; i < yPoints; i++) {
			var proc = 1 - ((i+1) / yPoints);
			var posY = ((g.settings.height + (g.settings.height * 0.146)) * proc) + g.settings.padding.top;
			var text = i*g.options.yAxis.markEvery;
			if (text !== 0) {
	
				var tnode = g.yLabels.text(text.toString())
					.fill(g.options.yAxis.label.color)
					.font({
						family: g.options.graph.fontFamily || 'Helvetica',
						anchor: 'middle',
						size: 14
					})
					.dx(g.settings.rect.left + g.options.yAxis.label.x)
					.dy(posY)
					.addClass('chartress__labels__label chartress__labels__label--yAxis');
	
				tnode.dy((tnode.node.scrollHeight / 2)*-1)
				g.settings.yPoints.push(posY);
			};
		}
	
		// draw xaxis
		var xPoints = g.settings.longestLine,
			dateRange = g.options.xAxis.range.to - g.options.xAxis.range.from;
	
		g.settings.xPoints = [];
		g.xLabels = g.draw.group().addClass('chartress__labels chartress__labels--xAxis');
		// todo: make xAxis.markEvery work properly
		for (i = 0; i <= dateRange; i++) {
			var time = g.options.xAxis.range.from + i;
			if (time < 10) {
				time = '0'+time;
			}
			var text = time+':00';
			var proc = ((i) / (dateRange))
			var posX = ((g.settings.width) * proc) + g.settings.padding.left;
	
			if (i%g.options.xAxis.markEvery === 0) {
	
				g.xLabels.text(text)
					.fill(g.options.xAxis.label.color)
					.font({
						family: g.options.graph.fontFamily || 'Helvetica',
						anchor: 'middle',
						size: 14
					})
					.dx(posX)
					.dy(g.settings.rect.bottom + g.options.xAxis.label.y)
					.addClass('chartress__labels__label chartress__labels--xAxis');
	
			}
	
			g.settings.xPoints.push(posX);
		}
	};
	g.drawLines = function(){
		g.draw_plots = g.draw.group().addClass('chartress__plots');
		for (var key in g.options.lines) {
			var line = g.options.lines[key];
	
			var x = 0;
			var pointsArr = [];
			line.__plotgroup = g.draw_plots.group();
			line.__plotgroup.addClass('chartress__plot chartress__plot--'+(line.classname)).attr('plot-name', line.classname);
	
			for (var key in line.__plot) {
				var point = line.__plot[key];
				var xPos = g.settings.xPoints[x];
				var yPos = (g.settings.height - ((point / g.settings.yMax) * g.settings.height)) + g.settings.padding.top;
				pointsArr.push([xPos, yPos]);
				x++;
			};
	
			line.__plotsvg = line.__plotgroup.polyline(pointsArr).fill('none').stroke({ width: 2 }).addClass('chartress__line chartress__line--'+line.classname);
			if(line.dash){
				line.__plotsvg.attr('stroke-dasharray', line.dash);
			}
			var rad = line.rad;
			for (var key in pointsArr) {
				var point = pointsArr[key];
				line.__plotgroup.circle(rad).dx(point[0] - rad/2).dy(point[1] - rad/2).addClass('chartress__dot chartress__dot--'+(line.classname));
			};
		};
	};
	g.drawLegend = function(){
		g.draw_legend = g.draw.group().addClass('chartress__legend').font({
			family: g.options.graph.fontFamily || 'Helvetica',
			size: 13
		});
	
		var pX = 0;
		var posX = (g.settings.outweWidth/100) * g.options.legend.x;
		if (g.options.legend.x > 50) {
			posX -= g.options.legend.padding[1];
			pX = g.options.legend.padding[1]*-1;
		}else{
			posX += g.options.legend.padding[3];
			pX = g.options.legend.padding[3];
		}
	
		var pY = 0;
		var posY = (g.settings.outerHeight/100) * g.options.legend.y;
		if (g.options.legend.y < 50) {
			posY += g.options.legend.padding[0];
			pY = g.options.legend.padding[0];
		}else{
			posY -= g.options.legend.padding[2];
			pY = g.options.legend.padding[2]*-1;
		}
	
		g.draw_legend.width(g.settings.outweWidth).dmove(posX, posY);
	
		var i = 0;
		for (var key in g.options.lines) {
			var line = g.options.lines[key];
			line.__legend = g.draw_legend.group().addClass('chartress__legend__row chartress__legend--'+line.classname).attr('plot-name', line.classname);
			var string = line.name;
			var text = line.__legend.text(string).font({
				family: g.options.graph.fontFamily || 'Helvetica'
			});
			var tx = (text.node.scrollWidth + 40)*-1;
			var ty = ((text.node.scrollHeight)*i) * 1.1;
			text.dx(tx);
			text.dy(ty);
			var rad = line.rad;
			var compensate = (text.node.scrollHeight * 1.1) * 0.2;
			var line_path = [
				[-30,pY+(text.node.scrollHeight-compensate) + ty],
				[0,pY+(text.node.scrollHeight-compensate) + ty],
			];
			var polyline = line.__legend.polyline(line_path).fill('none').stroke({ width: 2 }).addClass('chartress__line chartress__legend__line chartress__legend__line--'+line.classname);
			if(line.dash){
				polyline.attr('stroke-dasharray', line.dash);
			}
			line.__legend.circle(rad).dx(0 - rad/2).dy((pY + (text.node.scrollHeight-compensate) + ty) - rad/2).addClass('chartress__dot chartress__legend__dot--'+(line.classname));
	
			line.__legend.mouseover(function(){
				var t = this;
				// console.log(line);
				line.__plotgroup.addClass('chartress__plot--hover');
			}).mouseout(function(){
				line.__plotgroup.removeClass('chartress__plot--hover');
			});
			i++;
		};
	};
	g.drawPipes = function(){
		var i = 0;
		g.draw_pipes = {
			labels: g.draw.group().addClass('chartress__pipes__labels'),
			pipes: g.draw.group().addClass('chartress__pipes__pipes')
		};
	
		for (var key in g.options.lines) {
			var line = g.options.lines[key];
			var proc = ((100 / g.options.lines.length) / 100) * i;
			var space = g.settings.width / g.options.lines.length;
			var xcenter = (proc * g.settings.width) + space - (space/2);
			var pipeWidth = g.options.pipes.width || 10;
			var pipeHeight = (line.value / g.settings.largestPipe) * g.settings.height;
			var corr_label_y = g.options.pipes.labels.y || 0;
	
			g.draw_pipes.labels.text(line.name)
					.fill('#000')
					.font({
						family: g.options.graph.fontFamily || 'Helvetica',
						anchor: 'middle',
						size: g.options.pipes.labels.fontsize || 14
					})
					.dx(xcenter + g.settings.padding.left)
					.dy(g.settings.height + corr_label_y + g.settings.padding.top)
					.addClass('chartress__pipes__label');
	
			g.draw_pipes.pipes.rect(pipeWidth, pipeHeight).dx(xcenter - (pipeWidth/2) + g.settings.padding.left).dy(g.settings.height - pipeHeight + g.settings.padding.top).addClass('chartress__pipes__pipe');
	
			i++;
		};
	};
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
	g.drawGraph = function() {
		g.clear();
		g.setBounds();
	
		if (g.settings.type === 'normal') {
			g.drawLabels();
			g.drawLines();
			g.drawLegend();
		}
		if (g.settings.type === 'pipes') {
			g.drawPipes();
		}
		if (g.settings.type === 'pie') {
			g.drawPies();
		}
	};
	g.canvasResize = function(){
		g.draw.spof();
		g.drawGraph();
	};
	
	var sizeCache = [el.scrollWidth, el.scrollHeight];
	var to;
	
	SVG.on(window, 'resize', function() {
		if (sizeCache[0] !== el.scrollWidth || sizeCache[1] !== el.scrollHeight) {
			clearTimeout(to);
			to = setTimeout(g.canvasResize, g.options.graph.redrawTimeout || 100);
		}
	});

	g.drawGraph();

	return g;
};