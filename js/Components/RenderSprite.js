class RenderSprite extends GameComponent {
	constructor(url){
		super();

        this.img = new Image();
		this.img.addEventListener("load", ()=>{
			// this was to update the transform with the size of this rect
			// the transform needs to know the size of the rect to properly
			// position child objects in it


			// however, the negative x/y results in an odd offset

            this.transform.rect.w = this.img.width;
            this.transform.rect.h = this.img.height;
        });
        this.anchor = {x:0.5, y:0.5}; // percents
        this.load(url);
    }
    load(url){
    	this.img.src = url;
    }
    draw(){
    	gfx.fillStyle="#FF0000";


    	const w = this.img.width;
    	const h = this.img.height;
    	const x = -this.anchor.x*w;
    	const y = -this.anchor.y*h;

    	this.transform.rect.x = x;
    	this.transform.rect.y = y;
    	this.transform.rect.w = w;
    	this.transform.rect.h = h;

    	gfx.fillRect(x,y,w,h);
        gfx.drawImage(this.img, x, y);

    }
}