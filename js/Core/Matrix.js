const Matrix = class {
    static clear(){
        new Matrix().apply();
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