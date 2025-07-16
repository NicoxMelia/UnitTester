// Funciones auxiliares específicas
function extractClassVariables(javaCode) {
    const classVarRegex = /(private|protected|public)\s+(?!class)([\w<>,\s]+)\s+(\w+)\s*(=\s*[^;]+)?\s*;/g;
    const classVariables = [];
    
    const classBody = javaCode.replace(classVarRegex, (match, modifier, type, name, value) => {
        classVariables.push({ 
            modifier, 
            type: type.trim(), 
            name, 
            value: value ? value.replace(/^=\s*/, '').trim() : null 
        });
        return '';
    });
    console.warn(classVariables);
    return { classBody, classVariables };
}

function quitImports(code) {
    return code.replace(/import\s+[\w.]+;/g, '');
}

function returnVariable(code, vars) {
    const varNames = vars.map(v => v.name);
    
    // 1. Primero marcamos los parámetros de métodos para protegerlos
    let processedCode = code.replace(/(public|private|protected)?\s+\w+\s+(\w+)\s*\(([^)]*)\)/g, 
        (match, modifier, methodName, params) => {
            // Marcamos cada parámetro (tipo + nombre)
            const protectedParams = params.replace(/(\w+)\s+(\w+)/g, (_, type, paramName) => {
                return `${type} __PARAM_${paramName}__`;
            });
            return `${modifier || ''} ${methodName}(${protectedParams})`;
        }
    );
    
    // 2. Ahora reemplazamos las variables de clase
    processedCode = processedCode.replace(/(?<!\w\.|this\.)\b(\w+)\b(?=\s*[;),=+\-*\/%]|$)/g, 
        (match, varName) => {
            return varNames.includes(varName) ? `this.${varName}` : match;
        }
    );
    
    // 3. Restauramos los parámetros marcados
    processedCode = processedCode.replace(/__PARAM_(\w+)__/g, '$1');
    
    return processedCode;
}

function replaceHashMap(code) {
    // Caso 1: new HashMap<>()
    let jsCode = code.replace(/new\s+HashMap\s*<\s*>\s*\(\s*\)/g, 'new Map()');
    
    // Caso 2: new HashMap<Type>() con tipos
    jsCode = jsCode.replace(/new\s+HashMap\s*<\s*([^>]+)\s*>\s*\(\s*\)/g, 'new Map()');
    
    // Caso 3: new HashMap() (sin diamantes)
    jsCode = jsCode.replace(/new\s+HashMap\s*\(\s*\)/g, 'new Map()');
    
    // Caso 4: Inicialización con capacidad: new HashMap(100)
    jsCode = jsCode.replace(/new\s+HashMap\s*<\s*[^>]*\s*>\s*\(\s*(\d+)\s*\)/g, 'new Map()');
    
    // Caso 5: Inicialización con capacidad y factor de carga
    jsCode = jsCode.replace(/new\s+HashMap\s*<\s*[^>]*\s*>\s*\(\s*\d+\s*,\s*\d*\.\d+\s*\)/g, 'new Map()');
    
    //jsCode = jsCode.replace(/HashMap\s*<[a-zA-Z]*,\s*[a-zA-Z]*>\s*(\w+)/g, '$1');

    return jsCode;
}

function convertHashMapMethods(code) {
    let result = code;
    
    // put() → set()
    result = result.replace(/(\b\w+(?:\.\w+\(\))*)\s*\.\s*put\s*\(\s*([^)]*?)(?=\s*,\s*[^)]*\))\s*,\s*([^)]*)\s*\)/g, 
        `typeof $1 !== 'undefined' ? $1.set($2, $3) : this.$1.set($2, $3)`);
    
    // get() → get()
    result = result.replace(/(\w+)\.get\s*\((.*?)\)/g, 
        `typeof $1 !== 'undefined' ? $1.get($2) : this.$1.get($2)`);
    
    // containsKey() → has()
    result = result.replace(/(?:System\s*\.\s*out\s*\.\s*println\s*\(\s*)?(\b\w+(?:\.\w+\(\))*)\s*\.\s*containsKey\s*\(\s*([^)]*)\s*\)(?:\s*\))?/g, (match, group1, group2) => {
        const replacement = `typeof ${group1} !== 'undefined' ? ${group1}.has(${group2}) : this.${group1}.has(${group2})`;
        if (match.includes('System.out.println')) {
            return `System.out.println(${replacement})`;
        }
        return replacement;
    });
    
    // keySet() → Array.from(map.keys())
    result = result.replace(/(\w+)\.keySet\s*\(\s*\)/g, 
        `typeof $1 !== 'undefined' ? Array.from($1.keys()) : Array.from(this.$1.keys())`);
    
    // values() → Array.from(map.values())
    result = result.replace(/(\w+)\.values\s*\(\s*\)/g, 
        `typeof $1 !== 'undefined' ? Array.from($1.values()) : Array.from(this.$1.values())`);
    
    // entrySet() → Array.from(map.entries())
    result = result.replace(/(\w+)\.entrySet\s*\(\s*\)/g, 
        `typeof $1 !== 'undefined' ? Array.from($1.entries()) : Array.from(this.$1.entries())`);
    
    // size() → getCollectionSize
    result = result.replace(/(\b\w+(?:\.\w+\(\))*)\s*\.\s*size\s*\(\s*\)/g, 
        `typeof $1 !== 'undefined' ? getCollectionSize($1) : getCollectionSize(this.$1)`);
    
    // isEmpty() → size check
    result = result.replace(/(\w+)\.isEmpty\s*\(\s*\)/g, 
        `typeof $1 !== 'undefined' ? $1.size === 0 : this.$1.size === 0`);
    
    // remove() → delete()
    result = result.replace(/(\w+)\.remove\s*\((.*?)\)/g, 
        `typeof $1 !== 'undefined' ? $1.delete($2) : this.$1.delete($2)`);
    
    // clear() → clear()
    result = result.replace(/(\w+)\.clear\s*\(\s*\)/g, 
        `typeof $1 !== 'undefined' ? $1.clear() : this.$1.clear()`);
    
    return result;
}

