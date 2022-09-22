class CustomComponent extends GameComponent {
	constructor(customBehavior={}){
        super();
		if(customBehavior.start) this.start = ()=> customBehavior.start();
		if(customBehavior.destroy) this.destroy = ()=> customBehavior.destroy();
		if(customBehavior.update) this.update = ()=> customBehavior.update();
        if(customBehavior.touch) this.touch = ()=> customBehavior.touch();
        if(customBehavior.layout) this.layout = ()=> customBehavior.layout();
        if(customBehavior.draw) this.draw = ()=> customBehavior.draw();
    }
}