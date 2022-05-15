class SceneTitle extends Scene {
    constructor(){
        
        super();
       
        const card1 = this.instantiate(Anchors.Stretch(20,20,20,20)).with( Factory.RoundRect(30, "rgba(0,0,0,0.5)"));
        //this.card1.transform._drawDebug = true;

        const cards = [
            this.instantiate().with(Factory.RoundRect(10, "rgba(0,0,0,0.5)")),
            this.instantiate().with(Factory.RoundRect(10, "rgba(0,0,0,0.5)")).with(Factory.TextField("Hello World", Font.Basic)),
            this.instantiate().with(Factory.RoundRect(10, "rgba(0,0,0,0.5)")),
        ];

        this.cardSpin = cards[1];
        this.cardSpin.transform._drawDebug = true;

        const card2 = this.instantiate(Anchors.Stretch().setOrigin(.5,1), card1.transform)
            //.with( Factory.RoundRect(10, "rgba(0,0,0,.25)"))
            .with( Factory.Split(cards, true, 10, 0));

        //card2.transform._drawDebug = true;
        card2.transform._anchor.setSize(100,100);

        this.delayUntilSpawnMountain = 0;
        
        //this.cam.goals.x = this.cam.vals.x = game.view.size.w/2;
        //this.cam.goals.y = this.cam.vals.y = 0;//game.view.size.h/2;// + Math.sin(game.time.now) * 100;
        
        
        this.color=Color.HSV(200,50,25);

    }
    update(){

        this.delayUntilSpawnMountain -= game.time.dt;
        if(this.delayUntilSpawnMountain <= 0) this.makeNextRange();

        this.cardSpin.transform._angle += .001;
        this.cardSpin.transform._anchor.fixedWidth = 100;
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