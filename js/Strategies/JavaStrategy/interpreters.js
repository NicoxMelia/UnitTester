// Funciones auxiliares específicas
const classVariables = [];
function extractClassVariables(javaCode) {
    const classVarRegex = /(private|protected|public)\s+(?!class)([\w<>,\s]+)\s+(\w+)\s*(=\s*[^;]+)?\s*;/g;
   // const classVariables = [];
    
    const classBody = javaCode.replace(classVarRegex, (match, modifier, type, name, value) => {
        classVariables.push({ 
            modifier, 
            type: type.trim(), 
            name, 
            value: value ? value.replace(/^=\s*/, '').trim() : null 
        });
        return '';
    });
    return { classBody, classVariables };
}

function quitImports(code) {
    return code.replace(/import\s+[\w.]+;/g, '');
}

function replaceHashMap(code) {
    let jsCode = code.replace(/new\s+HashMap\s*<\s*>\s*\(\s*\)/g, 'new Map()');
    jsCode = jsCode.replace(/new\s+HashMap\s*<\s*([^>]+)\s*>\s*\(\s*\)/g, 'new Map()');
    jsCode = jsCode.replace(/new\s+HashMap\s*\(\s*\)/g, 'new Map()');
    jsCode = jsCode.replace(/new\s+HashMap\s*<\s*[^>]*\s*>\s*\(\s*(\d+)\s*\)/g, 'new Map()');
    jsCode = jsCode.replace(/new\s+HashMap\s*<\s*[^>]*\s*>\s*\(\s*\d+\s*,\s*\d*\.\d+\s*\)/g, 'new Map()');
    return jsCode;
}

