// Tryal

Equation = 
    L: Operation "=" R:Equation {
        return {
            lhs: L,
            rhs: R,
            symbol: "=",
            type: 'operation',
        }
    } / C: Operation { 
        return C; 
    }

Operation
    = O: (Function / AddSubtract / MultiplyDividePower / Brackets / ConstantCoeffTerm) {
        return O;
    }

Function = 
    F: UnaryFunctionSymbols "(" O: Operation ")" {
        return {
            symbol: F,
            expression: O,
            type: 'function',
        }
    }

MultiplyDividePower 
    = L: (Function / ConstantCoeffTerm / "(" O: Operation ")" { return {
        ...O,
        brackets: true,
        }; })
        S: ("*" / "/" / "^" / "") 
        R: (ConstantCoeffTerm / "(" O: Operation ")" { return O; }) {
            return {
                lhs: L,
                symbol: S !== "" ? S : "x",
                rhs: R,
                type: 'operation',
            }
        }

AddSubtract = L: (MultiplyDividePower / Function / ConstantCoeffTerm) S:("+" / "-") R: Operation {
    return {
        lhs: L,
        rhs: R,
        symbol: S,
        type: 'operation',
    }
} 

Brackets
    = "(" O: Operation ")" {
        return {
            ...O,
            brackets: true,
        }
    }

//A constant coefficient term is a term with a constant as it's coefficient
ConstantCoeffTerm "constant coefficient term"
    = D: (C:NegativeConstantFraction? V:Variable { 
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
    ("SQRT" / 
    "ROOT" Integer /
    "LOG" Integer /
    "LN" / 
    "SIN" / 
    "COS" / 
    "TAN" / 
    "ARCSIN" / 
    "ARCCOS" / 
    "ARCTAN") {
        return text();
    }

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