document.jSVGraph = function (element, width, height, type, axiscolor, fadecolor1, fadecolor2, bordercolor, gridcolor, textcolor) {
  // return immediately if element doesn't exist
  "use strict";
	if (!element){return null;}
	element = "";
	this.width = width || {};			// container width
	this.height = height || {};			// container height
	this.type = type || {};	
	this.element = element;				// DIV chart SVG data will be inserted into
	this.series = [];					// all chart data ( an array of series' )
	this.chartLabels = [];				// chart labels, e.g. title
	this.axisColor = axiscolor;			// chart axis color
	this.borderColor = bordercolor;		// chart border color
	this.gradientColor1 = fadecolor1;	// chart background gradient color 1
	this.gradientColor2 = fadecolor2;	// chart background gradient color 2
	this.gridColor = gridcolor;			// chart grid color 
	this.textColor = textcolor;			// chart leged / axis text color 
	this.axisWidth = "1px";
	this.svg_source = "";
	this.bottomPadding = 60;			// bottom padding of chart area
	this.topLeftX = 20;					// X origin of chart area
	this.topLeftY = 20;					// Y origin of chart area
	this.graphPadding = 40;				// padding from bottom to min data point, and top to max data point ( equal spacing ) 

	// trigger jsvGraph initialization
	this.setup();
	
};



