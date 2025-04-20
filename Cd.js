Steps:
Pull the latest main branch changes:
bash

git pull origin main

Edit index.html to add TAC generation and optimization within the <script> tag. Update the analyzeCode function to include:
javascript

function analyzeCode() {
    let code = document.getElementById("codeInput").value;
    let keywords = ["int", "float", "if", "else", "return", "while", "for"];
    let operators = ["==", "!=", "<=", ">=", "=", "+", "-", "*", "/"];
    let symbols = ["{", "}", "(", ")", ";", ","];
    
    let tokens = [], syntaxErrors = [], semanticErrors = [], tacList = [], assemblyList = [];
    let declaredVariables = new Set();
    let tokenMatches = code.match(/\b(int|float|if|else|return|while|for)\b|[a-zA-Z_][a-zA-Z0-9_]*|\d+|==|!=|<=|>=|[=+\-*/{}();,]/g) || [];

    // Lexical Analysis
    tokenMatches.forEach((token, i) => {
        if (keywords.includes(token)) {
            tokens.push(`Keyword: ${token}`);
            if (i + 1 < tokenMatches.length && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tokenMatches[i + 1])) {
                declaredVariables.add(tokenMatches[i + 1]);
            }
        } else if (operators.includes(token)) {
            tokens.push(`Operator: ${token}`);
        } else if (symbols.includes(token)) {
            tokens.push(`Symbol: ${token}`);
        } else if (!isNaN(token)) {
            tokens.push(`Number: ${token}`);
        } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
            tokens.push(`Identifier: ${token}`);
            if (!declaredVariables.has(token) && (i === 0 || !["int", "float"].includes(tokenMatches[i - 1]))) {
                semanticErrors.push(`Undeclared variable: ${token}`);
            }
        } else {
            syntaxErrors.push(`Unknown token: ${token}`);
        }
    });

    // Syntax Analysis
    let statements = code.split("\n");
    statements.forEach((line, index) => {
        if (line.trim() && !line.trim().endsWith(";") && !line.includes("{") && !line.includes("}")) {
            syntaxErrors.push(`Syntax Error at line ${index + 1}: Missing semicolon.`);
        }
    });

    // TAC Generation
    let assignmentMatch = code.match(/(\w+)\s*=\s*(.+);/);
    if (assignmentMatch) {
        let [_, result, expr] = assignmentMatch;
        tacList.push(`t1 = ${expr}`);
        tacList.push(`${result} = t1`);
    }

    // Optimization
    if (tacList.length > 1 && tacList[0].includes("=")) {
        let parts = tacList[0].split("=");
        let value = parts[1].trim();
        if (!isNaN(value)) {
            tacList = [`${assignmentMatch[1]} = ${value}`]; // Optimized: Constant folding
        }
    }

    // Display Results
    document.getElementById("tokensList").innerHTML = tokens.map(t => `<li>${t}</li>`).join("\n");
    document.getElementById("syntaxList").innerHTML = syntaxErrors.map(e => `<li class='error'>${e}</li>`).join("\n");
    document.getElementById("semanticList").innerHTML = semanticErrors.map(e => `<li class='error'>${e}</li>`).join("\n");
    document.getElementById("tacList").innerHTML = tacList.map(t => `<li>${t}</li>`).join("\n");
}

Stage and commit:
bash

git add index.html
git commit -m "Add TAC generation and optimization"

Push the branch:
bash

git push origin tac-generation
