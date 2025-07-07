export class CodeRunnerView {

    constructor(strategy) {
        this.strategy = strategy;
        const urlParams = new URLSearchParams(window.location.search);
        this.ejercicioId = urlParams.get("ejercicio");
        this.testResults = document.getElementById('testResults');
        this.consignaContainer = document.getElementById("consignaContainer");
        this.tablaCasos = document.getElementById("tablaCasos");
        this.code = undefined;
        this.titleCode = document.getElementById('titleCode');
        this.strategy.renderTerminalTitle(this.titleCode);
        this.userCode = document.getElementById('userCode');

        /**
         * Its used for tests
         */
        this.resultsContainer = document.getElementById('testResults');
        this.resultsContainer.innerHTML = '<div class="p-4 space-y-3"></div>';
        this.resultsList = this.resultsContainer.querySelector('div');
        this.resultDiv = undefined;
    }

    resetTestResults() {
        this.resultsContainer.innerHTML = '<div class="p-4 space-y-3"></div>';
        this.resultsList = this.resultsContainer.querySelector('div');
        this.resultsList.innerHTML = '';
    }

    renderTerminalCode(code){
        this.userCode.value = code;
    }

    getExcerciseId() {
        return this.ejercicioId;
    }

    getCodeToTranslate(){
        this.code = document.getElementById("userCode").value;
        return this.code;
    }

    showJsCode(jsCode) {
        document.getElementById('jsOutput').textContent = jsCode;
        Prism.highlightAll();
    }

    showMissingTestError(){
         this.resultsList.innerHTML = `
                <div class="bg-yellow-900/30 border border-yellow-800 text-yellow-400 p-3 rounded-md text-sm">
                    No hay tests definidos. Añade al menos un test para ejecutar.
                </div>
            `;
    }

    showIncompleteTestError(testInfo){
        this.resultDiv = document.createElement('div');
        this.resultDiv.className = `p-3 rounded-md border ${testInfo.input ? '' : 'bg-gray-750 border-gray-700'}`;
        this.resultDiv.innerHTML = `
                    <div class="flex items-center text-yellow-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        ${testInfo.message}
                    </div>
                `;
        this.resultsList.appendChild(this.resultDiv);
    }


    showSyntaxError(message) {
        this.testResults.innerHTML = `
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

    showLoadingError(){
        this.consignaContainer.innerHTML = `<div class="text-red-500 font-semibold">❌ Ejercicio no encontrado</div>`;
    }

    renderExcercice(excercise){
        this.consignaContainer.innerHTML = `<div class="text-gray-400">⏳ Cargando consigna...</div>`;
        this.tablaCasos.innerHTML = "";
        let contentToRender = this.strategy.getContentToRender(excercise);
        this.renderInstruction(contentToRender);
        this.renderTable(contentToRender);
    }

    renderTable(excercise){
        let tablaHTML = `
            <table class="w-full text-sm text-left text-gray-300 border border-gray-600">
                <thead class="bg-gray-700 text-xs uppercase text-gray-400">
                    <tr>
                        <th class="px-3 py-2 border border-gray-600">Input</th>
                        <th class="px-3 py-2 border border-gray-600">Expected Output</th>
                    </tr>
                </thead>
                <tbody>`;

        excercise.test_cases.forEach(test => {
            tablaHTML += `
                <tr class="bg-gray-800">
                    <td class="px-3 py-2 border border-gray-700 font-mono whitespace-pre-wrap">${test.input}</td>
                    <td class="px-3 py-2 border border-gray-700 font-mono">${test.expected_output}</td>
                </tr>`;
        });

        tablaHTML += `</tbody></table>`;
        this.tablaCasos.innerHTML = tablaHTML;
    }

    renderInstruction(excercise) {
        this.consignaContainer.innerHTML = `
                        <h2 class="text-2xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
                            📘 ${excercise.title}
                        </h2>
                        <p class="text-gray-300 mb-4">${excercise.description}</p>`;
    }

    formatOutput(text){
        if (!text) return '<div class="text-gray-400">Ninguna salida</div>';
        return text.split('\n').map(line => 
            `<div class="whitespace-pre">${line || ' '}</div>`
        ).join('');
    };

    renderTestResult(test){
        this.resultDiv = document.createElement('div');
        this.resultDiv.className = `p-3 rounded-md border ${test.passed ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`;
        this.resultDiv.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <h3 class="font-medium">${test.result}</h3>
                <span class="text-xs px-2 py-1 rounded ${test.passed ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}">${test.passed ? 'Éxito' : 'Fallo'}</span>
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
                    <div class="bg-gray-700 p-2 rounded font-mono">${this.formatOutput(test.output)}</div>
                </div>
            </div>
        `;
        this.resultsList.appendChild(this.resultDiv);
    }

    renderTestError(test){
        this.resultDiv = document.createElement('div');
        this.resultDiv.className = 'p-3 rounded-md border bg-red-900/20 border-red-800';
        this.resultDiv.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <h3 class="font-medium">${test.result}</h3>
                <span class="text-xs px-2 py-1 rounded bg-red-900/30 text-red-400">Error</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div>
                    <div class="text-xs text-gray-400 mb-1">Input</div>
                    <div class="bg-gray-700 p-2 rounded font-mono">${test.input}</div>
                </div>
                <div class="md:col-span-2">
                    <div class="text-xs text-gray-400 mb-1">Error</div>
                    <div class="bg-gray-700 p-2 rounded font-mono text-red-400">${test.errorMsg}</div>
                </div>
            </div>
        `;
        this.resultsList.appendChild(this.resultDiv);
    }

    renderClass(){
        const card = document.createElement('div');
        card.className = 'card fade-in bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 transition-all duration-300 space-y-4';

        const title = document.createElement('h2');
        title.className = 'text-2xl font-bold text-cyan-400 flex items-center gap-2';
        title.innerHTML = `📘<span class="text-white">${exercise.title}</span>`;

        const desc = document.createElement('p');
        desc.className = 'text-gray-300 text-sm';
        desc.innerText = exercise.description;

        // Tabla de ejemplo
        const tableWrapper = document.createElement('div');
        //const tableWrapper = document.createElement('div');
        tableWrapper.className = 'overflow-x-auto rounded-lg';

        const table = document.createElement('table');
        table.className = 'w-full text-sm border border-gray-700';

        const thead = document.createElement('thead');
        thead.className = 'bg-gray-700 text-gray-300 text-xs uppercase';
        thead.innerHTML = `
            <tr>
            <th class="px-3 py-2 text-left">📥 Input</th>
            <th class="px-3 py-2 text-left">📤 Output Esperado</th>
            </tr>
        `;

        const tbody = document.createElement('tbody');
        (exercise.test_cases || []).slice(0, 2).forEach(test => {
            const row = document.createElement('tr');
            row.className = 'border-t border-gray-600';
            row.innerHTML = `
            <td class="px-3 py-2 whitespace-pre-wrap text-gray-100 bg-gray-800">${test.input}</td>
            <td class="px-3 py-2 whitespace-pre-wrap text-green-400 bg-gray-800">${test.expected_output}</td>
            `;
            tbody.appendChild(row);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            tableWrapper.appendChild(table);
    }

}