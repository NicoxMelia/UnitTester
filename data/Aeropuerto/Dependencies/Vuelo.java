import java.time.LocalDateTime;
import java.time.Duration;
import java.util.HashMap;

/**
 * Clase que representa un vuelo en el aeropuerto.
 */
public class Vuelo {
    private String codigoVuelo;
    private String origen;
    private String destino;
    private LocalDateTime horaSalida;
    private LocalDateTime horaLlegada;
    private AvionComercial avionAsignado;
    private HashMap<String, Pasajero> pasajeros;
    private EstadoVuelo estado;

    /**
     * Constructor de la clase Vuelo.
     * @param codigoVuelo Identificador único del vuelo.
     * @param origen Ciudad de origen.
     * @param destino Ciudad de destino.
     * @param horaSalida Fecha y hora de salida.
     * @param horaLlegada Fecha y hora de llegada.
     * @param avionAsignado Avión asignado para este vuelo.
     */
    public Vuelo(String codigoVuelo, String origen, String destino, 
        LocalDateTime horaSalida, LocalDateTime horaLlegada, 
        AvionComercial avionAsignado) {
        this.codigoVuelo = codigoVuelo;
        this.origen = origen;
        this.destino = destino;
        this.horaSalida = horaSalida;
        this.horaLlegada = horaLlegada;
        this.avionAsignado = avionAsignado;
        this.pasajeros = new HashMap<>();
        this.estado = EstadoVuelo.PROGRAMADO;
    }

    // Getters y setters
    public String getCodigoVuelo() {
        return codigoVuelo;
    }

    public void setCodigoVuelo(String codigoVuelo) {
        this.codigoVuelo = codigoVuelo;
    }

    public String getOrigen() {
        return origen;
    }

    public void setOrigen(String origen) {
        this.origen = origen;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public LocalDateTime getHoraSalida() {
        return horaSalida;
    }

    public void setHoraSalida(LocalDateTime horaSalida) {
        this.horaSalida = horaSalida;
    }

    public LocalDateTime getHoraLlegada() {
        return horaLlegada;
    }

    public void setHoraLlegada(LocalDateTime horaLlegada) {
        this.horaLlegada = horaLlegada;
    }

    public AvionComercial getAvionAsignado() {
        return avionAsignado;
    }

    public void setAvionAsignado(AvionComercial avionAsignado) {
        this.avionAsignado = avionAsignado;
    }

    public HashMap<String, Pasajero> getPasajeros() {
        return pasajeros;
    }

    public EstadoVuelo getEstado() {
        return estado;
    }

    public void setEstado(EstadoVuelo estado) {
        this.estado = estado;
    }

    /**
     * Agrega un pasajero al vuelo.
     * @param pasajero Pasajero a agregar.
     * @throws VueloLlenoException Si no hay más capacidad en el avión.
     */
    public void agregarPasajero(Pasajero pasajero) throws VueloLlenoException {
        if (pasajeros.size() >= avionAsignado.getCapacidadPasajeros()) {
            throw new VueloLlenoException(codigoVuelo, avionAsignado.getCapacidadPasajeros());
        }
        pasajeros.put(pasajero.getPasaporte(), pasajero);
    }

    /**
     * Calcula la duración del vuelo en horas.
     * @return Duración en horas.
     */
    public double calcularDuracionHoras() {
        return horaLlegada.getHour() - horaSalida.getHour();
    }

    /**
     * Busca un pasajero por su número de pasaporte.
     * @param pasaporte Número de pasaporte del pasajero.
     * @return El pasajero encontrado o null si no existe.
     */
    public Pasajero buscarPasajero(String pasaporte) {
        return pasajeros.get(pasaporte);
    }
}