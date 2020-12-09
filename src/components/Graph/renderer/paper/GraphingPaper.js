export default (engine, trygraph) => {
    engine.setXVisible(...trygraph.x_range);
    engine.setYVisible(...trygraph.y_range);
    
    const majorSpacing = Math.round(trygraph.major_tick / trygraph.minor_tick);
    
    const verticalLines = Math.round((trygraph.x_range[1] - trygraph.x_range[0]) / trygraph.minor_tick);

    for (let i = 0; i < verticalLines; i++) {
        const x = i * trygraph.minor_tick + trygraph.x_range[0];
        
        engine.drawLine(x, trygraph.y_range[0], x, trygraph.y_range[1], {
            color: i % majorSpacing == 0 ? '#00000066' : '#00000033',
            lineWidth: Math.round(x == 0) ? 2 : 1,
        });
        if (i % majorSpacing == 0) {
            engine.drawText(`${Math.round(x)}`, x, -0.003 * verticalLines, {
                font: '14px sans-serif',
                textAlign: 'center',
                textBaseline: 'middle',
                backgroundColor: '#000',
            });

        }

    }

    const horizontalLines = Math.round((trygraph.y_range[1] - trygraph.y_range[0]) / trygraph.minor_tick);
    for (let i = 0; i < horizontalLines; i++) {
        const y = i * trygraph.minor_tick + trygraph.y_range[0];

        engine.drawLine(trygraph.x_range[0], y, trygraph.x_range[1], y, {
            color: i % majorSpacing == 0 ? '#00000066' : '#00000033',
            lineWidth: Math.round(y == 0) ? 2 : 1,
        });
        if (i % majorSpacing == 0) engine.drawText(`${Math.round(y)}`, -0.002 * horizontalLines, y, {
            font: '14px sans-serif',
            textAlign: 'center',
            textBaseline: 'middle',
            backgroundColor: '#000',
        });
    }

}