function convertHashMapIterations(code) {
    // Iteración con entrySet() y for
    let result = code.replace(/for\s*\(\s*Map\.Entry\s*<\s*([^,]+)\s*,\s*([^>]+)\s*>\s*(\w+)\s*:\s*(\w+)\.entrySet\s*\(\s*\)\s*\)\s*\{/g, 
        `for (let [$3.key, $3.value] of typeof $4 !== 'undefined' ? $4.entries() : this.$4.entries()) {`);
    
    // Iteración con keySet() y for
    result = result.replace(/for\s*\(\s*([^\s]+)\s+(\w+)\s*:\s*(\w+)\.keySet\s*\(\s*\)\s*\)\s*\{/g, 
        `for (let $2 of typeof $3 !== 'undefined' ? $3.keys() : this.$3.keys()) {`);
    
    return result;
}

function convertHashMapReturns(code) {
    return code.replace(
        /return\s+new\s+HashMap\s*<\s*>\s*\(\s*([^)]+)\s*\)\s*;/g,
        'return $1;'
    );
}

function convertHashMapDeclarations(code) {
    // Convertir declaraciones de variables HashMap
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
    //return code.replace(/System\s*\.\s*out\s*\.\s*println\s*\((.*?)\)\s*;/g, 'output.salida += $1 + String(\"\\n\")');
    return code.replace(/System\s*\.\s*out\s*\.\s*println\s*\((.*?)\)\s*;/g, 'output.salida += $1 + String(\"\\n\")');
}

function convertConstructors(code) {
    return code.replace(/public\s+(\w+)\s*\(([^)]*)\)/g, (match, className, params) => {
        // Eliminar tipos de los parámetros
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
    }).join('\n');

    const classOpenBraceIndex = jsCode.indexOf('{');
    
    return jsCode.slice(0, classOpenBraceIndex + 1) +  
           jsCode.slice(classOpenBraceIndex + 1);
}

