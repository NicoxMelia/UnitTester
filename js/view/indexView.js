export class IndexView {
    constructor(strategy) {
        this.strategy = strategy
    }
    renderExcercises(data){
        const container = document.getElementById('ejercicioList');
        data.exercises.forEach((exercise, index) => {
          const card = this.strategy.renderExerciseCard(exercise, index);
          container.appendChild(card);
        })
    }

    renderError(message){
        document.getElementById('ejercicioList').innerHTML = `
          <p class="text-red-500 text-center text-lg">❌ Error cargando ejercicios: ${message}</p>
        `;
    }

}