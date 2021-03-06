const Factory = {
	TextField(text="hello",font=Font.basic){
		return new RenderText(text, font);
	},
	Sprite(src=""){
		return new RenderSprite(src);
	},
	Shape(pts=[]){
		return new RenderShape(pts);
	},
	RoundRect(r=10,c="rgba(0,0,0,.5)"){
		return new RoundedRect(r,c);
	},
	Particles(url=""){
		return new RenderParticles(url);
	},
	Split(children=[],vert=false,padding=10,margin=0){
		return new SplitPanel(children, vert, padding, margin);
	},
};