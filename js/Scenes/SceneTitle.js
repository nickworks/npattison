class SceneTitle extends Scene {
    constructor(){
        
        super();

        const tf = Factory.TextField("Hello world!",vec2(100,100),vec2(0,0),{size:30,align:"center",valign:"middle"});
        this.objs.add(tf);

        this.delayUntilSpawnMountain = 0;

        this.cam.goals.x = this.cam.vals.x = game.view.size.w/2;
        this.cam.goals.y = this.cam.vals.y = game.view.size.h/2;


        this.color="#668";
    }
    update(){

        this.delayUntilSpawnMountain -= game.time.dt;
        if(this.delayUntilSpawnMountain <= 0) this.makeNextRange();


        this.cam.goals.x = this.cam.vals.x = game.view.size.w/2;
        this.cam.goals.y = this.cam.vals.y = game.view.size.h/2;

        super.update();
    }
    makeNextRange(){
        
        this.delayUntilSpawnMountain = .5;

        const obj = Factory.Empty(vec2(0, 300));
        obj.addComponent( new MountainRange() );

        this.objs.addAtBack(obj);

    }
}