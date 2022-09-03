const Font = class {

    props = {
        size: 12,
        color: "#000",
        font: "Arial",
        align: "left",
        baseline: "alphabetic",
    };
    constructor(raw = {}){
        this.props = {
            ...this.props,
            ...raw,
        };
    }
    apply(){
        gfx.fillStyle = this.props.color;
        gfx.font = this.props.size + "px " + this.props.font;
        gfx.textAlign = this.props.align;
        gfx.textBaseline = this.props.baseline;
    }
    measure(str){
        this.apply();
        return gfx.measureText(str);
    }
};

Font.basic = new Font();
Font.center = new Font({align:"center"});
Font.big = new Font({size:56,align:"center"});