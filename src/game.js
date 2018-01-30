import { Utils, Vector2 } from './utils'
import Tracer from './tracer'
import Bullet from './bullet'
import Client from './client'

let Game = function(canvas) {
	let canvas_ctx = canvas.getContext('2d');
	let mouse_pos = {x: 0, y: 0}
	let keys_pressed = new Set();
	let keys_not_released = new Set();
	let bullets = [];
	let tracers = [];
	let client = Client('http://127.0.0.1:16217');

	client.bind('tracer_create', function(data) {
		createTracer(data);
		console.log("tracer_player connected!", data);
	});

	client.bind('init_world', function(data) {
		//tracers.push( Tracer(canvas_ctx, game_api, data.x, data.y, data.angle) );
		data.tracers.forEach(createTracer);
		console.log("init_world", data);
	});

	client.bind('tracer_disconnect', function(id) {
		tracers = tracers.filter(tr => tr.getId() !== id);
		console.log("tracer_disconnect", id);
	});

	client.bind('tracer_update', function(data) {
		let tracer = tracers.find(tr => tr.getId() === data.id);
		if (tracer) {
			tracer.setData(data);
		}
	});

	canvas.onmousemove = e => {
		let rect = canvas.getBoundingClientRect();
		mouse_pos = {x: e.clientX - rect.left, y: e.clientY - rect.top}
	}

	function createTracer(data) {
		tracers.push( Tracer(canvas_ctx, game_api, data.x, data.y, parseFloat(data.angle), data.id) );
	}

	function getKey(e) {
		switch (e.button) {
			case 0: 
				return 'lmb';
			case 1:
				return 'wmb';
			case 2:
				return 'rmb';
		}
	}

	function onKeyDown(key) {
		keys_pressed.add(key.toLowerCase());
	}

	function onKeyUp(key) {
		keys_pressed.delete(key.toLowerCase());
		keys_not_released.delete(key.toLowerCase());
	}

	window.onkeydown = e => onKeyDown(e.key);
	window.onkeyup = e => onKeyUp(e.key);
	canvas.onmousedown = e => onKeyDown(getKey(e));
	canvas.onmouseup = e => onKeyUp(getKey(e));
	canvas.oncontextmenu = () => false; 

	function drawGUI() {
		canvas_ctx.fillStyle="#000";
		canvas_ctx.fillText(tracer_player.getAmmo(), canvas.width / 2, canvas.height - 10);

		if (tracer_player.getReloadProgress() < 1) {
			canvas_ctx.fillStyle="#000";
			canvas_ctx.fillRect(canvas.width / 2 + 50, canvas.height - 30, 100 * tracer_player.getReloadProgress(), 20);
			canvas_ctx.strokeStyle = "red";
			canvas_ctx.strokeRect(canvas.width / 2 + 50, canvas.height - 30, 100, 20);
		}

		canvas_ctx.fillStyle="#000";
		canvas_ctx.fillRect(canvas.width / 2 - 150, canvas.height - 30, 100 * tracer_player.hpPercentage(), 20);
		canvas_ctx.strokeStyle = "red";
		canvas_ctx.strokeRect(canvas.width / 2 - 150, canvas.height - 30, 100, 20);
	}

	function draw() {
		canvas_ctx.fillStyle="#FFF";
		canvas_ctx.font = "30px Arial";
		canvas_ctx.fillRect(0, 0, canvas.width, canvas.height);
		tracers.forEach(tracer_player => tracer_player.draw());
		bullets.forEach(bullet => bullet.draw());
		drawGUI();
	}

	let prev_timestamp;
	function getDiff(timestamp) {
		let diff = 0;
		if (prev_timestamp)
			diff = (timestamp - prev_timestamp) / 1000;
		prev_timestamp = timestamp;
		return diff;
	}

	function controls(diff) {
		let move_dir = Vector2(0, 0);
		let move_map = [
			['w', Vector2(1, 0)],
			['s', Vector2(-1, 0)],
			['d', Vector2(0, 1)],
			['a', Vector2(0, -1)],
		];
		move_map.forEach(pair => {
			let [key, dir] = pair;
			if (keys_pressed.has(key))
				move_dir.addNumbers(dir);
		});
		if (move_dir.x || move_dir.y) {
			let angle = Utils.pointsAngle({x:0, y:0}, move_dir);
			tracer_player.move(angle, diff);	
			
			['shift','rmb'].forEach(key => {
				if (keys_pressed.has(key) && !keys_not_released.has(key)) {
					keys_not_released.add(key);
					tracer_player.blink(angle);
				}
			});
		}

		if (keys_pressed.has('r') && !keys_not_released.has('r')) {
			keys_not_released.add('r');
			tracer_player.reload();
		}

		if (keys_pressed.has('q') && !keys_not_released.has('q')) {
			keys_not_released.add('q');
			let rect = tracer_player.checkCollision({x:200, y:200});
			//console.log(Utils.radiansToDegrees(tracer_player.getAngle()), rect, tracer_player);
		}

		if (keys_pressed.has('lmb'))
			tracer_player.shoot();
	}

	function controlsAI() {
		tracer_comp.rotate( tracer_comp.getAngle() + 0.03 );
		tracer_comp.shoot();
	}

	function processBullets(dt) {
		bullets.forEach(bullet => {
			let hit_tracer = bullet.move(dt, tracers);
			if (hit_tracer)
				hit_tracer.hit(bullet.getDamage())
		});
		bullets = bullets.filter( bullet => bullet.isAlive());
	}

	function updateTracers(dt) {
		tracer_player.rotateToMouse(mouse_pos);
		tracers.forEach(tracer_player => tracer_player.update(dt));
	}

	function step(timestamp) {
		let dt = getDiff(timestamp);

		updateTracers(dt);
		processBullets(dt);
		controls(dt);
		//controlsAI(dt);
		draw();
		client.sendData('tracer_update', tracer_player.getChanges());

		window.requestAnimationFrame(step);
	}

	let game_api = {
		addBullet: bullet => bullets.push(bullet),
	}

	let tracer_player = Tracer(canvas_ctx, game_api, Utils.random(100, 800), Utils.random(100, 500), 0);
	client.sendData('tracer_create', tracer_player.getData());
	let tracer_comp = Tracer(canvas_ctx, game_api, 800, 300, 0);
	tracers.push(tracer_player);

	window.requestAnimationFrame(step);
};

export default Game;