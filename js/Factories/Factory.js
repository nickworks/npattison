const Factory = {
	Empty(p=vec2(),o=vec2(),customBehavior={}){
		const obj = new GameObject(customBehavior);
		obj.transform.position = p;
		obj.transform.anchor = o;
		return obj;
	},
	TextField(text="hello",p=vec2(),o=vec2(),font=Font.basic){
		const obj = this.Empty(p,o);
		obj.addComponent(new RenderText(text, font) );
		return obj;
	},
	Sprite(src="",p=vec2(),o=vec2()){
		const obj = this.Empty(p,o);
		obj.addComponent( new RenderSprite(src) );
		return obj;
	},
	Shape(pts=[],p=vec2(),o=vec2()){
		const obj = this.Empty(p,o);
		obj.addComponent( new RenderShape(pts) );
		return obj;
	},
	RoundRect(r=5,c="#CCC",p=vec2(),o=vec2(),s=vec2(100,50),customBehavior={}){
		const obj = this.Empty(p,o,customBehavior);
		obj.transform.rect.w = s.x;
		obj.transform.rect.h = s.y;

		obj.addComponent( new RoundedRect(r,c) );
		return obj;
	},
	Particles(url="",p=vec2(),o=vec2(),customBehavior={}){
		const obj = this.Empty(p,o,customBehavior);
		obj.addComponent( new RenderParticles(url) );
		return obj;
	},
	Split(children=[],p=vec2(),o=vec2(),customBehavior={}){
		const obj = this.Empty(p,o,customBehavior);
		obj.addComponent( new SplitPanel(children) );
		return obj;
	},
};