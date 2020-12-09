import DrawEngine from './DrawEngine';
import GraphingPaper from './paper/GraphingPaper';


let drawEngine = null;

export const render = (canvas, trygraph, width, height) => {
    //Set canvas width and height
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    //get the context
    drawEngine = new DrawEngine(canvas.getContext("2d"), canvas);
    GraphingPaper(drawEngine, {
        x_range: [-10, 10],
        y_range: [-10, 10],
        minor_tick: 0.2,
        major_tick: 1
    })
    //drawEngine.drawLine(-5, -5, 5, 5);
    //drawEngine.drawLine(5, -5, -5, 5);
}