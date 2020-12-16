import {parse} from './grammar.pegjs';
import * as components from './types';

const buildFloat = data => {
    return {
        component: components.float,
        props: {
            value: data.val,
        }
    }
}

const buildGreek = data => {
    return {
        component: components.greek,
        props: {
            value: data.val
        }
    }
}

const buildInteger = data => {
    return {
        component: components.integer,
        props: {
            value: data.val,
        }
    }
}

const buildFraction = data => {
    return {
        component: components.fraction,
        props: {
            numerator: build(data.numer),
            denominator: build(data.denom),
        }
    }
}

const buildNegation = data => {
    return {
        component: components.negation,
        props: {
            component: build(data.val),
        }
    }
}

const buildTerm = data => {
    return {
        component: components.term,
        props: {
            constant: data.coeff ? build(data.coeff) : null,
            variable: data.vars,
        }
    }
}

const buildTerms = data => {
    return {
        component: components.terms,
        props: {
            components: data.terms.map(d => build(d)),
        }
    }
}

const buildOperation = data => {
    if (data.symbol == '/') {
        return buildFraction({
            numer: data.lhs,
            denom: data.rhs,
        })
    }
    if (data.symbol == '^') {
        return {
            component: components.power,
            props: {
                coefficient: build(data.lhs),
                exponent: build(data.rhs),
            }
        }
    }
    return {
        component: components.expression,
        props: {
            lhs: build(data.lhs),
            rhs: build(data.rhs),
            brackets: data.brackets,
            symbol: data.symbol,
        }
    }
}

const buildFunction = data => {
    if (data.symbol === "SQRT") return {
        component: components.root,
        props: {
            base: null,
            term: build(data.expression),
        }
    } 
    if (/ROOT/.test(data.symbol)) {
        const result = /[1-9][0-9]*/.exec(data.symbol);
        return {
            component: components.root,
            props: {
                base: result,
                term: build(data.expression),
            }
        }
    }
    return {
        component: components.function,
        props: {
            symbol: data.symbol,
            expression: build(data.expression)
        }
    }
}

const builders = {
    real: buildFloat,
    integer: buildInteger,
    greek: buildGreek,
    fraction: buildFraction,
    negation: buildNegation,
    term: buildTerm,
    terms: buildTerms,
    operation: buildOperation,
    function: buildFunction,
}


const build = data => {
    return builders[data.type](data);
}


export const getComponent = expr => {
    try {
        const result = parse(expr);
        const component = build(result);
        return component;
    } catch(err) {
        console.log(err);
    }
}