class GameObject {
	#components = [];
	
	// cached values:
	#transform = null;
	#hasNeverTicked = true;
	#customBehavior = {};
	
	// flags:
	#updateable = false;
	#drawable = false;
	#touchable = false;
	#layoutable = false;

	constructor(xform){
		if(typeof xform ==="object" && xform.constructor.name === "Transform") {
			this.#transform = xform;
		} else {
			this.#transform = new Transform();
		}
		this.#transform.gameObject = this;
	}
	get transform() {
		return this.#transform;
	}
	instantiate(p=vec2(), index=0){
		// spawn game-object
        const obj = new GameObject(new Transform(p));
		// add as a child of this object:
		this.transform?.addChild(obj.transform, index);
        return obj;
    }
	destroy(){
		this.transform.removeFromParent();
		this.#components.forEach(c => {
			if(c.destroy)c.destroy()
		});
	}
	#start(){
		this.#hasNeverTicked = false;
		this.#components.forEach(c => {
			if(c.start)c.start()
		});
	}
	update(){

		if(this.#hasNeverTicked) this.#start();

		if(this.#updateable){
			// update components:
			this.#components.forEach(c => {
				if(c.update)c.update();
			});
		}
		this.transform.update(); // <-- recalc matrices if necessary
	}
	touch(){
		if(this.#touchable){
			// update components:
			this.#components.forEach(c => {
				if(c.touch)c.touch();
			});
		}
		this.transform.touch(); // <-- pass event to children
	}
	layout(){		
		// this function is triggered by Transform.calcMatrices(), which is triggered by _dirty flag

		if(this.#layoutable){
			// call layout() in components:
			this.#components.forEach(c => {
				if(c.layout)c.layout()
			});
		}
		
		// it is not necessary to call layout() in children.
		// the children's Transform.calcMatrices() will call their layout().
	}
	draw(){
		this.transform.render();
	}
	drawComponents(){
		if(this.#drawable || Game.DEVMODE){	
			// draw components:
			this.#components.forEach(c => {
				if(c.draw) c.draw()
			});
		}
	}
	with(c){
		if(!Array.isArray(c)) c = [c];
		c.forEach(comp => this.addComponent(comp));
		return this;
	}
	debug(){
		this.transform._drawDebug = true;
		return this;
	}
	addComponent(c){
		if(typeof c != "object") return this;
		this.#components.push(c);
		c.gameObject = this;
		this.#scanComponents();
		return this;
	}
	getComponent(type){
		let result = null;
		this.#components.forEach(c => {
			if(c.constructor.name === type) result = c; // if type is String -- "RenderSprite"
			if(c.constructor === type) result = c; // if type is a constructor -- RenderSprite
		});
		return result;
	}
	removeComponent(type){
		if(!type)return;
		if(type=="Transform")return;
		for(let i = this.#components.length-1; i>=0; i--){
			if(this.#components[i].constructor.name == type){
				this.#components.splice(i,1);
				break;
			}
		}
		this.#scanComponents();
	}
	#scanComponents(){
		this.#updateable = false;
		this.#drawable = false;
		this.#layoutable = false;
		this.#touchable = false;
		this.#components.forEach(c => {
			if(c.draw)this.#drawable=true;
			if(c.update)this.#updateable=true;
			if(c.layout)this.#layoutable=true;
			if(c.touch)this.#touchable=true;
		});
	}
}