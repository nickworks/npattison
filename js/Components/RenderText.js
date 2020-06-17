class RenderText extends GameComponent {
	constructor(text="placeholder",font){
		super();
		this.text=text;
	    this.x=0;
	    this.y=0;
	    this.font=new Font(font);
	}
	draw(){
        this.font.apply();
        gfx.fillText(this.text,this.x,this.y);
    }
}