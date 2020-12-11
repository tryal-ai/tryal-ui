import ReferenceFrame from './ReferenceFrame';
import Line from 'trygraph/components/Line';
import Text from 'trygraph/components/Text';
import Polynomial from 'trygraph/components/Polynomial';

const computeWidthHeight = (options, width, height) => {
    if (!options.scale || options.scale === 'fit') return [
        width / (options.x_range[1] - options.x_range[0]), 
        height / (options.y_range[1] - options.y_range[0])
    ];
    else if (options.scale === 'even') {
        const ratio = width > height ? 
            width / (options.x_range[1] - options.x_range[0]) : 
            height / (options.y_range[1] - options.y_range[0]);
        return [ratio, ratio];
    } else {
        throw {
            errorCode: "TRYGRAPH_OPTION_ERROR",
            message: "The option given was invalid",
            option: "options.scale should be either 'fit' or 'even' (default: 'fit')"
        }
    }
}

const computeRange = (range, minor_tick) => {
    const lines = ((range[1] - range[0]) / minor_tick) + 1;
    return [...Array(lines).keys()].map(v => (v * minor_tick) + range[0]);
}

export default class GraphingPaper {
    constructor(trygraph, options) {
        if (trygraph.reference) throw {
            errorCode: "TRYGRAPH_PAPER_DEFINED",
            message: "A paper type has already been defined",
            options: "A paper type has already been defined for the given TryGraph object",
        }
        this.trygraph = trygraph;
        this.view = trygraph.app.view;
        this.options = options;

        this.generateReferenceFrame();

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

        this.x_labels = computeRange(options.x_range, options.major_tick)
            .map((v, i) => new Text(this.trygraph, `${v}`, v - 0.15, 0, {
                size: 0.3
            }));
        
        this.y_labels = computeRange(options.y_range, options.major_tick)
            .map((v, i) => new Text(this.trygraph, `${v}`, -0.3, v + 0.15, {
                size: 0.3
            }));
        
        this.example = new Polynomial(this.trygraph, [1, 0, -3], {
            resolution: 200,
        });
    }

    generateReferenceFrame() {
        this.trygraph.reference = new ReferenceFrame(
            ...computeWidthHeight(this.options, this.view.width, this.view.height),
            this.view.width / 2,
            this.view.height / 2,
            this.options.x_range,
            this.options.y_range
        );
    }

    setZoom(zoom) {
        if (zoom > 3 || zoom < 0.5) return;
        this.trygraph.reference.setZoom(zoom);
        this.draw(true);
    }

    getZoom() {
        return this.trygraph.reference.zoom;
    }

    setOffset(x_offset, y_offset) {
        this.trygraph.reference.setOffset(x_offset, y_offset);
        this.draw(true);
    }

    getOffset() {
        return [this.trygraph.reference.xOffset, this.trygraph.reference.yOffset];
    }

    draw(fixFrame = false) {
        if (!fixFrame) this.generateReferenceFrame();
        this.vertical_grid.forEach(l => l.draw());
        this.horizontal_grid.forEach(l => l.draw());
        this.x_labels.forEach(l => l.draw());
        this.y_labels.forEach(l => l.draw());
        this.example.draw();
    }
}