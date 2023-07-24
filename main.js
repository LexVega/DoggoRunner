import {Player} from './player.js';
import {FlyingEnemy, ClimbingEnemy, GroundEnemy} from "./enemies.js";
import {InputHandler} from "./input.js";
import {Background} from "./background.js";
import {UI} from "./ui.js";
// import {Rain} from "./rain.js";

window.addEventListener('load', () => {
        const canvas = doggoRunnerCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = 900;
        canvas.height = 500;

        class Game {
            constructor(width, height) {
                //game
                this.debug = false;
                this.width = width;
                this.height = height;
                this.groundMargin = 40;
                this.speed = 0;
                this.maxSpeed = 2;
                this.fps = this.maxSpeed * 10;
                this.background = new Background(this);
                this.bgMusic = bgMusic;
                this.soundOn = false;
                this.score = 0;
                this.neededScore = 30;
                this.time = 30000;
                this.gameOver = false;
                this.minTime = 0;
                //player
                this.player = new Player(this);
                this.input = new InputHandler(this);
                //enemies
                this.enemies = [];
                this.enemyTimer = 0;
                this.enemyInterval = 1000;
                //ui
                this.fontColor = 'white';
                this.UI = new UI(this);
                //floating messages
                this.floatingMessages = [];
                //particles
                this.particles = [];
                this.maxParticles = 50;
                //rain
                // this.rainDrops = [];
                //collision
                this.collisions = [];
                //on game loaded
                this.player.currentState = this.player.states[0];
                this.player.currentState.enter();
            }
            update(frameTime){
                this.time -= frameTime;
                if (this.time <= this.minTime || this.player.lifes < 1) {
                    this.gameOver = true;
                    this.time = 0;
                }
                this.background.update();
                this.player.update(this.input.keys, frameTime);
                //enemies
                if (this.enemyTimer > this.enemyInterval) {
                    this.addEnemy();
                    this.enemyTimer = 0;
                } else
                    this.enemyTimer += frameTime;
                this.enemies.forEach(enemy => {
                    enemy.update(frameTime)
                });
                this.enemies = this.enemies.filter(enemy => !enemy.delete);
                //floating messages
                this.floatingMessages.forEach(message => {
                    message.update(frameTime)
                });
                this.floatingMessages = this.floatingMessages.filter(message => !message.hide);
                //particles
                this.particles.forEach((particle, index) => {
                    particle.update()
                });
                if (this.particles.length > this.maxParticles) {
                    this.particles.length = this.maxParticles;
                }
                this.particles = this.particles.filter(particle => !particle.hide);
                //rain
                // if (Math.random() > 0.6){
                //     this.rainDrops.push(new Rain(this));
                // }
                // this.rainDrops.forEach((drop, index) => drop.update(frameTime));
                // this.rainDrops = this.rainDrops.filter(drop => !drop.hide);

                //collision
                this.collisions.forEach((boom, index) => boom.update(frameTime));
                this.collisions = this.collisions.filter(boom => !boom.hide);
            }
            draw(context){
                this.background.draw(context);
                this.floatingMessages.forEach(message => {
                    message.draw(context);
                });
                this.particles.forEach(particle => {
                    particle.draw(context);
                });
                // this.rainDrops.forEach(drop => {
                //     drop.draw(context);
                // });
                this.collisions.forEach(boom => {
                    boom.draw(context);
                });
                this.player.draw(context);
                this.enemies.forEach(enemy => {
                    enemy.draw(context);
                });
                this.UI.draw(context);
            }
            addEnemy(){
                if (this.speed > 0 && Math.random() > 0.5)
                    this.enemies.push(new GroundEnemy(this));
                else if (this.speed > 0)
                    this.enemies.push(new ClimbingEnemy(this));
                this.enemies.push(new FlyingEnemy(this));
            }
            reloadGame(){
                if (this.input.keys.includes('reload')) {
                    this.player.lifes = 5;
                    this.player.g = 255;
                    this.player.r = 0;
                    this.score = 0;
                    this.time = 30000;
                    this.player.currentEnergy = this.player.maxEnergy;
                    this.enemies = [];
                    this.particles = [];
                    this.collisions = [];
                    this.player.x = 15;
                    this.player.y = this.player.height + this.height + this.groundMargin;
                    this.player.setState(0, 0);
                    this.gameOver = false;

                }
            }
        }

        const game = new Game(canvas.width, canvas.height);
        let lastTime = 0;
        game.draw(ctx);
        window.addEventListener('click', (click) => {
            game.UI.toggleSound(click.offsetX, click.offsetY);
        })


        const animate = (timeStamp) => {
            const frameTime = timeStamp - lastTime;
            lastTime = timeStamp;
            ctx.clearRect(0,0, canvas.width, canvas.height);
            if (!game.gameOver) {
                game.update(frameTime);
            } else {
                if (game.input.keys.includes('reload')) {
                    game.reloadGame();
                }
            }
            game.UI.update();
            game.draw(ctx);
            requestAnimationFrame(animate);
        };
        animate(0);
})