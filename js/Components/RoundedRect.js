class RoundedRect extends GameComponent {

    static ROUND = 0;
    static SHARP = 1;
    static CHAMF = 2;

    constructor(radius = 10, color="#CCE"){
        super();
        this.radius=radius;
        this.color=color;
        this.corners={
            tl: RoundedRect.ROUND,
            tr: RoundedRect.ROUND,
            br: RoundedRect.ROUND,
            bl: RoundedRect.ROUND,
        };
    }
    
    touch(){
        this.color = "#fff";
    }
    draw(){

        gfx.fillStyle=this.color;

        const radius = this.radius;
        const r = this.transform.offset_rect;
        
        gfx.beginPath();

        gfx.moveTo(r.x + radius, r.y);
        switch(this.corners.tr){
            case RoundedRect.ROUND:
                gfx.lineTo(r.x + r.w - radius, r.y);
                gfx.quadraticCurveTo(r.x + r.w, r.y, r.x + r.w, r.y + radius);
                break;
            case RoundedRect.SHARP:
                gfx.lineTo(r.x + r.w, r.y);
                break;
            case RoundedRect.CHAMF:
                gfx.lineTo(r.x + r.w - radius, r.y);
                gfx.lineTo(r.x + r.w, r.y + radius);
                break;
        }
        switch(this.corners.br){
            case RoundedRect.ROUND:
                gfx.lineTo(r.x + r.w, r.y + r.h - radius);
                gfx.quadraticCurveTo(r.x + r.w, r.y + r.h, r.x + r.w - radius, r.y + r.h);
                break;
            case RoundedRect.SHARP:
                gfx.lineTo(r.x + r.w, r.y + r.h);
                break;
            case RoundedRect.CHAMF:
                gfx.lineTo(r.x + r.w, r.y + r.h - radius);
                gfx.lineTo(r.x + r.w - radius, r.y + r.h);
                break;
        }
        switch(this.corners.bl){
            case RoundedRect.ROUND:
                gfx.lineTo(r.x + radius, r.y + r.h);
                gfx.quadraticCurveTo(r.x, r.y + r.h, r.x, r.y + r.h - radius);
                break;
            case RoundedRect.SHARP:
                gfx.lineTo(r.x, r.y + r.h);
                break;
            case RoundedRect.CHAMF:
                gfx.lineTo(r.x + radius, r.y + r.h);
                gfx.lineTo(r.x, r.y + r.h - radius);
                break;
        }
        switch(this.corners.tl){
            case RoundedRect.ROUND:
                gfx.lineTo(r.x, r.y + radius);
                gfx.quadraticCurveTo(r.x, r.y, r.x + radius, r.y);
                break;
            case RoundedRect.SHARP:
                gfx.lineTo(r.x, r.y);
                break;
            case RoundedRect.CHAMF:
                gfx.lineTo(r.x, r.y + radius);
                gfx.lineTo(r.x + radius, r.y);
                break;
        }

        gfx.closePath();
        gfx.fill();
    }
}