let Utils = {
	pointsAngle: function(p1, p2) {
		return Math.atan2(p2.y - p1.y, p2.x - p1.x);
	},
	degreesToRadians: a => a / 180 * Math.PI,
	radiansToDegrees: a => a * 180 / Math.PI,
	random: (min, max) => Math.random() * (max - min) + min,
	vectorLength: (p1, p2) => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2),
	isPointInsideRect: function(p, rect) {
		if (rect.x1 <= p.x &&
			rect.x2 >= p.x &&
			rect.y1 <= p.y &&
			rect.y2 >= p.y) 
			return true;
		return false;
	}
};

let Vector2 = function(x, y){
	function add(prop, val) {
		if (Number.isFinite(val))
			this[prop] += val;
	}

	function addNumbers(obj) {
		add.call(this, 'x', obj.x);
		add.call(this, 'y', obj.y);
	}

	return {
		x, y,
		addNumbers: addNumbers
	}
}

let MemoryCanvasProvider = {
	get(width=0, height=0, angle=0, center_x=0.5, center_y=0.5) {
		let canvas = document.createElement("canvas");
		let ctx = canvas.getContext('2d');
		canvas.width = width;
		canvas.height = height;
		ctx.translate(canvas.width*center_x,canvas.height*center_y);
		ctx.rotate(angle);
		return {
			canvas, ctx, width, height
		};
	}
}

let FakeCanvasProvider = {
	get() {
		return {
			canvas: null, ctx: null, width: null, height: null
		}
	}
}

let fake_game_api = {
	addBullet: 1,
}

Object.prototype.isEmpty = function() {
	return !Object.keys(this).length;
}
String.prototype.pad = function(content, size) {
	var s = String(this);
	while (s.length < (size || 1)) {s = content + s;}
	return s;
}

export { Utils, Vector2, MemoryCanvasProvider, FakeCanvasProvider, fake_game_api };
export default Utils;