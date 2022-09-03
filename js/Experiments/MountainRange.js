class MountainRange extends RenderShape {

    #vel = -200;
    #lightValue = 25;

    constructor(){
        //////////// Generate points:
        const width = Game.view.size.w;
        const offset = -width/2;
        const pts = [];
        pts.push(vec2(offset - 50,-100));
        for(var x=0,i=0,y=0; true; i++){
            y = Maths.rand(25, 50) * ((i%2==0) ? 1 : -1);
            x += Maths.rand(150, 250);
            pts.push(vec2(offset + x, y));
            if(x > width && (i%2==0)) break;
        }
        pts.push(vec2(offset + x  , y + 400));
        pts.push(vec2(offset - 50 , y + 400));

        //////////// Call super constructor:
        super(pts);
        
        //this.transform.scale = vec2(1,0);
    }
    start(){
        this.transform.scale = vec2(Maths.rand(1,1.1),Maths.rand(0,.1));
    }
    update(){

        const dt = Game.time.dt;

        this.#vel += 50 * dt;
        
        this.transform.x = 0;
        this.transform.y += this.#vel * dt;
        
        this.transform.scale.x += .2 * dt; 
        this.transform.scale.y += .5 * dt;
        
        if(this.#lightValue < 100) this.#lightValue += 5 * dt;
        this.color = Color.HSV(200, 50, this.#lightValue);
        if(this.#lightValue > 75) this.gameObject.destroy();
    }
}