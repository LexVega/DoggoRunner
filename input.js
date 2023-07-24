export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        this.keyHandler = (key) => {
            // console.log(this.keys)
            if (key === 'ArrowUp' || key === 'w' || key === 'W') return 'up';
            else if (key === 'ArrowLeft' || key === 'a' || key === 'A') return 'left';
            else if (key === 'ArrowDown' || key === 's' || key === 'S') return 'down';
            else if (key === 'ArrowRight' || key === 'd' || key === 'D') return 'right';
            else if (key === 'Enter') return 'spMove';
            else if (key === ' ') return 'attack';
            else if (key === 'j' || key === 'J') return 'debug';
            else if (key === 'r' || key === 'R') return 'reload';
            else if (key === 'm' || key === 'M') return 'toggleSound';
            else return false;
        }
        window.addEventListener('keydown', ev => {
            this.keyP = this.keyHandler(ev.key)
            if (this.keyP && this.keys.indexOf(this.keyP) === -1){
                this.keys.push(this.keyP);
            }
        })
        window.addEventListener("keyup", ev => {
            this.keyR = this.keyHandler(ev.key)
            if (this.keyR){
                this.keys.splice(this.keys.indexOf(this.keyR), 1);
            }
            if (this.keyR === 'debug') this.game.debug = !this.game.debug;
            if (this.keyR === 'toggleSound') this.game.soundOn = !this.game.soundOn;
        })
    }
}