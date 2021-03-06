const mouse={
    x:0,
    y:0,
    px:0,
    py:0,
    left:false,
    left_prev:false,
    right:false,
    right_prev:false,
    setup:function(element,game){
        element.addEventListener("mousemove",(e)=>{
            this.x=e.offsetX;
            this.y=e.offsetY;
        });
        element.addEventListener("mousedown",(e)=>{
            if(e.button==0)this.left=true;
            if(e.button==2)this.right=true;
        });
        element.addEventListener("mousewheel",(e)=>{
            let scrollUp = (e.wheelDeltaY>0);
            
        })
        element.oncontextmenu = (e)=>{ return false; };
        document.addEventListener("mouseup",(e)=>{
            if(e.button==0)this.left=false;
            if(e.button==2)this.right=false;
        });
        document.addEventListener("contextmenu",(e)=>{
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    },
    update:function(){
        this.left_prev=this.left;
        this.right_prev=this.right;
        this.px=this.x;
        this.py=this.y;
    },
    isDown:function(){
        return this.left;
    },
    isDownRight:function(){
        return this.right;
    },
    onDown:function(){
        return(this.left&&!this.left_prev);
    },
    onDownRight:function(){
        return(this.right&&!this.right_prev);
    },
    pos:function(){
        return{x:this.x,y:this.y};  
    },
    delta:function(){
        return{x:this.x-this.px,y:this.y-this.py};
    }
};