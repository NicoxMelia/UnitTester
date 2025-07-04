// Funciones auxiliares específicas
function extractClassVariables(javaCode) {
    const classVarRegex = /(private|protected|public)\s+(?!class)([\w<>]+)\s+(\w+)\s*(=\s*[^;]+)?\s*;/g;
    const classVariables = [];
    
    const classBody = javaCode.replace(classVarRegex, (match, modifier, type, name, value) => {
        classVariables.push({ modifier, type, name, value: value ? value.trim() : null });
        return '';
    });
    
    return { classBody, classVariables };
}

function convertClassDeclaration(code) {
    return code.replace(/public\s+class\s+(\w+)/g, 'class $1');
}

function convertSystemOut(code) {
    return code.replace(/System\.out\.println/g, 'console.log');
}

function convertConstructors(code) {
    return code.replace(/public\s+(\w+)\s*\(([^)]*)\)/g, 'constructor($2)');
}

function convertMethods(code) {
    return code.replace(
        /(public|private|protected)\s+([\w<>]+)\s+(\w+)\s*\(([^)]*)\)/g, 
        function(match, access, returnType, methodName, params) {
            const jsParams = params.split(',')
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
    return result;
}

function convertObjectCreations(code) {
    return code.replace(/[a-zA-Z]+\s(\w) = new (\w+\W+)/, 'let $1 = new $2\n');
}

function rebuildClassWithProperties(jsCode, classVariables) {
    const classNameMatch = jsCode.match(/class\s+(\w+)\s*\{/);
    if (!classNameMatch) return jsCode;
    
    const className = classNameMatch[1];
    const propsCode = classVariables.map(v => {
        const value = v.value ? v.value.replace(/^=\s*/, '') : undefined;
        return `    ${v.name} = ${value || getDefaultValueForType(v.type)};`;
    }).join('\n');

    const classOpenBraceIndex = jsCode.indexOf('{');
    
    return jsCode.slice(0, classOpenBraceIndex + 1) + 
           (propsCode ? '\n' + propsCode : '') + 
           jsCode.slice(classOpenBraceIndex + 1);
}

function getDefaultValueForType(type) {
    switch(type) {
        case 'boolean': return 'false';
        case 'int':
        case 'double':
        case 'float':
        case 'byte':
        case 'short':
        case 'long': return '0';
        case 'String': return '""';
        default: return 'null';
    }
}

export {extractClassVariables, convertClassDeclaration, convertSystemOut, convertConstructors, convertMethods, convertVariableDeclarations, convertObjectCreations, rebuildClassWithProperties, getDefaultValueForType}