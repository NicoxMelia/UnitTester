import { JavaInterpreter } from "./JavaInterpreter.js";

export class JavaStrategy {

    constructor() {
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
        return new JavaInterpreter();
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
        const code = jsCode + `
            try{
                
            }
        `;
        return new Function('output', 'currentInput', jsCode);
    }

    getName() {
        return "Java";
    }
}