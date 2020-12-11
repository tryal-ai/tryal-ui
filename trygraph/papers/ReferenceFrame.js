// Reference frame is a coordinate converter designed to 
// provide a scaled frame of reference from a classic cartesian grid
// space to a canvas top left pixel space

export default class ReferenceFrame {
    constructor(x_ratio, y_ratio, x_offset, y_offset, x_range, y_range) {
        this.xRatio = x_ratio;
        this.yRatio = y_ratio;
        this.xOffset = x_offset;
        this.yOffset = y_offset;
        this.xRange = x_range ? x_range : [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
        this.yRange = y_range ? y_range : [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
        this.zoom = 1;
    }

    toCanvas(x, y) {
        const out = [(x * this.xRatio) + this.xOffset, this.yOffset + ((-y) * this.yRatio)]
            .map(v => this.zoom * v);
        return out;
    }

    computeUnitScale(u) {
        //Compute the mean of the ratios and use that as a unit scale for text
        return u * ((this.xRatio + this.yRatio) / 2);
    }

    setZoom(zoom) {
        this.zoom = zoom;
    }

    getXBounds() {
        return this.xRange;
    }

    getYBounds() {
        return this.yRange;
    }

    setOffset(x_offset, y_offset) {
        this.xOffset = x_offset;
        this.yOffset = y_offset;
    }
}