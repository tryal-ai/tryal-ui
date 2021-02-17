import GraphingPaper from './GraphingPaper';

export default (trygraph, data) => {
    if (data.paper.type === 'graphing') {
        return new GraphingPaper(trygraph, {
            x_range: data.x_range,
            y_range: data.y_range,
            origin: [0, 0],
            major_tick: data.paper.major_tick ? data.paper.major_tick : 1,
            minor_tick: data.paper.minor_tick ? data.paper.minor_tick : 1,
            scale: 'even'
        });
    } else if (data.paper.type === 'image') {
        return new BackgroundPaper(trygraph, data.paper.image, {}); 
    }
}