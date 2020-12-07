// Tryal

Equation = 
    L: Expression "=" R:Equation {
        console.log("Equation #1");
        return {
            type: 'operation',
            lhs: L,
            rhs: R,
            symbol: "=",
        }
    } / C: Expression { 
        console.log("Equation #2");
        return C; 
    } / "(" C: Equation ")" {
        console.log("Equation #3");
        return {
            ...C,
            brackets: true,
        }
    } 


Expression =
    "(" L: (Operation / Expression) ")" S: ("/" / "^") "(" R: (Operation / Expression) ")" {
        console.log("Expression #1");
        return {
            type: 'operation',
            lhs: {
                ...L,
                brackets: true,
            },
            rhs: {
                ...R,
                brackets: true,
            },
            symbol: S,
        }
    } / "(" L: (Operation / Expression) ")" S: ("/" / "^") R: ConstantCoeffTerm {
        console.log("Expression #2");
        return {
            type: 'operation',
            lhs: {
                ...L,
                brackets: true,
            },
            rhs: R,
            symbol: S,
        }
    // consume brackets if no one else has consumed them
    } / "(" C:Expression ")" { 
        console.log("Expression #3");
        return { 
            ...C,
            brackets: true,
        } 
    } / L: Operation S: ("+" / "-") R: (Operation / Expression) {
        console.log("Expression #4");
        return {
            type: 'operation',
            lhs: L,
            rhs: R,
            symbol: S,
        }
    } / L: Operation R: Expression {
        console.log("Expression #5");
        return {
            type: 'operation',
            lhs: L,
            rhs: R,
            symbol: 'x',
        }
    } / C: Operation { 
        console.log("Expression #6");
        return C; 
    }

Operation =
    "(" C: Operation ")" { 
        return {
            ...C,
            brackets: true,
        }; 
    // A unary function can contain any operation
    } / F: UnaryFunctionSymbols "(" R:Operation ")" {
        return {
            type: 'function',
            symbol: F,
            expression: R,
        }
    // it's been wrapped in brackets, which pushes the order of precedence up
    } / L:ConstantCoeffTerm S:("^" / "*" / "/") "(" R:Operation ")" {
        return {
            type: 'operation',
            symbol: S,
            lhs: L,
            rhs: {
                ...R,
                brackets: true,
            },
        }
    // A "^" or "*" or "/" can take only a constant coeff on the right, unless
    } / L:ConstantCoeffTerm S:("^" / "*" / "/") R:(NegativeConstantFraction / ConstantCoeffTerm) {
        return {
            type: 'operation',
            symbol: S,
            lhs: L,
            rhs: R,
        }
    // A "+" or "-" can take anything on the right, including a bracketed operation
    } / L:ConstantCoeffTerm S:("+" / "-") R:Operation {
        return {
            type: 'operation',
            symbol: S,
            lhs: L,
            rhs: R,
        }
    //An expression could be a constant or coeff term
    } / C:ConstantCoeffTerm { return C; }

//A constant coefficient term is a term with a constant as it's coefficient
ConstantCoeffTerm "constant coefficient term"
    = "(" D:(C:NegativeConstantFraction? V:Variable { 
        return { 
            coeff: C, 
            vars: V.vars, 
            type: 'term' 
        } 
    })+ ")" {
        return D.length == 1 ? D[0] : {
            terms: D,
            type: 'terms',
        }
    } / D: (C:NegativeConstantFraction? V:Variable { 
        return { 
            coeff: C, 
            vars: V.vars, 
            type: 'term' 
        } 
    })+ {
        return D.length == 1 ? D[0] : {
            terms: D,
            type: 'terms',
        }
    } / C: NegativeConstantFraction { return C; }


NegativeConstantFraction "negative constant fraction"
    = "-" C:NegativeConstantFraction {
        return {
            val: C,
            type: 'negation',
        }
    } / C: ConstantFraction { return C; }

// A constant fraction is any fraction which a constant on top and bottom
ConstantFraction "constant fraction"
    = N:(Constant) "/" D:(Constant) { 
        return { 
            numer: N, 
            denom: D, 
            type: 'fraction' 
        } 
    } / C: Constant { return C }


Constant "constant"
    = "-" C:(Real / Integer / GreekSymbols / Variable) {
        return {
            val: C,
            type: 'negation', 
        }
    } / C:(Real / Integer / GreekSymbols / Variable) { return C }



//A Real begins with an integer or a zero, followed by a decimal
Real "real"
    = ("0" / Integer) "." [0-9]+ { 
        return {
            val: parseFloat(text(), 10),
            type: 'real',
        } 
    }

BinaryOperatorSymbols =
    "+" /
    "-" /
    //multiplication is not inferrable
    "*" /
    "=" /
    "^"

UnaryFunctionSymbols = 
    "SQRT" / 
    "ROOT" Integer /
    "LOG" Integer /
    "LN" / 
    "SIN" / 
    "COS" / 
    "TAN" / 
    "ARCSIN" / 
    "ARCCOS" / 
    "ARCTAN" 

//An integer is any set of digits beginning with a digit between 1-9 
Integer "integer"
    = ([1-9][0-9]* / "0") { 
        return {
            val: parseInt(text(), 10),
            type: 'integer'
        }
    }


GreekSymbols "greek symbol"
    = "#" S:("pi" / "epsilon" / "theta") {
        return {
            val: S,
            type: "greek"
        }
    }

//variables are any character a to z or A to Z
Variable
    = V:[a-zA-Z] {
        return {
            vars: V,
            type: 'term',
        }
    }

//Basic whitespace trimming
_ "whitespace"
    = [ \t\n\r]*