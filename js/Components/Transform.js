class Anchors {
	static get TopLeft() {
		return {
			min:vec2(0),
			max:vec2(0),
		}; 
	};
	static get TopRight() {
		return {
			min:vec2(1,0),
			max:vec2(1,0),
		}; 
	};
	static get Stretch() {
		return {
			min:vec2(0),
			max:vec2(1),
		}; 
	};
}

const Margins = (t=0,l=0,b=0,r=0)=>{
	t = Number(t);
	l = Number(l);
	b = (b===undefined) ? t : Number(b);
	r = (r===undefined) ? l : Number(r);
	return {t:t,l:l,b:b,r:r};
};

class Transform extends GameComponent {

	constructor(p=vec2(), a=Anchors.TopLeft){
		super();

		this._dirty = true;

		this._anchor=a; // percent position in parent
		this._margins=Margins(p.x, p.y);

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
		return {x:this.rect.x,y:this.rect.y};
	}
	set position(p){
		this._margins.l = p.x;
		this._margins.t = p.y;
		this.dirty();
	}
	get x(){
		return this._margins.l;
	}
	set x(x){
		this._margins.l = x;
		this.dirty();
	}
	get y(){
		return this._margins.t;
	}
	set y(y){
		this._margins.t = y;
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
	drawDebug(){
		gfx.fillStyle="#000";
		gfx.fillCircle(0,0,5);
		gfx.fillStyle="#FFF";
		gfx.fillCircle(0,0,3);
		this.rect.draw();
		Font.basic.apply();
		gfx.fillText("size: "+this.rect.w+"x"+this.rect.h, 3,-3);
	}
	update(){

		if(this._dirty) this.calcMatrices();

		// tell children to update:
		this.transform.children.forEach(c => c.gameObject.update());

	}
	calcMatrices(){
		this._dirty = false;

		// TODO: reconcile _margins, position, anchor, and rect

		// public set position
		// public set _margins ??
		// private set rect ??

		// 1. use anchor to find the min / max corners of a... box?
		// 2. add margins to box to find RECT?
		// 3. what about set / get position?

		// find anchor position in parent rect:
		let rect = undefined;
		let p1 = vec2(0);
		let p2 = vec2(0);
		if(this.parent) {
			rect = this.parent.rect;
			p1 = rect.getPositionOfAnchor(this.anchor.min); // if rect exists, find the position in the rect
			p2 = rect.getPositionOfAnchor(this.anchor.max);
			this.rect.x = p1.x;// + this._margins.l;
			this.rect.y = p1.y;//+ this._margins.t;
			this.rect.w = p2.x;// - this.rect.x - this._margins.r;
			this.rect.h = p2.y;// - this.rect.y - this._margins.b;
		} else {
			this.rect = game.view.size;
		}
			
		const m1 = new Matrix(); // parent-to-local
		const m2 = new Matrix(); // local-to-parent

		// build transform matrix:
		//m1.translate(p1.x, p1.y);
		m1.translate(this.x, this.y); // <-- wait... doesn't work w/ rects
		m1.rotate(this._angle);
		m1.scale(this._scale.x, this._scale.y);

		// build inverse matrix:
		m2.scale(1/this._scale.x, 1/this._scale.y);
		m2.rotate(-this._angle);
		m2.translate(-this.x, -this.y);
		//m2.translate(-p1.x, -p1.y);

		this.matrix.parentToLocal = m1;
		this.matrix.localToParent = m2;

		// multiply matrices by parents' matrices:
		this.matrix.localToWorld = (this.parent&&this.parent.matrix) ? Matrix.mult(this.parent.matrix.localToWorld, m1) : m1;
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