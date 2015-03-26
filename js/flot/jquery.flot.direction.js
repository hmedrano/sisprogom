/*
Flot plugin direction is used to show a visual arraw. Can be show wind data(wind speed and wind direction).
The data points you give in your data series should be three dimentions, like:[x_value, y_value, the_direction_value].

default options:
direction: {
            show: true,
            lineWidth: 1,
            color: "rgb(100, 60, 60)",
            fillColor: "rgb(100, 60, 60)",
            arrawLength: 8,
            angleType: "degree", //degree or radian
            openAngle: 30,
            zeroShow: false,
            threshold: 0.000001,
            angleStart: 0
        }

=========
 options
=========
"show" enable or disable the direction arraw show. Value: true or false.
"lineWidth", "color", "fillColor" is to set direction arraw's size, outline color, fill color.
"angleType" is default set to 'degree', another value is 'radian'. This set the direction value's type(the third dimentions' value).
"openAngle" set the arraw's head shape, used to be a sharp angle in degree, default is 30.
"zeroShow" when you want show zero value(value tha is less than "threshold" in abs), set it to true. see <attention> 2. Default is false, not show zero value.
"threshold" this is used when the "zeroShow" set to true only.
"angleStart" if you want change the start angle direction from north to east, set this value to -90 in degree, or from west set it to 90. See <attention> 1.

===========
 attention
===========
1. The angle diretion is start from north, and clockwise by default.
2. While the y's abosolut value is less than 0.000001 and zeroShow set to false(the default value), the direction arraw will not show.

=========
 changes
=========
version 1.4.2
-------------
fix bug that not draw the direction when the serial data is less than 3.

version 1.4.1
-------------
change the example section, now it works.

version 1.4
-------------
fix bug that set options in separate serie does not work well
fix bug that series ploted against the first axis only

version 1.3
-----------
fix bug that options can't set in sigle series
remove "disablePoints" options

version 1.2
------------
fix the bug when use radian angleType{bug: just show 0 ~ PI}
add options "zeroShow", "threshold", "angleStart"

version 1.1
-----------
fix bug that nonsense when change default options. {thanks Jernej Jerin}


=========
 example
=========
$.plot(
	"#place_holder",
	[
		[[1, 13, 50], [2, 20, 40], [3, 33, 50], [4, 13, 120], [5, 8, 270], [6, 26, 230]]
	],
	{
		series: {
			 points: {
				show: true,
				radius: 3,
				fill: false,
				symbol: 'circle'
			},
			 lines: {
				show: true,
				lineWidth: 2
			},
			 direction: {
				show: true
			}
		}
	}
);

=============
 acknowledge
=============
Jernej Jerin: Thank you for your testing any version of the plugin and reporting the bugs.
Xue Wei: the example section now works with flot v0.7 after version 1.4.1.

=========
 more :)
=========
Author: xb liu
Site: http://code.google.com/p/jquery-flot-direction/
License: GPL(any version) or Perl Artistic License
*/

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

