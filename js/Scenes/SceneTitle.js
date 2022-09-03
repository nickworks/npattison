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
            this.instantiate(Anchors.Stretch().setOrigin(.5, .5)).with([
                Factory.RoundRect(10, Color.RGBA(255,255,0, .5)),
                Factory.TextField("yello world?",new Font({size:40,align:'center',baseline:'middle'})),
            ]).debug(),
        ];
        this.cardSpin = cards[2];
        this.card1 = this.instantiate((new Anchors(vec2(.33,.2), vec2(.66,.8))).setMargins(0,0,0,0).setOrigin(.5, 0)).with( [
            Factory.RoundRect(15, "rgba(0,0,0,0.5)"),
            Factory.Split(cards, true, 5),
        ]).debug();
        //this.instantiate(vec2(200, 250)).with(Factory.TextField("yello world?",new Font({size:40,align:'center'}))).debug();
    }
    update(){
        this.#delayUntilSpawnMountain -= Game.time.dt;
        if(this.#delayUntilSpawnMountain <= 0) this.#makeNextRange();
        this.cardSpin.transform.angle += Game.time.dt;

        super.update();
    }
    #makeNextRange(){
        this.#delayUntilSpawnMountain = Maths.rand(.5,1);
        this.instantiate(Anchors.BottomCenter()).addComponent( new MountainRange() );
    }
}