import { IndexController } from './controller/indexController.js';

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if(path.includes('index.html')) {
        const controller = new IndexController();
        controller.init();
    }else if(path.includes('codeRunner.html')) {
        const controller = new CodeRunnerController();
        controller.init();
    }
});