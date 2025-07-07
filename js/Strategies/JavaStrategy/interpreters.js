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
    
    return { classBody, classVariables };
}

function quitImports(code) {
    return code.replace(/import\s+[\w.]+;/g, '');
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
    return code.replace(/return\s+([a-zA-Z_]\w*)\s*;/g, 'return this.$1;');
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

export {
    extractClassVariables,
    quitImports,
    replaceHashMap,
    convertHashMapDeclarations,
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
    convertReturns
}