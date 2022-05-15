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
        this.layout();
    }
    layout(){

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
        const amt = this.transform.children.length;
        const pad_outer = this.padding;
        const pad_inner = pad_outer / 2;

        this.transform.children.forEach(t => {
            
            const pad_before = i == 0 ? pad_outer : pad_inner;
            const pad_after = i == amt - 1 ? pad_outer : pad_inner;

            if(this.vert){
                t._anchor = Anchors.Stretch(pad_before,pad_outer,pad_after,pad_outer);
                t._anchor.anchorMin = vec2(0, i/amt);
                t._anchor.anchorMax = vec2(1, (i+1)/amt);
            } else {
                t._anchor = Anchors.Stretch(pad_outer,pad_after,pad_outer,pad_before);
                t._anchor.anchorMin = vec2(i/amt,0);
                t._anchor.anchorMax = vec2((i+1)/amt,1);
            }
            
            i++;
        });
    }
}