const Game = class {

    static DEVMODE = true;
    static #scene = null;
    static #nextScene = null
    static #alreadyRan = false;
    static get gfx() { return Game.view.gfx; }
    static time = {
        now:0,
        prev:0,
        dt:0,
        scale:1,
        unscaled_dt:0,
        delayUpdateFPS:0,
        frameRate:0,
        tick:(t)=>{
            if(t === undefined) t = 0;
            if(Game.time.scale<0)Game.time.scale=0;
            Game.time.now = t;
            Game.time.unscaled_dt = (t - Game.time.prev) / 1000;
            Game.time.dt = Game.time.unscaled_dt * Game.time.scale;
            Game.time.prev = t;
            Game.time.delayUpdateFPS -= Game.time.unscaled_dt;
            if(Game.time.delayUpdateFPS <= 0) {
                Game.time.frameRate = parseInt(1.0/Game.time.unscaled_dt);
                Game.time.delayUpdateFPS=.5;
            }
            Game.#update();
        },
    };

    // This section controls the size of the viewport,
    // and it has refences to the canvas element and the graphics renderer
    static view = {
        //size:{w:0,h:0},
        size:new Rect(0,0,0,0),
        canvas:null,
        gfx:null,
        isFullscreen:false,
        alphaOverlay:1,
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
        },
        // fade in or out, returns true when done
        fade(isDark){

            if(Game.DEVMODE) return true;

            const dif = (isDark ? -1 : 1) * game.time.dt;
            let a = this.alphaOverlay + dif;

            if(a<0) a = 0;
            if(a>1) a = 1;

            this.fill("rgba(0,0,0,"+a+")");
            this.alphaOverlay = a;

            if(isDark && a == 0) return true;
            if(!isDark && a == 1) return true;

            return false;
        },
        // fills the screen with a specified color
        fill(color="#000"){
            this.gfx.fillStyle=color;
            this.gfx.fillRect(0, 0, this.size.w, this.size.h); // clear screen
        },
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

    // returns the width of the viewport
    static width(){return Game.view.size.w;}

    // returns the height of the viewport
    static height(){return Game.view.size.h;}

    static #update(){
        Game.#resizeCanvas();

        Game.#scene?.update();
        Game.#draw(); // draw current scene + overlay(s)

        Game.#lateUpdate();
    }
    static #resizeCanvas(){
        if(Game.view.resizeCanvas()) Game.#scene?.transform?.dirty();
    }
    static #draw(){
        Matrix.clear();
        Game.#scene?.draw();
        if(Game.DEVMODE){
            Matrix.clear();
            Game.#drawDev();
        }
    }
    static #drawDev(){
        const gfx = Game.gfx;
        gfx.font="10pt Courier";
        gfx.textAlign="center";
        gfx.textBaseline="middle";
        gfx.fillStyle="rgba(0,0,0,.8)";
        gfx.fillRect(Game.width()-30,Game.height()-18,30,18);
        gfx.fillStyle="#FFF";
        gfx.fillText(Game.time.frameRate,Game.width()-15,Game.height()-9);
    }
    static switchScene(nextScene){
        Game.#nextScene = nextScene;
    }
    static #lateUpdate(){

        // self draws a fade overtop of everything
        // which is why it's in lateUpdate()
        const doneFading = Game.view.fade(!Game.#nextScene);

        if(Game.#nextScene && doneFading) {
            Game.#scene = Game.#nextScene;
            Game.#nextScene = null;
        }

        //sfx.update();
        keyboard.update();
        mouse.update();

        // queue up the next frame for rendering:
        requestAnimationFrame((timestamp)=>Game.time.tick(timestamp));
    }
    static start(id){
        if(Game.#alreadyRan) return;
        Game.#alreadyRan = true;
        Game.view.make(id);
        
        window.addEventListener("blur",()=>{
            if(Game.scene&&Game.scene.pause)Game.scene.pause();
            keyboard.blur();
        });
        window.addEventListener("resize",(e)=>{
            if(Game.view.isFullscreen)Game.view.fullscreen(true);
        });
        document.body.addEventListener("click",()=>{
            //sfx.audio.resume().then(()=>sfx.loadSounds());
        })
        keyboard.setup();
        mouse.setup(Game.view.canvas, self);
        
        //sprites.init(Game.view.gfx);
        //sfx.loadSounds();
        Game.#update(0); // begin game loop

        return Game;
    }
}