function removeCommentsAndJavadocs(javaCode) {
    // Expresión regular combinada para:
    // 1. Javadocs (/** ... */)
    // 2. Comentarios multi-línea (/* ... */)
    // 3. Comentarios de una línea (// ...)
    return javaCode.replace(/\/\*\*[\s\S]*?\*\//g, '')  // Javadocs
                   .replace(/\/\*[\s\S]*?\*\//g, '')    // Comentarios /* */
                   .replace(/\/\/.*$/gm, '');           // Comentarios //
}

function needsThis(code, varName) {
    const jsKeywords = ['function', 'let', 'const', 'var', 'if', 'else', 'for', 'while', 
        'do', 'switch', 'case', 'default', 'return', 'class', 'constructor', 'this', 'new', 
        'import', 'export', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'break', 
        'continue', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof', 'in', 'with', 
        'yield', 'debugger', 'void', 'delete', 'setTimeout', 'setInterval', 'clearTimeout', 
        'clearInterval', 'constructor', 'get', 'set', 'static', 'public', 'private', 'protected',
        'abstract', 'interface', 'extends', 'implements', 'super', 'new', 'import', 'this'];
    
    // 1. Si es palabra reservada de JS
    if (jsKeywords.includes(varName)) {
        return false;
    }

    // 2. Si es parámetro de función (solo en el contexto de declaración)
    const isParam = new RegExp(`(?:function|constructor|\\w+\\s*\\([^)]*\\b${varName}\\b[^)]*\\))`).test(code);
    if (isParam) {
        return false;
    }

    // 3. Si es declaración local (let/const/var)
    const isLocalVar = new RegExp(`(let|const|var)\\s+${varName}(\\s*[=;,]|$)`).test(code);
    if (isLocalVar) {
        return false;
    }

    // 4. Verificar si es propiedad de clase
    const isClassProperty = classVariables.some(v => v.name === varName);
    
    return isClassProperty; // Solo usa this. si es propiedad de clase
}

function convertComplexExpressions(code) {
    // Patrón para detectar variables con o sin métodos encadenados
    const complexVarPattern = /(\b\w+(?:\.\w+\(\))*)\b(?![.(])/g;
    
    //return code.replace(complexVarPattern, (match, variable) => {
    //     // Separar la parte base de los métodos
    //     const baseVar = variable.split('.')[0];
    //     const useThis = needsThis(code, baseVar);
        
    //     return useThis ? `this.${variable}` : variable;
    // });

     const structurePattern = 
        /(if|while|for|switch|System\s*\.\s*out\s*\.\s*println)\s*\(([^)]*)\)/g;

    return code.replace(structurePattern, (match, keyword, condition) => {
        const processedCondition = condition.replace(
            /\b(\w+(?:\.\w+\(\))*)\b/g,
            (m, variable) => {
                const baseVar = variable.split('.')[0];
                const useThis = classVariables.some(v => v.name === baseVar) && keyword !== 'for';
                console.log(`Variable: ${variable}, Use this?: ${useThis}`);
                return useThis ? `this.${variable}` : variable;
            }
        );
        return `${keyword}(${processedCondition})`;
    });
}

function convertHashMapMethods(code) {
    let result = code;
    
    // put() → set()
    result = result.replace(/(\b\w+(?:\.\w+\(\))*)\s*\.\s*put\s*\(\s*([^)]*?)(?=\s*,\s*[^)]*\))\s*,\s*([^)]*)\s*\)/g, 
        (match, obj, key, value) => {
            const useThis = needsThis(code, obj);
            return useThis ? `this.${obj}.set(${key}, ${value})` : `${obj}.set(${key}, ${value})`;
        });
    
    // get() → get()
    result = result.replace(/(\w+)\.get\s*\((.*?)\)/g, 
        (match, obj, key) => {
            const useThis = needsThis(code, obj);
            return useThis ? `this.${obj}.get(${key})` : `${obj}.get(${key})`;
        });
    
    // containsKey() → has()
    result = result.replace(/(?:System\s*\.\s*out\s*\.\s*println\s*\(\s*)?(\b\w+(?:\.\w+\(\))*)\s*\.\s*containsKey\s*\(\s*([^)]*)\s*\)(?:\s*\))?/g, 
        (match, obj, key, offset, original) => {
            const useThis = needsThis(original, obj);
            const replacement = useThis ? `this.${obj}.has(${key})` : `${obj}.has(${key})`;
            if (match.includes('System.out.println')) {
                return `System.out.println(${replacement})`;
            }
            return replacement;
        });
    
    // keySet() → Array.from(map.keys())
    result = result.replace(/(\w+)\.keySet\s*\(\s*\)/g, 
        (match, obj) => {
            const useThis = needsThis(code, obj);
            return useThis ? `Array.from(this.${obj}.keys())` : `Array.from(${obj}.keys())`;
        });
    
    // values() → Array.from(map.values())
    result = result.replace(/(\w+)\.values\s*\(\s*\)/g, 
        (match, obj) => {
            const useThis = needsThis(code, obj);
            return useThis ? `Array.from(this.${obj}.values())` : `Array.from(${obj}.values())`;
        });
    
    // entrySet() → Array.from(map.entries())
    result = result.replace(/(\w+)\.entrySet\s*\(\s*\)/g, 
        (match, obj) => {
            const useThis = needsThis(code, obj);
            return useThis ? `Array.from(this.${obj}.entries())` : `Array.from(${obj}.entries())`;
        });
    
    // size() → getCollectionSize
    result = result.replace(/(\b\w+(?:\.\w+\(\))*)\s*\.\s*size\s*\(\s*\)/g, 
        (match, obj) => {
            const useThis = needsThis(code, obj);
            return useThis ? `getCollectionSize(this.${obj})` : `getCollectionSize(${obj})`;
        });
    
    // isEmpty() → size check
    result = result.replace(/(\w+)\.isEmpty\s*\(\s*\)/g, 
        (match, obj) => {
            const useThis = needsThis(code, obj);
            return useThis ? `this.${obj}.size === 0` : `${obj}.size === 0`;
        });
    
    // remove() → delete()
    result = result.replace(/(\w+)\.remove\s*\((.*?)\)/g, 
        (match, obj, key) => {
            const useThis = needsThis(code, obj);
            return useThis ? `this.${obj}.delete(${key})` : `${obj}.delete(${key})`;
        });
    
    // clear() → clear()
    result = result.replace(/(\w+)\.clear\s*\(\s*\)/g, 
        (match, obj) => {
            const useThis = needsThis(code, obj);
            return useThis ? `this.${obj}.clear()` : `${obj}.clear()`;
        });
    
    return result;
}

