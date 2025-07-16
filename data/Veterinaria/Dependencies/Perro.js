const Animal = require('./Animal');
const TipoAnimal = require('./TipoAnimal');
const NivelEntrenamiento = require('./NivelEntrenamiento');

class Perro extends Animal {
    constructor(nombre, edad, raza, peso) {
        super(nombre, edad);
        this.raza = raza;
        this.peso = peso;
        this.entrenamientos = new Map();
        this.tipo = TipoAnimal.PERRO;
    }

    añadirEntrenamiento(comando, nivel) {
        this.entrenamientos.set(comando, nivel);
    }

    calcularComidaDiaria() {
        if (this.peso < 5) return 50;
        if (this.peso <= 10) return 100;
        return 150;
    }

    // Getters
    getRaza() { return this.raza; }
    getEntrenamientos() { return new Map(this.entrenamientos); }
    getTipo() { return this.tipo; }
}