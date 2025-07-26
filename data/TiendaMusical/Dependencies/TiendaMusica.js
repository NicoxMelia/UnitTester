/**
 * Clase que gestiona la tienda de música.
 */
class TiendaMusica {
    /**
     * @param {string} nombre 
     */
    constructor(nombre) {
        this.nombre = nombre;
        /** @type {Producto[]} */
        this.inventario = [];
        /** @type {Object.<string, Cliente>} */
        this.clientes = {};
    }

    /**
     * Añade un producto al inventario.
     * Valida que no exista un producto con el mismo ID antes de añadirlo.
     * @param {Producto} producto Producto a añadir
     */
    añadirProducto(producto) {
        if (producto && !this.inventario.some(p => p.getId() === producto.getId())) {
            this.inventario.push(producto);
        }
    }

    /**
     * Añade un cliente a la tienda.
     * @param {Cliente} cliente Cliente a añadir
     */
    añadirCliente(cliente) {
        if (cliente) {
            this.clientes[cliente.getId()] = cliente;
        }
    }

    /**
     * Registra una nueva venta.
     * Agrega la venta al historial del cliente.
     * @param {string} clienteId ID del cliente
     * @param {string} productoId ID del producto
     * @param {number} cantidad Cantidad vendida
     * @throws {Error} Si el cliente o producto no existen o la cantidad es inválida
     */
    registrarVenta(clienteId, productoId, cantidad) {
        if (!this.clientes[clienteId]) {
            throw new Error("Cliente no encontrado");
        }
        
        if (!this.inventario.some(p => p.getId() === productoId)) {
            throw new Error("Producto no encontrado");
        }
        
        if (cantidad <= 0) {
            throw new Error("La cantidad debe ser positiva");
        }
        
        this.clientes[clienteId].añadirCompra(productoId, cantidad);
    }

    // Getters
    getNombre() {
        return this.nombre;
    }
    
    getInventario() {
        return [...this.inventario]; // Devuelve copia del array
    }
    
    getClientes() {
        return {...this.clientes}; // Devuelve copia del objeto
    }
}