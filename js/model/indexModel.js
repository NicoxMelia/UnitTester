export class IndexModel{
    async getExercises() {
       // const response = await fetch('../../data/excercices.json');
        const response = await fetch('data/excercises.json');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        return await response.json();
    }
}