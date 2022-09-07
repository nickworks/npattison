// This section controls the size of the viewport,
// and it has refences to the canvas element and the graphics renderer
const View = class {

    size = new Rect(0,0,0,0);
    canvas = null;
    gfx = null;
    isFullscreen = false;
    #alphaOverlay = 1;

    // get the canvas and drawing context by using a provided id
    make(id){
        this.canvas=document.getElementById(id);
        if(this.canvas==undefined) return false;
        this.gfx=this.canvas.getContext("2d");
        if(this.gfx==undefined) return false;

        this.gfx.fillCircle=(x,y,r)=>{
            this.gfx.beginPath();
            this.gfx.ellipse(x,y,r,r,0,0,Math.PI*2);
            this.gfx.fill();
        };

        return true;
    }
    // fade in or out, returns true when done
    fade(isDark){

        if(Game.DEVMODE) return true;

        const dif = (isDark ? -1 : 1) * Time.dt;
        let a = this.#alphaOverlay + dif;

        if(a<0) a = 0;
        if(a>1) a = 1;

        this.fill("rgba(0,0,0,"+a+")");
        this.#alphaOverlay = a;

        if(isDark && a == 0) return true;
        if(!isDark && a == 1) return true;

        return false;
    }
    // fills the screen with a specified color
    fill(color="#000"){
        this.gfx.fillStyle=color;
        this.gfx.fillRect(0, 0, this.size.w, this.size.h); // clear screen
    }
    resizeCanvas(){
        const w = document.body.clientWidth;
        const h = window.innerHeight;
        if(this.canvas.width != w || this.canvas.height != h){
            this.size.w=this.canvas.width=w;
            this.size.h=this.canvas.height=h;
            return true;
        }
        return false;
    }
};