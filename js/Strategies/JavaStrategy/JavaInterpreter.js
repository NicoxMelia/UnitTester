//import * as translationFunctions from "./interpreters.js";
import {
    extractClassVariables,
    returnVariable,
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
        // Extraer y procesar variables de clase
        const { classBody, classVariables } = extractClassVariables(javaCode);
        
        // Convertir el cuerpo principal
        let jsCode = convertClassDeclaration(classBody);
        jsCode = returnVariable(jsCode, classVariables);
        jsCode = quitImports(jsCode);
        jsCode = replaceHashMap(jsCode);
        jsCode = convertHashMapDeclarations(jsCode);
        jsCode = convertHashMapReturnTypes(jsCode);
        jsCode = convertHashMapMethods(jsCode);
        jsCode = convertHashMapReturns(jsCode);
        jsCode = convertSystemOut(jsCode);
        jsCode = convertConstructors(jsCode);
        jsCode = convertMethods(jsCode);
        jsCode = convertVariableDeclarations(jsCode);
        jsCode = convertObjectCreations(jsCode);
        jsCode = convertReturns(jsCode);

        //nuevas
        jsCode = convertWhileLoops(jsCode);
        jsCode = convertForLoops(jsCode);
        jsCode = convertForEachLoops(jsCode);
        jsCode = convertIfElse(jsCode);
        jsCode = convertSwitchStatements(jsCode);
        jsCode = convertDoWhileLoops(jsCode);
        jsCode = convertBreakContinue(jsCode);

        //arraylist

        jsCode = convertArrayListDeclarations(jsCode);
        jsCode = convertArrayListVariableDeclarations(jsCode);
        jsCode = convertArrayListMethods(jsCode);
        jsCode = convertArrayListReturnTypes(jsCode);
            
        // Reconstruir la clase con las variables como propiedades
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