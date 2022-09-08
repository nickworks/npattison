class SceneTitle extends Scene {

    #mover = null;
    #dot = null;

    constructor(){
        super();

        this.#mover = this.instantiate().with([
            Factory.Sprite('imgs/truffle.png'),
        ]);
        this.#dot = this.#mover.instantiate(vec2(),{},2).with([
            Factory.Circle(50),
        ]);

    }
    update(){
        super.update();

        let x = Game.width/2 + Math.sin(Time.now/1000) * 400;

        this.#mover.transform.position = vec2(x, 200);
        this.#mover.transform.angle = Math.cos(Time.now/1000);

        this.#dot.transform.position = this.#dot.transform.worldToLocal(mouse.pos());
    }
}