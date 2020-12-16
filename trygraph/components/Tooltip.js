import Component from "./Component";
import { Graphics, Text, TextMetrics } from "pixi.js";

export default class Tooltip extends Component {
    constructor(trygraph, x, y, text, options = {}) {
        super(trygraph, new Graphics(), options);
        this.text = text;
        this.x = x;
        this.y = y;
        this.addToParent();
        this.draw();
    }

    removeFromParent() {
        super.removeFromParent();
        this.trygraph.remove(this.label);
    }

    draw() {
        const label = new Text(this.text);
        label.style = {
            fontSize: this.computeUnitScale(0.5),
        }
        const metrics = new TextMetrics(this.text, label.style);
        this.graphic.clear();
        this.graphic.beginFill(0x000000);
        this.graphic.drawRect(...this.toCanvas(this.x, this.y), metrics.width, metrics.height);
        label.position.set(...this.toCanvas(this.x, this.y));

        this.label = label;
        this.trygraph.add(label);
    }
}