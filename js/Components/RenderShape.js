class RenderShape extends GameComponent {
    #pts = [];
    #color = "#FFF";
    constructor(pts, color="#CCE"){
        super();
        this.#pts = (Array.isArray(pts)) ? pts : [];
        this.#color=color;
    }
    draw(){
        if(this.#pts.length == 0) return;
        const gfx = Game.gfx;

        gfx.beginPath();
        gfx.moveTo(this.#pts[0].x, this.#pts[0].y);
        this.#pts.forEach(pt => gfx.lineTo(pt.x, pt.y));
        gfx.closePath();
        
        gfx.fillStyle=this.#color;
        gfx.fill();
    }
}