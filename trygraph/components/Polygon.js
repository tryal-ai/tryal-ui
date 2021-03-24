import { Graphics } from 'pixi.js';

import {onhold} from '../events';

import Component from './Component';

export default class Polygon extends Component {
    constructor(trygraph, update = () => {}, options = {}) {
        super(trygraph, new Graphics(), options);
        
        this.coordinates = [];
        this.drawing = true;
        this.update = update;

        //Construct the graphic
        this.addToParent();
        this.draw();
        this.update();
        onhold(this.graphic, e => this.mouseDown(e), e => this.mouseUp(e));
    }
    
    addPoint(x, y, canvas = false) {
        if (!this.drawing) return;
        if (canvas) this.coordinates.push(this.trygraph.reference.toRef(x, y));
        else this.coordinates.push([x, y]);
        this.draw();
        this.update();
    }

    endDrawing() {
        this.drawing = false;
        this.draw();
    }

    setOptions(joiner) {
        const lineWidth = this.getProp('lineWidth', 3);
        const color = this.getProp('color', 0x000000);
        const alpha = this.getProp('opacity', 1);
        if (joiner) this.graphic.lineStyle(lineWidth, 0xff0000, 0.5);
        else this.graphic.lineStyle(lineWidth, color, alpha);
    }

    draw() {
        //Clear to redraw
        this.graphic.clear();
        //set options
        this.setOptions();
        
        if (this.coordinates.length > 0) {
            this.graphic.moveTo(...this.toCanvas(...this.coordinates[0]));
            this.coordinates.slice(1).forEach(coordinate => {
                this.graphic.lineTo(...this.toCanvas(...coordinate));
            });
            if (this.drawing) this.setOptions(true);
            this.graphic.lineTo(...this.toCanvas(...this.coordinates[0]));
        }
    }

    mouseDown() {
        this.options.color = 0xFF0000;
        if (this.coefficients.length > 2) this.trygraph.target.focus(this.graphic.getBounds(), f => this.scaleX(f));
        //document.body.addEventListener('keydown', e => this.keydown(e));
        this.draw();
    }

    mouseUp() {

    }


    delete() {
        //mark as deleted
        this.deleted = true;
        this.graphic.clear();
        this.removeFromParent();
        if (this.trygraph.slider) {
            this.trygraph.slider.$destroy();
            this.trygraph.slider = null;
        }
        this.trygraph.target.clearFocus();
        this.coordinates.forEach(c => c.removeFromParent());
        //redraw entire frame
        this.trygraph.draw();
    }

    getData() {
        return {
            type: 'polygon',
            data: {
                coordinates: this.coordinates
            }
        }
    }
}