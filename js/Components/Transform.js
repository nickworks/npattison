class Transform extends GameComponent {

	constructor(p=vec2()){
		super();

		this._drawDebug = false;
		this._dirty = true;

		if(p.constructor.name == 'Anchors'){
			this._anchor = p;
		} else {
			this._anchor = Anchors.TopLeft(p.x, p.y, 0, 0);
		}
		
		this._angle = 0;
		this._scale = vec2(1);
		this._position = vec2(0);

		this.rect = new Rect(0,0,0,0); // this canvas is used to position child GameObjects

		this.children = [];
		this._parent = null;
		this.matrix = {
			parentToLocal:null,
			localToParent:null,
			localToWorld:null,
			worldToLocal:null,
			draw:null,
		};
	}
	dirty(){
		this._dirty = true;
		this.children.forEach(t => t.dirty());
	}
	get anchor(){
		return this._anchor;
	}
	set anchor(a){
		this._anchor=a;
		this.dirty();
	}
	get position(){
		return this._position;
	}
	set position(p){
		this._position = p;
		this.dirty();
	}
	get x(){
		return this._position.x;
	}
	set x(x){
		this._position.x = x;
		this.dirty();
	}
	get y(){
		return this._position.y;
	}
	set y(y){
		this._position.y = y;
		this.dirty();
	}
	get scale(){
		return this._scale;
	}
	set scale(s){
		this._scale = s;
		this.dirty();
	}
	get sx(){
		return this._scale.x;
	}
	set sx(x){
		this._scale.x = x;
		this.dirty();
	}
	get sy(){
		return this._scale.y;
	}
	set sy(y){
		this._scale.y = y;
		this.dirty();
	}
	get angle(){
		return this._angle;
	}
	set angle(a){
		this._angle = a;
		this.dirty();
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

		if(this._parent && this._parent.children){ // if parent is a transform...
			// remove from parent's children list:
			const i = this._parent.children.indexOf(this);
			this._parent.children.splice(i,1);
		}

		// TODO: verify `p` is a Transform OR null...
		this._parent = p;
		
		// add `this` to parent's children[] array
		if(p && p.children) p.children.push(this); 

		this.dirty();
	}
	drawDebugInner(){
		if(!this._drawDebug) return;
		Font.basic.apply();
		gfx.fillStyle="#FFF";
		gfx.fillText("size: "+this.rect.w+"x"+this.rect.h, this.pos.x + 5,this.pos.y - 3);
		gfx.fillCircle(this.pos.x,this.pos.y,5);
	}
	drawDebugOuter(){
		if(!this._drawDebug) return;
		Font.basic.apply();

		//gfx.fillStyle="#000";
		//gfx.fillCircle(0,0,10);
		//gfx.fillStyle="#FFF";
		//gfx.fillCircle(0,0,8);

		this.rect.draw();
		this._anchor.draw();
	}
	update(){

		if(this._dirty) this.calcMatrices();

		// tell children to update:
		this.transform.children.forEach(c => c.gameObject.update());

	}
	calcMatrices(){
		this._dirty = false;

		// TODO: reconcile _margins, position, anchor, and rect

		if(this.parent) {
			this.rect = this._anchor.calcRectFromParent(this.parent.rect);
		} else {
			this.rect = game.view.size;
		}
		// this position is where we draw the origin
		this.pos = this.rect.getPositionOfAnchor(this._anchor.origin ?? vec2(0));

		const m1 = new Matrix(); // parent-to-local
		const m2 = new Matrix(); // local-to-parent

		// build transform matrix:
		//m1.translate(p1.x, p1.y); // <-- wait... doesn't work w/ rects
		m1.translate(this.pos.x, this.pos.y);
		m1.rotate(this._angle);
		m1.scale(this._scale.x, this._scale.y);
		//m1.translate(-this.pos.x, -this.pos.y);

		// build inverse matrix:
		//m2.translate(this.pos.x, this.pos.y);
		m2.scale(1/this._scale.x, 1/this._scale.y);
		m2.rotate(-this._angle);
		//m2.translate(-this.x, -this.y);
		m2.translate(-this.pos.x, -this.pos.y);

		this.matrix.parentToLocal = m1;
		this.matrix.localToParent = m2;

		// multiply matrices by parents' matrices:
		this.matrix.localToWorld = (this.parent&&this.parent.matrix) ? Matrix.mult(this.parent.matrix.localToWorld, m1) : m1;
		this.matrix.draw = this.matrix.localToWorld;
		this.matrix.draw.translate(-this.pos.x, -this.pos.y);
		this.matrix.worldToLocal = (this.parent&&this.parent.matrix) ? Matrix.mult(m2, this.parent.matrix.worldToLocal) : m2;
		
		// tell the other components to refresh layouts
		this.gameObject.layout();
	}
	worldToLocal(p){
		return this.matrix.worldToLocal.vec(p);
	}
	localToWorld(p){
		return this.matrix.localToWorld.vec(p);
	}
}