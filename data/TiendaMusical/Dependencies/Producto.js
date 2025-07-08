/**
 * Clase base que representa un producto en la tienda de música.
 */
class Producto {
    /**
     * @param {string} id 
     * @param {string} titulo 
     * @param {number} precio 
     */
    constructor(id, titulo, precio) {
        this.id = id;
        this.titulo = titulo;
        this.precio = precio;
    }

    /**
     * Calcula el precio con descuento.
     * @param {number} porcentaje Descuento a aplicar (debe estar entre 0 y 100)
     * @return {number} Precio con descuento
     * @throws {Error} Si el porcentaje no está entre 0 y 100
     */
    calcularDescuento(porcentaje) {
        if (porcentaje < 0 || porcentaje > 100) {
            throw new Error("El porcentaje debe estar entre 0 y 100");
        }
        return this.precio * (1 - porcentaje / 100);
    }

    // Getters y Setters
    getId() {
        return this.id;
    }
    
    getTitulo() {
        return this.titulo;
    }
    
    getPrecio() {
        return this.precio;
    }
    
    setPrecio(precio) {
        this.precio = precio;
    }
}