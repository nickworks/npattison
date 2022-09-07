class RenderText extends GameComponent {
	constructor(text="placeholder",font){
		super();
		this.text=text;
	    this.font=font;
	}
	draw(){
        this.font.apply();
        Game.gfx.fillText(this.text,0,0);
    }
}