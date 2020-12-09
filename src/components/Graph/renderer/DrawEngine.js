
/**
 * The DrawEngine's primary purpose is to provide a canvas to TryGraph
 * conversion system, designed to convert points and draw lines into the canvas
 * space. In essence say we have a canvas thats 900x500, in browser.
 * 
 * We want our x to have a domain -5,5 and y to have a domain -5,5. The Draw engine
 * can take in a coordinate such as (-2,3) and remap it to the required scale in 
 * the view.
 */
export default class DrawEngine {
    constructor(ctx, canvas) {
        this.context = ctx;
        this.canvas = canvas;
        this.origin = [canvas.width / 2, canvas.height / 2];
        this.xScale = 1;
        this.yScale = 1;
    }

    setOrigin(x, y) {
        this.origin = [x, y];
    }

    setLineColor(color = '#000000ff') {
        this.context.strokeStyle = color;
    }

    setFillColor(color = '#00000000') {
        this.context.fillStyle = color;
    }

    setFont(font = '12px sans-serif') {
        this.context.font = font;
    }

    setTextAlign(align = 'start') {
        this.context.textAlign = align;
    }

    setTextBaseline(baseline = 'bottom') {
        this.context.textBaseline = baseline;
    }

    setLineWidth(width = 1) {
        this.context.lineWidth = width;
    }

    setShadowColor(color = '#00000000') {
        this.context.shadowColor = color;
    }
    
    setOptions(config) {
        if (config.color) this.setLineColor(config.color);
        else this.setLineColor();
        if (config.backgroundColor) this.setFillColor(config.backgroundColor);
        else this.setFillColor();
        if (config.font) this.setFont(config.font);
        else this.setFont();
        if (config.textAlign) this.setTextAlign(config.textAlign);
        else this.setTextAlign();
        if (config.textBaseline) this.setTextBaseline(config.textBaseline);
        else this.setTextBaseline();
        if (config.lineWidth) this.setLineWidth(config.lineWidth);
        else this.setLineWidth();
        if (config.shadowColor) this.setShadowColor(config.shadowColor);
        else this.setShadowColor();
    }


    setXVisible(lower_x, upper_x) {
        this.xScale = this.canvas.width / (upper_x - lower_x)
    }

    setYVisible(lower_y, upper_y) {
        this.yScale = this.canvas.height / (upper_y - lower_y)
    }

    convertCoordinates(x, y) {
        return [this.origin[0] + (this.xScale * x), this.origin[1] - (this.yScale * y)];
    }

    drawLine(xs, ys, xe, ye, config = {}) {
        this.context.beginPath();
        this.setOptions(config);
        this.context.moveTo(...this.convertCoordinates(xs, ys));
        this.context.lineTo(...this.convertCoordinates(xe, ye));
        this.context.stroke();
    }


    drawText(txt, x, y, config = {}) {
        this.context.beginPath();
        this.setOptions(config);
        this.context.fillText(txt, ...this.convertCoordinates(x, y));
    }

    drawCircle(x, y, radius, config = {}) {
        this.context.beginPath();
        this.setOptions(config);
        this.context.ellipse(...this.convertCoordinates(x, y), radius, radius, 0, 0, Math.PI * 2);
    }

    drawRectangle(x, y, width, height, config = {}) {
        this.context.beginPath();
        this.setOptions(config);
        this.context.fillRect(x, y, width, height);
        this.context.strokeRect(x, y, width, height);
    }
}
