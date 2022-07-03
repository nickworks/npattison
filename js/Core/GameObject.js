class GameObject {

	constructor(xform, customBehavior={}){
		this.components = [];	
		this.customBehavior = customBehavior;
		
		// cached values:
		this._transform = null;
		this._hasNeverTicked = true;
		
		// flags:
		this.updateable = false;
		this.drawable = false;
		this.layoutable = false;
		this.touchable = false;

		if(typeof xform ==="object" && xform.constructor.name === "Transform") {
			this.addComponent( xform );
		} else {
			this.addComponent( new Transform() );
		}
	}
	get transform() {
		if(!this._transform) this._transform = this.getComponent("Transform");
		return this._transform;
	}
	destroy(){

		if(this.customBehavior.destroy) this.customBehavior.destroy();

		scene.destroy(this);
	}
	start(){
		this._hasNeverTicked = false;
		this.components.forEach(c => {
			if(c.start)c.start()
		});
		if(this.customBehavior.start) this.customBehavior.start();
	}
	update(){

		if(this._hasNeverTicked) this.start();

		if(this.updateable){
			// update components:
			this.components.forEach(c => {
				if(c.update)c.update()
			});
		}
		
		this.transform.update(); // <-- recalc matrices if necessary

		if(this.customBehavior.update) this.customBehavior.update();
	}
	layout(){
		
		// this function is triggered by Transform.calcMatrices(), which is triggered by _dirty flag

		if(this.layoutable){
			// call layout() in components:
			this.components.forEach(c => {
				if(c.layout)c.layout()
			});
		}
		
		// it is not necessary to call layout() in children.
		// the children's Transform.calcMatrices() will call their layout().

		// call layout() in customBehavior:
		if(this.customBehavior.layout) this.customBehavior.layout();
	}
	draw(){

    	//Matrix.push(this.transform.matrix.parentToLocal);
		
		if(this.drawable || Game.DEVMODE){
			if(Game.DEVMODE) this.transform.drawDebugOuter();
			this.transform.matrix.draw.apply();
	        // draw components:
			this.components.forEach(c => {
				if(c.draw)c.draw()
			});
			if(Game.DEVMODE) this.transform.drawDebugInner();
		}
		
		// tell children to draw:
		this.transform.children.forEach(c => c.gameObject.draw());
		
		if(this.customBehavior.draw) this.customBehavior.draw();
		
		//Matrix.pop();
	}
	with(c){
		if(!Array.isArray(c)) c = [c];
		c.forEach(comp => this.addComponent(comp));
		return this;
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
		this.layoutable = false;
		this.touchable = false;
		this.components.forEach(c => {
			if(c.draw)this.drawable=true;
			if(c.update)this.updateable=true;
			if(c.layout)this.layoutable=true;
			if(c.touch)this.touchable=true;
		});
	}
}