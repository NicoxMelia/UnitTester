//import * as translationFunctions from "./interpreters.js";
import { extractClassVariables, convertClassDeclaration, convertSystemOut, convertConstructors, convertMethods, convertVariableDeclarations, convertObjectCreations, rebuildClassWithProperties, getDefaultValueForType } from "./interpreters.js";

export class JavaInterpreter {
    constructor() {
        this.EXECUTION_ORDER = [
            'extractClassVariables',
            'convertClassDeclaration',
            'convertSystemOut',
            'convertConstructors',
            'convertMethods',
            'convertVariableDeclarations',
            'convertObjectCreations',
            'rebuildClassWithProperties',
            'getDefaultValueForType'
        ];
        this.currentInput = "";
        this.output = "";
        this.error = {
            state: false,
            message: "",
            line: null
        };
        /*const missingFunctions = this.EXECUTION_ORDER.filter(funcName => !translationFunctions[funcName]);
        if (missingFunctions.length > 0) {
            console.warn(`⚠️ Funciones no encontradas: ${missingFunctions.join(', ')}`);
        }*/
    }

    translate(javaCode) {
        // Extraer y procesar variables de clase
        const { classBody, classVariables } = extractClassVariables(javaCode);
        
        // Convertir el cuerpo principal
        let jsCode = convertClassDeclaration(classBody);
        jsCode = convertSystemOut(jsCode);
        jsCode = convertConstructors(jsCode);
        jsCode = convertMethods(jsCode);
        jsCode = convertVariableDeclarations(jsCode);
        jsCode = convertObjectCreations(jsCode);
        
        // Reconstruir la clase con las variables como propiedades
        if (classVariables.length > 0) {
            jsCode = rebuildClassWithProperties(jsCode, classVariables);
        }
        
        //return jsCode;
        return this.putLanguageCode(jsCode);
    }

    putLanguageCode(jsCode) {
        jsCode = `
                // Java-like functionality
                function assertTrue(condition) {
                    if (!condition) throw new Error("Assertion failed: expected true");
                }
                
                function assertFalse(condition) {
                    if (condition) throw new Error("Assertion failed: expected false");
                }
                
                function assertEquals(expected, actual) {
                    if (expected != actual) throw new Error(\`Assertion failed: expected \${expected}, got \${actual}\`);
                }
                
                function assertNotNull(obj) {
                    if (obj === null || obj === undefined) throw new Error("Assertion failed: object is null");
                }
                
                ${jsCode}
            `;
    
        return jsCode;
    }
    
}