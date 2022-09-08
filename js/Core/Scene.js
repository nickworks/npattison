class Scene extends GameObject {

    color = "#888";

    constructor(){  
        super();

        this.cam=new Camera();
        this.gravity=1200;
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