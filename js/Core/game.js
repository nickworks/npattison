const Game = class {

    static DEVMODE = true;

    constructor(scene=null){

        this.time={
            now:0,
            prev:0,
            dt:0,
            scale:1,
            _dt:0, // unscaled dt
            tick:(t)=>{
                if(t === undefined) t = 0;
                if(this.time.scale<0)this.time.scale=0;
                this.time.now = t;
                this.time._dt = (t - this.time.prev) / 1000;
                this.time.dt = this.time._dt * this.time.scale;
                this.time.prev = t;
                //Game.Repair(this);
                this.update();
            },
            // these are used in DEVMODE:
            delayUpdateFPS:0,
            frameRate:0,
        }
        // game.view
        // This section controls the size of the viewport,
        // and it has refences to the canvas element
        // and to the graphics renderer
        this.view={
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
                    if(game.scene) game.scene.doResize(w,h);
                }
            }
        }
        // reference to the current scene
        this.scene=scene;
        // reference to the next scene (so we can fade between the two scenes)
        this.nextScene=null;
    }

    // returns the width of the viewport
    width(){return this.view.size.w;}

    // returns the height of the viewport
    height(){return this.view.size.h;}

    // returns view.gfx
    gfx(){return this.view.gfx;}

    update(){

        this.view.resizeCanvas(); // if the canvas needs resizing, do it

        // update global values:
        this.globals();

        if(this.scene){
            this.scene.update();
            this.draw(); // draw current scene + overlay(s)
        } else {
            this.scene=new SceneTitle(); // if no scene, default to sceneTitle
        }

        this.lateUpdate();
    }
    globals(){
        window.scene=this.scene;
        window.game=this;
        window.gfx=this.view.gfx;
    }
    draw(){
        Matrix.clear();
        this.scene.draw();        
    }
    switchScene(nextScene){
        this.nextScene = nextScene;
    }
    lateUpdate(){

        // this draws a fade overtop of everything
        // which is why it's in lateUpdate()
        const doneFading = this.view.fade(!this.nextScene);

        if(this.nextScene && doneFading) {
            this.scene = this.nextScene;
            this.nextScene = null;
        }

        //sfx.update();
        keyboard.update();
        mouse.update();

        // queue up the next frame for rendering:
        requestAnimationFrame((timestamp)=>this.time.tick(timestamp));
    }
    loadLevel(n){
        scene=this.scene=new ScenePlay(n);  
    }
    start(id){
        this.view.make(id);
        
        window.addEventListener("blur",()=>{
            if(scene&&scene.pause)scene.pause();
            keyboard.blur();
        });
        window.addEventListener("resize",(e)=>{
            if(this.view.isFullscreen)this.view.fullscreen(true);
        });
        document.body.addEventListener("click",()=>{
            //sfx.audio.resume().then(()=>sfx.loadSounds());
        })
        keyboard.setup();
        mouse.setup(this.view.canvas, this);
        
        //sprites.init(this.view.gfx);
        //sfx.loadSounds();
        this.update(0); // begin game loop
    }
}