window.chartress = function($element, data){

	var g = {};
		var that = this;
		if (typeof jQuery !== 'undefined' && ($element instanceof jQuery)) {
			$element = $element[0];
		}
		var el = $element;
		var chel = document.createElement('div');
		el.appendChild(chel);
		chel.className = 'chartress';
		chel.style.height = '100%';
		chel.style.width = '100%';
		function sortNumber(a,b) {
			return b - a;
		}
		
		g.options = data;
		g.settings = {};
		
		g.draw = SVG(chel).size('100%', '100%').spof();
		
		g.clear = function(){
			g.draw.clear();
		}
		
		if (g.options.debug === true){
			console.info('chartress debug enabled for ');
			console.info(chel);
			console.info('Passed Data: ');
			console.info(g.options);
			console.log('------');
		}
		
		var isU = function(e) {
			return (typeof e === 'undefined');
		}
		
		var checkOption = [
			['graph'],
			['graph.padding'],
			['graph.padding.left', 0],
			['graph.padding.right', 0],
			['graph.padding.top', 0],
			['graph.padding.bottom', 0],
			['xAxis'],
			['xAxis.range'],
			['xAxis.range.from', 0],
			['xAxis.range.to', null],
			['xAxis.legend'],
			['xAxis.legend.x'],
			['xAxis.legend.y'],
			['xAxis.lines'],
			['xAxis.lines.color', '#0f0'],
			['xAxis.lines.width', 1],
			['xAxis.label'],
			['xAxis.label.markEvery', 1],
			['xAxis.label.markCount', null],
			['xAxis.label.color', 'gray'],
			['xAxis.label.y', 0],
			['xAxis.label.position', 'bottom'],
			['xAxis.label.size', 14],
			['yAxis'],
			['yAxis.lines'],
			['yAxis.lines.color', '#00f'],
			['yAxis.lines.width', 1],
			['yAxis.label'],
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
			['pie.total', 100],
			['pie.title'],
			['pie.title.size', 50],
			['pie.title.bold', true],
			['pie.title.text', false],
			['pie.title.pre'],
			['pie.title.pre.text', false],
			['pie.title.pre.size', 14],
			['pie.title.sub'],
			['pie.title.sub.text', false],
			['pie.title.sub.size', 14],
			['maxLength', null],
			['yMax', 0],
			['fontFamily', 'Helvetica'],
			['class', 'chartress'],
			['type', 'line'],
		];
		
		for (var i = 0; i < checkOption.length; i++) {
			var ch = checkOption[i][0].split('.');
			var dval = {};
			if (!isU(checkOption[i][1])) {
				dval = checkOption[i][1];
			}
			var objD = g.options;
		
			if (ch.length === 1) {
				if (isU(g.options[ch[0]])) {
					g.options[ch[0]] = dval;
					g.settings[ch[0]] = dval;
				}else{
					g.settings[ch[0]] = g.options[ch[0]];
				}
			}
			if (ch.length === 2) {
				if (isU(g.options[ch[0]][ch[1]])) {
					g.options[ch[0]][ch[1]] = dval;
					g.settings[ch[0]][ch[1]] = dval;
				}else{
					g.settings[ch[0]][ch[1]] = g.options[ch[0]][ch[1]];
				}
			}
			if (ch.length === 3) {
				if (isU(g.options[ch[0]][ch[1]][ch[2]])) {
					g.options[ch[0]][ch[1]][ch[2]] = dval;
					g.settings[ch[0]][ch[1]][ch[2]] = dval;
				}else{
					g.settings[ch[0]][ch[1]][ch[2]] = g.options[ch[0]][ch[1]][ch[2]];
				}
			}
		}
		
		if (isU(g.options.yAxis.label.format))
			g.options.yAxis.label.format = function(string){return string};
		
		if (isU(g.options.xAxis.label.format))
			g.options.xAxis.label.format = function(string){return string};
		
		
		g.log = function(e){
			if (g.options.debug === true) {
				console.log(e);
			}
		}
		
		var g_st = function(el){
			return getComputedStyle(el);
		}
		
		
		// if (true) {}
		if(g.settings.type === 'line') {
			g.settings.graph.padding = {
				top: g.options.graph.padding.top || 10,
				right: g.options.graph.padding.right || 8,
				bottom: g.options.graph.padding.bottom || 25,
				left: g.options.graph.padding.left || 35
			}
		}
		if(g.settings.type === 'column') {
			g.settings.graph.padding = {
				top: g.options.graph.padding.top || 25,
				right: g.options.graph.padding.right || 0,
				bottom: g.options.graph.padding.bottom || 25,
				left: g.options.graph.padding.left || 35
			};
			g.settings.xAxis.label.pos = g.options.xAxis.label.position || 'top';
			g.settings.xAxis.label.y = g.options.xAxis.label.y || -5;
		}
	g.setBounds = function() {
		if (g.settings.type === 'line' || g.settings.type == 'column') {
			var longest = 0;
			for (var key in g.options.dataset) {
				(function(){
					var line = g.options.dataset[key];
					var plot = line.plot.slice(0);
					if (g.settings.maxLength !== null && plot.length > g.settings.maxLength) {
						plot.reverse();
						plot.length = g.settings.maxLength;
						plot.reverse();
					}
					if (plot.length > longest) {
						longest = plot.length;
					}
					line.__plot = plot.slice(0);
					plot.sort(sortNumber);
					if (g.settings.yMax < plot[0]) {
						g.settings.yMax = plot[0];
					}
				})();
			};
			g.settings.maxLength = longest;
			if (g.settings.xAxis.range.to === null) {
				g.settings.xAxis.range.to = longest;
			}
		}
		if (g.settings.type === 'column') {
			g.settings.largestcolumn = 0;
			for (var key in g.options.dataset) {
				var line = g.options.dataset[key];
				for (var i = 0; i < line.__plot.length; i++) {
					var point = line.__plot[i];
					if (g.settings.largestcolumn < point) {
						g.settings.largestcolumn = point;
					}
				}
			}
		}
		if (g.settings.type === 'pie') {
			g.settings.pie.total = g.options.pie.total || false;
			if (g.settings.pie.total === false) {
				for (var key in g.options.dataset) {
					var line = g.options.dataset[key];
					g.settings.pie.total += line.value;
				}
			}
		}
	
		g.settings.outerWidth = parseInt(g_st(chel).width);
		g.settings.width = g.settings.outerWidth - g.settings.graph.padding.right - g.settings.graph.padding.left;
		g.settings.outerHeight = parseInt(g_st(chel).height);
		g.settings.height = g.settings.outerHeight - g.settings.graph.padding.top - g.settings.graph.padding.bottom;
	
		g.settings.rect = {
			top: g.settings.graph.padding.top,
			left: g.settings.graph.padding.left,
			right: g.settings.graph.padding.left + g.settings.width,
			bottom: g.settings.outerHeight - g.settings.graph.padding.bottom
		};
	
		// debug rect
		if (g.options.debug === true) {
			g.draw.rect(g.settings.width, g.settings.height).fill('#eee').dx(g.settings.rect.left).dy(g.settings.rect.top);
		}
	};
	g.drawLabels = function() {
	
		// draw yaxis
		if (g.settings.yAxis.label.markEvery === null) {
			g.settings.yAxis.label.markEvery = Math.round(g.settings.yMax / g.settings.yAxis.label.markCount);
		}
		var yPoints = [], i;
		for (i = 0; i < (g.settings.yMax + g.settings.yAxis.label.markEvery); i++) {
			var test = i%g.settings.yAxis.label.markEvery;
			if (test === 0 && i <= g.settings.yMax) {
				yPoints.push(i);
			}
		}
	
		// largest label is always max value
		yPoints[yPoints.length - 1] = g.settings.yMax;
	
		g.yLabels = g.draw.group().addClass(g.settings.class+'__labels chartress__labels--yAxis');
		g.settings.yPoints = [];
		for (i = 0; i < yPoints.length; i++) {
			(function(){
				var posY = ((1-(yPoints[i] / g.settings.yMax) * g.settings.height) *-1) + g.settings.graph.padding.top;
				var fontSize = 14;
				posY = posY - (fontSize /3);
	
				var text = yPoints[yPoints.length-1 - i];
				text = g.options.yAxis.label.format(text);
				text = text.toString();
				// if (text !== 'ex') {
	
					var tnode = g.yLabels.text(text)
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
				// };
			})();
		}
		// draw xaxis
		var xPoints = g.settings.longestLine,
			labelRange = g.settings.xAxis.range.to - g.settings.xAxis.range.from;
	
		if (g.settings.maxLength !== null) {
			labelRange = g.settings.maxLength;
		}
	
		g.settings.xPoints = [];
		var labelPosFix = 0;
		if (g.settings.type === 'column') {
			labelRange++;
			labelPosFix = (g.settings.width / (labelRange)) / 2;
		}
	
		if (g.options.xAxis.visible !== false && g.options.xAxis.lines !== false) {
			var startAt = 0;
			if (g.options.xAxis.maxRangeLength) {
				startAt = g.options.xAxis.maxRangeLength + 1;
			}
			// g.log([startAt, labelRange])
	
			g.xLabels = g.draw.group().addClass(g.settings.class+'__labels chartress__labels--xAxis');
			for (i = 0; i < labelRange; i++) {
				(function(){
					var text = (g.settings.xAxis.range.from + i) + startAt;
					text = g.options.xAxis.label.format(text);
					text = text.toString();
					var proc = ((i) / (labelRange-1))
					var posX = ((g.settings.width) * proc) + g.settings.graph.padding.left;
					var posY = g.settings.rect.bottom + g.settings.xAxis.label.y;
					if (g.settings.xAxis.label.pos === 'top') {
						posY = g.settings.rect.top - (g.settings.xAxis.label.size*1.5) + g.settings.xAxis.label.y;
					}
	
					if (i%g.settings.xAxis.label.markEvery === 0) {
						if (g.options.xAxis.visible !== false) {
						g.xLabels.text(text)
							.fill(g.settings.xAxis.label.color)
							.font({
								family: g.settings.fontFamily,
								anchor: 'middle',
								size: g.settings.xAxis.label.size
							})
							.dx(posX + labelPosFix)
							.dy(posY)
							.addClass(g.settings.class+'__labels__label chartress__labels--xAxis');
						}
					}
	
					g.settings.xPoints.push(posX);
				})();
			}
		}
	};
	g.drawLines = function(){
		g.draw_plots = g.draw.group().addClass(g.settings.class+'__plots');
	
		for (var key in g.options.dataset) {
	
			var line = g.options.dataset[key];
			var classname = line.classname || line.name.toLowerCase().replace(/ /g, '_');
			var color = line.color || 'black';
			var width = line.width || 2;
			var pointsArr = [];
			line.__plotgroup = g.draw_plots.group();
			line.__plotgroup.addClass(g.settings.class+'__plot chartress__plot--'+(classname)).attr('plot-name', classname);
	
			var x = 0;
			for (var key in line.__plot) {
				(function(){
					var point = line.__plot[key];
					var xPos = ((x/(g.settings.maxLength-1)) * g.settings.width) + g.settings.graph.padding.left;
					var yPos = ((point / g.settings.yMax) * g.settings.height);
					yPos = (g.settings.height - yPos) + g.settings.graph.padding.top;
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
	g.drawColumns = function(){
		g.draw_columns = [];
		var useLength = g.settings.maxLength;
	
		var columnSpaceX = g.settings.width / useLength;
	
		for (var i = 0; i < useLength; i++) {
			g.draw_columns[i] = g.draw.group().addClass(g.settings.class+'__columns__group '+g.settings.class+'__columns__group--'+i);
			// var absPosX = ((i/maxLength) * g.settings.width) + g.settings.graph.padding.left;
			var absPosX = (columnSpaceX * i) + g.settings.graph.padding.left;
			var corr_label_y = g.settings.columns.labels.y;
	
			var e = 0;
			for (var key in g.options.dataset) {
				var line = g.options.dataset[key];
				g.log(line);
				var name = line.name || (i+1).toString();
				if (typeof name == 'object') {
					name = name[i];
				}
				var color = line.color || '#222';
				var textColor = line.textColor || color;
				var classname = line.classname || name.replace(/ /g, '_').toLowerCase();
	
				var columnWidth = g.settings.columns.width;
				var columnSpace = g.settings.columns.space;
				var columnHeight = (line.__plot[i] / g.settings.largestcolumn) * g.settings.height;
	
				var position = ((g.options.dataset.length* -0.5) + 0.5) + e;
	
	
				var offsetX = position* (columnWidth+columnSpace);
				g.log([position, offsetX])
	
				g.draw_columns[i].text(name)
					.fill(textColor)
					.dx((absPosX + (columnSpaceX/2)) + offsetX)
					.dy(g.settings.height + corr_label_y + g.settings.graph.padding.top)
					.font({
						family: g.settings.fontFamily,
						anchor: 'middle',
						size: g.settings.columns.labels.fontsize
					})
					.addClass(g.settings.class+'__columns__label '+g.settings.class+'__columns__label--'+classname);
	
				g.draw_columns[i].rect(columnWidth, columnHeight)
					.fill(color)
					.dx(((absPosX + (columnSpaceX/2)) + offsetX) - columnWidth/2)
					.dy(g.settings.height - columnHeight + g.settings.graph.padding.top)
					.addClass(g.settings.class+'__columns__column '+g.settings.class+'__columns__column--'+classname);
	
				e++;
			}
		}
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
	
	
				var res = ((line.value*dia) / total);
				g.pies[classname].el.attr('stroke-dasharray', res+','+dia);
				g.pies[classname].el.addClass(g.settings.class+'__pie--' + classname);
				i++;
			})();
		};
	
		var title = g.settings.pie.title;
		if (title.text !== false) {
			g.draw_pie_title = g.draw_pie.group().addClass(g.settings.class+'__pie__title');
			var maintext = g.draw_pie_title.text(title.text).addClass(g.settings.class+'__pie__title--main').font({
				family: g.settings.fontFamily,
				size: title.size,
				anchor: 'middle',
			}).dx(g.settings.width / 2 + g.settings.graph.padding.left).dy(g.settings.height / 2 + g.settings.graph.padding.top - (title.size * 0.9));
			if (title.bold) {
				maintext.font({
					family: g.settings.fontFamily,
					weight: 'bold'
				});
			}
	
			var preTitle = title.pre;
			if (title.pre.text) {
				pretext = g.draw_pie_title.text(preTitle.text).addClass(g.settings.class+'__pie__title--pre').font({
					family: g.settings.fontFamily,
					size: preTitle.size,
					anchor: 'middle'
				}).dx(g.settings.width / 2 + g.settings.graph.padding.left).dy((g.settings.height / 2) - (title.size/2) - (preTitle.size) - 5 + g.settings.graph.padding.top);
			}
	
			var subTitle = title.sub;
			if (title.sub.text) {
				subText = g.draw_pie_title.text(subTitle.text).addClass(g.settings.class+'__pie__title--sub').font({
					family: g.settings.fontFamily,
					size: subTitle.size,
					anchor: 'middle'
				}).dx(g.settings.width / 2 + g.settings.graph.padding.left).dy((g.settings.height / 2) + (title.size/2.5) + g.settings.graph.padding.top);
			}
		}
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
		for (var key in g.options.dataset) {
			(function(){
				var line = g.options.dataset[key];
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
	g.drawChart = function() {
		g.clear();
		g.setBounds();
	
		if (g.settings.type === 'line') {
			g.drawLabels();
			g.drawLines();
			g.drawLegend();
		}
		if (g.settings.type === 'column') {
			g.drawLabels();
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
		g.drawChart();
		g.draw.spof();
	};
	
	var sizeCache = [parseInt(g_st(chel).width), parseInt(g_st(chel).height)];
	var to;
	
	SVG.on(window, 'resize', function() {
		if (sizeCache[0] !== parseInt(g_st(chel).width) || sizeCache[1] !== parseInt(g_st(chel).height)) {
			clearTimeout(to);
			to = setTimeout(g.canvasResize, g.options.graph.redrawTimeout || 5);
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