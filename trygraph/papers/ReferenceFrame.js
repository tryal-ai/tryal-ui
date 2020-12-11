import { Graphics } from "pixi.js";

// We use a scale factor on 0.9 on the ratio just to trim it down into frame
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

// Reference frame is a coordinate converter designed to 
// provide a scaled frame of reference from a classic cartesian grid
// space to a canvas top left pixel space

export default class ReferenceFrame {
    constructor(trygraph, options) {
        
        this.trygraph = trygraph;
        this.options = options;
        this.interaction = this.trygraph.app.renderer.plugins.interaction;


        //If no limit defined, just use the view range
        this.xLimit = options.x_limit ? options.x_limit : options.x_range;
        this.yLimit = options.y_limit ? options.y_limit : options.y_range;
        
        this.compute();
        //When the mouse goes down
        this.interaction.on('mousedown', event => {
            if (!event.stopped) {
                //Listen for motion
                const handler = (event) => this.mouseMove(event, trygraph);
                this.interaction.on('mousemove', handler);
                //When the mouse goes up
                this.interaction.on('mouseup', () => {
                    //stop listening
                    this.interaction.removeListener('mousemove', handler);
                });
            }
        });

        this.zoom = 1;
    }
    
    compute() {
        [this.xRatio, this.yRatio] = 
            computeWidthHeight(
                this.options, 
                this.trygraph.app.view.width * 0.9, 
                this.trygraph.app.view.height * 0.9
            );
        const frameWidth = this.xRatio * (this.options.x_range[1] - this.options.x_range[0]);
        const frameHeight = this.xRatio * (this.options.x_range[1] - this.options.x_range[0]);
        
        const viewToFrameOffset = [
            (this.trygraph.app.view.width - frameWidth) / 2,
            (this.trygraph.app.view.height - frameHeight) / 2
        ];

        const frameToOriginOffset = [
            (this.options.origin[0] - this.options.x_range[0]) * this.xRatio,
            -(this.options.origin[1] - this.options.y_range[1]) * this.yRatio,
        ]

        this.xOffset = viewToFrameOffset[0] + frameToOriginOffset[0];
        this.yOffset = viewToFrameOffset[1] + frameToOriginOffset[1];

    }

    toCanvas(x, y) {
        const out = [(x * this.xRatio) + this.xOffset, this.yOffset + ((-y) * this.yRatio)]
            .map(v => this.zoom * v);
        return out;
    }

    toRelRef(x, y) {
        return [x / this.xRatio, y / this.yRatio].map(v =>  v / this.zoom / 0.9);
    }

    computeUnitScale(u) {
        //Compute the mean of the ratios and use that as a unit scale for text
        return u * ((this.xRatio + this.yRatio) / 2);
    }

    setZoom(zoom) {
        this.zoom = zoom;
    }

    getXBounds() {
        return this.xLimit;
    }

    getYBounds() {
        return this.yLimit;
    }

    setOffset(x_offset, y_offset) {
        this.xOffset = x_offset;
        this.yOffset = y_offset;
    }

    mouseScroll(event) {
        this.setZoom(this.zoom + (event.deltaY * 0.001));
    }

    mouseMove(event, trygraph) {
        this.xOffset += event.data.originalEvent.movementX;
        this.yOffset += event.data.originalEvent.movementY;
        trygraph.paper.draw(true);
    }
}