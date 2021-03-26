const loadThen=(a,callback=()=>{},showFiles=false)=>{
    let loaded=0;
    if(typeof a=="string"){
        // LOAD SCRIPT:
        const s=document.createElement('script');
        s.addEventListener("load", ()=>{ // when the file has loaded:
            if(showFiles)console.log(a+" loaded!");
            if(typeof callback == "function")callback(); // run the callback
        });
        s.src=a; document.head.appendChild(s); // add the <script> to the DOM
    }
    else if(Array.isArray(a)){
        if(a.length > 0)
            loadThen(a[0],()=>{ // load the first script in the array
                a=a.slice(1); // then shift the array
                loadThen(a,callback); // do it again
            }); 
        else if(typeof callback=="function")callback(); // run the callback
    }
};


((showFiles)=>{

    // this is a list of the files to load
    // in the order we want them loaded
    const files=[
        
        'js/Components/GameComponent.js',
        'js/Components/RenderSprite.js',
        'js/Components/RenderShape.js',
        'js/Components/RenderText.js',
        'js/Components/RenderParticles.js',
        'js/Components/RoundedRect.js',
        'js/Components/SplitPanel.js',
        'js/Components/Transform.js',
        'js/Core/GameObject.js',

        'js/Experiments/MountainRange.js',

        'js/Core/Maths.js',
        'js/Core/Font.js',
        'js/Core/Color.js',
        'js/Core/Camera.js',
        'js/Core/Rect.js',
        'js/Core/Sprite.js',
        'js/Core/Matrix.js',
        'js/Core/Input/mouse.js',
        'js/Core/Input/keyboard.js',

        'js/Factories/Factory.js',
        'js/Factories/Data.js',

        'js/Scenes/Scene.js',
        'js/Scenes/SceneTitle.js',

        'js/Core/game.js',
    ];

    // This function loads one or more scripts in order,
    // when they're all loaded, an optional callback is ran.
    // It is a recursive nightmare.

    loadThen(files,()=>{

        Game.DEVMODE=true;

        if(Game.DEVMODE) console.log("------ ALL FILES LOADED ------");
        if(Game.DEVMODE) console.log("launching game...");
        
        window.scene=null;
        window.game=new Game();
        window.game.start("myCanvas");

    }, showFiles);

})(false);