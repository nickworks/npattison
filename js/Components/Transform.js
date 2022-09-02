class Transform extends GameComponent {

	constructor(p=vec2()){
		super();

		this._drawDebug = false;
		this._dirty = true;

		if(p.constructor.name == 'Anchors'){
			this._anchor = p;
		} else {
			this._anchor = Anchors.TopLeft(0, 0, 0, 0);
		}
		
		this._angle = 0;
		this._scale = vec2(1);
		this._position = vec2(p.x, p.y);

		this.rect = new Rect(0,0,0,0); // this canvas is used to position child GameObjects

		this.children = [];
		this._parent = null;
		this.matrix = {
			parentToLocal:null,
			localToParent:null,
			localToWorld:null,
			worldToLocal:null,
			predraw:null,
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
		if(p==null) this.removeFromParent();
		else p.addChild(this);
	}
	removeFromParent(){
		if(this._parent && this._parent.children){ // if parent is a transform...
			// remove from parent's children list:
			const i = this._parent.children.indexOf(this);
			this._parent.children.splice(i,1);
			this._parent = null;
		}
	}
	addChild(xform, i=-1){
		xform.removeFromParent();
		xform._parent = this;
		if(i >= 0){
			this.children.splice(i, 0, xform); 
		} else {
			this.children.push(xform);
		}
		this.dirty();
	}
	drawDebugInner(){
		if(!this._drawDebug) return;
		
	}
	drawDebugOuter(){
		if(!this._drawDebug) return;
		Font.basic.apply();

		// draw origin
		const drawOrigin = (x,y)=>{
			gfx.fillStyle="#000";
			gfx.fillCircle(x,y,10);
			gfx.fillStyle="#FFF";
			gfx.fillCircle(x,y,8);
			gfx.fillText("x: "+this.x+"\ny: "+this.y+"\nw: "+this.rect.w+"\nh:"+this.rect.h, x+ 5,y- 3);
		};
		drawOrigin(this.anchorpos.x, this.anchorpos.y);

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

		if(this.parent) {
			this.rect = this._anchor.calcRectFromParent(this.parent.rect);
		} else {
			this.rect = Rect.from(game.view.size);
		}
		// this is the local origin
		this.anchorpos = this.rect.getPositionOfAnchor(this._anchor.origin ?? vec2(0));

		const m1 = new Matrix(); // parent-to-local
		const m2 = new Matrix(); // local-to-parent

		// build parent-origin to local-origin
		m1.translate(this.anchorpos.x, this.anchorpos.y);
		m1.rotate(this._angle);
		m1.scale(this._scale.x, this._scale.y);

		// build inverse (local-to-parent)
		m2.scale(1/this._scale.x, 1/this._scale.y);
		m2.rotate(-this._angle);
		m2.translate(-this.anchorpos.x, -this.anchorpos.y);

		this.matrix.parentToLocal = m2;
		this.matrix.localToParent = m1;

		// multiply matrices by parents' matrices:

		// the predraw matrix is simply the parent's world-matrix
		// this allows us to draw parent-oriented debug info
		this.matrix.predraw = (this.parent&&this.parent.matrix) ? new Matrix(this.parent.matrix.localToWorld) : new Matrix();
		this.matrix.predraw.translate(this.x, this.y);
		
		// where to draw the 
		this.matrix.draw = Matrix.mult(this.matrix.predraw, m1);

		this.matrix.localToWorld = new Matrix(this.matrix.draw);
		this.matrix.localToWorld.translate(-this.anchorpos.x, -this.anchorpos.y);
		
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