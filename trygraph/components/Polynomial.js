import { Graphics, Rectangle } from 'pixi.js';
import { binomial_expansion } from 'trygraph/utils'; 
import Component from './Component';
import Coordinate from './Coordinate';

export default class Polynomial extends Component {
    constructor(trygraph, coeffs, options = {}) {
        super(trygraph, new Graphics(), options);
        
        
        //Record co-ordinates and options
        this.coefficients = coeffs.reverse();
        this.coordinates = [];

        //Construct the graphic
        this.addToParent();
        this.draw();
        this.graphic.interactive = true;
        this.graphic.on('mousedown', event => {
            if (!event.stopped) {
                event.stopPropagation();
                this.options.color = 0xFF0000;
                this.trygraph.target.focus(this.graphic.getBounds());
                const handler = e2 => {
                    e2.stopPropagation();
                    const offset = this.toRelRef(
                        e2.data.originalEvent.movementX, 
                        e2.data.originalEvent.movementY
                    );
                    this.coefficients = this.translate(offset[0], -offset[1]);
                    this.draw();
                    this.trygraph.target.focus(this.graphic.getBounds());
                };
                    
                this.graphic.on('mousemove', handler);
                this.graphic.on('mouseup', () => {
                    this.options.color = 0x000000;
                    this.graphic.removeListener('mousemove', handler);
                    //this.trygraph.target.clearFocus();
                    this.draw();
                });
                this.draw();
            }
        });
    }
    
    func(x) {
        return this.coefficients.reduce((prev, curr, i) => prev + (curr * Math.pow(x, i)));
    }


    translate(x, y) {
        const result = this.coefficients
            .map((coeff, i) => binomial_expansion(coeff, i, -x))
            .reverse()
            .reduce((prev, curr) => 
                prev.map((v, i) => v += curr[i] ? curr[i] : 0)
            );
        result[0] += y;
        return result;
    }

    scaleX(factor) {
        return this.coefficients.map((v, i) => v * Math.pow(factor, i));
    }

    scaleY(factor) {
        return this.coefficients.map(v => v * factor);
    }

    getSketchPoints() {
        const sketchPoints = [[0, this.func(0)]];
        //Compute drawing bounds
        const bounds = this.getBounds();
        const [xMin, xMax] = bounds.x;

        const changeOfSign = (x1, x2) => {
            const midpoint = (x1 + x2) / 2;
            const ym = this.func(midpoint);
            if (Math.abs(ym) < 0.01) return [midpoint, ym];
            const y1 = this.func(x1);
            const y2 = this.func(x2);
            if ((y1 >= 0 && ym < 0) || (y1 < 0 && ym >= 0)) return changeOfSign(x1, midpoint);
            else return changeOfSign(x2, midpoint);
        }

        //Compute if function starts positive assume 0 positive
        let positive = this.func(xMin) >= 0;
        //Compute the x Step
        const step = (xMax - xMin) / this.getProp('resolution', 100);
        
        for (let x = xMin + step; x < xMax; x += step) {
            //if sign changes this step, then we need to find the root
            if (positive && this.func(x) < 0) sketchPoints.push(changeOfSign(x-step, x));
            if (!positive && this.func(x) >= 0) sketchPoints.push(changeOfSign(x-step, x));
            positive = this.func(x) >= 0;
        }
        return sketchPoints;
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

        //fill with a translucent fill
        //this.graphic.beginFill(0xFFFFFF, 0.8);


        //Indicate if to move or draw
        let move = true;
        for (let x = xMin; x < xMax; x += (xMax - xMin) / this.getProp('resolution', 100)) {
            const y = this.func(x);
            if (x > xMin && x < xMax && y > yMin && y < yMax) {
                const [posX, posY] = this.toCanvas(x, y);
                if (move) this.graphic.moveTo(posX, posY);
                else this.graphic.lineTo(posX, posY);
                move = false;
            } else {
                move = true;
            }
        }

        this.graphic.hitArea = this.graphic.getBounds();

        this.coordinates.forEach(c => c.removeFromParent());
        this.coordinates = this.getSketchPoints().map(c => 
            new Coordinate(this.trygraph, ...c, {
                size: 0.5,
            }));
    }
    
    
}