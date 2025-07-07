export class IndexModel{
    constructor(strategy) {
        this.strategy = strategy;
    }
    async getExercises() {
       // const response = await fetch('../../data/excercices.json');
       let response = await this.strategy.getExercises();
        //const response = await fetch('data/excercises.json');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        return await response.json();
    }
}