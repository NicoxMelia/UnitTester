import * as translationFunctions from "./interpreters.js"; 
import { putExtraFunctions } from "./extraFunctions.js";

// Variables globales
let currentInput = "";
let output = "";
let error = {
    state: false,
    message: "",
    line: null
    
};


function showError(message) {
    const testResults = document.getElementById('testResults');
    testResults.innerHTML = `
        <div class="bg-gray-700 px-4 py-3">
            <h2 class="font-mono text-sm font-semibold">Error de Sintaxis</h2>
        </div>
        <div class="p-4 space-y-3">
            <div class="bg-red-900/20 border border-red-800 p-3 rounded-md">
                <div class="flex items-center text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    <span class="font-medium">Error al compilar</span>
                </div>
                <div class="mt-2 text-sm font-mono text-red-300">${message}</div>
            </div>
        </div>
    `;
}

// Traductor C++ a JS mejorado
function translateCppToJs(cppCode) {
    const originalLines = cppCode.split('\n');
    let translatedLines = [];
    let untranslatedLines = [];
    let jsCode = '';
    let index = 1;

    const EXECUTION_ORDER = [
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


    originalLines.forEach(line => {
        let lineReplaced = false;
        let trimmedLine = line.trim();

        // Ignorar líneas vacías o comentarios
        if (!trimmedLine || trimmedLine.startsWith('//')) {
            translatedLines.push(line); // Conservar formato original
            return;
        }

        EXECUTION_ORDER.forEach(funcName => {
            if (translationFunctions[funcName]) {
                //console.log(`Applying ${funcName}...`);
                const translatedLine = translationFunctions[funcName](line);
                if(translatedLine !== line && translatedLine != undefined) {
                    lineReplaced = true;
                    translatedLines.push(translatedLine); // Agregar línea traducida
                }
            } else {
                console.warn(`⚠️ Función ${funcName} no encontrada`);
            }
        });

        if (!lineReplaced && line.trim() !== '}') {
                console.warn(`⚠️ Syntax error at: Line: ${index}: ${line}`);
                error.state = true;
                error.message = `⚠️ Syntax error at line ${index}: ${line}`;
                error.line = index;
        }

        if( !lineReplaced && line.trim() == '}') {
            translatedLines.push(line); // Conservar llaves de cierre
        }
        index++;

        // Aplicar patrones de reemplazo
    //     for (const {pattern, replacement} of replacementPatterns) {
    //         if (pattern.test(trimmedLine)) {
    //             const translatedLine = line.replace(pattern, replacement);
    //             translatedLines.push(translatedLine);
    //             jsCode += translatedLine + '\n';
    //             lineReplaced = true;
    //             break;
    //         }
    //     }

    //     if (!lineReplaced) {
    //         untranslatedLines.push(line);
    //         translatedLines.push(`/* SIN TRADUCCIÓN: ${line} */`);
    //     }
    // });

    // Verificar líneas no traducidas
    // if (untranslatedLines.length > 0) {
    //     console.error('⚠️ Líneas no traducidas:');
    //     untranslatedLines.forEach(line => console.error(`- ${line}`));
    // }



    return {
        translatedCode: translatedLines.join('\n'), // Con líneas sin traducir comentadas
        fullOutput: translatedLines.join('\n'), // Con líneas sin traducir comentadas
        untranslatedLines: untranslatedLines
    };
});

return putExtraFunctions(translatedLines.join('\n'));
}

        // Función para ejecutar el código traducido
        async function executeTranslatedCode(jsCode, input) {
            output = {
                salida: ""
            };
            currentInput = input;

            
            try {
                // Crear función dinámica con el código
                const dynamicFunction = new Function('output', 'currentInput', jsCode);
                await dynamicFunction(output, currentInput);
                output = output.salida;
                console.log('Resultado de la ejecución:', output);
                return { success: true, output: output.trim() };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }


        //*********************************************************** */
        // Manejo de la interfaz
document.addEventListener('DOMContentLoaded', () => {

    

    const urlParams = new URLSearchParams(window.location.search);
    const ejercicioId = urlParams.get("ejercicio");

    /* CARGA EL EJERCICIO EN PANTALLA
    * Esta funcion setea el ejercicio en la variable ejercicio
    */
    var ejercicio = null;

    if (ejercicioId) {
        const consignaContainer = document.getElementById("consignaContainer");
        const tablaCasos = document.getElementById("tablaCasos");

        if (consignaContainer && tablaCasos) {
            consignaContainer.innerHTML = `<div class="text-gray-400">⏳ Cargando consigna...</div>`;
            tablaCasos.innerHTML = "";

            fetch("./js/excercices.json")
                .then(res => res.json())
                .then(data => {
                    ejercicio = data.exercises.find(e => e.id === ejercicioId);

                    if (!ejercicio) {
                        consignaContainer.innerHTML = `<div class="text-red-500 font-semibold">❌ Ejercicio no encontrado</div>`;
                        return;
                    }

                    // Mostrar consigna
                    consignaContainer.innerHTML = `
                        <h2 class="text-2xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
                            📘 ${ejercicio.title}
                        </h2>
                        <p class="text-gray-300 mb-4">${ejercicio.description}</p>`;

                    // Mostrar tabla de casos
                    let tablaHTML = `
                        <table class="w-full text-sm text-left text-gray-300 border border-gray-600">
                            <thead class="bg-gray-700 text-xs uppercase text-gray-400">
                                <tr>
                                    <th class="px-3 py-2 border border-gray-600">Input</th>
                                    <th class="px-3 py-2 border border-gray-600">Expected Output</th>
                                </tr>
                            </thead>
                            <tbody>`;

                    ejercicio.test_cases.forEach(test => {
                        tablaHTML += `
                            <tr class="bg-gray-800">
                                <td class="px-3 py-2 border border-gray-700 font-mono">${test.input}</td>
                                <td class="px-3 py-2 border border-gray-700 font-mono">${test.expected_output}</td>
                            </tr>`;
                    });

                    tablaHTML += `</tbody></table>`;
                    tablaCasos.innerHTML = tablaHTML;
                })
                .catch(err => {
                    consignaContainer.innerHTML = `<div class="text-red-500 font-semibold">⚠️ Error al cargar el ejercicio</div>`;
                    console.error(err);
                });
        }
    }
    
    // Ejecutar tests
    document.getElementById('runBtn').addEventListener('click', async () => {
        const cppCode = document.getElementById("cppCode").value; // Obtener código C++ del editor
        const jsCode = translateCppToJs(cppCode);
        
        // Mostrar JS generado
        document.getElementById('jsOutput').textContent = jsCode;
        Prism.highlightAll();
        
        // Obtener tests
        const testCases = ejercicio.test_cases.map(tc => ({
                    input: tc.input,
                    expected: tc.expected_output
        }));
        
        // Mostrar resultados
        const resultsContainer = document.getElementById('testResults');
        resultsContainer.innerHTML = '<div class="p-4 space-y-3"></div>';
        const resultsList = resultsContainer.querySelector('div');
        
        if (testCases.length === 0) {
            resultsList.innerHTML = `
                <div class="bg-yellow-900/30 border border-yellow-800 text-yellow-400 p-3 rounded-md text-sm">
                    No hay tests definidos. Añade al menos un test para ejecutar.
                </div>
            `;
            return;
        }

        if( error.state) {
            showError(error.message);
            error.state = false; // Resetear error
            return;
        }
        
        // Ejecutar cada test
        for (const [index, test] of testCases.entries()) {
            const resultDiv = document.createElement('div');
            resultDiv.className = `p-3 rounded-md border ${test.input ? '' : 'bg-gray-750 border-gray-700'}`;
            
            if (!test.input || !test.expected) {
                resultDiv.innerHTML = `
                    <div class="flex items-center text-yellow-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        Test #${index + 1} incompleto - falta input o resultado esperado
                    </div>
                `;
                resultsList.appendChild(resultDiv);
                continue;
            }
            
            const { success, output, error } = await executeTranslatedCode(jsCode, test.input);
            
            if (success) {
                const formatOutput = (text) => {
                    if (!text) return '<div class="text-gray-400">Ninguna salida</div>';
                    return text.split('\n').map(line => 
                        `<div class="whitespace-pre">${line || ' '}</div>`
                    ).join('');
                };
                const passed = output === test.expected;
                resultDiv.className = `p-3 rounded-md border ${passed ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`;
                resultDiv.innerHTML = `
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="font-medium">Test #${index + 1} ${passed ? '✅ Pasó' : '❌ Falló'}</h3>
                        <span class="text-xs px-2 py-1 rounded ${passed ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}">${passed ? 'Éxito' : 'Fallo'}</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                            <div class="text-xs text-gray-400 mb-1">Input</div>
                            <div class="bg-gray-700 p-2 rounded font-mono">${test.input}</div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-400 mb-1">Esperado</div>
                            <div class="bg-gray-700 p-2 rounded font-mono">${test.expected}</div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-400 mb-1">Obtenido</div>
                            <div class="bg-gray-700 p-2 rounded font-mono">${formatOutput(output)}</div>
                        </div>
                    </div>
                `;
            } else {
                resultDiv.className = 'p-3 rounded-md border bg-red-900/20 border-red-800';
                resultDiv.innerHTML = `
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="font-medium">Test #${index + 1} ❌ Error</h3>
                        <span class="text-xs px-2 py-1 rounded bg-red-900/30 text-red-400">Error</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                            <div class="text-xs text-gray-400 mb-1">Input</div>
                            <div class="bg-gray-700 p-2 rounded font-mono">${test.input}</div>
                        </div>
                        <div class="md:col-span-2">
                            <div class="text-xs text-gray-400 mb-1">Error</div>
                            <div class="bg-gray-700 p-2 rounded font-mono text-red-400">${error}</div>
                        </div>
                    </div>
                `;
            }
            
            resultsList.appendChild(resultDiv);
        }
    });
});


