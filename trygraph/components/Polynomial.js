import { Graphics } from 'pixi.js';
import { 
    binomial_expansion,
    change_of_sign,
    get_coordinates
} from '../utils'; 
import {ondrag, onhold} from '../events';

import Component from './Component';
import Coordinate from './Coordinate';
import Slider from './Slider.svelte';

export default class Polynomial extends Component {
    constructor(trygraph, coeffs, update = () => {}, options = {}) {
        super(trygraph, new Graphics(), options);
        
        
        //Record co-ordinates and options
        this.coefficients = coeffs.reverse();
        this.coordinates = [];
        this.update = update;

        //Construct the graphic
        this.addToParent();
        this.draw();
        
        //Make this interactive and add handlers
        this.graphic.interactive = true;
        ondrag(this.graphic, e => this.mouseMove(e));
        onhold(this.graphic, e => this.mouseDown(e), e => this.mouseUp(e));
        this.update();
    }
    
    func(x) {
        return this.coefficients.reduce((prev, curr, i) => prev + (curr * Math.pow(x, i)));
    }

    getFunc() {
        const coeffs = this.coefficients;
        return (x) => coeffs.reduce((prev, curr, i) => prev + (curr * Math.pow(x, i)));
    }

    translate(x, y) {
        const result = this.coefficients
            .map((coeff, i) => binomial_expansion(coeff, i, -x))
            .reverse()
            .reduce((prev, curr) => 
                prev.map((v, i) => v += curr[i] ? curr[i] : 0)
            );
        result[0] += y;
        this.update();
        return result;
    }

    scaleX(factor) {
        const actualFactor = Math.pow(factor, this.coefficients.length - 1);
        this.coefficients = this.coefficients.map((v, i) => v * Math.pow((1 / actualFactor), i));
        this.draw();
        this.trygraph.target.changeRect(this.graphic.getBounds());
        this.update();
    }

    scaleY(factor) {
        return this.coefficients.map(v => v * factor);
    }

    getSketchPoints() {
        //Compute drawing bounds
        const bounds = this.getBounds();
        const [xMin, xMax] = bounds.x;

        //Compute the x Step
        const step = (xMax - xMin) / this.getProp('resolution', 100);
        
        const points = get_coordinates(this.getFunc(), xMin + step, xMax, step)
            .filter(([x, y], i, coords) => i != 0 && 
                ((coords[i-1][1] >= 0 && y < 0) || (coords[i-1][1] < 0 && y >= 0)))
            .map(([x, y]) => change_of_sign(this.getFunc(), x - step, x));
        
        return [
            [0, this.func(0)],
            ...points,
        ];
    }

    setOptions() {
        const lineWidth = this.getProp('lineWidth', 3);
        const color = this.getProp('color', 0x000000);
        const alpha = this.getProp('opacity', 1);
        this.graphic.lineStyle(lineWidth, color, alpha);
    }

    draw() {
        //Clear to redraw
        this.graphic.clear();
        //set options
        this.setOptions();
        
        //Compute drawing bounds
        const bounds = this.getBounds();
        const [xMin, xMax] = bounds.x;
        const [yMin, yMax] = bounds.y;
        const step = (xMax - xMin) / this.getProp('resolution', 100);

        //fill with a translucent fill
        //this.graphic.beginFill(0xFFFFFF, 0.8);


        //Indicate if to move or draw
        let move = true;
        get_coordinates(this.getFunc(), xMin, xMax, step)
            .map(([x, y]) => {
                if (x > xMin && x < xMax && y > yMin && y < yMax) {
                    const [posX, posY] = this.toCanvas(x, y);
                    if (move) this.graphic.moveTo(posX, posY);
                    else this.graphic.lineTo(posX, posY);
                    move = false;
                } else {
                    move = true;
                }
            });

        this.graphic.hitArea = this.graphic.getBounds();

        this.coordinates.forEach(c => c.removeFromParent());
        this.coordinates = this.getSketchPoints().map(c => 
            new Coordinate(this.trygraph, ...c, {
                size: 0.5,
            }));
    }
    

    //Handlers
    mouseDown() {
        this.options.color = 0xFF0000;
        if (this.coefficients.length > 2) this.trygraph.target.focus(this.graphic.getBounds(), f => this.scaleX(f));
        if (this.coefficients.length == 2 || this.coefficients.length > 3) {
            if (this.trygraph.slider) this.trygraph.slider.$destroy();
            this.trygraph.slider = new Slider({
                target: this.trygraph.overlay,
                props: {
                    min: -100,
                    max: 100,
                    value: this.coefficients[1] * 10,
                    valueChanged: (v) => this.sliderChanged(v),
                },
            });
        }
        document.body.addEventListener('keydown', e => this.keydown(e));
        this.draw();
    }

    sliderChanged(v) {
        this.coefficients[1] = v / 10;
        this.draw();
    }

    mouseUp() {
        this.options.color = 0x000000;
        this.draw();
    }

    mouseMove(event) {
        event.stopPropagation();
        const offset = this.toRelRef(
            event.data.originalEvent.movementX, 
            event.data.originalEvent.movementY
        );
        this.coefficients = this.translate(offset[0], -offset[1]);
        this.draw();
        this.trygraph.target.changeRect(this.graphic.getBounds());
    }

    keydown(event) {
        if (event.code === "Delete") {
            document.body.addEventListener('keydown', (e) => this.keydown(e));
            this.delete();
        }
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
            type: 'polynomial',
            data: {
                coefficients: this.coefficients
            }
        }
    }
}