function convertReturns(code) {
    let returnSentence = `
    return typeof $1 !== 'undefined' ? $1 : this.$1
    `
    //return code.replace(/return\s+([a-zA-Z_]\w*)\s*;/g, 'return this.$1;');
    return code.replace(/return\s+([a-zA-Z_]\w*)\s*;/g, returnSentence);
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

function convertWhileLoops(code) {
    // Convertir bucles while (la sintaxis es similar en ambos lenguajes)
    return code.replace(/while\s*\((.*?)\)\s*\{/g, 'while ($1) {');
}

function convertForLoops(code) {
    // Convertir bucles for tradicionales
    return code.replace(/for\s*\((.*?;\s*.*?;\s*.*?)\)\s*\{/g, (match, condition) => {
        // Eliminar declaraciones de tipo en la inicialización (ej: int i = 0 → let i = 0)
        const parts = condition.split(';');
        const initPart = parts[0].replace(/\b(int|double|float|char|byte|short|long)\s+(\w+)/g, 'let $2');
        return `for (${initPart};${parts[1]};${parts[2]}) {`;
    });
}

function convertForEachLoops(code) {
    // Convertir bucles for-each de Java a for-of de JavaScript
    return code.replace(/for\s*\((?:final\s+)?([\w<>]+)\s+(\w+)\s*:\s*([^)]+)\)\s*\{/g, 
        `for (let $2 of typeof $3 !== 'undefined' ? $3 : this.$3) {`);
}

function convertIfElse(code) {
    // Convertir if-else (la sintaxis es similar, pero podemos limpiar paréntesis extra)
    let result = code.replace(/if\s*\((.*?)\)\s*\{/g, 'if ($1) {');
    result = result.replace(/}\s*else\s*if\s*\((.*?)\)\s*\{/g, '} else if ($1) {');
    result = result.replace(/}\s*else\s*\{/g, '} else {');
    return result;
}

function convertSwitchStatements(code) {
    // Convertir switch statements de Java a JavaScript
    let result = code.replace(/switch\s*\((.*?)\)\s*\{/g, 'switch ($1) {');
    
    // Convertir case statements (eliminar tipos si existen)
    result = result.replace(/case\s+([^:]+):/g, 'case $1:');
    
    // Convertir default case
    result = result.replace(/default\s*:/g, 'default:');
    
    return result;
}

function convertDoWhileLoops(code) {
    // Convertir do-while loops (la sintaxis es similar)
    return code.replace(/do\s*\{([^}]*)\}\s*while\s*\((.*?)\)\s*;/g, 
        'do {$1} while ($2);');
}

function convertBreakContinue(code) {
    // Convertir break y continue (la sintaxis es similar)
    return code.replace(/\bbreak\s*([^;]*);/g, 'break $1;')
              .replace(/\bcontinue\s*([^;]*);/g, 'continue $1;');
}

function convertArrayListDeclarations(code) {
    // Caso 1: new ArrayList<>()
    let jsCode = code.replace(/new\s+ArrayList\s*<\s*>\s*\(\s*\)/g, '[]');
    
    // Caso 2: new ArrayList<Type>() con tipos
    jsCode = jsCode.replace(/new\s+ArrayList\s*<\s*([^>]+)\s*>\s*\(\s*\)/g, '[]');
    
    // Caso 3: new ArrayList() (sin diamantes)
    jsCode = jsCode.replace(/new\s+ArrayList\s*\(\s*\)/g, '[]');
    
    // Caso 4: Inicialización con capacidad: new ArrayList(100)
    jsCode = jsCode.replace(/new\s+ArrayList\s*<\s*[^>]*\s*>\s*\(\s*(\d+)\s*\)/g, '[]');

    jsCode = jsCode.replace(/new\s+ArrayList\s*<\s*([^>]*)\s*>\s*\((\w+)\)/g, `typeof $2 !== 'undefined' ? $2 : this.$2`);
    
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
    ).replace(/ArrayList<\w+>\s(\w+)/g, 'let $1')
}

function convertArrayListMethods(code) {
    let result = code;
    
    // add() → push()
    result = result.replace(/(\w+)\.add\s*\((.*?)\)/g, `typeof $1 !== 'undefined' ? $1.push($2) : this.$1.push($2)`);
    
    // get() → acceso por índice $1[$2]
    result = result.replace(/(\w+)\.get\s*\((.*?)\)/g, `typeof $1 !== 'undefined' ? $1[$2] : this.$1[$2]`);
    
    // set() → asignación por índice
    //result = result.replace(/(\w+)\.set\s*\((.*?),\s*(.*?)\)/g, `typeof $1 !== 'undefined' ? $1[$2] = $3 : this.$1[$2] = $3`);
    
    // size() → length
    //result = result.replace(/(\w+)\.size\s*\(\s*\)/g, `typeof $1 !== 'undefined' ? $1.length : this.$1.length`);
    result = result.replace(/(([\w]+(?:\s*\.\s*[\w]+\s*\([^)]*\))*))\s*\.\s*size\s*\(\s*\)/g, `typeof $1 !== 'undefined' ? getCollectionSize($1) : getCollectionSize(this.$1)`);
    
    // isEmpty() → length check
    result = result.replace(/(\w+)\.isEmpty\s*\(\s*\)/g, `typeof $1 !== 'undefined' ? $1.length === 0 : this.$1.length === 0`);
    
    // contains() → includes()
    result = result.replace(/(\w+)\.contains\s*\((.*?)\)/g, `(typeof $1 !== 'undefined' ? $1.includes($2) : this.$1.includes($2))`);
    
    // remove(index) → splice()
    result = result.replace(/(\w+)\.remove\s*\((\d+)\)/g, `typeof $1 !== 'undefined' ? $1.splice($2, 1) : this.$1.splice($2, 1)`);
    
    // remove(object) → filter() o findIndex() + splice()
    result = result.replace(/(\w+)\.remove\s*\((.*?)\)/g, (match, list, obj) => {
        return `${list}.splice(${list}.indexOf(${obj}), 1)`;
    });
    
    // clear() → asignación a array vacío
    result = result.replace(/(\w+)\.clear\s*\(\s*\)/g, '$1 = []');
    
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
    returnVariable,
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
}