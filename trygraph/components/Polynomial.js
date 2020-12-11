import Component from './Component';
import { Graphics } from 'pixi.js';

export default class Line extends Component {
    constructor(trygraph, coeffs, options = {}) {
        super(trygraph, new Graphics(), options);
        
        
        //Record co-ordinates and options
        this.coefficients = coeffs.reverse();
        
        //Construct the graphic
        this.addToParent();
        this.draw();
        this.graphic.interactive = true;
        this.graphic.on('mousedown', event => {
            this.graphic.on('mousemove', e2 => {
                e2.stopPropagation();
            });
            this.options.color = 0xFF0000;
            this.draw();
        });
    }
    
    func(x) {
        return this.coefficients.reduce((prev, curr, i) => prev + (curr * Math.pow(x, i)));
    }

    setOptions() {
        const lineWidth = this.getProp('lineWidth', 3);
        const color = this.getProp('color', 0x000000);
        const alpha = this.getProp('opacity', 1);
        this.graphic.lineStyle(lineWidth, color, alpha);
    }

    draw() {
        this.graphic.clear();
        this.setOptions();
        const bounds = this.getBounds();
        const xMin = Math.max(-1000, bounds.x[0]);
        const xMax = Math.min(1000, bounds.x[1]);
        const yMin = Math.max(-1000, bounds.y[0]);
        const yMax = Math.min(1000, bounds.y[1]);
        this.graphic.beginFill(0xFFFFFF, 0.8);
        let move = true;
        for (let x = xMin; x < xMax; x += (xMax - xMin) / this.getProp('resolution', 50)) {
            const y = this.func(x);
            if (x > xMin && x < xMax && y > yMin && y < yMax) {
                if (move) this.graphic.moveTo(...this.toCanvas(x, y));
                else this.graphic.lineTo(...this.toCanvas(x, y));
                move = false;
            } else {
                move = true;
            }
        }

    }
    
    
}