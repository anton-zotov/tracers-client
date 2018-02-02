import { Utils, Vector2, MemoryCanvasProvider, FakeCanvasProvider } from "../../src/utils";

describe("Utils", function() {
	it("should convert radians to degrees", function() {
		expect(Utils.radiansToDegrees(Math.PI*2)).toBe(360);
		expect(Utils.radiansToDegrees(Math.PI)).toBe(180);
	});

	it("should convert degrees to radians", function() {
		expect(Utils.degreesToRadians(0)).toBe(0);
		expect(Utils.degreesToRadians(90)).toBe(Math.PI/2);
	});

	it("should calculate an angle in radians between two points", function() {
		let radians = Utils.pointsAngle({x:0,y:0},{x:100,y:100});
		let degrees = Utils.radiansToDegrees(radians);
		expect(degrees).toBe(45);
	});

	it("should return a random number between min and max", function(){
		const min = 57, max = 69;
		const r = Utils.random(min, max);
		expect(r >= min && r <= max).toBeTruthy();
	});

	it("should return the length of a vector", function() {
		expect(Utils.vectorLength({x:0,y:0},{x:3,y:4})).toBe(5);
	});

	it("should check if a point is inside of a rect", function(){
		const rect = {x1: 100, y1: 100,
			x2: 400, y2: 200};
		const point1 = {x: 200, y: 150};
		const point2 = {x: 200, y: 250};
		expect(Utils.isPointInsideRect(point1, rect)).toBeTruthy();
		expect(Utils.isPointInsideRect(point2, rect)).toBeFalsy();
	});
});

describe("Vector2", function() {
	const start_x = 3, start_y = 4;
	beforeEach(function(){
		this.v2 = Vector2(start_x, start_y);
	});

	it("should have x and y properties", function(){
		expect(this.v2.x).toBe(start_x);
		expect(this.v2.y).toBe(start_y);
	});

	it ("should add another vector", function(){
		const v = {x: 10, y: 20};
		this.v2.addNumbers(v);
		expect(this.v2.x).toBe(start_x + v.x);
		expect(this.v2.y).toBe(start_y + v.y);
	});
});

describe("Global augments", function(){
	it("should check if an object is empty", function(){
		expect({}.isEmpty()).toBeTruthy();
		expect({a: 100}.isEmpty()).toBeFalsy();
	});

	it ("should expand a string to the needed size with content", function(){
		expect("test".pad("!", 7)).toBe("!!!test");
		expect("test".pad("!", 3)).toBe("test");
	});
});

describe("FakeCanvasProvider", function () {
	const test = (viewport) => { it("should return a viewport object", function () {
		expect(viewport.canvas).not.toBe(undefined);
		expect(viewport.ctx).not.toBe(undefined);
		expect(viewport.canvas).not.toBe(undefined);
		expect(viewport.canvas).not.toBe(undefined);
	})};

	test(FakeCanvasProvider.get());
});