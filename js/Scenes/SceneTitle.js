class SceneTitle extends Scene {

    #mover = null;
    #dot = null;

    constructor(){
        super();

        this.#mover = this.instantiate().with([
            Factory.Sprite('imgs/truffle.png'),
        ]).debug();
        this.#dot = this.#mover.instantiate(vec2(300, 400),{},2).with([
            Factory.Circle(50),
        ]).debug();

    }
    update(){
        super.update();

        let x = Game.width/2 + Math.sin(Time.now/1000) * 400;

        this.#mover.transform.position = vec2(x, 200);
        this.#mover.transform.angle = Math.cos(Time.now/1000);

        //get mouse position in mover transform space:
        this.#dot.transform.position = this.#mover.transform.worldToLocal(mouse.pos());
    }
}