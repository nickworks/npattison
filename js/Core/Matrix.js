class Matrix {

    static stack=[new Matrix({inverse:true})];
    static push(m){
        // adds a new Matrix in the stack
        if(!m) m = new Matrix({inverse:true});
        Matrix.stack.push(m);
        Matrix.apply();
    }
    static pop() {
        // removes the top Matrix in the stack
        Matrix.stack.pop();
        Matrix.apply();
    }
    static last() {
        // returns the top Matrix in the stack
        const s=Matrix.stack.length;
        return (s<=0)?new Matrix():Matrix.stack[s-1];
    }
    static scale(sx, sy) {
        // this scales the top Matrix in the stack by `sx` and `sy` percent
        Matrix.last().scale(sx, sy);
        Matrix.apply();
    }
    static translate(x,y) {
        // this translates the top Matrix in the stack by `x` and `y` pixels
        Matrix.last().translate(x,y);
        Matrix.apply();
    }
    static rotate(r) {
        // this rotates the top Matrix in the stack by `r` radians
        Matrix.last().rotate(r);
        Matrix.apply();
    }
    static apply() {
        // applies the current Matrix stack to the renderer
        const res=new Matrix();
        Matrix.stack.forEach(m=>{
            res.mult(m);
        });
        gfx.setTransform(res.a,res.b,res.c,res.d,res.e,res.f);
    }
    static inverse() { // we might not need this feature...
        console.log("????");
        const res=new Matrix();
        for(var i=Matrix.stack.length-1;i>=0;i--){
            const inv=Matrix.stack[i].inverse;
            if(inv)res.mult(inv);
        };
        return res;
    }
    static mult(m1,m2) {
        const raw={};
        raw.a=m1.a*m2.a+m1.c*m2.b;
        raw.b=m1.b*m2.a+m1.d*m2.b;
        raw.c=m1.a*m2.c+m1.c*m2.d;
        raw.d=m1.b*m2.c+m1.d*m2.d;
        raw.e=m1.a*m2.e+m1.c*m2.f+m1.e;
        raw.f=m1.b*m2.e+m1.d*m2.f+m1.f;
        return new Matrix(raw);
    }
    constructor(raw={}){
        this.inverse=raw.inverse?new Matrix():null;
        this.set(raw);
    }
    set(raw){
        this.a=raw.a||1;
        this.b=raw.b||0;
        this.c=raw.c||0;
        this.d=raw.d||1;
        this.e=raw.e||0;
        this.f=raw.f||0;
    }
    scale(sx,sy){
        sx = Number(sx);
        sy = (sy == null) ? sx : Number(sy);
        this.mult(new Matrix({a:sx,d:sy}));
        //this.inverse.mult(new Matrix({a:1/s,b:1/s}),true);
    }
    translate(x,y){
        this.mult(new Matrix({e:x,f:y}));
        //this.inverse.mult(new Matrix({e:-x,f:-y}),true);
    }
    rotate(a){
        const rot=(r)=>{
            const cos=Math.cos(r);
            const sin=Math.sin(r);
            return new Matrix({a:cos,b:sin,c:-sin,d:cos});
        };
        this.mult(rot(a));
        //this.inverse.mult(rot(-a),true);
    }
    mult(m,reverse=false){
        // multiplies this matrix against another matrix `m`

        if(reverse) this.set(Matrix.mult(m,this));
        else this.set(Matrix.mult(this,m));
    }
    vec(p){
        // use this Matrix to transform vector `p`
        // returns transformed vector

        const raw={};
        raw.x=this.a*p.x+this.c*p.y+this.e;
        raw.y=this.b*p.x+this.d*p.y+this.f;
        return raw;    
    }
    apply(){
        // applies this matrix to the renderer
        // this overwrites the renderer's current transform

        gfx.setTransform(this.a,this.b,this.c,this.d,this.e, this.f);
    }
}