import {CppInterpreter} from "./Strategies/CppStrategy/CppInterpreter.js";

export class CodeRunnerModel{
    constructor(){
        this.interpreter = new CppInterpreter();
        this.translatedCode = "";
        this.testCases = undefined;
    }

    translate(code){
        this.translatedCode = this.interpreter.translate(code);
        return this.translatedCode;
    }

    async executeTranslatedCode(jsCode, input) { //Falta ver
            let output = {
                salida: ""
            };
            const currentInput = input;
            
            try {
                // Crear función dinámica con el código
                const dynamicFunction = new Function('output', 'currentInput', jsCode);
                await dynamicFunction(output, currentInput);
                output = output.salida;
                //console.warn('Resultado de la ejecución:', output);
                return { success: true, output: output.trim() };
            } catch (error) {
                console.error(error.message)
                return { success: false, error: error.message };
            }
        }

    async getExcerciseById(excerciceId){
        const response = await fetch('../../data/excercices.json');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        const exercise = data.exercises.find(e => e.id === excerciceId);
        if (!exercise) throw new Error();
        return exercise;
    }

    runTests = async () => { //Fata ver
        const testEntries = this.testCases.entries();
        for (const [index, test] of testEntries) {
            const resultDiv = document.createElement('div');
            resultDiv.className = `p-3 rounded-md border ${test.input ? '' : 'bg-gray-750 border-gray-700'}`;
            
            if (!test.input || !test.expected) {
                testCases[index].message = `Test #${index + 1} incompleto - falta input o resultado esperado`
                throw new Error();
            }
            
            const { success, output, error } = await this.executeTranslatedCode(this.translatedCode, test.input);
            //console.log(success+"\n"+output+"\n"+error)
            test.success = success;
            if(success){
                const passed = output === test.expected;
                this.testCases[index].result = `Test #${index + 1} ${passed ? '✅ Pasó' : '❌ Falló'}`
                this.testCases[index].passed = passed;
                this.testCases[index].output = output;
            }else{
                test.result = `Test #${index + 1} ❌ Error`
                test.errorMsg = error.message;
                this.testCases[index].passed = passed;
                this.testCases[index].output = output;
            }
        }
        return this.testCases
    }


    setTestCases(excercise){
        const tests = excercise.test_cases.map(tc => ({
            input: tc.input,
            expected: tc.expected_output
        }));

        if (tests.length === 0) throw new Error("No test cases");
        this.testCases = tests;
    }

    getTestCases(){
        return this.testCases;
    }
}