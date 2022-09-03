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
            //obj.transform.parent = parent;
            parent.addChild(obj.transform, 0);
        } else {
            //obj.transform.parent = this.transform;
            this.transform.addChild(obj.transform, 0);
        }
        return obj;
    }

    destroy(gameobject){
        this.#deadobjs.push(gameobject);
    }
	draw(){
        game.view.fill(this.color);

        //this.cam.drawStart(); // push
        super.draw();
        //this.cam.drawEnd(); // pop
    }
	update(){
        
        // update all objects:
        super.update();

        // do collision detection
        this.doCollisionDetection();

        // remove all Destroyed objects:
        this.cleanup();

        // update camera:
        this.cam.update();
        
        return false; // what does this do?
    }
    cleanup(){
        // remove dead objects from their parents:
        this.#deadobjs.forEach(o => {
            o.transform.parent = null;
        });
        // clear the deadobjs array:
        this.#deadobjs = [];
    }
    reverseIterate(arr, f){
        for(var i = arr.length - 1; i >= 0; i--){
            f(arr[i], i);
        }
    }
    doResize(w,h){
        this.transform.dirty();
        //this.transform.children.filter(o => o.layo)
    }
    doCollisionDetection(){
        // do collision detection:

        // this.objs.sometype.forEach(b => { b.block(this.objs.othertype); })
        // this.objs.sometype.forEach(b => { b.overlap(this.objs.othertype); })

    }
    modal(modal){

        /*
    	const types = this.guis.modals.map(m => Object.getPrototypeOf(m));
    	const typeAlreadyExists = types.includes(Object.getPrototypeOf(modal));

    	if (typeAlreadyExists) return;

    	this.guis.modals.push(modal);
        */
    }
    removeModal(modal){
        /*
        var i = this.guis.modals.indexOf(modal);
        this.guis.modals.slice(i,1);
        */
    }
}