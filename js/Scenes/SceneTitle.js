class SceneTitle extends Scene {
    constructor(){
        
        super();

        // set background color of scene:
        this.color=Color.HSV(200,50,25);

        // create a delay for spawning mountains:
        this.delayUntilSpawnMountain = 0;

        const cards = [
            this.instantiate().with(Factory.RoundRect(10, "rgba(0,0,0,0.5)")),
            this.instantiate().with(Factory.RoundRect(10, "rgba(0,0,0,0.5)")),
            this.instantiate().with(Factory.RoundRect(10, "rgba(0,0,0,0.5)")),
        ];
        this.card1 = this.instantiate(Anchors.TopStretch(10,10,10,140)).with( [
            Factory.RoundRect(15, "rgba(0,0,0,0.5)"),
            Factory.Split(cards),
        ]);
        //this.card1.transform._drawDebug = true;
        this.card1.transform._anchor.origin = vec2(0);
        
        
    }
    update(){

        this.delayUntilSpawnMountain -= game.time.dt;
        if(this.delayUntilSpawnMountain <= 0) this.makeNextRange();

        super.update();
    }
    makeNextRange(){
        this.delayUntilSpawnMountain = Maths.rand(.5,1);
        this.instantiate(Anchors.BottomCenter()).addComponent( new MountainRange() );
    }
}