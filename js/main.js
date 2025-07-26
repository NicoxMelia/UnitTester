import { IndexController } from './controller/indexController.js';
import { CodeRunnerController } from './controller/codeRunnerController.js';
import { JavaStrategy } from './Strategies/JavaStrategy/JavaStrategy.js';
import { CppStrategy } from './Strategies/CppStrategy/CppStrategy.js';


function getStrategyByLang(lang) {
    if (lang === 'java') {
        return new JavaStrategy();
    } else if (lang === 'cpp') {
        return new CppStrategy();
    } else {
        return new JavaStrategy();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const lang = new URLSearchParams(window.location.search).get('lang');
    let strategy = getStrategyByLang(lang);
    if(path.endsWith('/') || path.includes('index.html')) {
        const controller = new IndexController(strategy);
        controller.init();
    }else if(path.includes('codeRunner.html')) {
        const controller = new CodeRunnerController(strategy);
        controller.init();
    }
});