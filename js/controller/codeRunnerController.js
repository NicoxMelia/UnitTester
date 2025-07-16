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

    

    async init(){
        const id = this.view.getExcerciseId();

        try{
            this.exercise = await this.model.getExcerciseById(id);
            this.view.renderExcercice(this.exercise);
            this.model.getTerminalCode(this.exercise).then(code => {
                this.view.renderTerminalCode(code);
            })

            if(this.strategy.getName() === "Java"){
                this.renderClasess(this.exercise);
            }
        }catch (error) {
            //this.view.showSyntaxError(error.message); no va
            return;
        }
        document.getElementById('runBtn').addEventListener('click', () => {
            let code = this.view.getCodeToTranslate();
           this.strategy.getAllProyectCode(this.exercise, code).then(allCode => {
                code = allCode;
          
            
            try{
                this.jscode = this.model.translate(code);
            }catch(error){
                this.view.showSyntaxError(error.message);
                return;
            }
           // this.view.showJsCode(this.jscode);
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
            })
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
        const container = document.getElementById('ejercicioList');
        exercise.classes.forEach((cls, index) => {
            const card = this.view.renderClass(cls);
            card.addEventListener('click', () => {
                console.log(cls)
                this.view.resetTestResults();
                this.strategy.setExerciseIndex(index);
                this.view.renderInstruction(cls);
                this.view.renderTable(cls)
                this.model.getTerminalCode(this.exercise).then(code => {
                this.view.renderTerminalCode(code);
                })
            });
            container.appendChild(card);
        });
    }
}