function convertHashMapIterations(code) {
    let result = code.replace(/for\s*\(\s*Map\.Entry\s*<\s*([^,]+)\s*,\s*([^>]+)\s*>\s*(\w+)\s*:\s*(\w+)\.entrySet\s*\(\s*\)\s*\)\s*\{/g, 
        (match, keyType, valueType, entryVar, mapVar) => {
            const useThis = needsThis(code, mapVar);
            return `for (let [${entryVar}.key, ${entryVar}.value] of ${useThis ? `this.${mapVar}` : mapVar}.entries()) {`;
        });
    
    result = result.replace(/for\s*\(\s*([^\s]+)\s+(\w+)\s*:\s*(\w+)\.keySet\s*\(\s*\)\s*\)\s*\{/g, 
        (match, type, varName, mapVar) => {
            const useThis = needsThis(code, mapVar);
            return `for (let ${varName} of ${useThis ? `this.${mapVar}` : mapVar}.keys()) {`;
        });
    
    return result;
}

function convertHashMapReturns(code) {
    return code.replace(
        /return\s+new\s+HashMap\s*<\s*>\s*\(\s*([^)]+)\s*\)\s*;/g,
        'return $1;'
    );
}

function convertHashMapDeclarations(code) {
    return code.replace(
        /(private|public|protected)\s+(?:final\s+)?HashMap\s*<\s*([^>]+)\s*>\s+(\w+)\s*(=\s*[^;]+)?\s*;/g,
        (match, modifier, genericTypes, varName, initialization) => {
            const initValue = initialization ? 
                initialization.replace(/^=\s*/, '').trim() : 'new Map()';
            return `let ${varName} = ${initValue};`;
        }
    );
}

function convertHashMapReturnTypes(code) {
    return code.replace(
        /(public|private|protected)\s+HashMap\s*<\s*([^>]+)\s*>\s+(\w+)\s*\(([^)]*)\)/g,
        (match, modifier, genericTypes, methodName, params) => {
            const jsParams = params.split(',')
                .map(p => p.trim().split(/\s+/).pop())
                .join(', ');
            return `${methodName}(${jsParams})`;
        }
    );
}

function convertClassDeclaration(code) {
    return code.replace(/public\s+class\s+(\w+)/g, 'class $1');
}

function convertSystemOut(code) {
    return code.replace(/System\s*\.\s*out\s*\.\s*println\s*\((.*?)\)\s*;/g, 'output.salida += $1 + String("\\n")');
}

function convertConstructors(code) {
    return code.replace(/public\s+(\w+)\s*\(([^)]*)\)/g, (match, className, params) => {
        const jsParams = params.split(',')
            .map(p => {
                const parts = p.trim().split(/\s+/);
                return parts.length > 1 ? parts[parts.length - 1] : p.trim();
            })
            .join(', ');
        return `constructor(${jsParams})`;
    });
}

function convertMethods(code) {
    return code.replace(
        /(public|private|protected)\s+([\w<>]+)\s+([a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\w]+)\s*\(([^)]*)\)/g, 
        function(match, access, returnType, methodName, params) {
            const mapArgs = params.replace(/HashMap\s*<[a-zA-Z]*,\s*[a-zA-Z]*>\s*(\w+)/g, '$1');
            const jsParams = mapArgs.split(',')
                .map(p => p.trim().split(/\s+/).pop())
                .join(', ');
            return `${methodName}(${jsParams})`;
        }
    );
}

function convertVariableDeclarations(code) {
    let result = code.replace(/\b(int|double|float|char|byte|short|long)\s+(\w+)\s*=/g, 'let $2 =');
    result = result.replace(/\bString\s+(\w+)\s*=/g, 'let $1 =');
    result = result.replace(/\bboolean\s+(\w+)\s*=/g, 'let $1 =');
    result = result.replace(/\bfinal\s+/g, 'const ');
    result = result.replace(/\b(Integer|Double|Float)\s+(\w+)\s*=/g, 'let $2 =');
    return result;
}

