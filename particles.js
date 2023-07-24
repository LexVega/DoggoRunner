import {Collision} from "./collision.js";

class Particles {
    constructor(game) {
        this.game = game;
        this.hide = false;
        this.burnedEnemies = [];
    }
    update(){
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.95;
        if (this.size < 0.5)
            this.hide = true;
    }
}

export class Dust extends Particles{
    constructor(game, x, y) {
        super(game);
        this.x = x;
        this.y = y;
        this.speedX = Math.random();
        this.speedY = Math.random();
        this.size = Math.random() * 10 + 10;
        this.color = `rgba(205,133,63,0.2)`;
    }
    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}

export class LandingSplash extends Particles{
    constructor(game, x, y) {
        super(game);
        this.x = x;
        this.y = y;
        this.speedX = Math.random() * 6 - 4;
        this.speedY = Math.random() * 2 + 2;
        this.size = Math.random() * 100 + 150;
        this.image = fire;
        this.gravity = 0;

    }
    update() {
        super.update();
        this.gravity += 0.1;
        this.y += this.gravity;
        this.game.enemies.forEach((enemy) => {
            if (enemy.x < this.x + (this.size * 0.6) &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + (this.size * 0.6) &&
                enemy.y + enemy.height > this.y
            )
                enemy.burned = true;
        });
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}

export class FireTrail extends Particles{
    constructor(game, x, y) {
        super(game);
        this.x = x;
        this.y = y;
        this.speedX = 1;
        this.speedY = 0;
        this.size = Math.random() * 100 + 50;
        this.image = fire;
        this.angle = 0;
        this.angleVelocity = Math.random() * 0.2 - 0.1;
    }
    update() {
        super.update();
        this.angle += this.angleVelocity;
    }
    draw(context){
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image, -this.size * 0.05, -this.size * 0.4, this.size, this.size)
        context.restore();

    }
}