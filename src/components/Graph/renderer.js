let ctx = null;

const drawAxes = (canvas, ctx) => {
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
}

const drawPolynomial = (canvas, ctx, coeffs) => {
    const f = (x) => {
        const out = coeffs
            .map((v, i) => v * (Math.pow(x, coeffs.length - (1 + i))))
            .reduce((prev, curr) => prev + curr, 0);
        return -out;
    }
    const xRatio = canvas.width / 20;
    const yRatio = canvas.height / 20;
    ctx.moveTo(
        (-10 * xRatio) + (canvas.width / 2), 
        (f(-10) * yRatio) + (canvas.height / 2));

    for (let x = -9; x < 10; x = x + 0.2) {
        ctx.lineTo(
            (x * xRatio) + (canvas.width / 2), 
            (f(x) * yRatio) + (canvas.height / 2));
        ctx.stroke();
    }
}

export const render = (canvas, trygraph, width, height) => {
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    if (!ctx) ctx = canvas.getContext("2d");
    
    drawAxes(canvas, ctx);
    drawPolynomial(canvas, ctx, [1, 2, -2]);
}