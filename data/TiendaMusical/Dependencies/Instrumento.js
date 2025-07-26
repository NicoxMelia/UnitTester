/**
 * Clase que representa un instrumento musical.
 * Asume que existe una clase Producto de la que hereda.
 */
class Instrumento extends Producto {
    /**
     * @param {string} id 
     * @param {string} titulo 
     * @param {number} precio 
     * @param {TipoInstrumento} tipo 
     * @param {string} material 
     */
    constructor(id, titulo, precio, tipo, material) {
        super(id, titulo, precio);
        this.tipo = tipo;
        this.material = material;
        /** @type {string[]} */
        this.accesoriosIncluidos = [];
    }

    /**
     * Añade un accesorio incluido con el instrumento.
     * Valida que el accesorio no esté en la lista antes de añadirlo.
     * @param {string} accesorio Nombre del accesorio
     */
    añadirAccesorio(accesorio) {
        if (accesorio && !this.accesoriosIncluidos.includes(accesorio)) {
            this.accesoriosIncluidos.push(accesorio);
        }
    }

    /**
     * Calcula el peso estimado del instrumento.
     * Se asume la siguiente lógica:
     * - Guitarras: 2.5 kg
     * - Bajos: 3.0 kg
     * - Baterías: 10.0 kg
     * - Otros: 5.0 kg
     * @return {number} Peso en kg (estimación)
     */
    estimarPeso() {
        switch (this.tipo) {
            case TipoInstrumento.GUITARRA:
                return 2.5;
            case TipoInstrumento.BAJO:
                return 3.0;
            case TipoInstrumento.BATERIA:
                return 10.0;
            default:
                return 5.0;
        }
    }

    // Getters
    getTipo() {
        return this.tipo;
    }
    
    getMaterial() {
        return this.material;
    }
    
    getAccesoriosIncluidos() {
        return [...this.accesoriosIncluidos]; // Devuelve una copia del array
    }
}

/**
 * Enumeración de tipos de instrumento.
 * En JavaScript podemos simular una enum con un objeto.
 */
const TipoInstrumento = {
    GUITARRA: "GUITARRA",
    BAJO: "BAJO",
    BATERIA: "BATERIA",
    OTRO: "OTRO"
};