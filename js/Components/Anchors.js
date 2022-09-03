const AnchorType = {
	Simple : 0,
	NoStretch : 1 ,
	Stretch : 2,
	StretchHorizontal : 3,
	StretchVertical : 4,
};

class Anchors {

	static TopLeft(x=0, y=0, w=0, h=0) {
		return new Anchors(vec2(0), vec2(0)).setPosition(x, y).setSize(w, h);
	};
	static TopRight(x=0, y=0, w=0, h=0) {
		return new Anchors(vec2(1,0), vec2(1,0)).setPosition(x, y).setSize(w, h);
	};
	static TopCenter(x=0, y=0, w=0, h=0) {
		return new Anchors(vec2(.5,0), vec2(.5,0)).setPosition(x, y).setSize(w, h);
	};
	static BottomLeft(x=0, y=0, w=0, h=0) {
		return new Anchors(vec2(0,1), vec2(0,1)).setPosition(x, y).setSize(w, h);
	};
	static BottomRight(x=0, y=0, w=0, h=0) {
		return new Anchors(vec2(1,1), vec2(1,1)).setPosition(x, y).setSize(w, h);
	};
	static BottomCenter(x=0, y=0, w=0, h=0) {
		return new Anchors(vec2(.5,1), vec2(.5,1)).setPosition(x, y).setSize(w, h);
	};
	static CenterLeft(x=0, y=0, w=0, h=0) {
		return new Anchors(vec2(0,.5), vec2(0, .5)).setPosition(x, y).setSize(w, h);
	};
	static CenterRight(x=0, y=0, w=0, h=0) {
		return new Anchors(vec2(1,.5), vec2(1,.5)).setPosition(x, y).setSize(w, h);
	};
	static Center(x=0, y=0, w=0, h=0) {
		return new Anchors(vec2(.5), vec2(.5)).setPosition(x, y).setSize(w, h);
	};
	static Stretch(t=0, r=0, b=0, l=0) {
		return new Anchors(vec2(0), vec2(1)).setMargins(t, r, b, l);
	};
	static StretchHorizontal(l=0, r=0, y=0, h=0) {
		return new Anchors(vec2(0, .5), vec2(1, .5)).setMargins(0, r, 0, l).setPosition(0, y).setSize(0, h);
	};
	static StretchVertical(t=0, b=0, x=0, w=0) {
		return new Anchors(vec2(.5, 0), vec2(.5, 1)).setMargins(t, 0, b, 0).setPosition(x, 0).setSize(w, 0);
	};
	static TopStretch(l=0, r=0, y=0, h=0) {
		return new Anchors(vec2(0,0), vec2(1,0)).setMargins(0, r, 0, l).setPosition(0, y).setSize(0,h);
	};
	static BottomStretch(l=0, r=0, y=0, h=0) {
		return new Anchors(vec2(0,1), vec2(1,1)).setMargins(0, r, 0, l).setPosition(0, y).setSize(0,h);
	};
	static LeftStretch(t=0, b=0, x=0, w=0) {
		return new Anchors(vec2(0,0), vec2(0,1)).setMargins(t, 0, b, 0).setPosition(x, 0).setSize(w,0);
	};
	static RightStretch(t=0, b=0, x=0, w=0) {
		return new Anchors(vec2(1,0), vec2(1,1)).setMargins(t, 0, b, 0).setPosition(x, 0).setSize(w,0);
	};

	#anchorType = 0;
	#anchorMin = 0;
	#anchorMax = 0;
	#marginLeft = 0;
	#marginTop = 0;
	#marginRight = 0;
	#marginBottom = 0;
	#fixedWidth = 0;
	#fixedHeight = 0;
	#origin = vec2(0);
	#position = vec2(0);

	#pxAnchorMin = vec2(0);
	#pxAnchorMax = vec2(0);

