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
		if (typeof g.options.xAxis.label.format === 'undefined')
			g.options.xAxis.label.format = function(string){return string};
		if (typeof g.options.legend.padding === 'undefined')
			g.options.legend.padding = {};
		if (typeof g.options.graph.padding === 'undefined')
			g.options.graph.padding = {};
		if (typeof g.options.columns === 'undefined')
			g.options.columns = {};
		if (typeof g.options.columns.labels === 'undefined')
			g.options.columns.labels = {};
		if (typeof g.options.pie === 'undefined')
			g.options.pie = {};
		if (typeof g.options.pie.title === 'undefined')
			g.options.pie.title = {};
		
		var g_st = function(el){
			return getComputedStyle(el);
		}
		var maxLength = g.options.xAxis.maxRangeLength || Infinity;
		
		g.settings = {
			yMax: 0,
			fontSize: g.options.graph.fontFamily || 'Helvetica',
			class: g.options.graph.class_prefix || 'chartress',
			padding: {
				top: g.options.graph.padding.top || 0,
				right: g.options.graph.padding.right || 0,
				bottom: g.options.graph.padding.bottom || 0,
				left: g.options.graph.padding.left || 0
			},
			type: g.options.type || 'line',
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
			},
			columns: {
				width: g.options.columns.width || 15,
				labels: {
					fontSize: g.options.columns.labels.fontSize || 16,
					y: g.options.columns.labels.y || 1
				}
			},
			pie: {
				total: g.options.pie.total || 100,
				red: 'blue',
				title: {
					size: g.options.pie.title.size || 50,
					bold: g.options.pie.title.bold || true,
					text: g.options.pie.title.text || false,
					pre: g.options.pie.title.pre || false,
					sub: g.options.pie.title.sub || false
				}
			}
		};
		// if (true) {}
		if(g.settings.type === 'line') {
			g.settings.padding = {
				top: g.options.graph.padding.top || 10,
				right: g.options.graph.padding.right || 8,
				bottom: g.options.graph.padding.bottom || 25,
				left: g.options.graph.padding.left || 35
			}
		}
		if(g.settings.type === 'column') {
			g.settings.padding = {
				top: g.options.graph.padding.top || 0,
				right: g.options.graph.padding.right || 0,
				bottom: g.options.graph.padding.bottom || 25,
				left: g.options.graph.padding.left || 0
			}
		}
	g.setBounds = function() {
		if (g.settings.type === 'line') {
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
			g.settings.pie.total = g.options.pie.total || false;
			if (g.settings.pie.total === false) {
				for (var key in g.options.lines) {
					var line = g.options.lines[key];
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
	g.drawLabels = function() {
	
		if (true) {}
		// draw yaxis
		var yPoints = [], i;
		for (i = 0; i < (g.settings.yMax + g.settings.yAxis.markEvery); i++) {
			if (i%g.settings.yAxis.markEvery === 0) {
				yPoints.push(i);
			}
		}
		g.yLabels = g.draw.group().addClass(g.settings.class+'__labels chartress__labels--yAxis');
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
							family: g.settings.fontFamily,
							size: fontSize
						})
						.dx(g.settings.rect.left + g.settings.yAxis.label.x)
						.dy(posY)
						.addClass(g.settings.class+'__labels__label chartress__labels__label--yAxis');
	
					tnode.dx((parseInt(g_st(tnode.node).width))*-1 - 10);
					tnode.dy((parseInt(g_st(tnode.node).height)/2)*-1);
					g.settings.yPoints.push(posY);
				};
			})();
		}
		// draw xaxis
		var xPoints = g.settings.longestLine,
			dateRange = g.settings.xAxis.range.to - g.settings.xAxis.range.from;
	
		g.settings.xPoints = [];
		g.xLabels = g.draw.group().addClass(g.settings.class+'__labels chartress__labels--xAxis');
		for (i = 0; i <= dateRange; i++) {
			(function(){
				var text = (g.settings.xAxis.range.from + i);
				text = g.options.xAxis.label.format(text);
				text = text.toString();
				var proc = ((i) / (dateRange))
				var posX = ((g.settings.width) * proc) + g.settings.padding.left;
	
				if (i%g.settings.xAxis.markEvery === 0) {
	
					console.log(i);
	
					g.xLabels.text(text)
						.fill(g.settings.xAxis.label.color)
						.font({
							family: g.settings.fontFamily,
							anchor: 'middle',
							size: 14
						})
						.dx(posX)
						.dy(g.settings.rect.bottom + g.settings.xAxis.label.y)
						.addClass(g.settings.class+'__labels__label chartress__labels--xAxis');
	
				}
	
				g.settings.xPoints.push(posX);
			})();
		}
	};
	g.drawLines = function(){
		g.draw_plots = g.draw.group().addClass(g.settings.class+'__plots');
		for (var key in g.options.lines) {
			var line = g.options.lines[key];
			var classname = line.classname || line.name.toLowerCase().replace(/ /g, '_');
			var color = line.color || 'black';
			var width = line.width || 2;
			var x = 0;
			var pointsArr = [];
			line.__plotgroup = g.draw_plots.group();
			line.__plotgroup.addClass(g.settings.class+'__plot chartress__plot--'+(classname)).attr('plot-name', classname);
	
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
	
			line.__plotsvg = line.__plotgroup.polyline(pointsArr).fill('none').stroke({ color: color, width: width }).addClass(g.settings.class+'__line chartress__line--'+classname);
			if(line.dash){
				line.__plotsvg.attr('stroke-dasharray', line.dash);
			}
			var rad = line.rad || 6;
			for (var key in pointsArr) {
				(function(){
					var point = pointsArr[key];
					line.__plotgroup.circle(rad).dx(point[0] - rad/2).dy(point[1] - rad/2).addClass(g.settings.class+'__dot chartress__dot--'+(classname)).stroke({
						color: color,
						width: width
					}).fill('white');
				})();
			};
		};
	};
	g.drawLegend = function(){
		g.draw_legend = g.draw.group().addClass(g.settings.class+'__legend').font({
			family: g.settings.fontFamily,
			size: 12
		});
	
		var pX = 0;
		var posX = (g.settings.outerWidth/100) * g.settings.legend.x;
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
	
		g.draw_legend.width(g.settings.outerWidth).dmove(posX, posY);
	
		var i = 0;
		for (var key in g.options.lines) {
			(function(){
				var line = g.options.lines[key];
				if (line.name) {
					var classname = line.classname || line.name.toLowerCase().replace(/ /g, '_');
					var color = line.color || 'black';
					var width = line.width || 2;
					line.__legend = g.draw_legend.group().addClass(g.settings.class+'__legend__row chartress__legend--'+classname).attr('plot-name', classname);
					var string = line.name;
					var text = line.__legend.text(string)
						.fill(color)
						.font({
							family: g.settings.fontFamily
						});
					var tx = (parseInt(g_st(text.node).width) + 40)*-1 - 5;
					var ty = ((parseInt(g_st(text.node).height))*i) - 9;
					text.dx(tx);
					text.dy(ty);
					var rad = line.rad || 6;
					var comp = (parseInt(g_st(text.node).height)/2 + 1);
					var pathY = (parseInt(g_st(text.node).height))*i + comp;
					var line_path = [
						[-35,pathY],
						[-5,pathY],
					];
					var polyline = line.__legend.polyline(line_path)
						.fill('none')
						.stroke({ color: color, width: width })
						.addClass(g.settings.class+'__line chartress__legend__line chartress__legend__line--'+classname);
					if(line.dash){
						polyline.attr('stroke-dasharray', line.dash);
					}
					line.__legend.circle(rad)
						.stroke({width: width, color: color})
						.fill('white')
						.dx(0 - rad/2 -5)
						.dy(pathY - rad/2)
						.addClass(g.settings.class+'__dot chartress__legend__dot--'+(classname));
	
					line.__legend.mouseover(function(){
						var t = this;
						line.__plotgroup.addClass(g.settings.class+'__plot--hover');
					}).mouseout(function(){
						line.__plotgroup.removeClass(g.settings.class+'__plot--hover');
					});
					i++;
				}
			})();
		};
	};
	g.drawColumns = function(){
		g.draw_columns = [];
		var i = 0;
		for (var key in g.options.lines) {
			(function(){
				var line = g.options.lines[key];
				var classname = line.classname || line.name.replace(/ /g, '_').toLowerCase();
				g.draw_columns[i] = g.draw.group().addClass(g.settings.class+'__columns__group '+g.settings.class+'__columns__group--'+classname);
				var color = line.color || '#222';
				var textColor = line.textColor || color;
				var proc = ((100 / g.options.lines.length) / 100) * i;
				var space = g.settings.width / g.options.lines.length;
				var xcenter = (proc * g.settings.width) + space - (space/2);
				var columnWidth = g.settings.columns.width;
				var columnHeight = (line.value / g.settings.largestcolumn) * g.settings.height;
				var corr_label_y = g.settings.columns.labels.y;
	
				g.draw_columns[i].text(line.name)
						.fill(textColor)
						.font({
							family: g.settings.fontFamily,
							anchor: 'middle',
							size: g.settings.columns.labels.fontsize
						})
						.dx(xcenter + g.settings.padding.left)
						.dy(g.settings.height + corr_label_y + g.settings.padding.top)
						.addClass(g.settings.class+'__columns__label '+g.settings.class+'__columns__label--'+classname);
	
				g.draw_columns[i].rect(columnWidth, columnHeight)
					.dx(xcenter - (columnWidth/2) + g.settings.padding.left)
					.dy(g.settings.height - columnHeight + g.settings.padding.top)
					.fill(color)
					.addClass(g.settings.class+'__columns__column '+g.settings.class+'__columns__column--'+classname);
	
				i++;
			})();
		};
	};
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
			for (var key in g.options.lines) {
				var line = g.options.lines[key];
				total+=line.value;
			}
		}
	
		var mask;
		for (var key in g.options.lines) {
			(function(){
				var line = g.options.lines[key];
	
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
	g.drawChart = function() {
		g.clear();
		g.setBounds();
	
		if (g.settings.type === 'line') {
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
	
		setTimeout(function(){
			g.draw.spof();
		});
	};
	g.canvasResize = function(){
		g.draw.spof();
		g.drawChart();
	};
	
	var sizeCache = [parseInt(g_st(el).width), parseInt(g_st(el).height)];
	var to;
	
	SVG.on(window, 'resize', function() {
		if (sizeCache[0] !== parseInt(g_st(el).width) || sizeCache[1] !== parseInt(g_st(el).height)) {
			clearTimeout(to);
			to = setTimeout(g.canvasResize, g.options.graph.redrawTimeout || 0);
		}
	});
	g.drawToCanvas = function($canvas){
		var svg = $element.querySelector('svg');
		var ctx = $canvas.getContext('2d');
		ctx.canvas.width = g.settings.outerWidth;
		ctx.canvas.height = g.settings.outerHeight;
	
		var img = new Image();
		var xml = new XMLSerializer().serializeToString(svg);
		var svg64 = btoa(xml);
		var b64Start = 'data:image/svg+xml;base64,';
		var image64 = b64Start + svg64;
	
		img.src = image64;
		ctx.drawImage(img, 0, 0);
	};

	g.drawChart();

	return g;
};