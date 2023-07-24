export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 20;
        this.fontFamily = 'Creepster';
        this.marginTop = 30;
        this.marginLeft = 15;
        this.marginRight = 110;
        this.heartImage = heart;
        this.heartGrayImage = heartGray;
        this.heartImageSize = 25;
        this.soundTogglerImage = soundToggler;
        this.frameY = 0;
        this.frameX = 1;
        this.soundTogglerSize = 100;
    }
    update(){
        if (this.game.soundOn){
            this.frameX = 0;
            this.game.bgMusic.play();
            this.game.bgMusic.volume = 0.02;
            this.game.player.jumpSound.volume = 0.02;
            this.game.player.getHitSound.volume = 0.04;
            this.game.player.killEnemySound.volume = 0.15;
            this.game.player.rollingSound.volume = 0.02;
            this.game.player.landingSound.volume = 0.5;
        } else {
            this.frameX = 1;
            this.game.bgMusic.volume = 0;
            this.game.player.jumpSound.volume = 0;
            this.game.player.getHitSound.volume = 0;
            this.game.player.killEnemySound.volume = 0;
            this.game.player.rollingSound.volume = 0;
            this.game.player.landingSound.volume = 0;

        }
    }
    toggleSound(x, y){
        if (x > this.game.width - this.marginRight - this.soundTogglerSize * 0.7 &&
            x < this.game.width - this.marginRight - this.soundTogglerSize * 0.3 &&
            y > this.marginTop * 0.4 &&
            y < this.marginTop * 0.4 + this.soundTogglerSize * 0.4){
            this.game.soundOn ? this.game.soundOn = false : this.game.soundOn = true;
        }
    }
    draw(context){
        if (this.game.gameOver){
                context.fillStyle = 'rgba(0,0,0,0.2)';
                context.fillRect(0,0, this.game.width, this.game.height);
            }
        context.save();
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.fillStyle = this.game.fontColor;

        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;

        context.shadowColor = 'black';
        context.shadowBlur = 2;

        //hearts
        for (let i = 0; i < this.game.player.maxLifes; i++)
            context.drawImage(this.heartGrayImage, this.marginLeft + ((this.heartImageSize + 6) * i), this.marginTop * 0.5,
                this.heartImageSize, this.heartImageSize);
        for (let i = 0; i < this.game.player.lifes; i++)
            context.drawImage(this.heartImage, this.marginLeft + ((this.heartImageSize + 6) * i), this.marginTop * 0.5,
                this.heartImageSize, this.heartImageSize);
        //energy
        context.textAlign = 'left';
        context.fillText(`Energy: ${this.game.player.currentEnergy}`,
            this.marginLeft, this.marginTop + this.heartImageSize + 10);
        //soundToggler
        context.drawImage(this.soundTogglerImage, this.frameX * this.soundTogglerSize, this.frameY,
            this.soundTogglerSize, this.soundTogglerSize,
            this.game.width - this.marginRight - this.soundTogglerSize * 0.7,
            this.marginTop * 0.4, this.soundTogglerSize * 0.4, this.soundTogglerSize * 0.4);
        //score
        // context.textAlign = 'right';
        context.fillText(`Score: ${this.game.score}/${this.game.neededScore}`,
            this.game.width - this.marginRight, this.marginTop, this.marginRight);
        //timer
        context.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
        context.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)}`,
            this.game.width - this.marginRight, this.marginTop + 20, this.marginRight);
        //gameOver messages
        if (this.game.gameOver){
            context.textAlign = 'center';
            context.font = `${this.fontSize * 2}px ${this.fontFamily}`;
            if (this.game.score >= this.game.neededScore){
                context.fillStyle = 'green';
                context.fillText(`Congrats!`,
                    this.game.width * 0.5, this.game.height * 0.5 - this.marginTop, 400);
                context.font = `${this.fontSize * 1.5}px ${this.fontFamily}`;
                context.fillStyle = this.game.fontColor;
                context.fillText(`You've won, what a champ!`,
                    this.game.width * 0.5, this.game.height * 0.5 + this.marginTop, 400);
                context.fillText(`Press R to play again`,
                    this.game.width * 0.5, this.game.height * 0.5 + 10 + this.marginTop * 2, 400);
            }
            else if (this.game.player.lifes <= 0 ){
                context.fillText(`Game over`,
                    this.game.width * 0.5, this.game.height * 0.5 - this.marginTop, 400);
                context.font = `${this.fontSize * 1.5}px ${this.fontFamily}`;
                context.fillText(`Bitten to death, better luck next time!`,
                    this.game.width * 0.5, this.game.height * 0.5 + this.marginTop, 400);
                context.fillText(`Press R to try again`,
                    this.game.width * 0.5, this.game.height * 0.5 + 10 + this.marginTop * 2, 400);
            }
            else {
                context.fillText(`Game over`,
                    this.game.width * 0.5, this.game.height * 0.5 - this.marginTop, 400);
                context.font = `${this.fontSize * 1.5}px ${this.fontFamily}`;
                context.fillText(`Time is up, better luck next time!`,
                    this.game.width * 0.5, this.game.height * 0.5 + this.marginTop, 400);
                context.fillText(`Press R to try again`,
                    this.game.width * 0.5, this.game.height * 0.5 + 10 + this.marginTop * 2, 400);
            }
        }
        context.restore();
    }

}