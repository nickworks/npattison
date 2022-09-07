class Transform extends GameComponent {

	#angle = 0;
	#scale = vec2(1);
	#position = vec2(0);
	#anchor = null;
	#parent = null;
	#dirty = true;
	#children = [];
	#rect = new Rect(0,0,0,0); // this canvas is used to position child GameObjects
	#offset_rect = new Rect(0,0,0,0);
	#anchorpos = vec2(0);
	#matrix = {
		parentToLocal:null,
		localToParent:null,
		localToWorld:null,
		worldToLocal:null,
		predraw:null,
	};
	_drawDebug = false;

	constructor(p=vec2()){
		super();

		if(p.constructor.name == 'Anchors'){
			this.#anchor = p;
		} else {
			this.#anchor = Anchors.TopLeft(0, 0, 0, 0);
		}
		this.#position = vec2(p.x, p.y);
	}
	get children(){
		// returns a COPY of the array
		return this.#children.slice();
	}
	get childCount(){
		return this.#children.length;
	}
	dirty(){
		this.#dirty = true;
		this.#children.forEach(t => t.dirty());
	}
	get anchor(){
		return this.#anchor;
	}
	set anchor(a){
		this.#anchor=a;
		this.dirty();
	}
	get position(){
		return this.#position;
	}
	set position(p){
		this.#position = p;
		this.dirty();
	}
	get x(){
		return this.#position.x;
	}
	set x(x){
		this.#position.x = x;
		this.dirty();
	}
	get y(){
		return this.#position.y;
	}
	set y(y){
		this.#position.y = y;
		this.dirty();
	}
	get scale(){
		return this.#scale;
	}
	set scale(s){
		this.#scale = s;
		this.dirty();
	}
	get sx(){
		return this.#scale.x;
	}
	set sx(x){
		this.#scale.x = x;
		this.dirty();
	}
	get sy(){
		return this.#scale.y;
	}
	set sy(y){
		this.#scale.y = y;
		this.dirty();
	}
	get angle(){
		return this.#angle;
	}
	set angle(a){
		this.#angle = a;
		this.dirty();
	}
	get root() {
		let p = this.#parent;
		while(p&&p.parent) p = p.parent;
		return p;
	}
	get parent() {
		return this.#parent;
	}
	set parent(p) {
		if(p==null) this.removeFromParent();
		else p.addChild(this);
	}
	get rect() {
		return this.#rect;
	}
	get offset_rect(){
		return this.#offset_rect;
	}
	removeFromParent(){
		if(this.#parent && this.#parent.#children){ // if parent is a transform...
			// remove from parent's children list:
			const i = this.#parent.#children.indexOf(this);
			this.#parent.#children.splice(i,1);
			this.#parent = null;
		}
	}
	addChild(xform, i=-1){
		xform.removeFromParent();
		xform.#parent = this;
		if(i >= 0){
			this.#children.splice(i, 0, xform); 
		} else {
			this.#children.push(xform);
		}
		this.dirty();
	}
	render(){
		// this function can't be called draw()
		// of the game will see it has a renderable component
		// this would cause an infinite loop

		this.#matrix.draw.apply();
		this.gameObject.drawComponents();
		
		// draw debug:
		this.#drawDebug();

		// tell children to draw:
		this.#children.forEach(t => t.render());
	}
	#drawDebug(){
		if(!this._drawDebug) return;
		this.#matrix.predraw.apply();
		const x = this.#anchorpos.x;
		const y = this.#anchorpos.y;
		const str = "x: "+Math.round(this.x)+" y: "+Math.round(this.y)+" w: "+Math.round(this.#rect.w)+" h:"+Math.round(this.#rect.h);
		const width = Font.basic.measure(str).width + 6;
		const height = Font.basic.props.size + 4;
        const gfx = Game.gfx;
		gfx.fillStyle="#000";
		gfx.fillCircle(x,y,10);
		gfx.fillStyle="#FFF";
		gfx.fillCircle(x,y,8);
		gfx.fillStyle=Color.RGBA(0,0,0,.8);
		gfx.fillRect(x,y-height,width,height);
		gfx.fillStyle="#FFF";
		gfx.fillText(str,x+3,y-4);
		this.#rect.draw();
		this.#anchor.draw();
	}
	update(){

		if(this.#dirty) this.calcMatrices();

		// tell children to update:
		this.transform.#children.forEach(c => c.gameObject.update());
	}
	calcMatrices(){
		this.#dirty = false;

		if(this.parent) {
			this.#rect = this.#anchor.calcRectFromParent(this.parent.#rect);
		} else {
			this.#rect = Rect.from(Game.view.size);
		}
		this.#offset_rect = Rect.from(this.#rect);
		this.#offset_rect.x = -this.#offset_rect.w * this.#anchor.origin?.x??0;
        this.#offset_rect.y = -this.#offset_rect.h * this.#anchor.origin?.y??0;

		// this is the local origin
		this.#anchorpos = this.#rect.getPositionOfAnchor(this.#anchor.origin ?? vec2(0));

		const m1 = new Matrix(); // parent-to-local
		const m2 = new Matrix(); // local-to-parent

		// build parent-origin to local-origin
		m1.translate(this.#anchorpos.x, this.#anchorpos.y);
		m1.rotate(this.#angle);
		m1.scale(this.#scale.x, this.#scale.y);

		// build inverse (local-to-parent)
		m2.scale(1/this.#scale.x, 1/this.#scale.y);
		m2.rotate(-this.#angle);
		m2.translate(-this.#anchorpos.x, -this.#anchorpos.y);

		this.#matrix.parentToLocal = m2;
		this.#matrix.localToParent = m1;

		// multiply matrices by parents' matrices:

		// the predraw matrix is simply the parent's world-matrix
		// this allows us to draw parent-oriented debug info
		this.#matrix.predraw = (this.parent&&this.parent.#matrix) ? new Matrix(this.parent.#matrix.localToWorld) : new Matrix();
		this.#matrix.predraw.translate(this.x, this.y);
		
		// where to draw the 
		this.#matrix.draw = Matrix.mult(this.#matrix.predraw, m1);

		this.#matrix.localToWorld = new Matrix(this.#matrix.draw);
		this.#matrix.localToWorld.translate(-this.#anchorpos.x, -this.#anchorpos.y);
		
		this.#matrix.worldToLocal = (this.parent&&this.parent.#matrix) ? Matrix.mult(m2, this.parent.#matrix.worldToLocal) : m2;
		
		// tell the other components to refresh layouts
		this.gameObject.layout();
	}
	worldToLocal(p){
		return this.#matrix.worldToLocal.vec(p);
	}
	localToWorld(p){
		return this.#matrix.localToWorld.vec(p);
	}
}