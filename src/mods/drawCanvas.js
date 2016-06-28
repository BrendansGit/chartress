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