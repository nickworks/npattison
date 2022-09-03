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
             if(c.transform) c.transform.parent = this.transform;
        });
        this.childrenToAdd = [];
        this.layout();
    }
    layout(){
        
        let i = 0;
        const amt = this.transform.childCount;
        const pad_outer = this.margin;
        const pad_inner = this.padding/2;

        this.transform.children.forEach(t => {
            
            const pad_before = i == 0 ? pad_outer : pad_inner;
            const pad_after = i == amt - 1 ? pad_outer : pad_inner;

            if(this.vert){
                t.anchor
                    .setMargins(pad_before,pad_outer,pad_after,pad_outer)
                    .setAnchor(vec2(0, i/amt), vec2(1, (i+1)/amt));
            } else {
                t.anchor
                    .setMargins(pad_outer,pad_after,pad_outer,pad_before)
                    .setAnchor(vec2(i/amt,0),vec2((i+1)/amt,1));
            }
            i++;
        });
    }
}