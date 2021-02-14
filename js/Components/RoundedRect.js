class RoundedRect extends GameComponent {
    constructor(radius = 5, color="#CCE"){
        super();
        
        this.radius=radius;
        this.color=color;
    }
    draw(){

        gfx.fillStyle=this.color;

        const radius = this.radius;
        const r = this.transform.rect;

        gfx.beginPath();

        gfx.moveTo(r.x + radius, r.y);
        gfx.lineTo(r.x + r.w - radius, r.y);
        gfx.quadraticCurveTo(r.x + r.w, r.y, r.x + r.w, r.y + radius);
        gfx.lineTo(r.x + r.w, r.y + r.h - radius);
        gfx.quadraticCurveTo(r.x + r.w, r.y + r.h, r.x + r.w - radius, r.y + r.h);
        gfx.lineTo(r.x + radius, r.y + r.h);
        gfx.quadraticCurveTo(r.x, r.y + r.h, r.x, r.y + r.h - radius);
        gfx.lineTo(r.x, r.y + radius);
        gfx.quadraticCurveTo(r.x, r.y, r.x + radius, r.y);

        gfx.closePath();
        gfx.fill();
    }
}