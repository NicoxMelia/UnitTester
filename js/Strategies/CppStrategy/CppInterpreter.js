import * as translationFunctions from "./interpreters.js";

export class CppInterpreter {
    constructor() {
        this.EXECUTION_ORDER = [
            'removeIncludes',
            'putVariables',
            'putFunctions',
            'manageCin',
            'manageCout',
            'manageEndl',
            'manageControlFlow',
            'manageExceptions',
            'putMain',
            'manageArrays'
        ];
        this.currentInput = "";
        this.output = "";
        this.error = {
            state: false,
            message: "",
            line: null
        };
        const missingFunctions = this.EXECUTION_ORDER.filter(funcName => !translationFunctions[funcName]);
        if (missingFunctions.length > 0) {
            console.warn(`⚠️ Funciones no encontradas: ${missingFunctions.join(', ')}`);
        }
    }

    translate(cppCode) {
        const originalLines = cppCode.split('\n');
        let translatedLines = [];
        let untranslatedLines = [];
        let jsCode = '';
        let index = 1;

        originalLines.forEach(line => {
            let lineReplaced = false;
            let trimmedLine = line.trim();

            // Ignorar líneas vacías o comentarios
            if (!trimmedLine || trimmedLine.startsWith('//')) {
                translatedLines.push(line);
                return;
            }

            this.EXECUTION_ORDER.forEach(funcName => {
                if (translationFunctions[funcName]) {
                    const translatedLine = translationFunctions[funcName](line);
                    if (translatedLine !== line && translatedLine != undefined) {
                        lineReplaced = true;
                        translatedLines.push(translatedLine);
                    }
                } else {
                    console.warn(`⚠️ Función ${funcName} no encontrada`);
                }
            });

            if (!lineReplaced && line.trim() !== '}') {
                console.warn(`⚠️ Syntax error at: Line: ${index}: ${line}`);
                throw new Error(`⚠️ Syntax error at: Line: ${index}: ${line}`);
                this.error.state = true;
                this.error.message = `⚠️ Syntax error at line ${index}: ${line}`;
                this.error.line = index;
            }

            if (!lineReplaced && line.trim() == '}') {
                translatedLines.push(line);
            }
            index++;
        });

        return this.putLanguageCode(translatedLines.join('\n'));
    }

    putLanguageCode(jsCode) {
        return `// Funciones de soporte
    // let output = "";
    // let currentInput = "";

    async function readInput() {
        const result = currentInput.trim();
        currentInput = "";
        return result;
    }

    async function readInputs(n) {
        const parts = currentInput.trim().split(/\\s+/);
        currentInput = "";
        return parts.slice(0, n).map(v => isNaN(v) ? v : Number(v));
    }

    ${jsCode}

    // Iniciar ejecución
    main();`;
    }
    
}