function convertObjectCreations(code) {
    return code.replace(/([a-zA-Z]+)\s+(\w+)\s*=\s*new\s+([\w<>]+)\s*\(([^)]*)\)/g, 'let $2 = new $3($4)');
}

function rebuildClassWithProperties(jsCode, classVariables) {
    const classNameMatch = jsCode.match(/class\s+(\w+)\s*\{/);
    if (!classNameMatch) return jsCode;
    
    const className = classNameMatch[1];
    const propsCode = classVariables.map(v => {
        const value = v.value || getDefaultValueForType(v.type);
       // return `    this.${v.name} = ${value};`;
       return "";
    }).join('\n');

    const classOpenBraceIndex = jsCode.indexOf('{');
    
    return jsCode.slice(0, classOpenBraceIndex + 1) +  
           '\n' + propsCode + '\n' +
           jsCode.slice(classOpenBraceIndex + 1);
}

function getDefaultValueForType(type) {
    if (type.includes('HashMap')) return 'new Map()';
    
    switch(type.toLowerCase()) {
        case 'boolean': return 'false';
        case 'int':
        case 'double':
        case 'float':
        case 'byte':
        case 'short':
        case 'long': return '0';
        case 'string': return '""';
        default: return 'null';
    }
}

function convertReturns(code) {
    return code.replace(/return\s+([a-zA-Z_]\w*)\s*;/g, 
        (match, varName) => {
            const useThis = classVariables.some(v => v.name === varName);
            return useThis ? `return this.${varName};` : `return ${varName};`;
        });
}

function convertWhileLoops(code) {
    return code.replace(/while\s*\((.*?)\)\s*\{/g, 'while ($1) {');
}

function convertForLoops(code) {
    return code.replace(/for\s*\((.*?;\s*.*?;\s*.*?)\)\s*\{/g, (match, condition) => {
        const parts = condition.split(';');
        const initPart = parts[0].replace(/\b(int|double|float|char|byte|short|long)\s+(\w+)/g, 'let $2');
        return `for (${initPart};${parts[1]};${parts[2]}) {`;
    });
}

function convertForEachLoops(code) {
    return code.replace(/for\s*\((?:final\s+)?([\w<>]+)\s+(\w+)\s*:\s*([^)]+)\)\s*\{/g, 
        (match, type, varName, collection) => {
            const useThis = needsThis(code, collection);
            return `for (let ${varName} of ${useThis ? `this.${collection}` : collection}) {`;
        });
}

function convertIfElse(code) {
    let result = code.replace(/if\s*\((.*?)\)\s*\{/g, 'if ($1) {');
    result = result.replace(/}\s*else\s*if\s*\((.*?)\)\s*\{/g, '} else if ($1) {');
    result = result.replace(/}\s*else\s*\{/g, '} else {');
    return result;
}

function convertSwitchStatements(code) {
    let result = code.replace(/switch\s*\((.*?)\)\s*\{/g, 'switch ($1) {');
    result = result.replace(/case\s+([^:]+):/g, 'case $1:');
    result = result.replace(/default\s*:/g, 'default:');
    return result;
}

function convertDoWhileLoops(code) {
    return code.replace(/do\s*\{([^}]*)\}\s*while\s*\((.*?)\)\s*;/g, 
        'do {$1} while ($2);');
}

function convertBreakContinue(code) {
    return code.replace(/\bbreak\s*([^;]*);/g, 'break $1;')
              .replace(/\bcontinue\s*([^;]*);/g, 'continue $1;');
}

function convertArrayListDeclarations(code) {
    let jsCode = code.replace(/new\s+ArrayList\s*<\s*>\s*\(\s*\)/g, '[]');
    jsCode = jsCode.replace(/new\s+ArrayList\s*<\s*([^>]+)\s*>\s*\(\s*\)/g, '[]');
    jsCode = jsCode.replace(/new\s+ArrayList\s*\(\s*\)/g, '[]');
    jsCode = jsCode.replace(/new\s+ArrayList\s*<\s*[^>]*\s*>\s*\(\s*(\d+)\s*\)/g, '[]');
    jsCode = jsCode.replace(/new\s+ArrayList\s*<\s*([^>]*)\s*>\s*\((\w+)\)/g, 
        (match, type, arrayVar) => {
            const useThis = needsThis(code, arrayVar);
            return useThis ? `this.${arrayVar}` : arrayVar;
        });
    return jsCode;
}

function convertArrayListVariableDeclarations(code) {
    return code.replace(
        /(private|public|protected)\s+(?:final\s+)?ArrayList\s*<\s*([^>]+)\s*>\s+(\w+)\s*(=\s*[^;]+)?\s*;/g,
        (match, modifier, genericType, varName, initialization) => {
            const initValue = initialization ? 
                initialization.replace(/^=\s*/, '').trim() : '[]';
            return `let ${varName} = ${initValue};`;
        }
    ).replace(/ArrayList<\w+>\s(\w+)/g, 'let $1');
}

function convertArrayListMethods(code) {
    let result = code;
    
    // add() → push()
    result = result.replace(/(\w+)\.add\s*\((.*?)\)/g, 
        (match, obj, value) => {
            const useThis = classVariables.some(v => v.name === obj);
            return useThis ? `this.${obj}.push(${value})` : `${obj}.push(${value})`;
        });
    
    // get() → acceso por índice
    result = result.replace(/(\w+)\.get\s*\((.*?)\)/g, 
        (match, obj, index) => {
            const useThis = classVariables.some(v => v.name === obj);
            return useThis ? `this.${obj}[${index}]` : `${obj}[${index}]`;
        });
    
    // size() → length
    result = result.replace(/(([\w]+(?:\s*\.\s*[\w]+\s*\([^)]*\))*))\s*\.\s*size\s*\(\s*\)/g, 
        (match, obj) => {
            const useThis = classVariables.some(v => v.name === obj);
            return useThis ? `getCollectionSize(this.${obj})` : `getCollectionSize(${obj})`;
        });
    
    // isEmpty() → length check
    result = result.replace(/(\w+)\.isEmpty\s*\(\s*\)/g, 
        (match, obj) => {
            const useThis = classVariables.some(v => v.name === obj);
            return useThis ? `this.${obj}.length === 0` : `${obj}.length === 0`;
        });
    
    // contains() → includes()
    result = result.replace(/(\w+)\.contains\s*\((.*?)\)/g, 
        (match, obj, value) => {
            const useThis = false;
            return useThis ? `this.${obj}.includes(${value})` : `${obj}.includes(${value})`;
        });
    
    // remove(index) → splice()
    result = result.replace(/(\w+)\.remove\s*\((\d+)\)/g, 
        (match, obj, index) => {
            const useThis = classVariables.some(v => v.name === obj);
            return useThis ? `this.${obj}.splice(${index}, 1)` : `${obj}.splice(${index}, 1)`;
        });
    
    // clear() → asignación a array vacío
    result = result.replace(/(\w+)\.clear\s*\(\s*\)/g, 
        (match, obj) => {
            const useThis = classVariables.some(v => v.name === obj);
            return useThis ? `this.${obj} = []` : `${obj} = []`;
        });
    
    return result;
}

function convertArrayListReturnTypes(code) {
    return code.replace(
        /(public|private|protected)\s+ArrayList\s*<\s*([^>]+)\s*>\s+(\w+)\s*\(([^)]*)\)/g,
        (match, modifier, genericType, methodName, params) => {
            const jsParams = params.split(',')
                .map(p => p.trim().split(/\s+/).pop())
                .join(', ');
            return `${methodName}(${jsParams})`;
        }
    );
}

export {
    extractClassVariables,
    quitImports,
    replaceHashMap,
    convertHashMapDeclarations,
    convertHashMapMethods,
    convertHashMapReturnTypes,
    convertHashMapReturns,
    convertClassDeclaration,
    convertSystemOut,
    convertConstructors,
    convertMethods,
    convertVariableDeclarations,
    convertObjectCreations,
    rebuildClassWithProperties,
    getDefaultValueForType,
    convertReturns,
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
    convertHashMapIterations,
    convertComplexExpressions,
    removeCommentsAndJavadocs,
};