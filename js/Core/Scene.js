class Scene extends GameObject {

    #deadobjs = [];
    color = "#888";

    constructor(){
        
        super();

        this.cam=new Camera();
        this.gravity=1200;
	}
    start(){
        this.transform.anchor = Anchors.Stretch;
    }
    /** Creates a new GameObject */
    instantiate(p=vec2(),parent=undefined,customBehavior={},index=0){
        const obj = new GameObject(new Transform(p), customBehavior);
        if(typeof parent ==="object" && parent.constructor.name ==="Transform"){
            parent.addChild(obj.transform, 0);
        } else {
            this.transform?.addChild(obj.transform, 0);
        }
        return obj;
    }
    destroy(gameobject){
        this.#deadobjs.push(gameobject);
    }
	draw(){
        Game.view.fill(this.color);
        super.draw();
    }
	update(){
        super.update();
        this.#doCollisionDetection();
        this.#cleanup();
        this.cam.update();
    }
    #doCollisionDetection(){

    }
    #cleanup(){
        // remove dead objects from their parents:
        this.#deadobjs.forEach(o => {
            o.transform.parent = null;
        });
        // clear the deadobjs array:
        this.#deadobjs = [];
    }
    doResize(){
        this.transform.dirty();
    }
}