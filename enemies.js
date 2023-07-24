import {Collision} from "./collision.js";
import {FloatingMessages} from "./floatingMessages.js";

const enemies = {
    FLY: enemy_fly,
    PLANT: enemy_plant,
    SPIDER_BIG: enemy_spider_big,
}

class Enemy {
    constructor(fps) {
        this.frameX = 0;
        this.frameY = 0;
        this.fps = fps;
        this.timeInterval =  1000 / this.fps;
        this.frameTimer = 0;
        this.delete = false;
        this.burned = false;
    }
    update(frameTime){
        //movement
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        //sprites cycle
        if (this.frameTimer > this.timeInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) {
                this.frameX ++;
            }
            else this.frameX = 0;
            //check if offscreen
            if (this.x + this.width < 0){
                this.delete = true;
            }
        } else {
            this.frameTimer += frameTime
        }
        if (this.burned){
            this.game.score++;
            this.delete = true;
            this.game.collisions.push(new Collision(this.game,
                        this.x + this.width * 0.5, this.y + this.height * 0.5));
            this.game.floatingMessages.push(new FloatingMessages(this.game.fontColor, '+1',
                this.x, this.y, this.game.width - 50, 30));
            if (this.game.soundOn){
                this.game.player.killEnemySound.currentTime = 0;
                this.game.player.killEnemySound.play();
            }
        }

    }
    draw(context){
        if (this.game.debug){
            context.strokeRect(this.x, this.y, this.width, this.height)
        }
        context.drawImage(this.image, this.frameX * this.width, 0,
            this.width, this.height,  this.x, this.y, this.width,
            this.height)
    }
}

export class FlyingEnemy extends Enemy {
    constructor(game) {
        super(game.fps);
        this.game = game;
        this.width = 60;
        this.height = 44;
        this.x = this.game.width + Math.random();
        this.y = Math.random() * (this.game.height - (this.game.groundMargin * 2));
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.maxFrame = 5;
        this.image = enemies.FLY;
        this.angle = 0;
        this.angleVelosity = Math.random() * 0.05 + 0.05;
    }
    update(frameTime) {
        super.update(frameTime);
        this.angle += this.angleVelosity;
        this.y += Math.sin(this.angle);
    }
}

export class GroundEnemy extends Enemy {
    constructor(game) {
        super(game.fps/2);
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.game.groundMargin - this.height;
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 1;
        this.image = enemies.PLANT;
    }
}

export class ClimbingEnemy extends Enemy {
    constructor(game) {
        super(game.fps);
        this.game = game;
        this.width = 120;
        this.height = 144;
        // this.x = Math.random() * this.game.width;
        this.x = this.game.width;
        // this.y = 0 - this.height;
        this.y = Math.random() * (this.game.height - this.game.groundMargin - this.height);
        this.maxY = Math.random() * (this.game.height - this.game.groundMargin - this.height);
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.maxFrame = 5;
        this.image = enemies.SPIDER_BIG;
    }

    update(frameTime) {
        super.update(frameTime);
        if (this.y > this.game.height - this.game.groundMargin - this.height
            || this.y < 0) this.speedY *= -1;
        // if (this.y < -this.height) this.delete = true;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = 'white';
        context.moveTo(this.x + (this.width / 2), 0);
        context.lineTo(this.x + (this.width / 2), (this.y + this.height / 2));
        context.stroke();
        context.closePath();
        super.draw(context);
    }

}

