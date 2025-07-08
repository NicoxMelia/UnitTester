const Animal = require('./Animal');
const TipoAnimal = require('./TipoAnimal');

class Gato extends Animal {
    constructor(nombre, edad, color) {
        super(nombre, edad);
        this.color = color;
        this.juguetesFavoritos = [];
        this.tipo = TipoAnimal.GATO;
    }

    añadirJuguete(juguete) {
        if (!this.juguetesFavoritos.includes(juguete)) {
            this.juguetesFavoritos.push(juguete);
        }
    }

    esMayor() {
        return this.getEdad() > 7;
    }

    // Getters
    getColor() { return this.color; }
    getJuguetesFavoritos() { return [...this.juguetesFavoritos]; }
    getTipo() { return this.tipo; }
}

module.exports = Gato;