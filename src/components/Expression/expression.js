import {parse} from 'trygrammar'
import * as components from './types';

const buildFloat = data => {
    return {
        component: components.float,
        props: {
            value: data.val,
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

const buildGreek = data => {
    if (data.power) {
        return build({
            mantissa: { ...data, power: null },
            exponent: data.power,
            type: 'power' 
        })
    }
    return {
        component: components.greek,
        props: {
            value: data.val
        }
    }
}

const buildTerm = data => {
    if (data.power) {
        return build({
            mantissa: { ...data, power: null },
            exponent: data.power,
            type: 'power'
        })
    }
    return {
        component: components.term,
        props: {
            variable: data.vars,
        }
    }
}

const buildTerms = data => {
    const vars = data.coeff ? [data.coeff, ...data.vars] : data.vars;
    return {
        component: components.terms,
        props: {
            components: vars.map(v => build(v)),
        }
    }
}

const buildCoordinate = data => {
    return {
        component: components.coordinate,
        props: {
            components: data.points.map(v => build(v))
        }
    }
}

const buildBracket = data => {
    return {
        component: components.bracket,
        props: {
            inner: build(data.expression)
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

const buildPower = data => {
    return {
        component: components.power,
        props: {
            coefficient: build(data.mantissa),
            exponent: build(data.exponent)
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

const buildImplicit = data => {
    return {
        component: components.implicit,
        props: {
            components: data.terms.map(v => build(v))
        }
    }
}

const buildExplicit = data => {
    const reduced = data.terms.reduce((prev, curr) => {
        if (curr.type === 'fraction' 
            && curr.numer.type === 'integer' 
            && curr.numer.val === 1 
            && prev.length > 0 
            && prev[prev.length - 1].type !== 'fraction') {
                return [...prev.slice(0, prev.length - 1), {
                ...curr,
                numer: prev[prev.length - 1],
            }]
        }
        return [...prev, curr]
    }, []);
    return {
        component: components.explicit,
        props: {
            components: reduced.map(t => build(t))
        }
    }
}

const buildMultiplication = data => {
    if (data.implicit) {
        return buildImplicit(data);
    } else {
        return buildExplicit(data);
    }
}

const buildAddition = data => {
    return {
        component: components.summation,
        props: {
            components: [build(data.terms[0]), ...data.terms.slice(1).map(t => {
                if (t.type == 'negation') return build(t);
                else return {
                    component: components.addition,
                    props: {
                        component: build(t)
                    }
                }
            })],
        }
    }
}

const buildNegation = data => {
    return {
        component: components.negation,
        props: {
            component: build(data),
        }
    }
}

const buildEquation = data => {
    return {
        component: components.equation,
        props: {
            components: data.expressions.map(e => build(e))
        }
    }
}

const builders = {
    'float': buildFloat,
    'integer': buildInteger,
    'greek': buildGreek,
    'term': buildTerm,
    'terms': buildTerms,
    'coordinate': buildCoordinate,
    'brackets': buildBracket,
    'function': buildFunction,
    'power': buildPower,
    'multiplication': buildMultiplication,
    'fraction': buildFraction,
    'addition': buildAddition,
    'negation': buildNegation,
    'equation': buildEquation,
}


const build = data => {
    return builders[data.type](data);
}


export const getComponent = expr => {
    try {
        const result = parse(expr);
        if (!result) return null;
        const component = build(result);
        return component;
    } catch(err) {
        //console.log(err);
    }
}