document.jSVGraph.prototype = {
	setup: function(params)	{
		"use strict";
		//var element = document.getElementById(this.element);
		this.svg_source = '<svg id="svgelem" height="' + this.height + '" width="' + this.width + '" xmlns="http://www.w3.org/2000/svg" version="1.1" >';
		this.svg_source+= '<defs>' + this.addGradient('grad1', 0, 0, 0, 100, this.gradientColor1, this.gradientColor2) + '</defs>';
		this.rectangle(0, 0, this.width, this.height, '0', '', this.borderColor, '','5' ,'5' );
		this.rectangle(this.topLeftX, this.topLeftY, this.width - this.graphPadding, this.height - this.bottomPadding, '0', '', '', '#grad1','','');
		this.axes(this.axisColor);		
		this.grid(10, 10, this.topLeftY, false , true, this.gridColor, '0.5');			
	},	
	
	
	line: function(x1, y1, x2, y2, width, color, linetype)	{
		"use strict";
		var line = '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="stroke:' + color + ';stroke-width:' +  width + '" />' + "\r\n";
		this.svg_source += line;
		return line;	  
	},
	
	dashedLine: function(x, y, x2, y2, color, width, dashArray)	{
		"use strict";
		var dashLength, distRemaining, dashIndex=0, draw=true, xStep, slope, dashCount = dashArray.length, pathStr = "", dx = (x2-x), dy = (y2-y);
		if (!dashArray) {dashArray=[5,10];}
		if (dashLength===0) {dashLength = 0.001;} // Hack for Safari				
		pathStr+= "M " + x + " " + y; // move to
		slope = dy/dx;
		distRemaining = Math.sqrt( dx*dx + dy*dy );
		while (distRemaining>=0.1){
		  dashLength = dashArray[dashIndex ++%dashCount];
		  if (dashLength > distRemaining) {dashLength = distRemaining;}
		  xStep = Math.sqrt( dashLength*dashLength / (1 + slope*slope) );
		  if (dx<0) {xStep = -xStep;}
		  x += xStep;
		  y += slope*xStep;
		 
		  if(draw) {
			pathStr+= " L " + x + " " + y + " " + (x + xStep) + " " + (y + slope*xStep);
		  }  else  {
			pathStr+= " M " + x + " " + y;
		  }
		  
		  distRemaining -= dashLength;
		  draw = !draw;
		}
		this.svg_source += this.simplePath(pathStr, width, color, color, '');
	},

	
	rectangle: function(x, y, width, height, stroke_width, stroke_color, fill_color, fill_url, radius_x, radius_y)	{
		"use strict";
		var style = '', box = '<rect x="' + x + '" y="' + y  + '" width="' + width + '" height="' + height +'" ';
		
		if(fill_url !== ''){
			style += 'style="fill:url(' + fill_url + ');';
		}else{
			style  += 'style="fill:' + fill_color + ';';
		}
		if(radius_x !== '') {box += 'rx="' + radius_x + '" ';}
		if(radius_y !== '') {box += 'ry="' + radius_y + '" ';}		
		
		style+= ' stroke:' + stroke_color + ';stroke-width:' + stroke_width;
		box+= style + ';"/>';
		this.svg_source += box;
		return box;
	},
	
	circle: function(x, y, radius, stroke_color, stroke_width, fill_color)
	{
		"use strict";
		var circle = "";
		circle += '<circle cx="' + x + '" cy="' + y + '" r="' + radius + '" stroke="' + stroke_color + '" stroke-width="' + stroke_width + '" fill="' + fill_color + '"/>';
		this.svg_source += circle;
		return circle;
	},
	
	simplePath: function(data, width, color, fill_color, dashstyle)	{		
		"use strict";
		var path = '<path ';
		if(dashstyle !== '') {path+= 'stroke-dasharray="' + dashstyle + '"';} 
		path+= ' d="' + data + '" fill = "' + fill_color + '" stroke = "' + color + '" stroke-width="' + width + '"/>';
		return path;
	},
	
	grid: function(rows, xoffset, yoffset, v , h, color, width)	{
		"use strict";
		var i, ypos, gd = "", xpos = 10 + xoffset, step = parseInt((this.height - this.bottomPadding) / rows, 10);
		for(i = 0; i < rows; i++){
			ypos = step * i + yoffset;
			//gd+= this.simplePath('M ' + xpos + ' ' + ypos + ' L ' + (this.width - 20) + ' ' + ypos, width, color, '', '2,5');
			gd += this.dashedLine(xpos, ypos, (this.width - 20), ypos, color, '0.5', [1,5]);
		}
		
		this.svg_source+= gd;
		return gd;
	},
	
	point: function(x, y, color, size, style)	{
		"use strict";
	},
	
	dataPoint: function(x, y)	{
		"use strict";
	},
	
	text: function(text, x, y, font, fontsize, color, transform){
		"use strict";
		var textsvg = '<text x="' + x + '" y="' + y + '" fill="' + color + '" font-family="' + font + '" font-size="' + fontsize + '" ';
		if(transform !== '') {textsvg+= 'transform="' + transform + '" ';}
		textsvg+= '>' + text + '</text>';
		this.svg_source+= textsvg;
		return textsvg;
	},

	axis: function(direction)	{
		"use strict";
		if(direction === "horizontal"){
			this.line(this.topLeftX, this.height - this.graphPadding, this.width - this.topLeftX, this.height - this.graphPadding, this.axisWidth, this.axisColor, 'solid');			
		}
		
		if(direction === "vertical"){
			this.line(this.topLeftX, 20, this.topLeftX, this.height - this.graphPadding, this.axisWidth, this.axisColor, 'solid');
		}				
	},

	axes: function(color)	{
		"use strict";
		this.axis("vertical");
		this.axis("horizontal");
	},
	
	axiscolor: function(color, axis)	{
		"use strict";
		this.axis.color = color;
	},
	
	ticks: function(axis, interval)		{
		// ticks on an axis
		"use strict";
		var ticks = "";
				
		if(axis === "horizontal")	{
			ticks = this.dashedLine(this.topLeftX, this.height - 38,this.width - 15,this.height - 38, this.axisColor, '5px', [1,interval]);		
		}
		
		if(axis === "vertical")	{
			ticks = '';
		}
		this.svg_source+= ticks;		
	},
	
	
	lables: function (lbl)		{
		// Chart title, x-axis, y-axis, y-axis2
		"use strict";
		var fontSize = 10, xpos, ypos, chartTitle, i;
		for(i=0; i < lbl.length; i++ )
		{
			this.chartLabels[i] = lbl[i];
		}
		
		if(this.chartLabels[1])	{
			xpos = parseInt(((this.width - 10) * 0.5) - (fontSize * this.chartLabels[1].length) * 0.2, 10);
			ypos = this.height - (20 - fontSize);
			this.text(this.chartLabels[1], xpos, ypos, "Arial", fontSize, this.textColor, '');
		}
		
		if(this.chartLabels[2])	{
			ypos = 15 - this.width;
			xpos = 100;
			this.text(this.chartLabels[2], xpos, ypos, "Arial", fontSize, this.textColor, 'rotate(90 0 0)'); 
		}
		
		if(this.chartLabels[0])	{
			chartTitle = this.chartLabels[0];
			this.text(chartTitle, (this.width / 2) - ((chartTitle.length) * 2.75), 15, "Verdana", 12, this.textColor, 'rotate(0,0,0)');
		}	
	},
	
	addXValues: function(xvalues, step, offset, xoffset)		{
		"use strict";
		var st = 1, xpos, i, interval;
		interval = parseInt((this.width - 35) / xvalues.length, 10 );
		
		for(i=0; i<xvalues.length; i++)
		{
			xpos = (i * (interval + 1)) + xoffset;
			if(st === step)		{	
				if((i + offset) < xvalues.length)
				{
					this.text(xvalues[i + offset], xpos, this.height - 25, "Verdana", 10, this.textColor, '');
				}
				st = 0;
			}	
			st++;
		}		
		this.ticks('horizontal', interval);
	},
	
	plotSeries: function(series, x, y, xstep, width, linetype)	{		
		"use strict";
		var pathData = "", startPoint = "0 0", i, dpoint, pointx, pointy, graphMetrics;	
		graphMetrics = this.graphMetrics();
				
		for(i=0; i < series.data.length; i++)		{
			dpoint = series.data[i];
			pointx = parseInt((i * graphMetrics.xstep) + this.topLeftX, 10);
			pointy = 190 - (dpoint - graphMetrics.min) * graphMetrics.yscale;
			pathData += pointx + " " + pointy + " ";
			if(i === 0) {
				startPoint = pointx + " " + pointy + " ";
			}
		}		
	
		this.text(graphMetrics.min, 3, graphMetrics.height  + this.topLeftY  - 20, "Arial", 12, '#000000', '');
		this.text(graphMetrics.max, 3, (this.height - this.topLeftY) - graphMetrics.height + 5, "Arial", 12, '#000000', '');		
				
		// data, width, color, fill_color, dashstyle
		this.svg_source+= this.simplePath('M ' + startPoint + ' L ' +  pathData, '2', series.color, 'none', ' ');		
	},
	
	plot: function(linetype)	{
		"use strict";
		var sr;
		for(sr in this.series)	{
			this.plotSeries(this.series[sr]);
		}	
	},
	
	graphMetrics: function()	{
		// derives scaling & offsets for charts from the data 
		"use strict";
		var sr, allData = [], metrics = {}, d, seriesLength = 0;
		for(sr in this.series)	{
			for(d in this.series[sr].data)
			{
				allData.push(this.series[sr].data[d]);
				if(this.series[sr].data.length > seriesLength){seriesLength = this.series[sr].data.length;}
			}
		}
			
		//this.metrics = [min, max, xstep, yscale, xorigin, yorigin, width, height, seriesLength];
		metrics.min =  Math.floor(Math.min.apply(Math, allData));
		metrics.max =  Math.ceil(Math.max.apply(Math, allData));
		metrics.width =  this.width - (this.topLeftX * 2);		
		metrics.height =  this.height - (this.topLeftY + this.bottomPadding);
		metrics.xstep =  Math.round(metrics.width * 100 / seriesLength) / 100;
		metrics.yscale = (metrics.height - (2 * this.graphPadding)) / (metrics.max - metrics.min);				
		metrics.xorigin =  this.topLeftX;
		metrics.yorigin =  this.topLeftY;
		metrics.seriesLength =  seriesLength;
		return metrics;
	},
	
	addSeries: function(name, title, units, color, data, yoffset)	{
		"use strict";
		this.series[name] = [];
		this.series[name].data = data;
		this.series[name].title = title;
		this.series[name].units = units;	
		this.series[name].color = color;
		this.series[name].yoffset = yoffset;		
	},
	
	dropSeries: function(name){"use strict"; delete this.series[name];},
	
	render: function()	{
		"use strict";
		// Main chart rendering method 
		this.plot("solid");
		this.svg_source+= '</svg>';
		this.element.innerHTML = this.svg_source;		
	},
	
	getSource: function() {
		"use strict";
		this.plot("solid");
		this.svg_source+= '</svg>';
		return this.svg_source;
	},
	
	objectSize: function(obj)	{
		"use strict";
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {size++;}
		}
		return size;
	},

	addGradient: function(id, x1, y1, x2, y2, color1, color2)	{
		"use strict";
		var gradSVG, col1, col2;
		col1 = this.hexToRGB(color1);
		col2 = this.hexToRGB(color2);
		gradSVG = '<linearGradient id="' + id + '" x1="' + x1 + '%" y1="' + y1 +'%" x2="' + x2 + '%" y2="' + y2 + '%">';
		gradSVG+= '		<stop offset="0%" style="stop-color:rgb(' + col1 + ');stop-opacity:1" />';	
		gradSVG+= '		<stop offset="100%" style="stop-color:rgb(' + col2 + ');stop-opacity:1" />';
		gradSVG+= '	  </linearGradient>';
		return gradSVG;
	},
	
	hexToRGB: function(color)	{
		"use strict";
		if(color.charAt(0) === "#") {color = color.replace("#", '');}
		var rgb = [];
		if(color.length === 6)	{
			rgb = [parseInt(color.substring(0,2),16), parseInt(color.substring(2,4),16), parseInt(color.substring(4,6),16)];
		}
		if(color.length === 3)	{
			rgb = [parseInt(color.charAt(0),16), parseInt(color.charAt(1),16), parseInt(color.charAt(2),16)];
		}
		if(color.length < 3 || color.length > 6) {rgb =[0,0,0];}	// black if it's not a valid triplet
		return rgb;
	}	
};
