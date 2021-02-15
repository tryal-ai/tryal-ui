import * as actions from './actions';
import Polynomial from '../components/Polynomial';
import Polygon from '../components/Polygon';

export default class InteractiveLayer {
    constructor(trygraph, options = {}) {
        this.trygraph = trygraph;
        this.options = options;
        this.elements = [];
    }

    getActions() {
        return [{
            ...actions.linearAction,
            action: (end) => this.addLine(end),
        }, {
            ...actions.quadAction,
            action: (end) => this.addQuadratic(end)
        }, {
            ...actions.cubicAction,
            action: (end) => this.addCubic(end)
        }, {
            ...actions.drawAction,
            action: (end) => this.drawLine(end)
        }]
    }

    addLine(drawEnded = null) {
        this.elements.push(new Polynomial(this.trygraph, [1, 0], {}));
        if (drawEnded) drawEnded();
    }

    addQuadratic(drawEnded = null) {
        this.elements.push(new Polynomial(this.trygraph, [1, 0, 0], {}));
        if (drawEnded) drawEnded();
    }

    addCubic(drawEnded = null) {
        this.elements.push(new Polynomial(this.trygraph, [1, 2, 2, 0], {}));
        if (drawEnded) drawEnded();
    }

    drawLine(drawEnded = null) {
        const polygon = new Polygon(this.trygraph);
        this.elements.push(polygon);
        const onDown = (event) => {
            polygon.addPoint(event.data.originalEvent.offsetX, event.data.originalEvent.offsetY, true);
        };
        this.trygraph.on('mousedown', onDown);

        const stopDraw = (event) => {
            if (event.keyCode === 27) {
                this.trygraph.removeListener('mousedown', onDown);
                document.removeEventListener('keydown', stopDraw);
                polygon.endDrawing();
                if (drawEnded) drawEnded();
            } 
        };
        document.addEventListener('keydown', stopDraw);
    }

    draw() {
        this.removeDeleted();
        this.elements.forEach(e => e.draw());
    }

    removeDeleted() {
        this.elements = this.elements.filter(e => !e.deleted);
    }
}