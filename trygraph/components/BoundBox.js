import Component from "./Component";
import { Graphics } from "pixi.js";
import {oncursor, ondrag} from '../events';

class Handle extends Component {
    constructor(trygraph, x, y, options) {
        super(trygraph, new Graphics(), options);
        this.x = x;
        this.y = y;
        
        this.radius = trygraph.getDimensions().reduce((prev, curr) => prev + curr) / 200;
        
        this.graphic.interactive = true;
        
        oncursor(this.graphic, 
            () => trygraph.setCursor(this.getProp('cursor', 'ew-resize')),
            () => trygraph.setCursor('crosshair'))
        
        ondrag(this.graphic, this.getProp('handler', () => {}));


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
        const x = this.x instanceof Function ? this.x() : this.x;
        const y = this.y instanceof Function ? this.y() : this.y;
        this.graphic.drawCircle(x, y, this.radius);
    }
}

export default class BoundBox extends Component {
    constructor(trygraph, rect, options = {}) {
        super(trygraph, new Graphics(), options);
        this.rect = rect;
        this.inFocus = false;
        this.handles = null;
        this.addToParent();
        this.draw();
    }

    changeRect(newRect) {
        this.rect = newRect;
        this.draw();
    }

    leftHandler() {
        if (!this.xHandler) return null;
        return (event) => {
            const scale = (-event.data.originalEvent.movementX + this.rect.width) / this.rect.width;
            this.xHandler(scale);
        }
    }

    rightHandler() {
        if (!this.xHandler) return null;
        return (event) => {
            const scale = (event.data.originalEvent.movementX + this.rect.width) / this.rect.width;
            this.xHandler(scale);
        }
    }

    topHandler() {
        if (!this.yHandler) return null;
        return (event) => {
            const scale = (-event.data.originalEvent.movementY + this.rect.height) / this.rect.height;
            this.yHandler(scale);
        }
    }

    bottomHandler() {
        if (!this.yHandler) return null;
        return (event) => {
            const scale = (event.data.originalEvent.movementY + this.rect.height) / this.rect.height;
            this.xHandler(scale);
        }
    }

    setOptions() {
        const lineWidth = this.getProp('lineWidth', 2);
        const color = this.getProp('color', 0x000000);
        const alpha = this.getProp('opacity', 1);
        this.graphic.lineStyle(lineWidth, color, alpha);
    }

    clearFocus() {
        this.graphic.clear();
        if (this.handles) this.handles.forEach(h => h.removeFromParent());
        this.handles = null;
        this.xHandler = null;
        this.yHandler = null;
        this.inFocus = false;
    }
    
    focus(rect, xHandler = null, yHandler = null) {
        this.inFocus = true;
        this.xHandler = xHandler;
        this.yHandler = yHandler;
        if (rect) this.changeRect(rect);
        else this.draw();
    }
    
    draw() {
        if (!this.inFocus) return;
        this.graphic.clear();
        this.setOptions();
        const x = () => this.rect.x - 10;
        const y = () => this.rect.y - 10;
        const width = () => this.rect.width + 20;
        const height = () => this.rect.height + 20;

        this.graphic.drawRect(x(), y(), width(), height());

        const halfWidth = () => width() / 2;
        const halfHeight = () => height() / 2;

        
        if (!this.handles) this.handles = [
            //Top resizer
            [x() + halfWidth(), () => y(), this.topHandler(), 'ns-resize'], 
            //bottom resizer
            [x() + halfWidth(), () => y() + height(), this.bottomHandler(), 'ns-resize'],
            //left resizer
            [() => x(), y() + halfHeight(), this.leftHandler(), 'ew-resize'],
            //right resizer
            [() => x() + width(), y() + halfHeight(), this.rightHandler(), 'ew-resize']
        ]
        .filter(v => v[2] != null)
        .map(c => new Handle(this.trygraph, c[0], c[1], {
            handler: c[2],
            cursor: c[3]
        }));
        else this.handles.forEach(h => h.draw());
    }
}