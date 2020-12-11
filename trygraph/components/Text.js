import Component from './Component';
import { Text } from 'pixi.js';

export default class Label extends Component {
    constructor(trygraph, text, x, y, options = {}) {
        super(trygraph, new Text(text), options);
        
        //Record co-ordinates and options
        this.position = [x, y];

        //Construct the graphic
        this.addToParent();
        this.draw();
    }
    
    setOptions() {
        const size = this.computeUnitScale(this.getProp('size', 1));
        
        this.graphic.position.set(...this.toCanvas(...this.position));
        
        this.graphic.style = {
            fontSize: size,
        }
    }

    draw() {
        this.setOptions();
    }
    
    
}