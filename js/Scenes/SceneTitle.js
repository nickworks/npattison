class SceneTitle extends Scene {
    constructor(){
        
        super();


        this.add ( Factory.TextField("Howdy!", vec2(0,0), vec2(0,.5)) );
        this.obj1 = this.add ( Factory.Sprite("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png", vec2(0,0), vec2(.5,.5)));
        this.obj2 = Factory.Sprite("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png", vec2(-100, 0), vec2(0, 0));
        this.obj3 = Factory.Sprite("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png", vec2(100, 0), vec2(1,.5));
        
        this.obj2.transform.parent = this.obj1.transform;
        this.obj3.transform.parent = this.obj1.transform;

        this.obj1.transform.angle = 1;

        this.cam.goals.x = this.cam.vals.x = game.view.size.w/2;
        this.cam.goals.y = this.cam.vals.y = game.view.size.h/2;

    }
    update(){

        if(this.obj2) this.obj2.transform.angle+=1*game.time.dt;
        if(this.obj1) this.obj1.transform.position.x=Math.sin(game.time.now/1000)*200;

        this.cam.goals.x = this.cam.vals.x = game.view.size.w/2;
        this.cam.goals.y = this.cam.vals.y = game.view.size.h/2;
        super.update();
    }
    draw(){
        super.draw();
        if(this.obj1){

            const m = this.obj2.transform.worldToLocal(mouse.pos());
            gfx.fillStyle = "#000";
            gfx.fillCircle(m.x, m.y, 20);
        }

    }    
    
}