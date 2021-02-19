class SplitPanel extends GameComponent {
    constructor(children, vert=false){
        super();
        this.childrenToAdd = children;
        this.vert = !!vert;
    }
    start(){
        this.padding = 10;
        this.childrenToAdd.forEach(c=>{
             c.transform.parent = this.transform;
        });
        //this.transform.rect = game.view.size;
        this.layout();
    }
    layout(){

        if(!this.transform.parent) this.transform.rect = game.view.size;

        const amt = this.transform.children.length;
        
        if(this.vert) {
            const  w = (this.transform.rect.w - this.padding * amt * 1.5) / amt;
            const  h = (this.transform.rect.h - this.padding * 2);
            this.positionChildren(w, h, w + this.padding, 0);

        } else {
            const w = (this.transform.rect.w - this.padding * 2);
            const h = (this.transform.rect.h - this.padding * amt * 1.5) / amt;
            this.positionChildren(w, h, 0, h + this.padding);
        }

    }
    positionChildren(w,h,dx,dy){
        let i = 0;
        this.transform.children.forEach(t => {
            t.rect.y = i * dy + this.padding;
            t.rect.h = h;
            t.rect.x = i * dx + this.padding;
            t.rect.w = w;
            i++;
            //t.gameObject.layout();
        });
    }
}