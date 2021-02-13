class Sprite {
    constructor(url){
        this.img = new Image();
        this.img.src = url;
        this.img.addEventListener("load", ()=>{
            this.anchor.x = this.img.width/2;
            this.anchor.y = this.img.height/2;
        });
        
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.scale = vec2(1,1);
        this.anchor = {x:0, y:0};
    }
    draw (){
        gfx.translate(this.x, this.y);
        gfx.rotate(0);
        gfx.scale(this.scale.x, this.scale.y);
        gfx.drawImage(this.img, -this.anchor.x, -this.anchor.y);
        gfx.endTransform();
    }
}