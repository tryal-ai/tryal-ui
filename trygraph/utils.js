//If n is greater than 1 do n * factorial - 1
export const factorial = (n) => n > 1 ? n * factorial(n - 1) : n;

export const combination = (n, r) => r == 0 || r == n ? 1 : factorial(n) / (factorial(r) * factorial(n - r));

//implementation of binomial expansion for [coeff (x + shift) ^ power]
//e.g. 2(x+3)^3
export const binomial_expansion = (coeff, power, shift) => {
    //get row of pascal's triangle
    const pascal_row = [...Array(power+1).keys()].map(v => combination(power, v));
    //e.g. [1, 3, 3, 1]

    //compute power of shift for each column by powers reversed
    const shift_row = [...Array(power+1).keys()].reverse().map(v => Math.pow(shift, v));
    //e.g. [-27, 9, -3, 1]
    
    //multiply pascal's row by the shift value powered
    const inner_expansion = pascal_row.map((v, i) => v * shift_row[i]);
    //e.g. [-27, 27, -27, 1] (lol, bad example)
    
    //bring in the coefficient
    return inner_expansion.map(v => v * coeff);
    //e.g. [-54, 54, -54, 2]
}

//Implementation of numerical change of sign method, to nearest 0.01 accuracy
export const change_of_sign = (func, x1, x2) => {
    const midpoint = (x1 + x2) / 2;
    const ym = func(midpoint);
    if (Math.abs(ym) < 0.01) return [midpoint, ym];
    const y1 = func(x1);
    if ((y1 >= 0 && ym < 0) || (y1 < 0 && ym >= 0)) return change_of_sign(func, x1, midpoint);
    else return change_of_sign(func, x2, midpoint);
}


export const get_coordinates = (func, lower_x, upper_x, step) => {
    let coordinates = [];
    for(let x = lower_x; x < upper_x; x += step) {
        coordinates.push([x, func(x)]);
    }
    return coordinates;
}
