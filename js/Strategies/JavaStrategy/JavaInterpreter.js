//import * as translationFunctions from "./interpreters.js";
import {
    convertComplexExpressions,
    removeCommentsAndJavadocs,
    extractClassVariables,
    convertReturns,
    quitImports,
    replaceHashMap,
    convertHashMapReturns,
    convertHashMapDeclarations,
    convertHashMapReturnTypes,
    convertHashMapMethods,
    convertClassDeclaration,
    convertSystemOut,
    convertConstructors,
    convertMethods,
    convertVariableDeclarations,
    convertObjectCreations,
    rebuildClassWithProperties,
    getDefaultValueForType,
    convertWhileLoops,
    convertForLoops,
    convertForEachLoops,
    convertIfElse,
    convertSwitchStatements,
    convertDoWhileLoops,
    convertBreakContinue,
    convertArrayListDeclarations,
    convertArrayListVariableDeclarations,
    convertArrayListMethods,
    convertArrayListReturnTypes,
} from "./interpreters.js";

export class JavaInterpreter {
    constructor() {
        this.EXECUTION_ORDER = [
            'extractClassVariables',
            'quitImports',
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
        const { classBody, classVariables } = extractClassVariables(javaCode);

        // 1. Limpieza inicial y estructura básica
        let jsCode = quitImports(classBody);
        jsCode = removeCommentsAndJavadocs(jsCode); // Limpieza de comentarios y Javadocs
        jsCode = convertClassDeclaration(jsCode);

        // 2. Declaraciones de variables
        jsCode = convertVariableDeclarations(jsCode);
        jsCode = convertHashMapDeclarations(jsCode);
        jsCode = convertArrayListDeclarations(jsCode);
        jsCode = convertArrayListVariableDeclarations(jsCode);

        // 3. Estructuras de control (para definir ámbitos)
        jsCode = convertForLoops(jsCode);
        jsCode = convertForEachLoops(jsCode);
        jsCode = convertWhileLoops(jsCode);
        jsCode = convertDoWhileLoops(jsCode);
        jsCode = convertIfElse(jsCode);
        jsCode = convertSwitchStatements(jsCode);
        jsCode = convertBreakContinue(jsCode);


        // 5. Funciones y métodos
        jsCode = convertConstructors(jsCode);
        jsCode = convertMethods(jsCode);
        jsCode = convertHashMapMethods(jsCode);
        jsCode = convertArrayListMethods(jsCode);

        // 6. Retornos y expresiones finales
        jsCode = replaceHashMap(jsCode);
        jsCode = convertObjectCreations(jsCode);
        jsCode = convertHashMapReturns(jsCode);
        jsCode = convertArrayListReturnTypes(jsCode);
        jsCode = convertHashMapReturnTypes(jsCode);
        jsCode = convertReturns(jsCode);

         // 4. Convertir expresiones complejas (¡NUEVO!)
        jsCode = convertComplexExpressions(jsCode);  // <--- Aquí

        // 7. Salida y reconstrucción
        jsCode = convertSystemOut(jsCode);
        if (classVariables.length > 0) {
            jsCode = rebuildClassWithProperties(jsCode, classVariables);
        }
        
        //return jsCode;
        return this.putLanguageCode(jsCode);
    }

    putLanguageCode(jsCode) {
      /*  jsCode = `
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
            `;*/

        jsCode = `
        function getCollectionSize(collection) {
        console.log(collection);
            if (collection instanceof Map) {
                return collection.size;
            } else if (Array.isArray(collection)) {
                return collection.length;
            }
        }
            ${jsCode}`
    
        return jsCode;
    }
    
}