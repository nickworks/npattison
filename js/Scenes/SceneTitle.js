class SceneTitle extends Scene {
    constructor(){
        
        super();

        this.panel = Factory.Empty(vec2(20,-20),vec2(0,1));
        this.panel.transform.rect.w=200;
        this.panel.transform.rect.h=50;
        
        this.objs.add(this.panel);
        
        var hello = Factory.TextField("Hello world!",vec2(0,-20),vec2(0,0), Font.big);
        hello.transform.parent = this.panel.transform;
        
        this.objs.add(Factory.Particles(Data.lorem.img, vec2(0,-700), vec2(.5,1)));
        
        this.objs.add(Factory.RoundRect(10, "rgba(0,0,0,.9)", vec2(-120,20), vec2(1,0), vec2(100,50)));

        this.delayUntilSpawnMountain = 0;
        
        //this.cam.goals.x = this.cam.vals.x = game.view.size.w/2;
        //this.cam.goals.y = this.cam.vals.y = 0;//game.view.size.h/2;// + Math.sin(game.time.now) * 100;
        
        
        this.color=Color.HSV(200,50,25);

    }
    update(){

        this.delayUntilSpawnMountain -= game.time.dt;
        if(this.delayUntilSpawnMountain <= 0) this.makeNextRange();


        //this.cam.goals.x = this.cam.vals.x = game.view.size.w/2;
        //this.cam.goals.y = this.cam.vals.y = game.view.size.h/2;

        super.update();
    }
    makeNextRange(){
        
        this.delayUntilSpawnMountain = Maths.rand(.5,1);

        const obj = Factory.Empty(vec2(0,0),vec2(.5,1));
        obj.addComponent( new MountainRange() );

        this.objs.addAtBack(obj);

    }
}