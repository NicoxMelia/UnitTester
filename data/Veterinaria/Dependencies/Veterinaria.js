class Veterinaria {
    constructor(nombre) {
        this.nombre = nombre;
        this.clientes = [];
        this.stockMedicamentos = new Map();
    }

    añadirCliente(cliente) {
        if (!this.clientes.some(c => c.getId() === cliente.getId())) {
            this.clientes.push(cliente);
        }
    }

    actualizarStock(medicamento, cantidad) {
        const current = this.stockMedicamentos.get(medicamento) || 0;
        const newValue = current + cantidad;
        
        if (newValue <= 0) {
            this.stockMedicamentos.delete(medicamento);
        } else {
            this.stockMedicamentos.set(medicamento, newValue);
        }
    }

    // Getters
    getNombre() { return this.nombre; }
    getClientes() { return [...this.clientes]; }
    getStockMedicamentos() { return new Map(this.stockMedicamentos); }
}

module.exports = Veterinaria;