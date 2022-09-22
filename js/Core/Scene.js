class Scene extends GameObject {

    color = "#888";
    gravity = 1200;
    #cam = new Camera();

    get cam(){
        return this.#cam;
    }
    constructor(){  
        super();
	}
	draw(){
        Game.view.fill(this.color);
        super.draw();
    }
	update(){
        super.update();
        this.#doCollisionDetection();
        this.cam.update();
    }
    #doCollisionDetection(){

    }
    doResize(){
        this.transform.dirty();
    }
}