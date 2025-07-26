import java.util.ArrayList;
import java.util.HashMap;

/**
 * Clase que gestiona la veterinaria.
 */
public class Veterinaria {
    private String nombre;
    private ArrayList<Cliente> clientes;
    private HashMap<String, Integer> stockMedicamentos; // Nombre -> Cantidad

    public Veterinaria(String nombre) {
        this.nombre = nombre;
        this.clientes = new ArrayList<>();
        this.stockMedicamentos = new HashMap<>();
    }

    /**
     * Añade un nuevo cliente.
     * @param cliente Cliente a registrar
     */
    public void añadirCliente(Cliente cliente) {
        // TO DO
    }


    /**
     * Actualiza el stock de un medicamento.
     * @param medicamento Nombre del medicamento
     * @param cantidad Cambio en cantidad
     */
    public void actualizarStock(String medicamento, Integer cantidad) {
        // TODO: Implementar actualización
    }

    // Setters y Getters
    public String getNombre() { return nombre; }
    public ArrayList<Cliente> getClientes() { return new ArrayList<>(clientes); }
    public HashMap<String, Integer> getStockMedicamentos() { return new HashMap<>(stockMedicamentos); }
}