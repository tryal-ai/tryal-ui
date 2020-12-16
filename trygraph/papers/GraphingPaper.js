import Line from 'trygraph/components/Line';
import Text from 'trygraph/components/Text';

const computeRange = (range, minor_tick) => {
    const lines = ((range[1] - range[0]) / minor_tick) + 1;
    return [...Array(lines).keys()].map(v => (v * minor_tick) + range[0]);
}

export default class GraphingPaper {
    constructor(trygraph, options) {
        this.trygraph = trygraph;
        this.options = options;

        //Generate vertical grid
        this.vertical_grid = computeRange(options.x_range, options.minor_tick)
            .map((v, i) => new Line(this.trygraph, v, options.y_range[0], v, options.y_range[1], {
                lineWidth: Math.abs(v - options.origin[0]) < 0.001 ? 2 : 1,
                opacity: v % options.major_tick == 0 ? 1 : 0.2,
            }));

        //Generate horizontal grid
        this.horizontal_grid = computeRange(options.y_range, options.minor_tick)
            .map(v => new Line(this.trygraph, options.x_range[0], v, options.x_range[1], v, {
                lineWidth: Math.abs(v - options.origin[1]) < 0.001 ? 2 : 1,
                opacity: v % options.major_tick == 0 ? 1 : 0.2,
            }));

        //generate X labels
        this.x_labels = computeRange(options.x_range, options.major_tick)
            .map((v, i) => new Text(this.trygraph, `${v}`, v - 0.15, 0, {
                size: 0.3
            }));
        
        //generate Y labels
        this.y_labels = computeRange(options.y_range, options.major_tick)
            .map((v, i) => new Text(this.trygraph, `${v}`, -0.3, v + 0.15, {
                size: 0.3
            }));
        
        //TODO: Remove this curve
        //this.example = new Polynomial(this.trygraph, [1, 0, -3], {
        //    resolution: 200,
        //});
    }
    
    draw() {
        this.vertical_grid.forEach(l => l.draw());
        this.horizontal_grid.forEach(l => l.draw());
        this.x_labels.forEach(l => l.draw());
        this.y_labels.forEach(l => l.draw());
        //TODO: Remove redrawing the curve
        //this.example.draw();
    }
}