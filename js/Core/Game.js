const Game = class {

    static DEVMODE = true;
    static #scene = null;
    static #nextScene = null
    static #alreadyRan = false;

    // access view values:
    static #view = new View();
    static get view() { return Game.#view; }
    static get gfx() { return Game.#view.gfx; }
    static get width() { return Game.#view.size.w; }
    static get height() { return Game.#view.size.h; }

    // switch scene:
    static switchScene = (nextScene) => { Game.#nextScene = nextScene; }

    static #update(){
        Game.#resizeCanvas();

        Game.#scene?.update();
        Game.#draw(); // draw current scene + overlay(s)

        Game.#lateUpdate();
    }
    static #resizeCanvas(){
        if(Game.#view.resizeCanvas()) Game.#scene?.transform?.dirty();
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
        gfx.fillRect(Game.width-30,Game.height-18,30,18);
        gfx.fillStyle="#FFF";
        gfx.fillText(Time.frameRate,Game.width-15,Game.height-9);
    }
    static #lateUpdate(){

        // self draws a fade overtop of everything
        // which is why it's in lateUpdate()
        const doneFading = Game.#view.fade(!Game.#nextScene);

        if(Game.#nextScene && doneFading) {
            Game.#scene = Game.#nextScene;
            Game.#nextScene = null;
        }

        //sfx.update();
        keyboard.update();
        mouse.update();

        // queue up the next frame:
        //  -- first calls Time.tick
        //  -- then calls Game.#update()
        requestAnimationFrame((timestamp)=> {
            Time.tick(timestamp);
            Game.#update();
        });
    }
    static start(id){
        if(Game.#alreadyRan) return;
        Game.#alreadyRan = true;
        Game.#view.make(id);
        
        window.addEventListener("blur",()=>{
            if(Game.scene&&Game.scene.pause)Game.scene.pause();
            keyboard.blur();
        });
        window.addEventListener("resize",(e)=>{
            if(Game.#view.isFullscreen)Game.#view.fullscreen(true);
        });
        document.body.addEventListener("click",()=>{
            //sfx.audio.resume().then(()=>sfx.loadSounds());
        })
        keyboard.setup();
        mouse.setup(Game.#view.canvas, self);
        
        //sprites.init(Game.#view.gfx);
        //sfx.loadSounds();
        Game.#update(0); // begin game loop

        return Game;
    }
}