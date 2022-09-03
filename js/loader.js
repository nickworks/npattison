// This function loads one or more scripts in order,
// when they're all loaded, an optional callback is ran.
// It is a recursive nightmare.
const loadThen=(a,callback=()=>{},showFiles=false)=>{
    let loaded=0;
    if(typeof a=="string"){
        // LOAD SCRIPT:
        const s=document.createElement('script');
        s.addEventListener("load", ()=>{ // when the file has loaded:
            if(showFiles)console.log(a+" loaded");
            if(typeof callback == "function")callback(); // run the callback
        });
        s.src=a; document.head.appendChild(s); // add the <script> to the DOM
    }
    else if(Array.isArray(a)){
        if(a.length > 0)
            loadThen(a[0],()=>{ // load the first script in the array
                a=a.slice(1); // then shift the array
                loadThen(a,callback, showFiles); // do it again
            }, showFiles); 
        else if(typeof callback=="function")callback(); // run the callback
    }
};

// this is a list of files to load
// in the order we want them loaded
loadThen([
    // load core files:
    [
        'js/Core/Maths.js',
        'js/Core/Font.js',
        'js/Core/Color.js',
        'js/Core/Camera.js',
        'js/Core/Rect.js',
        'js/Core/Sprite.js',
        'js/Core/Matrix.js',
        'js/Core/Input/Mouse.js',
        'js/Core/Input/Keyboard.js',
        'js/Core/GameObject.js',
        'js/Core/Scene.js',
        'js/Core/Game.js',
    ],
    // load components:
    [
        'js/Components/GameComponent.js',
        'js/Components/RenderSprite.js',
        'js/Components/RenderShape.js',
        'js/Components/RenderText.js',
        'js/Components/RenderParticles.js',
        'js/Components/RoundedRect.js',
        'js/Components/SplitPanel.js',
        'js/Components/Anchors.js',
        'js/Components/Transform.js',
    ],
    // load factories, assets:
    [
        'js/Factories/Factory.js',
        'js/Factories/Data.js',
    ],
    // load user code:
    [
        'js/Experiments/MountainRange.js',
        'js/Scenes/SceneTitle.js',
    ]
],()=>{ // then run:

    Game.DEVMODE = true;

    if(Game.DEVMODE) console.log("------ ALL FILES LOADED ------");
    if(Game.DEVMODE) console.log("launching game...");
    
    Game.start("myCanvas").switchScene(new SceneTitle());

}, false);