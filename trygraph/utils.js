//If n is greater than 1 do n * factorial - 1
export const factorial = (n) => n > 1 ? n * factorial(n - 1) : n;

export const combination = (n, r) => r == 0 || r == n ? 1 : factorial(n) / (factorial(r) * factorial(n - r));

export const binomial_expansion = (coeff, power, shift) => {
    const pascal_row = [...Array(power+1).keys()].map(v => combination(power, v));
    const shift_row = [...Array(power+1).keys()].reverse().map(v => Math.pow(shift, v));
    const inner_expansion = pascal_row.map((v, i) => v * shift_row[i]);
    return inner_expansion.map(v => v * coeff);
}