import * as actions from '../actions';
import Polynomial from '../components/Polynomial';

export default class InteractiveLayer {
    constructor(trygraph, options = {}) {
        this.trygraph = trygraph;
        this.options = options;
        this.elements = [];
    }

    getActions() {
        return [{
            ...actions.linearAction,
            action: () => this.addLine(),
        }, {
            ...actions.quadAction,
            action: () => this.addQuadratic()
        }, {
            ...actions.cubicAction,
            action: () => this.addCubic()
        }]
    }

    addLine() {
        this.elements.push(new Polynomial(this.trygraph, [1, 0], {}));
    }

    addQuadratic() {
        this.elements.push(new Polynomial(this.trygraph, [1, 0, 0], {}));
    }

    addCubic() {
        this.elements.push(new Polynomial(this.trygraph, [1, 2, 2, 0], {}));
    }

    draw() {
        this.removeDeleted();
        this.elements.forEach(e => e.draw());
    }

    removeDeleted() {
        this.elements = this.elements.filter(e => !e.deleted);
    }
}