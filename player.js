import {Sitting, Running, Jumping, Falling, Rolling, Diving, Hit} from "./playerStates.js";
import {Collision} from "./collision.js";
import {FloatingMessages} from "./floatingMessages.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.image = player;
        this.jumpSound = jumpSound;
        this.getHitSound = getHitSound;
        this.killEnemySound = killSound;
        this.rollingSound = rollingSound;
        this.landingSound = landingSound;
        this.width = 100;
        this.height = 91.3;
        this.maxLifes = 5;
        this.lifes = this.maxLifes;
        this.maxEnergy = 200;
        this.currentEnergy = this.maxEnergy;
        this.energyModifier = 1;
        this.energyRequited = 30;
        this.x = 15;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.horizontalVelocity = 0;
        this.maxHorizontalVelocity = 5;
        this.verticalVelocity = 0;
        this.maxVerticalVelocity = 18;
        this.weight = 0.5;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 5;
        this.fps = this.game.fps;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.states = [
            new Sitting(this.game),
            new Running(this.game),
            new Jumping(this.game),
            new Falling(this.game),
            new Rolling(this.game),
            new Diving(this.game),
            new Hit(this.game),
        ];
        this.currentState = null;
        this.xStartHitModifier = 15;
        this.xEndHitModifier = 20;
        this.yStartHitModifier = 20;
        this.yEndHitModifier = 20;
        //initial energy colors
        this.r = 0;
        this.g = 255;
        this.b = 0;
        this.colorK = Number((255 / this.maxEnergy).toFixed(3));
    }
    update(input, frameTime){
        this.currentState.handleInput(input)
        //horizontal movement
        this.x += this.horizontalVelocity;
        if (input.includes('right') && this.currentState !== this.states[6])
            this.horizontalVelocity = this.maxHorizontalVelocity;
        else if (input.includes('left') && this.currentState !== this.states[6])
            this.horizontalVelocity = -this.maxHorizontalVelocity;
        else this.horizontalVelocity = 0;
        //horizontal bounds
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        //vertical movement
        this.y += this.verticalVelocity;
        if (!this.onGround())
            this.verticalVelocity += this.weight;
        else {
            this.verticalVelocity = 0;
            this.weight = 0.5
        }
        //vertical bounds
        if (this.y > this.game.height - this.game.groundMargin - this.height)
            this.y = this.game.height - this.game.groundMargin - this.height;
        //sprite animation
        if (this.frameTimer >= this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX ++;
            else this.frameX = 0;
        } else
            this.frameTimer += frameTime;
        //hitbox and energy changes
        if (this.currentState === this.states[0]) {
            this.yStartHitModifier = 30;
            this.yEndHitModifier = 30;
            if (this.currentEnergy < this.maxEnergy){
                this.currentEnergy += this.energyModifier * 2;
                if (this.g < 255) this.g += this.colorK * 2;
                else this.g = 255;
                if (this.r > 0) this.r -= this.colorK * 2;
                else this.r = 0;
            }
            else
                this.currentEnergy = this.maxEnergy;
        } else if (this.currentState === this.states[1]) {
            this.yStartHitModifier = 25;
            this.yEndHitModifier = 35;
            if (this.currentEnergy < this.maxEnergy){
                this.currentEnergy += this.energyModifier;
                if (this.g < 255) this.g += this.colorK;
                else this.g = 255;
                if (this.r > 0) this.r -= this.colorK;
                else this.r = 0;
            }
            else
                this.currentEnergy = this.maxEnergy;
        } else if (this.currentState === this.states[4]){
            if (this.currentEnergy > 0) {
                this.currentEnergy -= this.energyModifier;
                if (this.g > 0) this.g -= this.colorK;
                else this.g = 0;
                if (this.r < 255) this.r += this.colorK;
                else this.r = 255;
                this.yStartHitModifier = 40;
                this.yEndHitModifier = 50;
                this.xStartHitModifier = 30;
                this.xEndHitModifier = 60;
            }
        } else if (this.currentState === this.states[5]){
            if (this.currentEnergy > 0){
                this.currentEnergy -= this.energyModifier;
                if (this.g > 0) this.g -= this.colorK;
                else this.g = 0;
                if (this.r < 255) this.r += this.colorK;
                else this.r = 255;
            }
            this.yStartHitModifier = 30;
            this.yEndHitModifier = 30;
            this.xStartHitModifier = 15;
            this.xEndHitModifier = 30;
        } else {
            if (this.currentEnergy < this.maxEnergy){
                this.currentEnergy += this.energyModifier;
                if (this.g < 255) this.g += this.colorK;
                else this.g = 255;
                if (this.r > 0) this.r -= this.colorK;
                else this.r = 255;
            }
            this.xStartHitModifier = 20;
            this.xEndHitModifier = 25;
            this.yStartHitModifier = 20;
            this.yEndHitModifier = 20;
        }
        this.xHitStart = this.x + this.xStartHitModifier;
        this.xHitEnd = this.width - this.xEndHitModifier;
        this.yHitStart = this.y + this.yStartHitModifier;
        this.yHitEnd = this.height - this.yEndHitModifier;

        if (this.currentEnergy <= 0){
        this.game.floatingMessages.push(new FloatingMessages('orange', 'Out of energy',
            (this.x + this.width) * 0.5, this.y,  (this.x + this.width) * 0.5, this.y - 50))
        }
        //collision
        this.checkCollision();
    }
    draw(context){
        //hitboxes
        if (this.game.debug){
            context.strokeRect(this.xHitStart, this.yHitStart,
                this.xHitEnd, this.yHitEnd);
        }
        //energy bar
        context.beginPath();
        context.strokeStyle = 'black';
        context.roundRect(this.x, this.y, this.maxEnergy * 0.5, 10, 4);
        context.stroke();
        context.closePath();
        context.beginPath();
        context.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
        context.roundRect(this.x, this.y, this.currentEnergy * 0.5, 10, 4);
        context.fill();
        context.closePath();

        //player sprite
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height,
            this.x, this.y, this.width, this.height );
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = speed * this.game.maxSpeed;
        this.currentState.enter();
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if (enemy.x < this.xHitStart + this.xHitEnd &&
                enemy.x + enemy.width > this.xHitStart &&
                enemy.y < this.yHitStart + this.yHitEnd &&
                enemy.y + enemy.height > this.yHitStart
            ){
                enemy.delete = true;
                this.game.collisions.push(new Collision(this.game,
                    enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
                if (this.currentState === this.states[4] || this.currentState === this.states[5]){
                    if (this.game.soundOn){
                        this.killEnemySound.currentTime = 0;
                        this.killEnemySound.play();
                    }
                    this.game.score ++;
                    this.game.floatingMessages.push(new FloatingMessages(this.game.fontColor, '+1',
                        enemy.x, enemy.y, this.game.width - 50, 30))
                }
                else {
                    if (this.currentState !== this.states[6]){
                        this.setState(6, 0);
                        this.lifes--;
                        if (this.game.soundOn){
                            this.getHitSound.currentTime = 0;
                            this.getHitSound.play();
                        }
                        this.game.floatingMessages.push(new FloatingMessages('red', '-1',
                            enemy.x, enemy.y,  50, 30))
                    }
                }
            }
        });
    };
}