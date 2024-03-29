const Rect = class {

    static grow(r,a){
        return new Rect(r.x-a/2,r.y-a/2,r.w+a,r.h+a);
    }
    static from(raw){
        return new Rect(raw.x,raw.y,raw.w,raw.h);
    }
    static lerp(a,b,t){
        let x=a.x+(b.x-a.x)*t;
        let y=a.y+(b.y-a.y)*t;
        let w=a.w+(b.w-a.w)*t;
        let h=a.h+(b.h-a.h)*t;
        return new Rect(x,y,w,h);
    }
    constructor(x,y,w,h){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.vx=0;
        this.vy=0;
        this.prev={};
        this.fix();
    }
    getPositionOfAnchor(relPos){
        // given a percent-based position (an `anchor`),
        // this function will return a position within the rect

        let x = relPos.x*this.w+this.x;
        let y = relPos.y*this.h+this.y;
        return {x:x,y:y};
    }
    getChildRect(anchorMin, anchorMax){

        const x = anchorMin.x*this.w + this.x;
        const y = anchorMin.y*this.h + this.y;
        const w = anchorMax.x*this.w + this.x - x;
        const h = anchorMax.y*this.h + this.y - y;

        return {
            x:x,
            y:y,
            w:w,
            h:h,
        };
    }
    merge(x,y,w,h){

        const max = this.max();
        if(x < this.x) this.x = x;
        if(y < this.y) this.y = y;

        this.w = (x+w > max.x) ? w : max.x - this.x;
        this.y = (y+h < max.y) ? h : max.y - this.y;

        this.fix();
    }
    fix(){
        // if w or h are negative, adjust the values
        if(this.w<0){
            this.w*=-1;
            this.x-=this.w;
        }
        if(this.h<0){
            this.h*=-1;
            this.y-=this.h;
        }   
    }
    setRaw(raw){
        this.x=raw.x;
        this.y=raw.y;
        this.w=raw.w;
        this.h=raw.h;
        this.fix();
    }
    speed(){
        // calculate the velocity this rect is moving
        // IMPORTANT: this velocity is per-second! It has delta-time already applied.
        this.vx=this.x-this.prev.x;
        this.vy=this.y-this.prev.y;
        this.cache();
    }
    cache(){
        this.prev=this.raw();
    }
    copy(){
        return new Rect(this.x,this.y,this.w,this.h);
    }
    hits(p){
        return (p.x>this.x&&p.x<this.x+this.w&&p.y>this.y&&p.y<this.y+this.h);
    }
    // this checks to see if this rect overlaps with a circle
    overlapsCircle(x,y,r){
        const p={ // nearest point in rect to the circle's center
            x:Maths.clamp(x,this.x,this.x+this.w),
            y:Maths.clamp(y,this.y,this.y+this.h),
        }
        const dx=p.x-x;
        const dy=p.y-y;
        
        const d2=(dx*dx+dy*dy);
        if(d2>r*r) return null;

        const d = Math.sqrt(d2);

        return {
            p:(r-d)/r,      // percent of the circle penetrated (1 = exact center)
            dis:d,          // distance from center of circle to penetration point
            dir:{           // direction towards penetration point
                x:dx/d,     // normalized x
                y:dy/d,     // normalized y
            }
        };
        
        return null; // not intersecting
    }
    overlaps(o){
        const r=this;
        if(r.x>=o.x+o.w) return false;
        if(r.x+r.w<=o.x) return false;
        if(r.y>=o.y+o.h) return false;
        if(r.y+r.h<=o.y) return false;
        return true;
    }
    groupCheck(g,o){
        g.forEach(i=>{
            if(this.overlaps(i.rect)) o(i);
        });
    }
    findFix(o){
        
        // find how far to move other to get it out of this

        const r=this;
        let moveL=r.x-(o.x+o.w);
        let moveR=(r.x+r.w)-o.x;
        let moveU=r.y-(o.y+o.h);
        let moveD=(r.y+r.h)-o.y;
        
        // get previous position of other's center:
        const prevOther=o.mid();
        prevOther.y-=o.vy;
        prevOther.x-=o.vx;

        // get previous position of this center:
        const prevThis=r.mid();
        prevThis.x-=r.vx;
        prevThis.y-=r.vy;

        const otherWasLeft = (prevOther.x < prevThis.x);
        const otherWasAbove = (prevOther.y < prevThis.y);

        const res={x:0,y:0};
        res.x=(Math.abs(moveL)<Math.abs(moveR) || otherWasLeft)?moveL:moveR;
        res.y=(Math.abs(moveU)<Math.abs(moveD) || otherWasAbove)?moveU:moveD;

        if(o.vx>0&&res.x>0)res.x=0;         // if moving right, nullify fix right
        else if(o.vx<0&&res.x<0)res.x=0;    // if moving left, nullify fix left
        else if(o.vy>0&&res.y>0)res.y=0;    // if moving down, nullify fix down
        else if(o.vy<0&&res.y<0)res.y=0;    // if moving up, nullify fix up
        else if(Math.abs(res.x)<Math.abs(res.y))res.y=0; // if horizontal fix is smaller than vertical, nullify vertical
        else res.x=0; // else nullify horizontal

        return res;
    }
    toString(){
        return "{"+this.x+", "+this.y+", "+this.w+", "+this.h+"}";
    }
    draw(){
        const gfx = Game.gfx;
        gfx.strokeStyle = "#FFF";
        gfx.strokeRect(this.x,this.y,this.w,this.h);
    }
    drawStroke(color="#F00",w=3){
        const gfx = Game.gfx;
        gfx.beginPath();
        gfx.strokeStyle=color;
        gfx.strokeWeight=+w;
        gfx.rect(this.x,this.y,this.w,this.h);
        gfx.stroke();
    }
    raw(){
        return {x:this.x,y:this.y,w:this.w,h:this.h};
    }
    mid(){
        return {x:this.x+this.w/2,y:this.y+this.h/2};
    }
    min(){
        return {x:this.x, y:this.y};
    }
    max(){
        return {x:this.x+this.w,y:this.y+this.h};
    }
    mouseOver(){
        return(scene.cam && this.hits(scene.cam.worldMouse()));
    }
}