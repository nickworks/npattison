const Factory = {
	Empty(p=vec2(0,0),o=vec2(0,0)){
		const obj = new GameObject();
		obj.transform.position.x=p.x;
		obj.transform.position.y=p.y;
		obj.transform.anchor.x=o.x;
		obj.transform.anchor.y=o.y;
		return obj;
	},
	TextField(text="hello",p=vec2(0,0),o=vec2(0,0),options={size:20, align:"left", valign:"middle"}){
		const obj = this.Empty(p,o);
		obj.addComponent(new RenderText(text,p.x,p.y,options ) );
		return obj;
	},
	Sprite(src="",p=vec2(0,0),o=vec2(0,0)){
		const obj = this.Empty(p,o);
		obj.addComponent( new RenderSprite(src) );
		return obj;
	},
	Shape(pts=[],p=vec2(0,0),o=vec2(0,0)){
		const obj = this.Empty(p,o);
		obj.addComponent( new RenderShape(pts) );
		return obj;
	},
};