(function ($) {
    var options = {
        series: {
            direction: {
                show: true,
                lineWidth: 1,
                color: "rgb(100, 60, 60)",
                fillColor: "rgb(100, 60, 60)",
                arrawLength: 8,
                angleType: "degree", //degree or radian
                openAngle: 30,
                zeroShow: false,
                threshold: 0.000001,
                angleStart: 0
            }
        }
    };
    
    function init(plot) {
        function draw(plot, ctx) {
            $.each(plot.getData(), function(ii, series) {
                drawSeries(plot, ctx, series);
            });
        }
        
        function drawSeries(plot, ctx, series) {
            var direction = plot.getOptions().series.direction;
            series = $.extend(true, {}, direction, series, series.direction);
            if (!series.show || series.data.length < 1 ||  series.data[0].length < 3) {
                return;
            }

            var i, x, y;
            var points = series.data;

            var yMax = -10000 ; 
            var yMin = 10000 ;
            for (i=0;i<points.length;i++) {
                if (points[i][1] > yMax) {
                    yMax = points[i][1] ;
                }
                if (points[i][1] < yMin) {
                    yMin = points[i][1] ; 
                }
            }

            var radius = series.arrawLength;
            var stepL = (series.arrawLength/ (yMax-yMin)) ;
            var plotOffset = plot.getPlotOffset() ; 

            // Draw North Arrow 
            cY = plotOffset.top + 20 ; 
            cX = plotOffset.left + 20 ; 
            ctx.beginPath(); 
            ctx.moveTo(cX,cY) ; 
            ctx.lineTo(cX+10,cY) ; 
            ctx.lineTo(cX+5,cY-10) ;  
            ctx.lineTo(cX,cY) ; 
            ctx.closePath();
            ctx.fillStyle = "#505050";
            ctx.strokeStyle = "#505050";
            ctx.fill();
            ctx.stroke();
            ctx.moveTo(cX+5,cY) ;
            ctx.lineTo(cX+5,cY+8) ; 
            ctx.stroke(); 
            placeH = plot.getPlaceholder() ; 
            placeH.append("<div style='position:absolute;left:" + (cX+1) + "px;top:" + (cY+7) + "px;color:#505050;font-size:smaller'>N</div>")

            
            for (i = 0; i < points.length; i++) {
                if (points[i].length < 3 || points[i][1] === null) {
                    continue;
                }
                
                x = points[i][0];
                y = points[i][1];

                radius = stepL * (y-yMin) ; 
                
                var offset = plot.pointOffset({ x: x, y: yMin, xaxis: series.xaxis, yaxis: series.yaxis});
                x = offset.left;
                // Just plot the lines inside the grid area
                if (x<plotOffset.left || x > (plot.width() + plotOffset.left) ) { 
                    continue ; 
                }
                y = offset.top + 35; // in pixels 
                
                if (!series.zeroShow && (Math.abs(points[i][1]) < series.threshold)) {
                    ctx.beginPath();
                    ctx.strokeStyle = series.color;
                    ctx.lineWidth = series.lineWidth || 1;
                    ctx.arc(x, y, radius, 0, series.shadow ? Math.PI : Math.PI * 2, false);
                    ctx.closePath();
                    continue;
                }
                
                if (series.angleType == "degree") {
                    direct = ((90 - points[i][2]) + series.angleStart) * Math.PI / 180;
                }
                else {
                    direct = Math.PI/2 - points[i][2] + series.angleStart;
                }                
                
                var tail_percent = 0.0;
                var t_x = x + radius * Math.cos(direct);
                var t_y = y - radius * Math.sin(direct);
                var f_x = x - radius * Math.cos(direct) * tail_percent;
                var f_y = y + radius * Math.sin(direct) * tail_percent;
                                
                var sharp_angle = (series.openAngle * Math.PI / 180) % 90; //arraw open angle
                
                var r_x = t_x - (radius*0.15) / Math.cos(sharp_angle) * Math.cos(direct + sharp_angle);
                var r_y = t_y + (radius*0.15) / Math.cos(sharp_angle) * Math.sin(direct + sharp_angle);
                
                var l_x = t_x - (radius*0.15) / Math.cos(sharp_angle) * Math.cos(direct - sharp_angle);
                var l_y = t_y + (radius*0.15) / Math.cos(sharp_angle) * Math.sin(direct - sharp_angle);
                
                ctx.beginPath();

                ctx.strokeStyle = series.color;
                ctx.lineWidth = 0.5;
                
                // Simple arrow  --> 
                ctx.moveTo(f_x, f_y);
                ctx.lineTo(t_x, t_y);
                ctx.lineTo(r_x, r_y);
                ctx.moveTo(t_x, t_y);
                ctx.lineTo(l_x, l_y);


                //ctx.moveTo(f_x, f_y);
                //ctx.lineTo(r_x, r_y);
                //ctx.lineTo(t_x, t_y);
                //ctx.lineTo(l_x, l_y);
                //ctx.lineTo(f_x, f_y);
                //ctx.closePath();
                
                //ctx.fillStyle = series.fillColor;
                //ctx.fill();
                
                ctx.stroke();
            }


            
        }
        
        plot.hooks.draw.push(draw);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'direction',
        version: '1.4.2'
    });
})(jQuery);

