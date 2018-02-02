import Bullet from "../../src/bullet";
import { FakeCanvasProvider } from "../../src/utils";


describe("Bullet", function() {
	beforeEach(function(){
		this.bullet = Bullet(null, null, 100, 100, 0, FakeCanvasProvider);
	});

	it("should be alive at the beginning", function () {
		expect(this.bullet.isAlive()).toBe(true);
	});

	it("should be alive at the beginning", function () {
		expect(this.bullet.isAlive()).toBe(true);
	});

	it("should move", function () {
		expect(this.bullet.move(0.001, [])).toBe(null);
		expect(this.bullet.isAlive()).toBe(true);
	});

	it("should die after a while", function () {
		expect(this.bullet.move(0.001, [])).toBe(null);
		expect(this.bullet.isAlive()).toBe(true);
		expect(this.bullet.move(99, [])).toBe(null);
		expect(this.bullet.isAlive()).toBe(false);
	});

	it("should return its damage", function () {
		expect(this.bullet.getDamage()).toEqual(jasmine.any(Number));
	});
});