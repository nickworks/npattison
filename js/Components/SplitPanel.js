class SplitPanel extends GameComponent {
    constructor(children){
        super();
        this.childrenToAdd = children;
    }
    start(){
        this.padding = 10;
        this.childrenToAdd.forEach(c=>{
             c.transform.parent = this.transform;
        });
        this.transform.rect = game.view.size;
        this.layout();
    }
    layout(){

        const amt = this.transform.children.length;
        
        const w = (this.transform.rect.w - this.padding * amt * 1.5) / amt;
        const h = (this.transform.rect.h - this.padding * 2);

        let i = 0;
        this.transform.children.forEach(t => {
            t.rect.y = this.padding;
            t.rect.h = h;
            t.rect.x = i * (w + this.padding) + this.padding;
            t.rect.w = w;
            i++;
        });
    }
}