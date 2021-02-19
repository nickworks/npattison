class SplitPanel extends GameComponent {
    constructor(children, vert=false, padding=10, margin=0){
        super();
        this.childrenToAdd = children;
        this.vert = !!vert;
        this.padding = Number(padding);
        this.margin = Number(margin);
    }
    start(){
        this.childrenToAdd.forEach(c=>{
             c.transform.parent = this.transform;
        });
        //this.transform.rect = game.view.size;
        this.layout();
    }
    layout(){

        if(!this.transform.parent) this.transform.rect = game.view.size;
        
        const  w = this.getSizeWidth();
        const  h = this.getSizeHeight();

        if(this.vert) {
            this.positionChildren(w, h, w + this.padding, 0);
        } else {
            this.positionChildren(w, h, 0, h + this.padding);
        }

    }
    getSizeWidth(){
        const fullsize = this.transform.rect.w;
        let amt = this.transform.children.length;
        if(!this.vert) amt = 1;
        const emptySpace = this.margin * 2 + this.padding * (amt - 1);
        return (fullsize - emptySpace) / amt;
    }
    getSizeHeight(){
        const fullsize = this.transform.rect.h;
        let amt = this.transform.children.length;
        if(this.vert) amt = 1;
        const emptySpace = this.margin * 2 + this.padding * (amt - 1);
        return (fullsize - emptySpace) / amt;
    }
    positionChildren(w,h,dx,dy){
        let i = 0;
        this.transform.children.forEach(t => {
            t.rect.y = i * dy + this.margin;
            t.rect.h = h;
            t.rect.x = i * dx + this.margin;
            t.rect.w = w;
            i++;
        });
    }
}