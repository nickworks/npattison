class Scene {
	constructor(){
        
        // this object contains all of the objects in the scene
        // objects are sorted into categories (for collision detection, etc)
		this.objs={
			get(i){
				return this.all[i]||{};
			},
			getUnderMouse(){
				let obj = null;
				this.all.forEach(o=>{
					if(o.rect.mouseOver())obj=o; 
				});
				return obj;
			},
			clear(){
				this.all =[];
			},
            add(obj){
                this.all.push(obj);
                switch(obj.constructor.name){
                    case "some class":
                }
            },
            remove(obj){
                this.removeFrom(obj, this.all);
            },
            removeFrom(obj, arr){
                const i = arr.indexOf(obj);
                if(i != -1) arr.splice(i, 1); 
            },
            indexOf(obj){
            	return this.all.indexOf(obj);
            },
            cleanup(){
                // remove dead objects
                for(let i=this.all.length-1; i>= 0; i--){
                    const obj = this.all[i];
                    if(obj.dead) this.remove(obj);
                }
            },
            allByType(){
                const sorted={};
                this.all.forEach(i=>{
                    const n = i.constructor.name;
                    if(!Array.isArray(sorted[n])) sorted[n] = [];
                    sorted[n].push(i);
                });
                return sorted;
            }
        };
        this.objs.clear();
        this.guis={
            overlays:[],
            modals:[],
        };
        this.particles=[];
		
        this.cam=new Camera();
        this.gravity=1200;
	}
    add(obj){
        obj.transform.parent = this;
        this.objs.add(obj);
        return obj;
    }
    pause(){
        if(this.guis.editor) return;
        //this.guis.pause = new Pause();
    }
    unpause(){
        this.guis.pause = null;
    }
	draw(){
        game.view.fill("#666676");

        this.cam.drawStart();
        this.objs.all.forEach(o => o.draw());
        this.particles.forEach(p => p.draw());

        this.cam.drawEnd();

        // GUI OVERLAYS:
        this.guis.overlays.forEach(m => m.draw());
        this.guis.modals.forEach(m => m.draw());
    }
	update(){
        

        if(this.guis.modals.length == 0){
            // update all objects
            this.objs.all.forEach(o => o.update());

            this.doCollisionDetection();

            // remove all objects marked as "DEAD"
            this.objs.cleanup();


            // update particles:
            this.reverseIterate(this.particles, (o, i) =>{
                o.update();
                if(o.dead) this.particles.splice(i,1);
            });
            this.reverseIterate(this.guis.overlays, (o, i)=>{
                o.update();
                if(o.dead) this.guis.overlays.splice(i,1);
            });
        } else {
            // UPDATE MODALS:
            this.reverseIterate(this.guis.modals, (o, i)=>{
                o.update();
                if(o.dead) this.guis.modals.splice(i,1);
            });
        }

        // update camera
        this.cam.update();
        
        return false;
    }
    reverseIterate(arr, f){
        for(var i = arr.length - 1; i >= 0; i--){
            f(arr[i], i);
        }
    }
    doResize(w,h){
        
    }
    doCollisionDetection(){
        // do collision detection:

        // this.objs.sometype.forEach(b => { b.block(this.objs.othertype); })
        // this.objs.sometype.forEach(b => { b.overlap(this.objs.othertype); })

    }
    modal(modal){

    	const types = this.guis.modals.map(m => Object.getPrototypeOf(m));
    	const typeAlreadyExists = types.includes(Object.getPrototypeOf(modal));

    	if (typeAlreadyExists) return;

    	this.guis.modals.push(modal);
    }
    removeModal(modal){

        var i = this.guis.modals.indexOf(modal);
        this.guis.modals.slice(i,1);
    }
}