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
        Vuelo vuelo = buscarVuelo(codigoVuelo);
        if (vuelo != null) {
            // Si la puerta no existe en el mapa, la creamos
            puertasEmbarque.putIfAbsent(numeroPuerta, new ArrayList<>());
            // Agregamos el vuelo a la lista de vuelos de esa puerta
            puertasEmbarque.get(numeroPuerta).add(vuelo);
            System.out.println("Vuelo " + codigoVuelo + " asignado a puerta " + numeroPuerta);
        } else {
            throw new IllegalArgumentException("Vuelo no encontrado: " + codigoVuelo);
        }
    }

    @Override
    public EstadoVuelo verificarEstadoVuelo(String codigoVuelo) {
        Vuelo vuelo = buscarVuelo(codigoVuelo);
        return vuelo != null ? vuelo.getEstado() : null;
    }

    @Override
    public void ofrecerServicioPremium(String pasaporte, ServicioPremium servicio) {
        if(pasaporte == null || servicio == null) {
            throw new IllegalArgumentException("Pasaporte o servicio no pueden ser nulos");
        }
        for (Vuelo vuelo : vuelos) {
            Pasajero pasajero = vuelo.buscarPasajero(pasaporte);
            if (pasajero != null) {
                pasajero.hacerVip();
                System.out.println("Servicio premium " + servicio + " ofrecido a " + 
                                 pasajero.getNombre() + " en vuelo " + vuelo.getCodigoVuelo());
                return;
            }
        }
       throw new IllegalArgumentException("Pasajero con pasaporte " + pasaporte + " no encontrado en ningún vuelo");
    }

    /**
     * Registra una nueva aeronave en el aeropuerto.
     * @param aeronave Aeronave a registrar.
     */
    public void registrarAeronave(Aeronave aeronave) {
        if (aeronave != null) {
            aeronaves.put(aeronave.getMatricula(), aeronave);
        }else{
            throw new IllegalArgumentException("Aeronave no puede ser nula");
        }
    }

    /**
     * Programa un nuevo vuelo en el aeropuerto.
     * @param vuelo Vuelo a programar.
     */
    public void programarVuelo(Vuelo vuelo) {
        if (vuelo != null) {
            vuelos.add(vuelo);
        }else{
            throw new IllegalArgumentException("Vuelo no puede ser nulo");
        }
    }

    /**
     * Obtiene todos los vuelos asignados a una puerta de embarque.
     * @param numeroPuerta Número de la puerta.
     * @return Lista de vuelos asignados a esa puerta.
     */
    public List<Vuelo> obtenerVuelosPorPuerta(int numeroPuerta) {
        return puertasEmbarque.getOrDefault(numeroPuerta, new ArrayList<>());
        //Tambien se puede hacer con un if verificando si el value es null
    }

    /**
     * Busca un vuelo por su código.
     * @param codigoVuelo Código del vuelo a buscar.
     * @return El vuelo encontrado o null si no existe.
     */
    private Vuelo buscarVuelo(String codigoVuelo) {
        if (codigoVuelo == null || codigoVuelo.isEmpty()) {
            throw new IllegalArgumentException("El código de vuelo no puede ser nulo o vacío");
        }
        for (Vuelo vuelo : vuelos) {
            if (vuelo.getCodigoVuelo().equals(codigoVuelo)) {
                return vuelo;
            }
        }
        return null;
    }
}