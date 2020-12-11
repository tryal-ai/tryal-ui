import Component from './Component';
import { Graphics } from 'pixi.js';

export default class Line extends Component {
    constructor(trygraph, xs, ys, xe, ye, options = {}) {
        super(trygraph, new Graphics(), options);
        
        //Record co-ordinates and options
        this.start = [xs, ys];
        this.end = [xe, ye];

        //Construct the graphic
        this.addToParent();
        this.draw();
    }
    
    setOptions() {
        const lineWidth = this.getProp('lineWidth', 1);
        const color = this.getProp('color', 0x000000);
        const alpha = this.getProp('opacity', 1);
        this.graphic.lineStyle(lineWidth, color, alpha);
    }

    draw() {
        this.graphic.clear();
        this.setOptions();
        this.graphic.moveTo(...this.toCanvas(...this.start));
        this.graphic.lineTo(...this.toCanvas(...this.end));
    }
    
    
}