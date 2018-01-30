import Utils from "./utils";

let Bullet = function(screen_ctx, parent, x, y, angle) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');

    let spread = 0.01;
    angle = Utils.random(angle * (1 - spread), angle * (1 + spread));
    let speed = 2000;
    let x_speed = speed * Math.cos(angle);
    let y_speed = speed * Math.sin(angle);
    let max_age = 0.5;
    let age = 0;
    let damage = 3;

    canvas.width = 100;
    canvas.height = 100;

    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(angle);
    ctx.fillStyle="#000";
    ctx.fillRect(-6,-1,12,2);

    function draw_buffer() {
        ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
        let s = "#" + Math.round((1 - powerPercentage()) * 255).toString(16).pad('0', 2).repeat(3);
        ctx.fillStyle = s;
        ctx.fillRect(-6,-1,12,2);
    }

    function draw() {
        //console.log('draw', x, y);
        draw_buffer();
        screen_ctx.drawImage(canvas, x - canvas.width / 2, y - canvas.height / 2);
    }

    function do_move(dt) {
        x -= x_speed * dt;
        y -= y_speed * dt;
        age = Math.min(max_age, age + dt);
    }
    
    function move(dt, tracers) {
        let target_delta = 0.001;
        let repeat = Math.round(dt / target_delta);
        let step = dt / repeat;
        while (repeat--) {
            do_move(step);
            for (let tracer of tracers) {
				if (tracer !== parent) {
					if (tracer.checkCollision({x, y})) {
						destroy();
						return tracer;
					}
				}
			};
        }
        return null;
    }

    function agePercentage() {
        return age / max_age;
    }

    function powerPercentage() {
        return Math.min(1, 1.2 - agePercentage());
    }

    function destroy() {
        age = max_age;
    }

    return {
        draw: draw,
        move: move,
        isAlive: () => age < max_age,
        getDamage: () => damage,
        destroy: destroy,
    }
}

export default Bullet;