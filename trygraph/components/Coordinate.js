import Label from './Text';

export default class Coordinate extends Label {
    constructor(trygraph, x, y, options = {}) {
        super(trygraph, `(${Math.round(x * 100) / 100}, ${Math.round(y * 100) / 100})`, x, y, options);
        this.x = x;
        this.y = y;
    }

    isAt(x, y, margin = 0.001) {
        return Math.abs(x - this.x) < margin && Math.abs(y - this.y) < margin;
    }
}