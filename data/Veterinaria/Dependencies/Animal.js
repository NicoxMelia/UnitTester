class Animal {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
        this.vacunas = [];
    }

    añadirVacuna(vacuna) {
        if (!this.vacunas.includes(vacuna)) {
            this.vacunas.push(vacuna);
        }
    }

    calcularEdadHumana() {
        return this.edad * 7; // Default conversion (1 animal year = 7 human years)
    }

    // Getters and Setters
    getNombre() { return this.nombre; }
    getEdad() { return this.edad; }
    getVacunas() { return [...this.vacunas]; }
    setEdad(edad) { this.edad = edad; }
}

module.exports = Animal;