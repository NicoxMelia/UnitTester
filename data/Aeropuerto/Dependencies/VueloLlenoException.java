/**
 * Excepción personalizada para cuando un vuelo está lleno.
 */
public class VueloLlenoException extends Exception {
    private String codigoVuelo;
    private int capacidad;

    /**
     * Constructor de la excepción.
     * @param codigoVuelo Código del vuelo que está lleno.
     * @param capacidad Capacidad máxima del avión.
     */
    public VueloLlenoException(String codigoVuelo, int capacidad) {
        super("El vuelo " + codigoVuelo + " está lleno. Capacidad máxima: " + capacidad);
        this.codigoVuelo = codigoVuelo;
        this.capacidad = capacidad;
    }

    public String getCodigoVuelo() {
        return codigoVuelo;
    }

    public int getCapacidad() {
        return capacidad;
    }
}