import {Application} from 'pixi.js';
import {get} from 'svelte/store';
//import GraphingPaper from './papers/GraphingPaper';
import loadPaper from './papers';
//import BackgroundPaper from './papers/BackgroundPaper';
import BoundBox from './components/BoundBox';
import ReferenceFrame from './papers/ReferenceFrame';
import Menu from './components/Menu.svelte';
//import Slider from './components/Slider.svelte';
import InteractiveLayer from './Layers/InteractiveLayer';

export default class TryGraph {
    constructor(canvas, overlay, width, data = {
        x_range: [-10, 10],
        y_range: [-10, 10],
        paper: {
            type: 'graphing',
            major_tick: 1,
            minor_tick: 0.2
        },
        update: (x) => console.log(x)
    }) {
        //Create a pixi application
        this.app = new Application({
            view: canvas,
            backgroundColor: 0xFFFFFF,
            width: get(width),
            height: get(width),
            resizeTo: canvas,
        });
        this.overlay = overlay;
        
        //Set crosshair on hover
        this.setCursor('crosshair');
        //Create the reference frame
        this.reference = new ReferenceFrame(this, {
            x_range: data.x_range,
            y_range: data.y_range,
            //limits dictate what the reported bounds are by the reference frame
            x_limit: data.x_limit ? data.x_limit : data.x_range, 
            y_limit: data.y_limit ? data.y_limit : data.y_range,
            origin: [0, 0],
        });
        
        //Create a bounding box
        this.target = new BoundBox(this, {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        });
        
        //Create the paper
        this.paper = loadPaper(this, data);

        this.interactiveLayer = new InteractiveLayer(this, data.update, {});

        this.menu = new Menu({
            target: overlay,
            props: {
                functions: this.interactiveLayer.getActions(),
            }
        });

        //Subscribe to changes in size
        width.subscribe(v => {
            this.paper.draw();
        });

        this.draw();
    }

    reframe() {
        this.reference.compute();
    }

    
    draw(fixFrame = false) {
        if (!fixFrame) this.reference.compute();
        this.paper.draw();
        this.interactiveLayer.draw();
    }
    
    getDimensions() {
        return [this.app.view.width, this.app.view.height];
    }
    
    setCursor(cursor) {
        this.app.view.parentElement.style.cursor = cursor;
    }

    add(...args) {
        this.app.stage.addChild(...args);
    }

    remove(...args) {
        this.app.stage.removeChild(...args);
    }

    on(...args) {
        this.app.renderer.plugins.interaction.on(...args);
    }

    once(...args) {
        this.app.renderer.plugins.interaction.once(...args);
    }

    removeListener(...args) {
        this.app.renderer.plugins.interaction.removeListener(...args);
    }

    addGlobalListener(...args) {
        this.app.view.addEventListener(...args);
    }

    removeGlobalListener(...args) {
        this.app.view.removeEventListener(...args);
    }
}