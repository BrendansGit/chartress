var demodata = {
    graph: {
        padding: [50, 40, 50, 80]
    },
    legend: {
        x: 100,
        y: 0,
        padding: [5,20,0,0]
    },
    xAxis: {
        label: {
            y: 20,
            color: '#000'
        },
        markEvery: 2,
        maxRange: 11
    },
    yAxis: {
        label: {
            color: '#000',
            x: -30,
            font_size: 12
        },
        markEvery: 20
    },
    lines: [
    {
        name: 'Workspace',
        classname: 'workspace',
        plot: [20, 40, 60, 60, 70, 100, 60, 25, 44, 36, 20],
        rad: 6
    },
    {
        name: 'Meeting',
        classname: 'meeting',
        // dash: '10,5',
        plot: [0, 10, 50, 80, 53, 20, 25, 80, 70, 5, 40],
        rad: 6
    },
    {
        name: 'Breakout Space',
        classname: 'breakspace',
        dash: '10,5',
        plot: [10, 35, 70, 100, 65, 40, 20, 45, 90, 70, 30],
        rad: 6
    },
    {
        name: 'Kitchen',
        classname: 'kithen',
        dash: '10,5',
        plot: [40, 20, 1, 50, 60, 70, 100, 70, 40, 30, 10],
        rad: 6
    }
    ],
    plot: {
        range: {
            from: 7,
            to: 17
        }
    }
};


