import { JavaInterpreter } from "./JavaInterpreter.js";

export class JavaStrategy {

    constructor() {
        this.interpreter = new JavaInterpreter();
        this.exerciseIndex = 0;
    }

    async getExercises() {
        const response = await fetch('data/exercisesJava.json');
        return response
    }

    renderExerciseCard(exercise, index) {
        const card = document.createElement('div');
        card.className = 'card fade-in bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 transition-all duration-300 space-y-4';

        const title = document.createElement('h2');
        title.className = 'text-2xl font-bold text-cyan-400 flex items-center gap-2';
        title.innerHTML = `📘<span class="text-white">${exercise.title}</span>`;

        const desc = document.createElement('p');
        desc.className = 'text-gray-300 text-sm';
        desc.innerText = exercise.description;
        

        const btn = document.createElement('a');
        btn.href = `./pages/codeRunner.html?ejercicio=E${index + 1}&lang=java`;
        btn.className = 'inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-transform hover:scale-105';
        btn.innerHTML = '🚀 ¡Resolver ahora!';

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(btn);
        return card;
    }

    getInterpreter() {
        return this.interpreter;
    }

    renderTerminalTitle(titleCode){
        titleCode.textContent = "Código Java";
    }

    async getExerciseById(exerciseId) {
        const response = await fetch('../data/exercisesJava.json');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        const exercise = data.exercises.find(e => e.id === exerciseId);
        if (!exercise) throw new Error();
        return exercise;
    }

    getContentToRender(exercise) {
        return exercise.classes[this.exerciseIndex];
    }

    getTests(exercise) {
        return exercise.classes[this.exerciseIndex].test_cases;
    }

    getCodeToRender(path) {
        return fetch("../data/"+path).then(response => 
            response.text()).then(text => {
            return text;
        })
    }

    getFunctionToRun(jsCode, input) {
        const test = this.interpreter.translate(input); //aca se agregan las bad lines
        const code = jsCode + `
            try{
                ${test}
            }catch(error){
                output.salida = "Error: " + error.message;
            }
        `;

        console.warn(code)
        return new Function('output', code);
    }

    async runTestFunction(functionName){
        let output = {
            salida: ""
        };
        await functionName(output)
        return output.salida;
    }

    setExerciseIndex(index) {
        this.exerciseIndex = index;
    }

    getName() {
        return "Java";
    }

    async getAllProyectCode(exercise, codeUser) {
        let code = "";
        // 1. Leer cada archivo de dependencia y concatenarlo a `code`
        for (const depPath of exercise.classes[this.exerciseIndex].dependencies) {
            try {
            const fileContent = await this.getCodeToRender(depPath);
            code += fileContent + "\n"; // Concatenar con salto de línea
            } catch (error) {
            console.error(`Error leyendo ${depPath}:`, error);
            // Opcional: Continuar con las siguientes dependencias a pesar del error
            }
        }

        code += codeUser + "\n"; // 2. Agregar el código del usuario al final

        return code; // Retorna el código concatenado
    }
}