	constructor(min = vec2(0), max = undefined){
		this.setAnchor(min, max);
		this.setMargins(0);
		this.setPosition(0,0);
		this.setSize(0,0);
	}
	get origin(){
		return this.#origin;
	}
	setPosition(x=0, y=0){
		this.#position = vec2(x,y);
		return this;
	}
	setSize(w=0, h=0){
		this.#fixedWidth = w;
		this.#fixedHeight = h;
		return this;
	}
	setAnchor(min=vec(0), max=undefined){
		if(max === undefined || max === null) {
			this.#anchorType = AnchorType.Simple;
			// TODO position = min
			this.#anchorMin = this.#anchorMax = vec2(0);
		} else {
			this.#anchorMin = min;
			this.#anchorMax = max;
			const doesStretchH = (min.x != max.x);
			const doesStretchV = (min.y != max.y);
			if(doesStretchH && doesStretchV){
				this.#anchorType = AnchorType.Stretch;
			} else if(!doesStretchH && !doesStretchV){
				this.#anchorType = AnchorType.NoStretch;
			} else if(doesStretchH) {
				this.#anchorType = AnchorType.StretchHorizontal;
			} else if(doesStretchV){
				this.#anchorType = AnchorType.StretchVertical;
			}
		}
		return this;
	}
	setOrigin(x=0, y=0){
		this.#origin.x = x;
		this.#origin.y = y;
		return this;
	}
	setMargins(... args){

		let t = 0;
		let l = 0;
		let b = 0;
		let r = 0;
		
		if(args.length >= 4){
			t = args[0];
			r = args[1];
			b = args[2];
			l = args[3];
		} else if(args.length == 3) {
			t = args[0];
			l = r = args[1];
			t = args[2];
		} else if(args.length == 2) {
			t = b = args[0];
			l = r = args[1];
		} else if(args.length == 1) {
			t = l = b = r = args[0];
		}
		this.#pxAnchorMin = vec2(0);
		this.#pxAnchorMax = vec2(0);

		this.#marginTop=Number(t);
		this.#marginLeft=Number(l);
		this.#marginBottom=Number(b);
		this.#marginRight=Number(r);
		
		return this;
	}
	calcRectFromParent(parentRect){
		this.#pxAnchorMin = parentRect.getPositionOfAnchor(this.#anchorMin);
		this.#pxAnchorMax = parentRect.getPositionOfAnchor(this.#anchorMax);
		
		const xMin = this.#pxAnchorMin.x + this.#marginLeft;
		const yMin = this.#pxAnchorMin.y + this.#marginTop;
		const xMax = this.#pxAnchorMax.x - this.#marginRight;
		const yMax = this.#pxAnchorMax.y - this.#marginBottom;
		
		const availableSpace = new Rect(xMin, yMin, xMax - xMin, yMax - yMin);

		const w = this.#fixedWidth;
		const h = this.#fixedHeight;
		const x = this.#pxAnchorMin.x - this.#origin.x * w + this.#position.x;
		const y = this.#pxAnchorMin.y - this.#origin.y * h + this.#position.y;

		switch(this.#anchorType){
			case AnchorType.NoStretch:
				return new Rect(x,y,w,h);
			case AnchorType.Stretch:
				return availableSpace;
			case AnchorType.StretchVertical: 
				return new Rect(x,yMin,w,yMax - yMin);
			case AnchorType.StretchHorizontal: 
				return new Rect(xMin,y,xMax - xMin,h);
			case AnchorType.Simple:
				return new Rect(this.#position.x, this.#position.y, 0, 0);
		}
		console.log("error!");
	}
	draw(){
        // gfx.strokeStyle = "#FFF";
        // gfx.strokeRect(
		// 	this.#marginLeft,
		// 	this.#marginTop,
		// 	this.#marginRight - this.#marginLeft,
		// 	this.#marginBottom - this.#marginTop);
		
		// the four corners are cached in _pxAnchorMin and _pxAnchorMax
		// draw the four corners:
		gfx.fillStyle="#F88";
		gfx.fillCircle(this.#pxAnchorMin.x,this.#pxAnchorMin.y,4);
		
		gfx.fillStyle="#88F";
		gfx.fillCircle(this.#pxAnchorMax.x,this.#pxAnchorMax.y,4);
		
		gfx.fillStyle="#8F8";
		gfx.fillCircle(this.#pxAnchorMin.x,this.#pxAnchorMax.y,4);
		
		gfx.fillStyle="#8F8";
		gfx.fillCircle(this.#pxAnchorMax.x,this.#pxAnchorMin.y,4);
    }
	/*
    drawStroke(color="#F00",w=3){
        gfx.beginPath();
        gfx.strokeStyle=color;
        gfx.strokeWegith=+w;
        gfx.rect(this.#x,this.#y,this.#w,this.#h);
        gfx.stroke();
    }*/
}
