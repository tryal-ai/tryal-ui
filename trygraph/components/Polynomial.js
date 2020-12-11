import Component from './Component';
import { Graphics } from 'pixi.js';
import Coordinate from './Coordinate';

export default class Polynomial extends Component {
    constructor(trygraph, coeffs, options = {}) {
        super(trygraph, new Graphics(), options);
        
        
        //Record co-ordinates and options
        this.coefficients = coeffs.reverse();
        this.xOffset = 0;
        this.yOffset = 0;
        this.coordinates = [];

        //Construct the graphic
        this.addToParent();
        this.draw();
        this.graphic.interactive = true;
        this.graphic.on('mousedown', event => {
            event.stopPropagation();
            this.options.color = 0xFF0000;

            const handler = e2 => {
                e2.stopPropagation();
                this.xOffset += e2.data.originalEvent.movementX;
                this.yOffset -= e2.data.originalEvent.movementY;
                this.draw();
            };

            this.graphic.on('mousemove', handler);
            this.graphic.on('mouseup', () => {
                this.options.color = 0x000000;
                this.graphic.removeListener('mousemove', handler);
                this.draw();
            });
            this.draw();
        });
    }
    
    func(x) {
        return this.coefficients.reduce((prev, curr, i) => prev + (curr * Math.pow(x, i)));
    }

    getSketchPoints() {
        const offset = this.toRelRef(this.xOffset, this.yOffset);
        const sketchPoints = [[0, this.func(0) + offset[1]]];
        //Compute drawing bounds
        const bounds = this.getBounds();
        const [xMin, xMax] = bounds.x;
        const [yMin, yMax] = bounds.y;

        const changeOfSign = (x1, x2) => {
            const midpoint = (x1 + x2) / 2;
            const ym = this.func(midpoint);
            if (Math.abs(ym) < 0.01) return [midpoint + offset[0], ym];
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
        this.graphic.beginFill(0xFFFFFF, 0.8);

        const offset = this.toRelRef(this.xOffset, this.yOffset);


        //Indicate if to move or draw
        let move = true;
        for (let x = xMin; x < xMax; x += (xMax - xMin) / this.getProp('resolution', 100)) {
            const y = this.func(x) + offset[1];
            const compX = x + offset[0];
            if (compX > xMin && compX < xMax && y > yMin && y < yMax) {
                const [posX, posY] = this.toCanvas(compX, y);
                if (move) this.graphic.moveTo(posX, posY);
                else this.graphic.lineTo(posX, posY);
                move = false;
            } else {
                move = true;
            }
        }
        this.coordinates.forEach(c => c.removeFromParent());
        this.coordinates = this.getSketchPoints().map(c => 
            new Coordinate(this.trygraph, ...c, {
                size: 0.5,
            }));
    }
    
    
}