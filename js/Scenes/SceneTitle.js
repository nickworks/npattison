class SceneTitle extends Scene {
    constructor(){
        
        super();
       
        this.card1 = this.instantiate(Anchors.Stretch(20,20,20,20)).with( Factory.RoundRect(15, "rgba(0,0,0,0.5)"));
        //card1.transform._drawDebug = true;
        this.card1.transform._anchor.origin = vec2(.75);
        
        const cards = [
            this.instantiate().with(Factory.RoundRect(10, "rgba(0,0,0,0.5)")),
            this.instantiate().with(Factory.RoundRect(10, "rgba(0,0,0,0.5)")),
            this.instantiate().with(Factory.RoundRect(10, "rgba(0,0,0,0.5)")),
        ];
        
        cards[0].transform._drawDebug = true;
        this.cardSpin = cards[2];
        this.cardSpin.transform._anchor.origin = vec2(.5);
        this.cardSpin.transform._drawDebug = true;
        //this.cardSpin.transform.y += 50;

        this.otherText = this.instantiate(vec2(200, 100)).with(Factory.TextField("Hello World", Font.big));
        this.someText = this.instantiate(vec2(200, 100), this.cardSpin.transform).with(Factory.TextField("Hello World", Font.big));
        const thirdText = this.instantiate(vec2(200, 100), this.otherText.transform).with(Factory.TextField("Hello World", Font.big));

        this.otherText.transform._drawDebug = true;
        this.otherText.transform._anchor.fixedWidth = 100;
        this.otherText.transform._anchor.fixedHeight = 100;
        this.someText.transform._drawDebug = true;
        this.someText.transform._anchor.fixedWidth = 100;
        this.someText.transform._anchor.fixedHeight = 100;

        const card2 = this.instantiate(Anchors.Stretch(), this.card1.transform)
            //.with( Factory.RoundRect(10, "rgba(0,0,0,.25)"))
            .with( Factory.Split(cards, true, 10, 0));

        card2.transform._drawDebug = true;
        //card2.transform._anchor.setSize(100,100);

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
        
        this.otherText.transform._angle += .003;
        this.someText.transform.x = this.otherText.transform.x = mouse.x;
        this.someText.transform.y = this.otherText.transform.y = mouse.y;

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