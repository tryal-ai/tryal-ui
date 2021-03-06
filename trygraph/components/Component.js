export default class Component {
    constructor(trygraph, graphic, options) {
        this.trygraph = trygraph;
        this.graphic = graphic;
        this.options = options ? options : {};
    }

    toCanvas(x, y, dump = false) {
        if (dump) {
            console.log(x);
            console.log(y);
        }
        //Allows for absolute co-ordinate system rather than reference system
        if (this.options.refOff) return [x, y];
        return this.trygraph.reference.toCanvas(x, y);
    }

    toRelRef(x, y) {
        if (this.options.refOff) return [x, y];
        return this.trygraph.reference.toRelRef(x, y);
    }

    computeUnitScale(u) {
        //Allows for absolute co-ordinate system rather than reference system
        if (this.options.refOff) return u;
        return this.trygraph.reference.computeUnitScale(u);
    }

    getBounds() {
        return {
            x: this.trygraph.reference.getXBounds(),
            y: this.trygraph.reference.getYBounds()
        }
    }

    addToParent() {
        this.trygraph.add(this.graphic);
    }

    removeFromParent() {
        this.trygraph.remove(this.graphic);
    }

    getProp(key, defacto) {
        return this.options[key] ? this.options[key] : defacto; 
    }

    getData() {
        return {
            type: 'component'
        }
    }
}