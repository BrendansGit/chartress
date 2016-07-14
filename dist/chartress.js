window.chartress = function($element, data) {

	var g = {};

	/* global $element jQuery g data SVG*/
	// var that = this;
	
	// check if element is from jquery
	if (typeof jQuery !== 'undefined' && ($element instanceof jQuery)) {
		// save it from jquery
		$element = $element[0];
	}
	var el = $element;
	
	g.o = data;
	g.s = {};
	
	// core functions
	g.log = function(e) {
		if (g.o.debug === true) {
			console.log(e);
		}
	};
	g.clear = function() {
		g.draw.clear();
	};
	var g_st = function(el) {
		return getComputedStyle(el);
	};
	
	var sortNumber = function(a, b) {
		return b - a;
	};
	var isU = function(e) {
		return (typeof e === 'undefined');
	};
	
	// options list and defaults
	var checkOption = [
		['maxLength', null],
		['yMax', 0],
		['fontFamily', 'Helvetica'],
		['class', 'chartress'],
		['type', 'line'],
	
		['graph'],
		['graph.padding'],
		['graph.padding.left', 0],
		['graph.padding.right', 0],
		['graph.padding.top', 0],
		['graph.padding.bottom', 0],
		['graph.redrawTimeout', 5],
	
		['xAxis'],
		['xAxis.visible', true],
		['xAxis.range'],
		['xAxis.range.from', 0],
		['xAxis.range.to', null],
		['xAxis.legend'],
		['xAxis.legend.x'],
		['xAxis.legend.y'],
		['xAxis.lines'],
		['xAxis.lines.visible', false],
		['xAxis.lines.color', 'rgba(0,0,0,.1)'],
		['xAxis.lines.width', 1],
		['xAxis.label'],
		['xAxis.label.format', function(string) {
			return string;
		}],
		['xAxis.label.fontSize', 14],
		['xAxis.label.markEvery', 1],
		['xAxis.label.markCount', null],
		['xAxis.label.color', 'gray'],
		['xAxis.label.y', 0],
		['xAxis.label.position', 'bottom'],
		['xAxis.label.size', 14],
	
		['yAxis'],
		['yAxis.visible', true],
		['yAxis.lines'],
		['yAxis.lines.visible', true],
		['yAxis.lines.color', 'rgba(0,0,0,.1)'],
		['yAxis.lines.width', 1],
		['yAxis.label'],
		['yAxis.label.format', function(string) {
			return string;
		}],
		['yAxis.label.fontSize', 14],
		['yAxis.label.markEvery', null],
		['yAxis.label.markCount', 4],
		['yAxis.label.color', 'gray'],
		['yAxis.label.x', 0],
	
		['legend'],
		['legend.x', 100],
		['legend.y', 0],
		['legend.padding'],
		['legend.padding.top', 0],
		['legend.padding.right', 0],
		['legend.padding.bottom', 0],
		['legend.padding.left', 0],
	
		['columns'],
		['columns.width', 40],
		['columns.space', 1],
		['columns.labels'],
		['columns.labels.fontSize', 16],
		['columns.labels.y', 1],
	
		['pie'],
		['pie.total', null],
		['pie.title'],
		['pie.title.size', 50],
		['pie.title.bold', true],
		['pie.title.text', false],
		['pie.title.pre'],
		['pie.title.pre.text', false],
		['pie.title.pre.size', 14],
		['pie.title.sub'],
		['pie.title.sub.text', false],
		['pie.title.sub.size', 14]
	];
	
	// generate g.o and g.s
	for (var i = 0; i < checkOption.length; i++) {
		var ch = checkOption[i][0].split('.');
		var dval = {};
		if (!isU(checkOption[i][1])) {
			dval = checkOption[i][1];
		}
		// var objD = g.o;
	
		if (ch.length === 1) {
			if (isU(g.o[ch[0]])) {
				g.o[ch[0]] = dval;
				g.s[ch[0]] = dval;
			} else {
				g.s[ch[0]] = g.o[ch[0]];
			}
		}
		if (ch.length === 2) {
			if (isU(g.o[ch[0]][ch[1]])) {
				g.o[ch[0]][ch[1]] = dval;
				g.s[ch[0]][ch[1]] = dval;
			} else {
				g.s[ch[0]][ch[1]] = g.o[ch[0]][ch[1]];
			}
		}
		if (ch.length === 3) {
			if (isU(g.o[ch[0]][ch[1]][ch[2]])) {
				g.o[ch[0]][ch[1]][ch[2]] = dval;
				g.s[ch[0]][ch[1]][ch[2]] = dval;
			} else {
				g.s[ch[0]][ch[1]][ch[2]] = g.o[ch[0]][ch[1]][ch[2]];
			}
		}
	}
	
	// default padding
	// TODO: clean this up
	if (g.s.type === 'line') {
		g.s.graph.padding = {
			top: g.o.graph.padding.top || 10,
			right: g.o.graph.padding.right || 8,
			bottom: g.o.graph.padding.bottom || 25,
			left: g.o.graph.padding.left || 35
		};
	}
	if (g.s.type === 'column') {
		g.s.graph.padding = {
			top: g.o.graph.padding.top || 25,
			right: g.o.graph.padding.right || 0,
			bottom: g.o.graph.padding.bottom || 25,
			left: g.o.graph.padding.left || 35
		};
		g.s.xAxis.label.pos = g.o.xAxis.label.position || 'top';
		g.s.xAxis.label.y = g.o.xAxis.label.y || -5;
	}
	
	// generate its own div
	var chel = document.createElement('div');
	// append to element
	el.appendChild(chel);
	// default styles
	chel.className = g.s.class;
	chel.style.height = '100%';
	chel.style.width = '100%';
	
	// initiate svg.js
	g.draw = SVG(chel).size('100%', '100%').spof();
	
	// debug options
	if (g.o.debug === true) {
		console.info('chartress debug enabled for ');
		console.info(chel);
		console.info('Passed Data: ');
		console.info(g.o);
		console.log('------');
	}
	
	/* global g sortNumber g_st chel */
	g.setBounds = function() {
		if (g.s.type === 'line' || g.s.type === 'column') {
			var longest = 0;
			for (var key in g.o.dataset) {
				(function() {
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
			for (key in g.o.dataset) {
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
				for (key in g.o.dataset) {
					var t_line = g.o.dataset[key];
					g.s.pie.total += t_line.value;
				}
			}
		}
	
		g.s.outerWidth = parseInt(g_st(chel).width, 10);
		g.s.width = g.s.outerWidth - g.s.graph.padding.right - g.s.graph.padding.left;
		g.s.outerHeight = parseInt(g_st(chel).height, 10);
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
	
	/* global g g_st */
	
	g.drawLabels = function() {
	
		// draw yaxis
		if (g.s.yAxis.label.markEvery === null) {
			g.s.yAxis.label.markEvery = Math.round(g.s.yMax / g.s.yAxis.label.markCount);
		}
		var yPoints = [],
			i;
		for (i = 0; i < (g.s.yMax + g.s.yAxis.label.markEvery); i++) {
			var test = i % g.s.yAxis.label.markEvery;
			if (test === 0 && i <= g.s.yMax) {
				yPoints.push(i);
			}
		}
	
		// largest label is always max value
		yPoints[yPoints.length - 1] = g.s.yMax;
	
		if (g.s.yAxis.visible !== false || g.s.yAxis.lines.visible !== false) {
			g.yLabels = g.draw.group().addClass(g.s.class + '__labels chartress__labels--yAxis');
			g.yLines = g.draw.group().addClass(g.s.class + '__lines chartress__lines--yAxis');
			g.s.yPoints = [];
			for (i = 0; i < yPoints.length; i++) {
				(function() {
					var posY = ((1 - (yPoints[i] / g.s.yMax) * g.s.height) * -1) + g.s.graph.padding.top;
					var fontSize = g.s.yAxis.label.fontSize;
	
					if (g.s.yAxis.lines.visible !== false) {
						g.yLines.rect(g.s.width, g.s.yAxis.lines.width)
							.fill(g.s.yAxis.lines.color)
							.dy(posY)
							.dx(g.s.rect.left);
					}
					if (g.s.yAxis.visible !== false) {
						var text = yPoints[yPoints.length - 1 - i];
						text = g.s.yAxis.label.format(text);
						text = text.toString();
	
						var tnode = g.yLabels.text(text)
							.fill(g.s.yAxis.label.color)
							.font({
								family: g.s.fontFamily,
								size: fontSize
							})
							.dx(g.s.rect.left + g.s.yAxis.label.x)
							.dy(posY - (fontSize / 3))
							.addClass(g.s.class + '__labels__label chartress__labels__label--yAxis');
	
						tnode.dx((parseInt(g_st(tnode.node).width, 10)) * -1 - 10);
						tnode.dy((parseInt(g_st(tnode.node).height, 10) / 2) * -1);
						g.s.yPoints.push(posY - (fontSize / 3));
					}
	
				})();
			}
		}
		// draw xaxis
		// var xPoints = g.s.longestLine,
		var labelRange = g.s.xAxis.range.to - g.s.xAxis.range.from;
	
		if (g.s.maxLength !== null) {
			labelRange = g.s.maxLength;
		}
	
		g.s.xPoints = [];
		var labelPosFix = 0;
		if (g.s.type === 'column') {
			labelRange++;
			labelPosFix = (g.s.width / (labelRange)) / 2;
		}
	
		if (g.s.xAxis.visible !== false || g.s.xAxis.lines.visible !== false) {
			var startAt = 0;
			if (g.s.xAxis.maxRangeLength) {
				startAt = g.s.xAxis.maxRangeLength + 1;
			}
	
			g.xLabels = g.draw.group().addClass(g.s.class + '__labels chartress__labels--xAxis');
			g.xLines = g.draw.group().addClass(g.s.class + '__lines chartress__lines--xAxis');
			for (i = 0; i < labelRange; i++) {
				(function() {
					var text = (g.s.xAxis.range.from + i) + startAt;
					text = g.s.xAxis.label.format(text);
					text = text.toString();
					var proc = ((i) / (labelRange - 1));
					var posX = ((g.s.width) * proc) + g.s.graph.padding.left;
					var posY = g.s.rect.bottom + g.s.xAxis.label.y;
					if (g.s.xAxis.label.pos === 'top') {
						posY = g.s.rect.top - (g.s.xAxis.label.size * 1.5) + g.s.xAxis.label.y;
					}
	
					if (g.s.xAxis.lines.visible !== false) {
						g.xLines.rect(g.s.xAxis.lines.width, g.s.height)
							.fill(g.s.xAxis.lines.color)
							.dx(posX - Math.ceil(g.s.xAxis.lines.width / 2) + 1)
							.dy(g.s.rect.top);
					}
					if (i % g.s.xAxis.label.markEvery === 0) {
						if (g.s.xAxis.visible !== false) {
							g.xLabels.text(text)
								.fill(g.s.xAxis.label.color)
								.font({
									family: g.s.fontFamily,
									anchor: 'middle',
									size: g.s.xAxis.label.fontSize
								})
								.dx(posX + labelPosFix)
								.dy(posY)
								.addClass(g.s.class + '__labels__label chartress__labels--xAxis');
						};
					}
	
					g.s.xPoints.push(posX);
				})();
			}
		}
	};
	
	/* global g */
	g.drawLines = function() {
		g.draw_plots = g.draw.group().addClass(g.s.class + '__plots');
	
		for (var key in g.o.dataset) {
	
			var line = g.o.dataset[key];
			var classname = line.classname || line.name.toLowerCase().replace(/ /g, '_');
			var color = line.color || 'black';
			var width = line.width || 2;
			var pointsArr = [];
			line.__plotgroup = g.draw_plots.group();
			line.__plotgroup.addClass(g.s.class + '__plot chartress__plot--' + (classname)).attr('plot-name', classname);
	
			var x = 0;
			for (var plot_key in line.__plot) {
				(function() {
					var point = line.__plot[plot_key];
					var xPos = ((x / (g.s.maxLength - 1)) * g.s.width) + g.s.graph.padding.left;
					var yPos = ((point / g.s.yMax) * g.s.height);
					yPos = (g.s.height - yPos) + g.s.graph.padding.top;
					pointsArr.push([xPos, yPos]);
					x++;
				})();
			};
	
			line.__plotsvg = line.__plotgroup.polyline(pointsArr).fill('none').stroke({
				color: color,
				width: width
			}).addClass(g.s.class + '__line chartress__line--' + classname);
			if (line.dash) {
				line.__plotsvg.attr('stroke-dasharray', line.dash);
			}
			var rad = line.rad || 6;
			for (var pont_key in pointsArr) {
				(function() {
					var point = pointsArr[pont_key];
					line.__plotgroup.circle(rad).dx(point[0] - rad / 2).dy(point[1] - rad / 2).addClass(g.s.class + '__dot chartress__dot--' + (classname)).stroke({
						color: color,
						width: width
					}).fill('white');
				})();
			};
		};
	};
	
	/* global g */
	
	g.drawColumns = function() {
		g.draw_columns = [];
		var useLength = g.s.maxLength;
	
		var columnSpaceX = g.s.width / useLength;
	
		for (var i = 0; i < useLength; i++) {
			g.draw_columns[i] = g.draw.group().addClass(g.s.class + '__columns__group ' + g.s.class + '__columns__group--' + i);
			// var absPosX = ((i/maxLength) * g.s.width) + g.s.graph.padding.left;
			var absPosX = (columnSpaceX * i) + g.s.graph.padding.left;
			var corr_label_y = g.s.columns.labels.y;
	
			var e = 0;
			for (var key in g.o.dataset) {
				var line = g.o.dataset[key];
				g.log(line);
				var name = line.name || (i + 1).toString();
				if (typeof name === 'object') {
					name = name[i];
				}
				var color = line.color || '#222';
				var textColor = line.textColor || color;
				var classname = line.classname || name.replace(/ /g, '_').toLowerCase();
	
				var columnWidth = g.s.columns.width;
				var columnSpace = g.s.columns.space;
				var columnHeight = (line.__plot[i] / g.s.largestcolumn) * g.s.height;
	
				var position = ((g.o.dataset.length * -0.5) + 0.5) + e;
	
				var offsetX = position * (columnWidth + columnSpace);
				g.log([position, offsetX]);
	
				g.draw_columns[i].text(name)
					.fill(textColor)
					.dx((absPosX + (columnSpaceX / 2)) + offsetX)
					.dy(g.s.height + corr_label_y + g.s.graph.padding.top)
					.font({
						family: g.s.fontFamily,
						anchor: 'middle',
						size: g.s.columns.labels.fontsize
					})
					.addClass(g.s.class + '__columns__label ' + g.s.class + '__columns__label--' + classname);
	
				g.draw_columns[i].rect(columnWidth, columnHeight)
					.fill(color)
					.dx(((absPosX + (columnSpaceX / 2)) + offsetX) - columnWidth / 2)
					.dy(g.s.height - columnHeight + g.s.graph.padding.top)
					.addClass(g.s.class + '__columns__column ' + g.s.class + '__columns__column--' + classname);
	
				e++;
			}
		}
	};
	
	/* global g */
	g.drawPies = function() {
		var i = 0;
		g.pies = {};
	
		g.draw_pie = g.draw.group().addClass(g.s.class + '__pies');
		var size = (g.s.width < g.s.height ? g.s.width : g.s.height);
		var x = (g.s.width / 2 - (size / 2)) + g.s.rect.left;
		var y = (g.s.height / 2 - (size / 2)) + g.s.rect.top;
	
		var total = g.s.pie.total;
		var filled = 0;
	
		if (total === null) {
			total = 0;
			for (var key in g.o.dataset) {
				var line = g.o.dataset[key];
				total += line.value;
			}
		}
	
		var circleMask;
		for (key in g.o.dataset) {
			(function() {
				var line = g.o.dataset[key];
	
				var cstep = (200 - (10 * i));
				var dc = 'rgb(' + cstep + ',' + cstep + ',' + cstep + ')';
	
				var gradient = false;
				if (typeof line.color === 'object') {
					gradient = g.draw_pie.gradient('radial', function(stop) {
						stop.at(0, line.color[0]);
						stop.at(1, line.color[1]);
					});
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
					filledProc = (filled / total) * 360;
				}
	
				if (typeof line.position !== 'number') {
					filled += line.value;
				}
				rotate = -90 + (filledProc);
	
				var classname = line.classname || 'noclass-' + i;
				var lineWidth = size;
				if (typeof line.width !== 'undefined') {
					lineWidth = line.width;
				}
	
				var sliceMask = g.draw_pie.circle(size);
				sliceMask.fill('transparent')
					.addClass(g.s.class + '__pie')
					.dx(x).dy(y)
					.stroke({
						width: lineWidth,
						color: 'white'
					});
	
				var dia = (2 * Math.PI * (size / 2));
	
				sliceMask.rotate(rotate);
	
				circleMask = g.draw_pie.circle(size).fill({
					color: 'white'
				}).dx(x).dy(y);
				sliceMask.maskWith(circleMask);
	
				var res = ((line.value * dia) / total);
				sliceMask.attr('stroke-dasharray', (res) + ',' + dia);
	
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
			g.draw_pie_title = g.draw_pie.group().addClass(g.s.class + '__pie__title');
			var maintext = g.draw_pie_title.text(title.text).addClass(g.s.class + '__pie__title--main').font({
				family: g.s.fontFamily,
				size: title.size,
				anchor: 'middle'
			}).dx(g.s.width / 2 + g.s.graph.padding.left).dy(g.s.height / 2 + g.s.graph.padding.top - (title.size * 0.9));
			if (title.bold) {
				maintext.font({
					family: g.s.fontFamily,
					weight: 'bold'
				});
			}
	
			var preTitle = title.pre;
			if (title.pre.text) {
				g.draw_pie_title.text(preTitle.text).addClass(g.s.class + '__pie__title--pre').font({
					family: g.s.fontFamily,
					size: preTitle.size,
					anchor: 'middle'
				}).dx(g.s.width / 2 + g.s.graph.padding.left).dy((g.s.height / 2) - (title.size / 2) - (preTitle.size) - 5 + g.s.graph.padding.top);
			}
	
			var subTitle = title.sub;
			if (title.sub.text) {
				g.draw_pie_title.text(subTitle.text).addClass(g.s.class + '__pie__title--sub').font({
					family: g.s.fontFamily,
					size: subTitle.size,
					anchor: 'middle'
				}).dx(g.s.width / 2 + g.s.graph.padding.left).dy((g.s.height / 2) + (title.size / 2.5) + g.s.graph.padding.top);
			}
		}
	};
	
	/* global g g_st */
	
	g.drawLegend = function() {
		g.draw_legend = g.draw.group().addClass(g.s.class + '__legend').font({
			family: g.s.fontFamily,
			size: 12
		});
	
		// var pX = 0;
		var posX = (g.s.outerWidth / 100) * g.s.legend.x;
		if (g.s.legend.x > 50) {
			posX -= g.s.legend.padding.right;
			// pX = g.s.legend.padding.right * -1;
		} else {
			posX += g.s.legend.padding.left;
			// pX = g.s.legend.padding.left;
		}
	
		// var pY = 0;
		var posY = (g.s.outerHeight / 100) * g.s.legend.y;
		if (g.s.legend.y < 50) {
			posY += g.s.legend.padding.top;
			// pY = g.s.legend.padding.top;
		} else {
			posY -= g.s.legend.padding.bottom;
			// pY = g.s.legend.padding.bottom * -1;
		}
	
		g.draw_legend.width(g.s.outerWidth).dmove(posX, posY);
	
		var i = 0;
		for (var key in g.o.dataset) {
			(function() {
				var line = g.o.dataset[key];
				if (line.name) {
					var classname = line.classname || line.name.toLowerCase().replace(/ /g, '_');
					var color = line.color || 'black';
					var width = line.width || 2;
					line.__legend = g.draw_legend.group().addClass(g.s.class + '__legend__row chartress__legend--' + classname).attr('plot-name', classname);
					var string = line.name;
					var text = line.__legend.text(string)
						.fill(color)
						.font({
							family: g.s.fontFamily
						});
					var tx = (parseInt(g_st(text.node).width, 10) + 40) * -1 - 5;
					var ty = ((parseInt(g_st(text.node).height, 10)) * i) - 9;
					text.dx(tx);
					text.dy(ty);
					var rad = line.rad || 6;
					var comp = (parseInt(g_st(text.node).height, 10) / 2 + 1);
					var pathY = (parseInt(g_st(text.node).height, 10)) * i + comp;
					var line_path = [
						[-35, pathY],
						[-5, pathY]
					];
					var polyline = line.__legend.polyline(line_path)
						.fill('none')
						.stroke({
							color: color,
							width: width
						})
						.addClass(g.s.class + '__line chartress__legend__line chartress__legend__line--' + classname);
					if (line.dash) {
						polyline.attr('stroke-dasharray', line.dash);
					}
					line.__legend.circle(rad)
						.stroke({
							width: width,
							color: color
						})
						.fill('white')
						.dx(0 - rad / 2 - 5)
						.dy(pathY - rad / 2)
						.addClass(g.s.class + '__dot chartress__legend__dot--' + (classname));
	
					line.__legend.mouseover(function() {
						// var t = this;
						line.__plotgroup.addClass(g.s.class + '__plot--hover');
					}).mouseout(function() {
						line.__plotgroup.removeClass(g.s.class + '__plot--hover');
					});
					i++;
				}
			})();
		};
	};
	
	/* global g */
	g.drawChart = function() {
		g.clear();
		g.setBounds();
	
		if (g.s.type === 'line') {
			g.drawLabels();
			g.drawLines();
			g.drawLegend();
		}
		if (g.s.type === 'column') {
			g.drawLabels();
			g.drawColumns();
		}
		if (g.s.type === 'pie') {
			g.drawPies();
		}
	
		setTimeout(function() {
			g.draw.spof();
		});
	};
	
	/* global g g_st chel SVG */
	
	g.canvasResize = function() {
		g.drawChart();
		g.draw.spof();
	};
	
	var sizeCache = [
		parseInt(g_st(chel).width, 10),
		parseInt(g_st(chel).height, 10)
	];
	var to;
	
	SVG.on(window, 'resize', function() {
		if (sizeCache[0] !== parseInt(g_st(chel).width, 10) || sizeCache[1] !== parseInt(g_st(chel).height, 10)) {
			clearTimeout(to);
			to = setTimeout(g.canvasResize, g.s.graph.redrawTimeout);
		}
	});
	
	/* global g $element btoa*/
	
	g.drawToCanvas = function($canvas) {
		var svg = $element.querySelector('svg');
		var ctx = $canvas.getContext('2d');
		ctx.canvas.width = g.s.outerWidth;
		ctx.canvas.height = g.s.outerHeight;
	
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
