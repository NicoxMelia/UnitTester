import java.util.ArrayList;
import java.util.HashMap;

/**
 * Clase que gestiona la tienda de música.
 */
public class TiendaMusica {
    private String nombre;
    private ArrayList<Producto> inventario;
    private HashMap<String, Cliente> clientes;

    public TiendaMusica(String nombre) {
        this.nombre = nombre;
        this.inventario = new ArrayList<>();
        this.clientes = new HashMap<>();
    }

    /**
     * Añade un producto al inventario.
     * Debe validar que no exista un producto con el mismo ID antes de añadirlo.
     * Si el producto ya existe, no se añade
     * @param producto Producto a añadir
     */
    public void añadirProducto(Producto producto) {
        //TO DO
    }

    /**
     * Añade un cliente a la tienda.
     * @param cliente Cliente a añadir
     */

    public void añadirCliente(Cliente cliente) {
        clientes.put(cliente.getId(), cliente);
    }


    /**
     * Registra una nueva venta.
     * Solo debe agregar la venta al historial del cliente.
     * @param clienteId ID del cliente
     * @param productoId ID del producto
     * @param cantidad Cantidad vendida
     */
    public void registrarVenta(String clienteId, String productoId, int cantidad) {
        // TODO: Implementar lógica de venta
    }

    // Setters y Getters
    public String getNombre() {
        return nombre;
    }
    public ArrayList<Producto> getInventario() {
        return new ArrayList<>(inventario);
    }
    public HashMap<String, Cliente> getClientes() {
        return new HashMap<>(clientes);
    }
}