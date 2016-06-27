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
	
	g.options = data;
	
	g.draw = SVG(el).size('100%', '100%').spof();
	
	g.clear = function(){
		g.draw.clear();
	}
	
	if (typeof g.options.graph === 'undefined')
		g.options.graph = {};
	if (typeof g.options.xAxis === 'undefined')
		g.options.xAxis = {};
	if (typeof g.options.xAxis.range === 'undefined')
		g.options.xAxis.range = {};
	if (typeof g.options.xAxis.legend === 'undefined')
		g.options.xAxis.legend = {};
	if (typeof g.options.yAxis === 'undefined')
		g.options.yAxis = {};
	if (typeof g.options.yAxis.label === 'undefined')
		g.options.yAxis.label = {};
	if (typeof g.options.legend === 'undefined')
		g.options.legend = {};
	if (typeof g.options.xAxis.label === 'undefined')
		g.options.xAxis.label = {};
	if (typeof g.options.xAxis.format === 'undefined')
		g.options.xAxis.format = function(string){return string};
	
	if (typeof g.options.legend.padding === 'undefined')
		g.options.legend.padding = {};
	if (typeof g.options.graph.padding === 'undefined')
		g.options.graph.padding = {};
	
	
	var maxLength = g.options.xAxis.maxRangeLength || Infinity;
	
	g.settings = {
		yMax: 0,
		padding: {
			top: g.options.graph.padding.top || 10,
			right: g.options.graph.padding.right || 8,
			bottom: g.options.graph.padding.bottom || 25,
			left: g.options.graph.padding.left || 35
		},
		type: g.options.type || 'normal',
		yAxis: {
			markEvery: g.options.yAxis.markEvery || 1,
			label: {
				color: g.options.yAxis.label.color || 'gray',
				x: g.options.yAxis.label.x || 0
			},
			markEvery: g.options.yAxis.markEvery || 20,
		},
		xAxis: {
			range: {
				from: g.options.xAxis.range.from || 0,
				to: g.options.xAxis.range.to || null,
			},
			markEvery: g.options.xAxis.markEvery || 1,
			label: {
				color: g.options.xAxis.label.color || 'gray',
				y: g.options.xAxis.label.y || 0
			},
		},
		legend: {
			x: g.options.legend.x || 100,
			y: g.options.legend.x || 0,
			padding: {
				top: g.options.legend.padding.top || 0,
				right: g.options.legend.padding.right || 0,
				bottom: g.options.legend.padding.bottom || 0,
				left: g.options.legend.padding.left || 0,
			}
		}
	};
	g.setBounds = function() {
		if (g.settings.type === 'normal') {
			var longest = 0;
			for (var key in g.options.lines) {
				(function(){
					var line = g.options.lines[key];
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
			if (g.settings.xAxis.range.to === null) {
				g.settings.xAxis.range.to = longest;
			}
		}
		if (g.settings.type === 'column') {
			g.settings.largestcolumn = 0;
			for (var key in g.options.lines) {
				var line = g.options.lines[key];
				if (g.settings.largestcolumn < line.value) {
					g.settings.largestcolumn = line.value;
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
	
		g.settings.outweWidth = parseInt(getComputedStyle(el).width);
		g.settings.width = g.settings.outweWidth - g.settings.padding.right - g.settings.padding.left;
		g.settings.outerHeight = parseInt(getComputedStyle(el).height);
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
	g.drawLabels = function() {
	
		if (true) {}
		// draw yaxis
		var yPoints = [], i;
		for (i = 0; i < (g.settings.yMax + g.settings.yAxis.markEvery); i++) {
			if (i%g.settings.yAxis.markEvery === 0) {
				yPoints.push(i);
			}
		}
		g.yLabels = g.draw.group().addClass('chartress__labels chartress__labels--yAxis');
		g.settings.yPoints = [];
		for (i = 0; i < yPoints.length; i++) {
			(function(){
				var posY = ((1-(yPoints[i] / g.settings.yMax) * g.settings.height) *-1) + g.settings.padding.top;
				var fontSize = 14;
				posY = posY - (fontSize /3);
	
				var text = yPoints[yPoints.length-1 - i];
				if (text !== 0) {
	
					var tnode = g.yLabels.text(text.toString())
						.fill(g.settings.yAxis.label.color)
						.font({
							family: g.options.graph.fontFamily || 'Helvetica',
							size: fontSize
						})
						.dx(g.settings.rect.left + g.settings.yAxis.label.x)
						.dy(posY)
						.addClass('chartress__labels__label chartress__labels__label--yAxis');
	
					tnode.dx((parseInt(getComputedStyle(tnode.node).width))*-1 - 10);
					tnode.dy((parseInt(getComputedStyle(tnode.node).height)/2)*-1);
					g.settings.yPoints.push(posY);
				};
			})();
		}
		// draw xaxis
		var xPoints = g.settings.longestLine,
			dateRange = g.settings.xAxis.range.to - g.settings.xAxis.range.from;
	
		g.settings.xPoints = [];
		g.xLabels = g.draw.group().addClass('chartress__labels chartress__labels--xAxis');
		// todo: make xAxis.markEvery work properly
		for (i = 0; i <= dateRange; i++) {
			(function(){
				var text = (g.settings.xAxis.range.from + i).toString();
				var proc = ((i) / (dateRange))
				var posX = ((g.settings.width) * proc) + g.settings.padding.left;
	
				if (i%g.settings.xAxis.markEvery === 0) {
	
					g.xLabels.text(text)
						.fill(g.settings.xAxis.label.color)
						.font({
							family: g.options.graph.fontFamily || 'Helvetica',
							anchor: 'middle',
							size: 14
						})
						.dx(posX)
						.dy(g.settings.rect.bottom + g.settings.xAxis.label.y)
						.addClass('chartress__labels__label chartress__labels--xAxis');
	
				}
	
				g.settings.xPoints.push(posX);
			})();
		}
	};
	g.drawLines = function(){
		g.draw_plots = g.draw.group().addClass('chartress__plots');
		for (var key in g.options.lines) {
			var line = g.options.lines[key];
			var classname = line.classname || line.name.toLowerCase().replace(/ /g, '_');
			var color = line.color || 'black';
			var width = line.width || 2;
			var x = 0;
			var pointsArr = [];
			line.__plotgroup = g.draw_plots.group();
			line.__plotgroup.addClass('chartress__plot chartress__plot--'+(classname)).attr('plot-name', classname);
	
			for (var key in line.__plot) {
				(function(){
					var point = line.__plot[key];
					var xPos = g.settings.xPoints[x];
					var yPos = ((point / g.settings.yMax) * g.settings.height);
					yPos = (g.settings.height - yPos) + g.settings.padding.top;
					pointsArr.push([xPos, yPos]);
					x++;
				})();
			};
	
			line.__plotsvg = line.__plotgroup.polyline(pointsArr).fill('none').stroke({ color: color, width: width }).addClass('chartress__line chartress__line--'+classname);
			if(line.dash){
				line.__plotsvg.attr('stroke-dasharray', line.dash);
			}
			var rad = line.rad || 6;
			for (var key in pointsArr) {
				(function(){
					var point = pointsArr[key];
					line.__plotgroup.circle(rad).dx(point[0] - rad/2).dy(point[1] - rad/2).addClass('chartress__dot chartress__dot--'+(classname)).stroke({
						color: color,
						width: width
					}).fill('white');
				})();
			};
		};
	};
	g.drawLegend = function(){
		g.draw_legend = g.draw.group().addClass('chartress__legend').font({
			family: g.options.graph.fontFamily || 'Helvetica',
			size: 13
		});
	
		var pX = 0;
		var posX = (g.settings.outweWidth/100) * g.settings.legend.x;
		if (g.settings.legend.x > 50) {
			posX -= g.settings.legend.padding.right;
			pX = g.settings.legend.padding.right*-1;
		}else{
			posX += g.settings.legend.padding.left;
			pX = g.settings.legend.padding.left;
		}
	
		var pY = 0;
		var posY = (g.settings.outerHeight/100) * g.settings.legend.y;
		if (g.settings.legend.y < 50) {
			posY += g.settings.legend.padding.top;
			pY = g.settings.legend.padding.top;
		}else{
			posY -= g.settings.legend.padding.bottom;
			pY = g.settings.legend.padding.bottom*-1;
		}
	
		g.draw_legend.width(g.settings.outweWidth).dmove(posX, posY);
	
		var i = 0;
		for (var key in g.options.lines) {
			(function(){
				var line = g.options.lines[key];
				if (line.name) {
					var classname = line.classname || line.name.toLowerCase().replace(/ /g, '_');
					var color = line.color || 'black';
					var width = line.width || 2;
					line.__legend = g.draw_legend.group().addClass('chartress__legend__row chartress__legend--'+classname).attr('plot-name', classname);
					var string = line.name;
					var text = line.__legend.text(string)
						.fill(color)
						.font({
							family: g.options.graph.fontFamily || 'Helvetica'
						});
					var tx = (parseInt(getComputedStyle(text.node).width) + 40)*-1 - 5;
					var ty = ((parseInt(getComputedStyle(text.node).height))*i) - 9;
					text.dx(tx);
					text.dy(ty);
					var rad = line.rad || 6;
					var comp = (parseInt(getComputedStyle(text.node).height)/2);
					var pathY = (parseInt(getComputedStyle(text.node).height))*i + comp;
					var line_path = [
						[-35,pathY],
						[-5,pathY],
					];
					var polyline = line.__legend.polyline(line_path)
						.fill('none')
						.stroke({ color: color, width: width })
						.addClass('chartress__line chartress__legend__line chartress__legend__line--'+classname);
					if(line.dash){
						polyline.attr('stroke-dasharray', line.dash);
					}
					line.__legend.circle(rad)
						.stroke({width: width, color: color})
						.fill('white')
						.dx(0 - rad/2 -5)
						.dy(pathY - rad/2)
						.addClass('chartress__dot chartress__legend__dot--'+(classname));
	
					line.__legend.mouseover(function(){
						var t = this;
						line.__plotgroup.addClass('chartress__plot--hover');
					}).mouseout(function(){
						line.__plotgroup.removeClass('chartress__plot--hover');
					});
					i++;
				}
			})();
		};
	};
	g.drawColumns = function(){
		var i = 0;
		g.draw_columns = {
			labels: g.draw.group().addClass('chartress__columns__labels'),
			columns: g.draw.group().addClass('chartress__columns__columns')
		};
	
		for (var key in g.options.lines) {
			(function(){
				var line = g.options.lines[key];
				var proc = ((100 / g.options.lines.length) / 100) * i;
				var space = g.settings.width / g.options.lines.length;
				var xcenter = (proc * g.settings.width) + space - (space/2);
				var columnWidth = g.options.columns.width || 10;
				var columnHeight = (line.value / g.settings.largestcolumn) * g.settings.height;
				var corr_label_y = g.options.columns.labels.y || 0;
	
				g.draw_columns.labels.text(line.name)
						.fill('#000')
						.font({
							family: g.options.graph.fontFamily || 'Helvetica',
							anchor: 'middle',
							size: g.options.columns.labels.fontsize || 14
						})
						.dx(xcenter + g.settings.padding.left)
						.dy(g.settings.height + corr_label_y + g.settings.padding.top)
						.addClass('chartress__columns__label');
	
				g.draw_columns.columns.rect(columnWidth, columnHeight).dx(xcenter - (columnWidth/2) + g.settings.padding.left).dy(g.settings.height - columnHeight + g.settings.padding.top).addClass('chartress__columns__column');
	
				i++;
			})();
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
						width: lineWidth,
						color: '#000'
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
				}).dx(g.settings.width / 2 + g.settings.padding.top).dy((g.settings.height/2 + g.settings.padding.left) - (parseInt(getComputedStyle(maintext.node).height)/2));
				pretext.dy(parseInt(getComputedStyle(maintext.node).height)*-1.8);
			}
	
			var subTitle = title.sub || false;
			if (subTitle) {
				subText = g.draw_pie_title.text(subTitle.text).addClass('chartress__pie__title--sub').font({
					family: g.options.graph.fontFamily || 'Helvetica',
					size: subTitle.size,
					anchor: 'middle'
				}).dx(g.settings.width / 2 + g.settings.padding.left).dy(g.settings.height / 2 + (g.settings.height*0.11) + g.settings.padding.top);
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
		if (g.settings.type === 'column') {
			g.drawColumns();
		}
		if (g.settings.type === 'pie') {
			g.drawPies();
		}
	};
	g.canvasResize = function(){
		g.draw.spof();
		g.drawGraph();
	};
	
	var sizeCache = [parseInt(getComputedStyle(el).width), parseInt(getComputedStyle(el).height)];
	var to;
	
	SVG.on(window, 'resize', function() {
		if (sizeCache[0] !== parseInt(getComputedStyle(el).width) || sizeCache[1] !== parseInt(getComputedStyle(el).height)) {
			clearTimeout(to);
			to = setTimeout(g.canvasResize, g.options.graph.redrawTimeout || 0);
		}
	});

	g.drawGraph();

	return g;
};