import {Dust, FireTrail, LandingSplash} from "./particles.js";

const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6,
}

class State {
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

export class Sitting extends State {
    constructor(game) {
        super('SITTING', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 4;
        this.game.player.frameY = 5;
    }
    handleInput(input){
        if (input.includes('left') ||
            input.includes('right')){
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes('up'))
            this.game.player.setState(states.JUMPING, 1);
        else if (input.includes('attack'))
            this.game.player.setState(states.ROLLING, 2);
    }
}

export class Running extends State {
    constructor(game) {
        super('RUNNING', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 8;
        this.game.player.frameY = 3;
    }
    handleInput(input){
        this.game.particles.unshift(new Dust(this.game,
            this.game.player.x + this.game.player.width * 0.5,
            this.game.player.y + this.game.player.height));
        if (input.includes('down') ){
            this.game.player.setState(states.SITTING, 0);
        } else if (input.includes('up'))
            this.game.player.setState(states.JUMPING, 1);
        else if (input.includes('attack') &&
        this.game.player.currentEnergy > this.game.player.energyRequited)
            this.game.player.setState(states.ROLLING, 2);
    }
}

export class Jumping extends State {
    constructor(game) {
        super('JUMPING', game);
    }
    enter(){
        if (this.game.player.onGround()){
            this.game.player.verticalVelocity -= this.game.player.maxVerticalVelocity;
        }
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 1;
        if (this.game.soundOn){
            this.game.player.jumpSound.currentTime = 0;
            this.game.player.jumpSound.play();
        }
    }
    handleInput(input){
        if (this.game.player.verticalVelocity > this.game.player.weight){
            this.game.player.setState(states.FALLING, 1);
        }
        else if (input.includes('attack') &&
            this.game.player.currentEnergy >= this.game.player.energyRequited)
                this.game.player.setState(states.ROLLING, 2);
        else if (input.includes('down') &&
        this.game.player.currentEnergy > this.game.player.energyRequited)
            this.game.player.setState(states.DIVING, 0)
    }
}

export class Falling extends State {
    constructor(game) {
        super('FALLING', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.frameY = 2;
        this.game.player.maxFrame = 6;
    }
    handleInput(input){
        if (this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);
        }
        else if (input.includes('down') &&
        this.game.player.currentEnergy > this.game.player.energyRequited)
            this.game.player.setState(states.DIVING, 0)
    }
}

export class Rolling extends State {
    constructor(game) {
        super('ROLLING', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.frameY = 6;
        this.game.player.maxFrame = 6;
        if (this.game.soundOn){
            this.game.player.rollingSound.currentTime = 0;
            this.game.player.rollingSound.play();
        }
    }
    handleInput(input){
        this.game.particles.unshift(new FireTrail(this.game,
            this.game.player.x, this.game.player.yHitStart));
        if (
            (!input.includes('attack') && this.game.player.onGround()) ||
            this.game.player.currentEnergy <= 0
        )
            this.game.player.setState(states.RUNNING, 1);
        else if (
            (!input.includes('attack')
            && !this.game.player.onGround()) ||
            (input.includes('attack') &&
            this.game.player.currentEnergy <= 0)
        )
            this.game.player.setState(states.FALLING, 1);
        else if (input.includes('attack') &&
            input.includes('up') && this.game.player.onGround()){
                this.game.player.verticalVelocity -= this.game.player.maxVerticalVelocity;
                if (this.game.soundOn){
                    this.game.player.jumpSound.currentTime = 0;
                    this.game.player.jumpSound.play();
                }
        }
        else if (input.includes('down') && !this.game.player.onGround())
            this.game.player.setState(states.DIVING, 0);
    }
}

export class Diving extends State {
    constructor(game) {
        super('DIVING', game);
    }
    enter(){
        if (this.game.soundOn){
            this.game.player.landingSound.currentTime = 0;
            this.game.player.landingSound.play();
        }
        this.game.player.frameX = 0;
        this.game.player.frameY = 6;
        this.game.player.maxFrame = 6;
        this.game.player.weight = this.game.player.weight * 4;
        this.game.bgMusic.playbackRate = 1;
    }
    handleInput(input){
        this.game.particles.unshift(new FireTrail(this.game,
            this.game.player.x, this.game.player.yHitStart));
        if (this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);
            for (let i = 0; i <= 30; i++){
                this.game.particles.unshift(new LandingSplash(this.game,
                this.game.player.xHitStart - this.game.player.width * 0.5, this.game.player.y));
            }
        }
        else if (input.includes('attack' ) && this.game.player.onGround())
            this.game.player.setState(states.ROLLING, 2);
    }
}

export class Hit extends State {
    constructor(game) {
        super('HIT', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.frameY = 4;
        this.game.player.maxFrame = 10;
        this.game.bgMusic.playbackRate = 1;
    }
    handleInput(input){
        if (this.game.player.frameX >= 10 && this.game.player.onGround())
            this.game.player.setState(states.RUNNING, 1);
        else if (this.game.player.frameX >= 10 && this.game.player.onGround())
            this.game.player.setState(states.FALLING, 1);
    }
}