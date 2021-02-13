class GameObject {

	constructor(){
		this.components = [];
		this.addComponent( new Transform() );

		// cached values:
		this._transform = null;
		this._hasNeverTicked = true;

		// flags:
		this.updateable = false;
		this.drawable = false;
	}
	get transform() {
		if(!this._transform) this._transform = this.getComponent("Transform");
		return this._transform;
	}
	destroy(){

		if(this.transform.parent){
			// if parent, remove from parent
			this.transform.parent = null;
		} else {
			// if no parent, remove from scene
			scene.objs.remove(this);
		}
	}
	start(){
		this._hasNeverTicked = false;
		this.components.forEach(c => {
			if(c.start)c.start()
		});
	}
	update(){

		if(this._hasNeverTicked) this.start();

		if(this.updateable){
			// update components:
			this.components.forEach(c => {
				if(c.update)c.update()
			});
		}

		this.transform.calcMatrices();

		// tell children to update:
		this.transform.children.forEach(c => c.gameObject.update());

	}
	draw(){

    	//Matrix.push(this.transform.matrix.parentToLocal);

		if(this.drawable){
    		this.transform.matrix.localToWorld.apply();

	        // draw components:
			this.components.forEach(c => {
				if(c.draw)c.draw()
			});
		}

		// tell children to draw:
		this.transform.children.forEach(c => c.gameObject.draw());

		//Matrix.pop();
	}
	addComponent(c){
		this.components.push(c);
		c.gameObject = this;
		this.scanComponents();
	}
	getComponent(type){
		let result = null;
		this.components.forEach(c => {
			if(c.constructor.name === type) result = c; // if type is String -- "RenderSprite"
			if(c.constructor === type) result = c; // if type is a constructor -- RenderSprite
		});
		return result;
	}
	removeComponent(type){
		if(!type)return;
		if(type=="Transform")return;
		for(let i = this.components.length-1; i>=0; i--){
			if(this.components[i].constructor.name == type){
				this.components.splice(i,1);
				break;
			}
		}
		this.scanComponents();
	}
	scanComponents(){
		this.updateable = false;
		this.drawable = false;
		this.components.forEach(c => {
			if(c.draw)this.drawable=true;
			if(c.update)this.updateable=true;
		});
	}
}