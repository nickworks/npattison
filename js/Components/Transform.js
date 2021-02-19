class Transform extends GameComponent {

	constructor(p=vec2()){
		super();

		this._dirty = true;

		this.anchor = {x:0.5, y:0.5}; // percent position in parent
		
		this._position = vec2(); // pixels position from anchor
		this._angle = 0;
		this._scale = vec2(1);
		
		this.rect = new Rect(0,0,0,0); // this canvas is used to position child GameObjects

		this.children = [];
		this._parent = null;
		this.matrix = {
			parentToLocal:null,
			localToParent:null,
			localToWorld:null,
			worldToLocal:null,
		};
	}
	get position(){
		return this._position;
	}
	set position(p){
		this._position = p;
		this._dirty = true;
	}
	get x(){
		return this._position.x;
	}
	set x(x){
		this._position.x = x;
		this._dirty = true;
	}
	get y(){
		return this._position.y;
	}
	set y(y){
		this._position.y = y;
		this._dirty = true;
	}
	get scale(){
		return this._scale;
	}
	set scale(s){
		this._scale = s;
		this._dirty = true;
	}
	get sx(){
		return this._scale.x;
	}
	set sx(x){
		this._scale.x = x;
		this._dirty = true;
	}
	get sy(){
		return this._scale.y;
	}
	set sy(y){
		this._scale.y = y;
		this._dirty = true;
	}
	get angle(){
		return this._angle;
	}
	set angle(a){
		this._angle = a;
		this._dirty = true;
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
				// TODO: call Gameobject.Destroy()?

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
	drawDebug(){
		gfx.fillStyle="#000";
		gfx.fillCircle(0,0,5);
		gfx.fillStyle="#FFF";
		gfx.fillCircle(0,0,3);
		this.rect.draw();
		Font.basic.apply();
		gfx.fillText("size: "+this.rect.w+"x"+this.rect.h, 3,-3);
	}
	calcMatrices(){

		if(!this._dirty) return;
		this._dirty = false;

		const m1 = new Matrix(); // parent-to-local
		const m2 = new Matrix(); // local-to-parent

		let p = {x:0,y:0}; // % position in parent rect

		// find anchor position in parent rect:
		let rect = null;
		if(this._parent == null) rect = game.view.size; // if _parent is the scene, set `rect` to the screen size
		else if(this._parent.children) rect = this._parent.rect; // if _parent is some Transform, set `rect` to the parent's `rect`
		if(rect) p = rect.getPositionOfAnchor(this.anchor); // if rect exists, find the position in the rect

		// build transform matrix:
		m1.translate(p.x, p.y);
		m1.translate(this._position.x, this._position.y);
        m1.rotate(this._angle);
        m1.scale(this._scale.x, this._scale.y);

		// build inverse matrix:
        m2.scale(1/this._scale.x, 1/this._scale.y);
        m2.rotate(-this._angle);
        m2.translate(-this._position.x, -this._position.y);
        m2.translate(-p.x, -p.y);

        this.matrix.parentToLocal = m1;
        this.matrix.localToParent = m2;

		// multiply matrices by parents' matrices:
        this.matrix.localToWorld = (this.parent&&this.parent.matrix) ? Matrix.mult(this.parent.matrix.localToWorld, m1) : m1;
        this.matrix.worldToLocal = (this.parent&&this.parent.matrix) ? Matrix.mult(m2, this.parent.matrix.worldToLocal) : m2;
		
		this.gameObject.layout();
	}
	worldToLocal(p){
		return this.matrix.worldToLocal.vec(p);
	}
	localToWorld(p){
		return this.matrix.localToWorld.vec(p);
	}
}