import { Utils, MemoryCanvasProvider } from './utils'
import Bullet from './bullet'

let Tracer = function(screen_ctx, game_api, x, y, angle=0, id=false, canvas_provider=MemoryCanvasProvider) {
	let speed = 500;
	let max_ammo = 30;
	let ammo = max_ammo;
	let between_shots_time = 0.05;
	let current_shot_delay = 0;
	let reload_time = 2;
	let reload_time_left = 0;
	let bullets = [];
	let max_hp = 100;
	let hp = max_hp;
	let width = 16;
	let height = 40;
	let changes = {};
	let viewport = canvas_provider.get(100, 100, angle);

	draw_buffer();

	function draw() {
		screen_ctx.drawImage(viewport.canvas, x - viewport.width / 2, y - viewport.height / 2);
		bullets.forEach(bullet => bullet.draw());
	}

	function draw_buffer() {
		if (!viewport.ctx)
			return;
		viewport.ctx.clearRect(-viewport.width/2, -viewport.height/2, viewport.width, viewport.height);
		viewport.ctx.fillStyle="#"+Math.round((1 - hpPercentage()) * 255).toString(16).pad('0', 2)+'0000';
		viewport.ctx.fillRect(-width/2, -height/2, width, height);
		viewport.ctx.fillRect(-24, -2, 16, 4);
		//viewport.ctx.fillRect(-24, height/2-4, 16, 4);
	}

	function rotate(a) {
		let diff = a - angle;
		if (diff) {
			angle = a;
			if (viewport.ctx) {
				viewport.ctx.rotate(diff);
			}
			addChange({angle: angle.toFixed(3)});
		}
	}

	function update_delays(dt) {
		current_shot_delay = Math.max(0, current_shot_delay - dt);
		let reload_time_left_prev = reload_time_left;
		reload_time_left = Math.max(0, reload_time_left - dt);
		if (reload_time_left === 0 && reload_time_left_prev > 0)
			ammo = max_ammo;
	}

	function update(dt) {
		update_delays(dt);
	}

	function move(add_angle, dt) {
		let x_speed = speed * dt * Math.cos(angle + add_angle);
		let y_speed = speed * dt * Math.sin(angle + add_angle);
		x -= x_speed;
		y -= y_speed;
		addChange({x: Math.round(x), y: Math.round(y)}, false);
	}

	function blink(angle) {
		move(angle, 0.3);
	}

	function reload() {
		if (ammo < max_ammo) {
			reload_time_left = reload_time;
			addChange({reload: true});
		}
	}

	function shoot() {
		if (current_shot_delay <= 0 && ammo > 0) {
			game_api.addBullet( Bullet(screen_ctx, this, x, y, angle) );
			current_shot_delay = between_shots_time;
			if (--ammo === 0) reload();
		}
	}

	function hpPercentage() {
		return hp / max_hp;
	}

	function hit(damage) {
		hp = Math.max(0, hp - damage);
	}

	function checkCollision(pos) {
		let point_angle = Utils.pointsAngle({x, y}, pos);
		let r = Utils.vectorLength({x, y}, pos);
		let rotated_pos = { x: x + r * Math.cos(point_angle + angle), y: y + r *Math.sin(point_angle + angle) };
		return Utils.isPointInsideRect(rotated_pos, getRect());
	}

	function getRect() {
		return {
			x1: x - width/2,
			x2: x + width/2,
			y1: y - height/2,
			y2: y + height/2
		}
	}

	function addChange(change, update=true) {
		changes = Object.assign(changes, change);
		if (update)
			draw_buffer();
	}

	function getChanges() {
		let result = changes;
		changes = {};
		return result;
	}

	function getData() {
		return { x, y, angle };
	}
	

	function setData(data) {
		x = data.x ? parseFloat(data.x) : x;
		y = data.y ? parseFloat(data.y) : y;
		if (data.angle) {
			rotate(parseFloat(data.angle));
		}
	}

	return {
		draw: draw,
		rotate: rotate,
		rotateToMouse: pos => rotate(Utils.pointsAngle(pos, {x, y})),
		move: move,
		blink: blink,
		reload: reload,
		shoot: shoot,
		update: update,
		getAmmo: () => ammo,
		getReloadProgress: () => (reload_time - reload_time_left) / reload_time,
		checkCollision: checkCollision,
		hit: hit,
		getMaxHp: () => max_hp,
		hpPercentage: hpPercentage,
		getAngle: () => angle,
		getRect: getRect,
		getChanges: getChanges,
		getData: getData,
		getId: () => id,
		setData: setData
	}
}

 export default Tracer;