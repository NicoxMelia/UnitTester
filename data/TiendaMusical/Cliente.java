import java.util.HashMap;

/**
 * Clase que representa un cliente de la tienda.
 */
public class Cliente {
    private String id;
    private String nombre;
    /**
     * Historial de compras del cliente.
     * Utiliza un HashMap donde la clave es el ID del producto y el valor es la cantidad comprada.
     * Esto permite llevar un registro de los productos comprados y sus cantidades
     */
    private HashMap<String, Integer> historialCompras; // ID Producto -> Cantidad

    public Cliente(String id, String nombre) {
        // TO DO: Implementar el constructor
    }

    /**
     * Añade una compra al historial del cliente.
     * Debe validar que la cantidad sea positiva antes de añadirla.
     * @param productoId ID del producto comprado
     * @param cantidad Cantidad comprada
     */
    public void añadirCompra(String productoId, int cantidad) {
        //TO DO: Implementar el metodo
    }

    /**
     * Calcula el total gastado por el cliente.
     * @param catalogo Catalogo de productos. String es el ID del producto y Producto es la clase que representa al producto.
     *                 Se asume que el catalogo contiene los precios de los productos.
     * @return Total gastado
     */
    public double calcularTotalGastado(HashMap<String, Producto> catalogo) {
        // TODO: Implementar cálculo del total
        return 0.0;
    }

    // Setters y Getters
    public String getId() {
        return id;
    }
    public String getNombre() {
        return nombre;
    }
    public HashMap<String, Integer> getHistorialCompras() {
        return new HashMap<>(historialCompras);
    }
}