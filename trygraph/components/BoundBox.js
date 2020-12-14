import Component from "./Component";
import { Graphics } from "pixi.js";

class Handle extends Component {
    constructor(trygraph, x, y, options) {
        super(trygraph, new Graphics(), options);
        this.x = x;
        this.y = y;
        this.radius = trygraph.getDimensions().reduce((prev, curr) => prev + curr) / 200;
        this.graphic.interactive = true;
        this.graphic.on('mouseover', () => trygraph.setCursor('ew-resize'));
        this.graphic.on('mouseout', () => trygraph.setCursor('crosshair'));
        this.graphic.on('mousedown', event => {
            if (!event.stopped) {
                event.stopPropagation();
                this.graphic.on('mousemove', this.getProp('handler', () => {}));
                this.graphic.on('mouseup', () => {
                    this.graphic.removeHandler('mousemove', this.getProp('handler', () => {}));
                });
            }
        });
        this.addToParent();
        this.draw();
    }

    setOptions() {
        const lineWidth = this.getProp('lineWidth', 2);
        const color = this.getProp('color', 0x000000);
        const alpha = this.getProp('opacity', 1);
        this.graphic.lineStyle(lineWidth, color, alpha);
    }

    on(...args) {
        this.graphic.on(...args);
    }

    removeFromParent() {
        this.trygraph.setCursor('crosshair');
        super.removeFromParent();
    }

    draw() {
        this.graphic.clear();
        this.setOptions();
        this.graphic.beginFill(this.getProp('backgroundColor', 0x000000));
        this.graphic.drawCircle(this.x, this.y, this.radius);
    }
}

export default class BoundBox extends Component {
    constructor(trygraph, rect, options = {}) {
        super(trygraph, new Graphics(), options);
        this.rect = rect;
        this.inFocus = false;
        this.handles = [];
        this.addToParent();
        this.draw();
    }

    changeRect(newRect) {
        this.rect = newRect;
        this.draw();
    }

    setOptions() {
        const lineWidth = this.getProp('lineWidth', 2);
        const color = this.getProp('color', 0x000000);
        const alpha = this.getProp('opacity', 1);
        this.graphic.lineStyle(lineWidth, color, alpha);
    }

    clearFocus() {
        this.graphic.clear();
        this.handles.forEach(h => h.removeFromParent());
        this.handles = [];
        this.inFocus = false;
    }

    focus(rect) {
        this.inFocus = true;
        if (rect) this.changeRect(rect);
        else this.draw();
    }
    
    draw() {
        if (!this.inFocus) return;
        this.graphic.clear();
        this.setOptions();
        const x = this.rect.x - 10;
        const y = this.rect.y - 10;
        const width = this.rect.width + 20;
        const height = this.rect.height + 20;

        this.graphic.drawRect(x, y, width, height);

        const halfWidth = width / 2;
        const halfHeight = height / 2;

        this.handles.forEach(h => h.removeFromParent());
        this.handles = [
            [x + halfWidth, y], 
            [x + halfWidth, y + height],
            [x, y + halfHeight],
            [x + width, y + halfHeight]].map(c => new Handle(this.trygraph, c[0], c[1], {}));
        console.log(this.handles);
    }
}