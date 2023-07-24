export class FloatingMessages {
    constructor(fontColor, value, x, y, targetX, targetY){
        this.value = value;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.hide = false;
        this.opacity = 1;
        this.fontSize = 30;
        this.fontColor = fontColor;
        this.fontFamily = 'Creepster';
    }
    update(){
        this.x += (this.targetX - this.x) * 0.02;
        this.y += (this.targetY - this.y) * 0.02;
        this.opacity -= 0.01;
        if (this.opacity < 0) this.hide = true;

    }
    draw(context){
        context.save();
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.globalAlpha = `${this.opacity}`
        context.fillStyle = 'black';
        context.fillText(this.value, this.x+2, this.y+2)
        context.fillStyle = this.fontColor;
        context.fillText(this.value, this.x, this.y)
        context.restore();

    }
}