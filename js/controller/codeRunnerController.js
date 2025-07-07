import { CodeRunnerView } from "../view/codeRunnerView.js";
import { CodeRunnerModel } from "../model/codeRunnerModel.js";

export class CodeRunnerController{
    constructor(strategy){
        this.strategy = strategy
        this.view = new CodeRunnerView(strategy);
        this.model = new CodeRunnerModel(strategy);
        this.exercise = null;
        this.testCases = null;
        this.jscode = undefined;
        this.terminalCode = undefined;
        
    }

    renderJavaView(className){
        this.view.renderExcercice(className);
        this.model.getTerminalCode(className.file).then(code => {
            this.view.renderTerminalCode(code)
        })
    }

    async init(){
        const id = this.view.getExcerciseId();

        try{
            this.exercise = await this.model.getExcerciseById(id);
            this.view.renderExcercice(this.exercise);
            this.model.getTerminalCode(this.exercise).then(code => {
                this.view.renderTerminalCode(code);
            })
        }catch (error) {
            //this.view.showSyntaxError(error.message); no va
            return;
        }
        document.getElementById('runBtn').addEventListener('click', () => {
            const code = this.view.getCodeToTranslate();
            try{
                this.jscode = this.model.translate(code);
            }catch(error){
                this.view.showSyntaxError(error.message);
                return;
            }
            this.view.showJsCode(this.jscode);
            try{
                //this.testCases = this.model.setTestCases(this.exercise);
                this.model.setTestCases(this.exercise);
            }catch(error){
                this.view.showMissingTestError();
            }
            this.model.runTests().then(tests => {
                this.renderTestResults(tests);
            }).catch(error => {
                console.error(error.message);
                this.view.showIncompleteTestError(error.message);
            });
        });
    }

    renderTestResults(tests){
        this.view.resetTestResults();
        tests.forEach(test => {
            if(test.success){
                this.view.formatOutput(test.expected);
                this.view.renderTestResult(test);
            }else{
                this.view.renderTestError(test);
            }
        });
    }

    renderClasess(exercise){
        exercise.classes.forEach(cls => {
            this.view.renderClass(cls);
        });
    }
}