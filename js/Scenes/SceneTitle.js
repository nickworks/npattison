class SceneTitle extends Scene {

    #mover = null;
    #dot = null;
    #dot2 = null;
    #delayUntilSpawnMountain = 0;
    
    constructor(){
        super();

        this.#mover = this.instantiate().with([
            Factory.Sprite('imgs/truffle.png'),
        ]).debug();
        
        this.#dot = this.#mover.instantiate(vec2(300, 400), 2).with([
            Factory.Circle(50),
        ]).debug();

        this.#dot2 = this.#dot.instantiate(vec2(100, 0)).with([
            Factory.Circle(30),
            Factory.Custom({
                touch:()=>{
                    console.log("!!!");
                },
            }),
        ]);

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
        this.sprite = this.instantiate(Anchors.TopLeft().setOrigin(1,1)).with([
            Factory.Sprite("imgs/truffle.png"),
            Factory.TextField("maybe?", Font.big),
        ]).debug();

    }
    update(){
        super.update();

        let x = Game.width/2 + Math.sin(Time.now/1000) * 400;

        this.#mover.transform.position = vec2(x, 200);
        this.#mover.transform.angle = Math.cos(Time.now/1000);

        //get mouse position in mover transform space:
        //this.#dot2.transform.position = this.#dot.transform.worldToLocal(mouse.pos());

        // spawn mountains:
        this.#delayUntilSpawnMountain -= Time.dt;
        if(this.#delayUntilSpawnMountain <= 0) this.#makeNextRange();
        
        // spin card:
        this.cardSpin.transform.angle = Math.sin(Time.now/500) * .25;

        this.sprite.transform.position = vec2(mouse.x, mouse.y);
        super.update();
    }
    #makeNextRange(){
        this.#delayUntilSpawnMountain = Maths.rand(.5,1);
        this.instantiate(Anchors.BottomCenter()).addComponent( new MountainRange() );
    }
}