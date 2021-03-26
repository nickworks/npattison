class SceneTitle extends Scene {
    constructor(){
        
        super();
        /*
        this.panel = Factory.Empty(vec2(20,-20),vec2(0,1));
        this.panel.transform.rect.w=200;
        this.panel.transform.rect.h=50;
        
        this.objs.add(this.panel);
        
        var hello = Factory.TextField("Hello world!",vec2(0,-20),vec2(), Font.big);
        hello.transform.parent = this.panel.transform;
        
        this.objs.add(Factory.Particles(Data.lorem.img, vec2(0,-700), vec2(.5,1)));
        
        var row1 = Factory.RoundRect(10, "rgba(0,0,0,.5)");
        var row2 = Factory.Split([Factory.RoundRect(),Factory.RoundRect(),Factory.RoundRect()], true, 20, 0);
        var row3 = Factory.RoundRect(10, "rgba(0,0,0,.5)");

        this.objs.add(Factory.Split([row1, row2, row3], false, 10, 10));
        */

       
       var card = this.instantiate(vec2(), Anchors.Stretch).with( Factory.RoundRect(30, "rgba(0,0,0,0.5)"));
       
       card.transform._margins = Margins(50, 0, 0, 0);

       this.instantiate(vec2(50, 50), Anchors.TopRight).with( Factory.TextField("Hello world?", Font.big) );
        /*
        var cards = [
            this.instantiate(vec2(), Anchors.Stretch).with(Factory.RoundRect(30, "rgba(0,0,0,0.5)")),
            this.instantiate(vec2(), Anchors.Stretch).with(Factory.RoundRect(30, "rgba(0,0,0,0.5)")),
            this.instantiate(vec2(), Anchors.Stretch).with(Factory.RoundRect(30, "rgba(0,0,0,0.5)")),
        ];

        this.instantiate(vec2(0, 0), Anchors.Stretch).with(Factory.Split(cards, false, 10, 0));
        */

      
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

        //const obj = Factory.Empty(vec2(),vec2(.5,1));
        //obj.addComponent( new MountainRange() );
        //this.objs.addAtBack(obj);

    }
}