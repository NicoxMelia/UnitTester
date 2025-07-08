class Cliente {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.mascotas = new Map();
    }

    registrarMascota(mascota) {
        if (!this.mascotas.has(mascota.getNombre())) {
            this.mascotas.set(mascota.getNombre(), mascota);
        }
    }

    contarMascotasPorTipo() {
        const conteo = {
            PERRO: 0,
            GATO: 0
        };

        for (const mascota of this.mascotas.values()) {
            if (mascota.getTipo) {
                const tipo = mascota.getTipo();
                conteo[tipo]++;
            }
        }

        return conteo;
    }

    // Getters
    getId() { return this.id; }
    getNombre() { return this.nombre; }
    getMascotas() { return new Map(this.mascotas); }
}

module.exports = Cliente;