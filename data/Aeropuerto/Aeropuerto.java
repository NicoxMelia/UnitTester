import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Clase principal que representa el aeropuerto y su operación.
 */
public class Aeropuerto implements ServiciosAeroportuarios {
    private String nombre;
    private String codigoIATA;
    private String ciudad;
    private ArrayList<Vuelo> vuelos;
    private HashMap<String, Aeronave> aeronaves;
    private HashMap<Integer, List<Vuelo>> puertasEmbarque; // Value es una List de Vuelos

    /**
     * Constructor del aeropuerto.
     * @param nombre Nombre del aeropuerto.
     * @param codigoIATA Código IATA del aeropuerto.
     * @param ciudad Ciudad donde está ubicado.
     */
    public Aeropuerto(String nombre, String codigoIATA, String ciudad) {
        this.nombre = nombre;
        this.codigoIATA = codigoIATA;
        this.ciudad = ciudad;
        this.vuelos = new ArrayList<>();
        this.aeronaves = new HashMap<>();
        this.puertasEmbarque = new HashMap<>();
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigoIATA() {
        return codigoIATA;
    }

    public void setCodigoIATA(String codigoIATA) {
        this.codigoIATA = codigoIATA;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public ArrayList<Vuelo> getVuelos() {
        return vuelos;
    }

    public HashMap<String, Aeronave> getAeronaves() {
        return aeronaves;
    }

    public HashMap<Integer, List<Vuelo>> getPuertasEmbarque() {
        return puertasEmbarque;
    }

    @Override
    public void asignarPuertaEmbarque(String codigoVuelo, int numeroPuerta) {
        // TO DO: Implementar método de la interfaz
        // Buscar el vuelo por código y agregarlo a la lista de vuelos de la puerta
    }

    @Override
    public EstadoVuelo verificarEstadoVuelo(String codigoVuelo) {
        // TO DO: Implementar método de la interfaz
        // Buscar el vuelo y devolver su estado
        return null;
    }

    @Override
    public void ofrecerServicioPremium(String pasaporte, ServicioPremium servicio) {
        // TO DO: Implementar método de la interfaz
    }

    /**
     * Registra una nueva aeronave en el aeropuerto.
     * @param aeronave Aeronave a registrar.
     */
    public void registrarAeronave(Aeronave aeronave) {
        // TO DO: Implementar método para registrar aeronave en el HashMap
    }

    /**
     * Programa un nuevo vuelo en el aeropuerto.
     * @param vuelo Vuelo a programar.
     */
    public void programarVuelo(Vuelo vuelo) {
        // TO DO: Implementar método para agregar vuelo a la lista
    }

    /**
     * Obtiene todos los vuelos asignados a una puerta de embarque.
     * @param numeroPuerta Número de la puerta.
     * @return Lista de vuelos asignados a esa puerta.
     */
    public List<Vuelo> obtenerVuelosPorPuerta(int numeroPuerta) {
        // TO DO: Implementar método para obtener vuelos de puerta
        return null;
    }

    /**
     * Busca un vuelo por su código.
     * @param codigoVuelo Código del vuelo a buscar.
     * @return El vuelo encontrado o null si no existe.
     */
    private Vuelo buscarVuelo(String codigoVuelo) {
        for (Vuelo vuelo : vuelos) {
            if (vuelo.getCodigoVuelo().equals(codigoVuelo)) {
                return vuelo;
            }
        }
        return null;
    }
}