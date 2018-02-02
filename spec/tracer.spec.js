import Tracer from "../src/tracer"
import { FakeCanvasProvider, FakeGameApi, Utils } from "../src/utils"

describe("Tracer", function() {
	const x = 100;
	const y = 100;
	const angle = 0;
	const id = 101;

	beforeEach(function(){
		this.game_api = FakeGameApi();
		this.tracer = Tracer(null, this.game_api, x, y, angle, id, FakeCanvasProvider);
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

	function testMovement(tracer) {
		let changes = tracer.getChanges();
		expect(changes).not.toEqual({});
		expect(changes.x != x || changes.y != y).toBe(true);
	}

	it("should move and add a change", function () {
		this.tracer.move(0, 0.01);
		testMovement(this.tracer);
	});

	it("should blink and add a change", function () {
		this.tracer.blink(Math.PI);
		testMovement(this.tracer);
	});

	it("should return ammo count", function(){
		let ammo = this.tracer.getAmmo();
		expect(ammo).toEqual(jasmine.any(Number));
		expect(ammo > 0).toBe(true);
	});

	it("should shoot", function(){
		let max_ammo = this.tracer.getAmmo();
		this.tracer.shoot();
		expect(this.tracer.getAmmo()).toBe(max_ammo - 1);
		expect(this.game_api.bullets.length).toBe(1);
	});

	it("should not shoot several times in a row", function(){
		let max_ammo = this.tracer.getAmmo();
		this.tracer.shoot();
		this.tracer.shoot();
		this.tracer.shoot();
		expect(this.tracer.getAmmo()).toBe(max_ammo - 1);
		expect(this.game_api.bullets.length).toBe(1);
	});

	it("should be reloaded at the beginning", function () {
		expect(this.tracer.getReloadProgress()).toBe(1);
	});

	it("should reload", function () {
		this.tracer.shoot();
		this.tracer.reload();
		expect(this.tracer.getReloadProgress() < 1).toBe(true);
		let changes = this.tracer.getChanges();
		expect(changes).not.toEqual({});
		expect(changes.reload).toBe(true);
	});

	it("should update its state", function () {
		let max_ammo = this.tracer.getAmmo();
		this.tracer.shoot();
		this.tracer.reload();
		this.tracer.update(999);
		expect(this.tracer.getReloadProgress()).toBe(1);
		expect(this.tracer.getAmmo()).toBe(max_ammo);
	});

	it("shoud detect collisions", function () {
		expect(this.tracer.checkCollision({x: 10, y: 10})).toBe(false);
		expect(this.tracer.checkCollision({x: x+1, y: y+1})).toBe(true);
	});

	it("should be with full health at the beginning", function () {
		expect(this.tracer.hpPercentage()).toBe(1);
	});

	it("should return max hp", function(){
		let max_hp = this.tracer.getMaxHp();
		expect(max_hp).toEqual(jasmine.any(Number));
		expect(max_hp > 0).toBe(true);
	});

	it("should take damage when hit", function () {
		let max_hp = this.tracer.getMaxHp();
		let damage_percent = 0.5;
		this.tracer.hit(max_hp * damage_percent);
		expect(this.tracer.hpPercentage()).toBe(damage_percent);
	});

	it("should return the shape rect", function () {
		let rect = this.tracer.getRect();
		expect(rect.x1).toEqual(jasmine.any(Number));
		expect(rect.x2).toEqual(jasmine.any(Number));
		expect(rect.y1).toEqual(jasmine.any(Number));
		expect(rect.y2).toEqual(jasmine.any(Number));
	});

	it("should have no changes in the beginning", function () {
		expect(this.tracer.getChanges()).toEqual({});
	});

	it("should return the viable data about itself", function () {
		let data = this.tracer.getData();
		expect(data.x).toEqual(jasmine.any(Number));
		expect(data.y).toEqual(jasmine.any(Number));
		expect(data.angle).toEqual(jasmine.any(Number));
	});

	it("should return its id", function () {
		expect(this.tracer.getId()).toBe(id);
	});

	it("should accept changes", function () {
		let a = Math.PI / 2;
		this.tracer.setData({angle: a});
		expect(this.tracer.getAngle()).toBe(a);
		expect(this.tracer.getData().angle).toBe(a);
	})
});