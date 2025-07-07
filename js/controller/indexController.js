import { IndexView } from '../view/indexView.js';
import { IndexModel } from '../model/indexModel.js';

export class IndexController{
    constructor(strategy) {
        this.view = new IndexView(strategy);
        this.model = new IndexModel(strategy);
    }

    async init() {
        try{
            const excercices = await this.model.getExercises();
            this.view.renderExcercises(excercices);
        }catch(error) {
            console.log("❗ Error en el controlador:", error);
            this.view.renderError(error.message);
        }
    }
}