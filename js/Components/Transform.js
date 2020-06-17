class Transform extends GameComponent {

	constructor(){
		super();

		this.anchor = {x:0.5, y:0.5}; // percent position in parent
		this.position = {x:0, y:0}; // pixels position from anchor
		
		this.rect = new Rect(0,0,0,0); // this canvas is used to position child GameObjects

		this.angle = 0;
		this.scale = 1;

		this.children = [];
		this._parent = null;
		this.matrix = {
			parentToLocal:null,
			localToParent:null,
			localToWorld:null,
			worldToLocal:null,
		};
	}
	get root() {
		let p = this.parent;
		while(p&&p.parent) p = p.parent;
		return p;
	}
	get parent() {
		return this._parent;
	}
	set parent(p) {

		if(this._parent){

			if(this._parent.children){ // if parent is a transform...

				// remove from parent's children list:
				const i = this._parent.children.indexOf(this);
				this._parent.children.splice(i,1);

			} else if(this._parent.objs){ // if parent is a scene:

				// remove from scene:
				this._parent.objs.remove(this);

			}
		}

		// TODO: verify `p` is a Transform OR null...
		this._parent = p;

		if(p){
			if(p.children){ // if new parent is a transform
				p.children.push(this); 
			} else if(p.objs){ // if new parent is a scene
				p.objs.add(this.gameObject);
			}
		}
	}
	calcMatrices(){

		const m1 = new Matrix(); // parent-to-local
		const m2 = new Matrix(); // local-to-parent

		let p = {x:0,y:0}; // % position in parent rect

		// find anchor position in parent rect:
		if(this._parent){
			let rect = null;
			if(this._parent.objs) rect = game.view.size;
			if(this._parent.children) rect = this._parent.rect;
			if(rect) p = rect.getPositionOfAnchor(this.anchor);
		}
		m1.translate(p.x, p.y);
		m1.translate(this.position.x, this.position.y);
        m1.rotate(this.angle);
        m1.scale(this.scale);

        m2.scale(1/this.scale);
        m2.rotate(-this.angle);
        m2.translate(-this.position.x, -this.position.y);
        m2.translate(-p.x, -p.y);

        this.matrix.parentToLocal = m1;
        this.matrix.localToParent = m2;
        this.matrix.localToWorld = (this.parent&&this.parent.matrix) ? Matrix.mult(this.parent.matrix.localToWorld, m1) : m1;
        this.matrix.worldToLocal = (this.parent&&this.parent.matrix) ? Matrix.mult(m2, this.parent.matrix.worldToLocal) : m2;
	}
	worldToLocal(p){
		return this.matrix.worldToLocal.vec(p);
	}
	localToWorld(p){
		return this.matrix.localToWorld.vec(p);
	}
}