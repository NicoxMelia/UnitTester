/**
 * Clase que representa un cliente de la tienda.
 */
class Cliente {
    /**
     * @param {string} id 
     * @param {string} nombre 
     */
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        /** 
         * Historial de compras del cliente.
         * @type {Object.<string, number>} 
         * Clave: ID del producto, Valor: cantidad comprada
         */
        this.historialCompras = {};
    }

    /**
     * Añade una compra al historial del cliente.
     * Valida que la cantidad sea positiva antes de añadirla.
     * @param {string} productoId ID del producto comprado
     * @param {number} cantidad Cantidad comprada
     */
    añadirCompra(productoId, cantidad) {
        if (cantidad > 0) {
            if (this.historialCompras[productoId]) {
                this.historialCompras[productoId] += cantidad;
            } else {
                this.historialCompras[productoId] = cantidad;
            }
        }
    }

    /**
     * Calcula el total gastado por el cliente.
     * @param {Object.<string, Producto>} catalogo Catalogo de productos. 
     *        Clave: ID del producto, Valor: objeto Producto con el precio.
     * @return {number} Total gastado
     */
    calcularTotalGastado(catalogo) {
        let total = 0;
        for (const [productoId, cantidad] of Object.entries(this.historialCompras)) {
            const producto = catalogo[productoId];
            if (producto && producto.precio) {
                total += producto.precio * cantidad;
            }
        }
        return total;
    }

    // Getters
    getId() {
        return this.id;
    }
    
    getNombre() {
        return this.nombre;
    }
    
    getHistorialCompras() {
        return {...this.historialCompras}; // Devuelve una copia del objeto
    }
}