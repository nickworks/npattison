class SceneTitle extends Scene {

    #delayUntilSpawnMountain = 0;

    constructor(){
        
        super();

        // set background color of scene:
        this.color=Color.HSV(200,50,25);

        // create a delay for spawning mountains:
        const cards = [
            this.instantiate().with(Factory.RoundRect(10, Color.RGBA(0,0,0,.5))),
            this.instantiate().with(Factory.RoundRect(10, Color.RGBA(0,0,0,.5))),
            this.instantiate().with(Factory.RoundRect(10, Color.RGBA(0,0,0,.5))),
        ];
        this.card1 = this.instantiate(Anchors.TopStretch(2,2,2,100).setOrigin(.5, 0)).with( [
            Factory.RoundRect(15, "rgba(0,0,0,0.5)"),
            Factory.Split(cards, false, 5),
        ]);
        //this.card1.transform._drawDebug = true;

        this.instantiate(vec2(200, 250)).with(Factory.TextField("yello world?",new Font({size:40,align:'center'}))).debug();
    }
    update(){
        this.#delayUntilSpawnMountain -= game.time.dt;
        if(this.#delayUntilSpawnMountain <= 0) this.#makeNextRange();

        super.update();
    }
    #makeNextRange(){
        this.#delayUntilSpawnMountain = Maths.rand(.5,1);
        this.instantiate(Anchors.BottomCenter()).addComponent( new MountainRange() );
    }
}