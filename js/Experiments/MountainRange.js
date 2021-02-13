class MountainRange extends RenderShape {
    constructor(){
        //////////// Generate points:
        const width = game.view.size.w;
        const offset = -width/2;
        const pts = [];
        pts.push(vec2(offset - 50,-100));
        for(var x=0,i=0,y=0; true; i++){
            y = Maths.rand(25, 50) * ((i%2==0) ? 1 : -1);
            x += Maths.rand(150, 250);
            pts.push(vec2(offset + x, y));
            if(x > width && (i%2==0)) break;
        }
        pts.push(vec2(offset + x  , y + 150));
        pts.push(vec2(offset - 50 , y + 150));

        //////////// Call super constructor:
        super(pts);

        this.vel =  10;
    }
    update(){

        this.vel += 20 * game.time.dt;

        this.transform.position.x = game.view.size.w/2;
        this.transform.position.y += this.vel * game.time.dt;
        const p = this.transform.position.y / game.view.size.h;
        this.transform.scale.x = 1 + p * .5;
        this.transform.scale.y = .1 + p * 2;
        this.color = Color.HSV(200, 50, p * 100);

        if(p > 1) this.gameObject.destroy();
    }
}