app.mods.graph = function($element) {
    var that = this;
    var el = $element[0];
    var g = {};
    function sortNumber(a,b) {
        return b - a;
    }

    g.settings = {
        yMax: 0
    };
    g.options = demodata;
    g.draw = SVG(el).size('100%', '100%').spof();

    g.clear = function(){
        g.draw.clear();
    }

    g.setBounds = function() {

        _.forEach(g.options.lines, function(line) {
            var plot = _.clone(line.plot);
            if (plot.length > g.options.xAxis.maxRange) {
                plot.reverse();
                plot.length = g.options.xAxis.maxRange;
                plot.reverse();
            }
            line.__plot = _.clone(plot);
            plot.sort(sortNumber);
            if (g.settings.yMax < plot[0]) {
                g.settings.yMax = plot[0];
            }
        });
        g.settings.outweWidth = $element.width();
        g.settings.width = $element.width() - g.options.graph.padding[1] - g.options.graph.padding[3];
        g.settings.outerHeight = $element.height();
        g.settings.height = $element.height() - g.options.graph.padding[0] - g.options.graph.padding[2];

        g.settings.rect = {
            top: g.options.graph.padding[0],
            left: g.options.graph.padding[3],
            right: g.options.graph.padding[3] + g.settings.width,
            bottom: g.settings.outerHeight - g.options.graph.padding[2]
        };

        // g.draw.rect(g.settings.width, g.settings.height).fill('#eee').dx(g.settings.rect.left).dy(g.settings.rect.top);
    };

    g.drawBounds = function() {

        // draw yaxis
        var yPoints = 0, i;
        for (i = 0; i < (g.settings.yMax + g.options.yAxis.markEvery); i++) {
            if (i%g.options.yAxis.markEvery === 0) {
                yPoints++;
            }
        }
        
        g.settings.yPoints = [];
        for (i = 0; i < yPoints; i++) {
            var proc = 1 - ((i+1) / yPoints);
            var posY = ((g.settings.height + (g.settings.height * 0.13)) * proc) + g.options.graph.padding[0];
            var text = i*g.options.yAxis.markEvery;
            if (text !== 0) {
                var tnode = g.draw.text(text.toString())
                    .fill(g.options.yAxis.label.color)
                    .font({
                        anchor: 'middle',
                        size: 12
                    })
                    .dx(g.settings.rect.left + g.options.yAxis.label.x)
                    .dy(posY);

                tnode.dy((tnode.node.scrollHeight / 2)*-1)
                g.settings.yPoints.push(posY);
            };
        }

        // draw xaxis
        var xPoints = g.settings.longestLine,
            dateRange = g.options.plot.range.to - g.options.plot.range.from;

        g.settings.xPoints = [];

        // todo: make xAxis.markEvery work properly
        for (i = 0; i <= dateRange; i++) {
            var time = g.options.plot.range.from + i;
            if (time < 10) {
                time = '0'+time;
            }
            var text = time+':00';
            var proc = ((i) / (dateRange))
            var posX = ((g.settings.width) * proc) + g.options.graph.padding[3];

            if (i%g.options.xAxis.markEvery === 0) {
                g.draw.text(text)
                    .fill(g.options.xAxis.label.color)
                    .font({
                        anchor: 'middle',
                        size: 12
                    })
                    .dx(posX)
                    .dy(g.settings.rect.bottom + g.options.xAxis.label.y)
                    .addClass('graph__xlabel');

            }

            g.settings.xPoints.push(posX);
        }
    };

    g.drawLines = function(){
        g.draw_plots = g.draw.group().addClass('graph__plots');
        _.map(g.options.lines, function(line){
            var x = 0;
            var pointsArr = [];
            line.__plotgroup = g.draw_plots.group();
            line.__plotgroup.addClass('graph__plot graph__plot--'+(line.classname)+' graph__style--'+line.classname).attr('plot-name', line.classname);

            _.forEach(line.__plot, function(point){
                var xPos = g.settings.xPoints[x];
                var yPos = (g.settings.height - ((point / g.settings.yMax) * g.settings.height)) + g.options.graph.padding[0];
                pointsArr.push([xPos, yPos]);
                x++;
            });

            line.__plotsvg = line.__plotgroup.polyline(pointsArr).fill('none').stroke({ width: 2 }).addClass('graph__line graph__line--'+line.classname);
            if(line.dash){
                line.__plotsvg.attr('stroke-dasharray', line.dash);
            }
            var rad = line.rad;
            _.forEach(pointsArr, function(point){
                line.__plotgroup.circle(rad).dx(point[0] - rad/2).dy(point[1] - rad/2).addClass('graph__dot graph__dot--'+(line.classname));
            });
        });
    };

    g.drawLegend = function(){
        g.draw_legend = g.draw.group().addClass('graph__legend').font({
            size: 14
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
        _.forEach(g.options.lines, function(line){
            line.__legend = g.draw_legend.group().addClass('graph__legend__row graph__legend--'+line.classname+' graph__style--'+line.classname).attr('plot-name', line.classname);
            var string = line.name;
            var text = line.__legend.text(string).font();
            var tx = (text.node.scrollWidth + 40)*-1;
            var ty = ((text.node.scrollHeight)*i) * 1.1;
            text.dx(tx);
            text.dy(ty);
            var rad = line.rad;
            var compensate = (text.node.scrollHeight * 1.1) * 0.3;
            var line_path = [
                [-30,pY+(text.node.scrollHeight-compensate) + ty],
                [0,pY+(text.node.scrollHeight-compensate) + ty],
            ];
            var polyline = line.__legend.polyline(line_path).fill('none').stroke({ width: 2 }).addClass('graph__line graph__legend__line graph__legend__line--'+line.classname);
            if(line.dash){
                polyline.attr('stroke-dasharray', line.dash);
            }
            line.__legend.circle(rad).dx(0 - rad/2).dy((pY + (text.node.scrollHeight-compensate) + ty) - rad/2).addClass('graph__dot graph__legend__dot--'+(line.classname));

            line.__legend.mouseover(function(){
                var t = this;
                // console.log(line);
                line.__plotgroup.addClass('graph__plot--hover');
            }).mouseout(function(){
                line.__plotgroup.removeClass('graph__plot--hover');
            });
            i++;
        })
    };

    g.drawGraph = function() {
        g.setBounds();
        g.drawBounds();
        g.drawLines();
        g.drawLegend();
    };

    g.drawGraph();

    g.canvasResize = function(){
        g.draw.spof();
        g.clear();
        g.drawGraph();
    };

    var sizeCache = [$element.width(), $element.height()];
    var to;

    SVG.on(window, 'resize', function() {
        if (sizeCache[0] !== $element.width() || sizeCache[1] !== $element.height()) {
            clearTimeout(to);
            to = setTimeout(g.canvasResize, 100);
        }
    });
};