class RenderCircle extends GameComponent {
    #radius = 10;
    #color = "#FFF";
    constructor(radius, color="#CCE"){
        super();
        this.#radius = radius;
        this.#color = color;
    }
    draw(){
        const gfx = Game.gfx;

        gfx.fillStyle=this.#color;
        gfx.fillCircle(0,0,this.#radius);
    }
}