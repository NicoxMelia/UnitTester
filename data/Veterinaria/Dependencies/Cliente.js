class Cliente {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.mascotas = new Map();
    }

    registrarMascota(mascota) {
        if (!this.mascotas.has(mascota.getNombre())) {
            //this.mascotas.set(mascota.getNombre(), mascota);
            this.mascotas[mascota.getNombre()] = mascota; // Usando Map como objeto
        }
    }

    contarMascotasPorTipo() {
        const conteo = {
            PERRO: 0,
            GATO: 0
        };

        // Forma correcta de iterar sobre los valores de un Map
        this.mascotas.forEach((mascota) => {
            if (mascota.getTipo) {
                const tipo = mascota.getTipo();
                conteo[tipo]++;
            }
        });

        return conteo;
    }

    // Getters
    getId() { return this.id; }
    getNombre() { return this.nombre; }
    getMascotas() { return new Map(this.mascotas); }
}