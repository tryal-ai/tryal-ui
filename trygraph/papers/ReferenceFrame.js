import { ondrag } from 'trygraph/events';
import Tooltip from '../components/Tooltip';
import { onhover } from '../events';
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
        //Take Trygraph and config options
        this.trygraph = trygraph;
        this.options = options;

        //If no limit defined, just use the view range
        this.xLimit = options.x_limit ? options.x_limit : options.x_range;
        this.yLimit = options.y_limit ? options.y_limit : options.y_range;
        
        
        //Compute the reference frame
        this.compute();
        this.zoom = 1;

        onhover(trygraph, event => {
            if (this.tooltip) {
                this.tooltip.removeFromParent();
            }
            const point = this.toRef(event.data.originalEvent.offsetX, event.data.originalEvent.offsetY);
            this.tooltip = new Tooltip(trygraph, ...point, `(${Math.round(point[0] * 10) / 10}, ${Math.round(point[1] * 10) / 10})`, {});
        });

        //Create a drag handler 
        ondrag(trygraph, e => this.mouseMove(e));
        trygraph.addGlobalListener('wheel', e => this.mouseScroll(e));
        //Set zoom to default 1
    }
    
    compute(options) {
        //If compute is called with new options, take those options
        if (options) this.options = options;
        //compute the x, y coordinate ratio
        [this.xRatio, this.yRatio] = 
            computeWidthHeight(
                this.options, 
                ...this.trygraph.getDimensions().map(v => v * 0.9)
            );
        
        //compute the reference frames canvas pixel width and height
        const frameWidth = this.xRatio * (this.options.x_range[1] - this.options.x_range[0]);
        const frameHeight = this.xRatio * (this.options.x_range[1] - this.options.x_range[0]);
        
        //calculate how much offset is required to center it relative to the canvas
        const viewToFrameOffset = [
            (this.trygraph.app.view.width - frameWidth) / 2,
            (this.trygraph.app.view.height - frameHeight) / 2
        ];

        //compute the coordinate offset for a cartesian grid to canvas grid space
        const frameToOriginOffset = [
            (this.options.origin[0] - this.options.x_range[0]) * this.xRatio,
            -(this.options.origin[1] - this.options.y_range[1]) * this.yRatio,
        ]

        //The offset is the combined offset required to get to coordinate into frame
        //and to get it to the position within that frame
        this.xOffset = viewToFrameOffset[0] + frameToOriginOffset[0];
        this.yOffset = viewToFrameOffset[1] + frameToOriginOffset[1];

    }

    //convert a cartesian coordinate to a canvas space coordinate
    toCanvas(x, y) {
        const out = [(x * this.xRatio) + this.xOffset, ((-y) * this.yRatio) + this.yOffset]
            .map(v => this.zoom * v);
        return out;
    }

    toRef(x, y) {
        return [
            (x - this.xOffset) / this.xRatio, 
            (-(y - this.yOffset) / this.yRatio)]
    }

    //convert a canvas space coordinate to a cartesian grid coordinate
    toRelRef(x, y) {
        return [x / this.xRatio, y / this.yRatio].map(v =>  v / this.zoom / 0.9);
    }

    //compute the unit scale of a value in 1 dimension (we use the average of the two ratios)
    computeUnitScale(u) {
        //Compute the mean of the ratios and use that as a unit scale for text
        return u * ((this.xRatio + this.yRatio) / 2);
    }

    //Set the zoom of this reference frame (zoom scales all coordinates)
    setZoom(zoom) {
        this.zoom = zoom;
    }

    //Get the suggested render limits for cartesian space, e.g. although we render x from -10 to 10 on canvas
    //the allowed render space may be larger, e.g. -20 to 20
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
        event.preventDefault();
        this.setZoom(this.zoom + (event.deltaY * 0.001));
        this.trygraph.draw(true);
        this.trygraph.target.clearFocus();
    }

    mouseMove(event) {
        this.xOffset += event.data.originalEvent.movementX;
        this.yOffset += event.data.originalEvent.movementY;
        this.trygraph.draw(true);
        this.trygraph.target.clearFocus();
        if (this.trygraph.slider) this.trygraph.slider.$destroy();
    }
}