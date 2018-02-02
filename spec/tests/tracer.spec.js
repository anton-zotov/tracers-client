import Tracer from "../../src/tracer"
import { FakeCanvasProvider, fake_game_api, Utils } from "../../src/utils"

describe("Tracer", function() {
	const x = 100;
	const y = 100;
	const angle = 0;
	const id = 101;

	beforeEach(function(){
		this.tracer = Tracer(null, fake_game_api, x, y, angle, id, FakeCanvasProvider);
	});

	it("should return its angle", function () {
		expect(this.tracer.getAngle()).toBe(0);
	});		

	it("should rotate", function () {
		this.tracer.rotate(Math.PI);
		expect(this.tracer.getAngle()).toBe(Utils.degreesToRadians(180));
	});

	it("should rotate to mouse", function () {
		this.tracer.rotateToMouse({x:0, y:0});
		expect(this.tracer.getAngle()).toBe(Utils.degreesToRadians(45));
	});
});