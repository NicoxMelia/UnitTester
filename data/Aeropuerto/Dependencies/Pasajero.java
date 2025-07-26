/**
 * Clase que representa un pasajero en el aeropuerto.
 */
public class Pasajero {
    private String pasaporte;
    private String nombre;
    private String nacionalidad;
    private boolean vip;

    /**
     * Constructor de la clase Pasajero.
     * @param pasaporte Número de pasaporte.
     * @param nombre Nombre completo del pasajero.
     * @param nacionalidad Nacionalidad del pasajero.
     */
    public Pasajero(String pasaporte, String nombre, String nacionalidad) {
        this.pasaporte = pasaporte;
        this.nombre = nombre;
        this.nacionalidad = nacionalidad;
        this.vip = false;
    }

    // Getters y setters
    public String getPasaporte() {
        return pasaporte;
    }

    public void setPasaporte(String pasaporte) {
        this.pasaporte = pasaporte;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNacionalidad() {
        return nacionalidad;
    }

    public void setNacionalidad(String nacionalidad) {
        this.nacionalidad = nacionalidad;
    }

    public boolean isVip() {
        return vip;
    }

    /**
     * Método para convertir al pasajero en VIP.
     */
    public void hacerVip() {
        this.vip = true;
    }
}