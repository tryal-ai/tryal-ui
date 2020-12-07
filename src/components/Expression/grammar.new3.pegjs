// Tryal

Operation "operation"
    = "(" O: Operation ")" S: BinaryOperatorSymbols R: Operation {
        return {
            type: 'operation',
            lhs: O,
            rhs: R,
            symbol: S
        }
    } / "(" O: Operation ")" R: Operation {
        return {
            type: 'operation',
            lhs: O,
            rhs: R,
            symbol: 'x'
        }
    } / "(" O: Operation ")" R: OperationTail {
        return {
            type: 'operation',
            lhs: O,
            rhs: R.rhs,
            symbol: R.symbol
        }
    } / "(" O: Operation ")" { 
        return O; 
    } / S: UnaryFunctionSymbols "(" O: Operation ")" P: OperationTail {
        return {
            type: 'operation',
            lhs: {
                type: 'function',
                symbol: S,
                expression: O,
            },
            rhs: P.rhs,
            symbol: P.symbol,
        }
    } / S: UnaryFunctionSymbols "(" O: Operation ")" {
        return {
            type: 'function',
            symbol: S,
            expression: O,
        }
    } / L: NegativeVariableFraction O: OperationTail {
        return {
            type: 'operation',
            lhs: L,
            rhs: O.rhs,
            symbol: O.symbol,
        }
    } / C: NegativeVariableFraction {
        return C;
    }

OperationTail "operation tail"
    // A function with an operation on the end
    = S: BinaryOperatorSymbols R: NegativeVariableFraction T: OperationTail {
        return {
            rhs: {
                type: 'operation',
                lhs: R,
                rhs: T.rhs,
                symbol: T.symbol
            },
            symbol: S,
        }
    } / S: BinaryOperatorSymbols R: NegativeVariableFraction {
        return {
            rhs: R,
            symbol: S,
        }
    } / R: NegativeVariableFraction {
        return {
            rhs: R,
            symbol: 'x'
        }
    }

NegativeVariableFraction "negative variable fraction"
    = "-" V: VariableFraction {
        return {
            val: V,
            type: 'negation',
        }
    } / VariableFraction

//A variable fraction is a fraction where zero or more of the top or bottom sub expressions are variable terms
VariableFraction "variable fraction"
    = N:(ConstantCoeffTerm) "/" D:(ConstantCoeffTerm) { 
        return { 
            numer: N, 
            denom: D, 
            type: 'fraction' 
        } 
    } / C: ConstantCoeffTerm { return C; }

//A constant coefficient term is a term with a constant as it's coefficient
ConstantCoeffTerm "constant coefficient term"
    = "(" (C:NegativeConstantFraction? V:Variable { 
        return { 
            coeff: C, 
            vars: V, 
            type: 'term' 
        } 
    })+ ")" / (C:NegativeConstantFraction? V:Variable { 
        return { 
            coeff: C, 
            vars: V, 
            type: 'term' 
        } 
    })+ / C: NegativeConstantFraction { return C; }


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
    = [a-zA-Z]

//Basic whitespace trimming
_ "whitespace"
    = [ \t\n\r]*