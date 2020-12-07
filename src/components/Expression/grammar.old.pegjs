// Simple Arithmetics Grammar
// ==========================
//
// Accepts expressions like "2 * (3 + 4)" and computes their value.


RootSubExpression
    = "ROOT" B:Integer "(" T:ExponentSubExpression ")" {
        return {
            type: 'root',
            base: B,
            term: T,
        }
    } / T:ExponentSubExpression {
        return T
    }

ExponentSubExpression "exponent subexpression"
    = C:SubExpression "^" E: SubExpression {
        return {
            coeff: C,
            exp: E,
            type: 'power',
        }
    } / SubExpression

SubExpression "expression"
    = "(" L:(RootTerm) S:("+" / "-" / "=") R:SubExpression ")" {
        return {
            brackets: true,
            lhs: L,
            rhs: R,
            symbol: S,
            type: 'expression',
        }
    } / L:(RootTerm) S:("+" / "-" / "=") R:SubExpression {
        return {
            brackets: false,
            lhs: L,
            rhs: R,
            symbol: S,
            type: 'expression',
        }
    } / F:(RootTerm) { return F }

RootTerm = "ROOT" B:Integer "(" T:ExponentFraction ")" {
    return {
        type: 'root',
        base: B,
        term: T,
    }
} / T:ExponentFraction {
    return T
}

ExponentFraction = N:ExponentTerm "/" D:ExponentTerm {
    return {
        numer: N,
        denom: D,
        type: 'fraction',
    }
} / C: ExponentTerm { return C }

ExponentTerm =
    "(" C:(VariableFraction / ConstantCoeffTerm / Constant) "^" P:(VariableFraction / ConstantCoeffTerm / Constant) ")" {
        return {
            type: 'power',
            coeff: C,
            exp: P
        }
    } / C:(VariableFraction / ConstantCoeffTerm / Constant) "^" P:(VariableFraction / ConstantCoeffTerm / Constant) {
        return {
            type: 'power',
            coeff: C,
            exp: P
        }
    } / C:(VariableFraction / ConstantCoeffTerm / Constant) { return C }

//A variable fraction is a fraction where zero or more of the top or bottom sub expressions are variable terms
VariableFraction "variable fraction"
    = N:(ConstantCoeffTerm / Real / Integer) "/" D:(ConstantCoeffTerm / Real / Integer) { 
        return { 
            numer: N, 
            denom: D, 
            type: 'fraction' 
        } 
    }

//A constant coefficient term is a term with a constant as it's coefficient
ConstantCoeffTerm "constant coefficient term"
    = "(" C:Constant? V:Variable+ ")" { 
        return { 
            coeff: C, 
            vars: V, 
            type: 'term' 
        } 
    } / C:Constant? V:Variable+ { 
        return { 
            coeff: C, 
            vars: V, 
            type: 'term' 
        } 
    }

// A constant is either a constant fraction, a real, or an integer
Constant "constant"
    = (ConstantFraction / Real / Integer)

// A constant fraction is any fraction which a constant on top and bottom
ConstantFraction "constant fraction"
    = N:(Real / Integer) "/" D:(Real / Integer) { return { numer: N, denom: D, type: 'fraction' } }

//A Real begins with an integer or a zero, followed by a decimal
Real "real"
    = _ ("0" / Integer) "." [0-9]+ { 
        return {
            val: parseFloat(text(), 10),
            type: 'real',
        } 
    }

//An integer is any set of digits beginning with a digit between 1-9 
Integer "integer"
    = _ ([1-9][0-9]* / "0") { 
        return {
            val: parseInt(text(), 10),
            type: 'integer'
        }
    }

//variables are any character a to z or A to Z
Variable
    = [a-zA-Z]

//Basic whitespace trimming
_ "whitespace"
    = [ \t\n\r]*