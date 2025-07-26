import java.util.ArrayList;

/**
 * Clase que representa un avión comercial, hereda de Aeronave.
 */
public class AvionComercial extends Aeronave {
    private int numeroAzafatas;
    private boolean tienePrimeraClase;
    private ArrayList<String> serviciosABordo;

    /**
     * Constructor de AvionComercial.
     * @param matricula Identificador único del avión.
     * @param modelo Modelo del avión.
     * @param capacidadPasajeros Número máximo de pasajeros.
     * @param autonomiaKm Distancia máxima que puede recorrer sin repostar.
     * @param numeroAzafatas Número de azafatas/asistentes de vuelo.
     * @param tienePrimeraClase Indica si tiene sección de primera clase.
     */
    public AvionComercial(String matricula, String modelo, int capacidadPasajeros, 
        double autonomiaKm, int numeroAzafatas, boolean tienePrimeraClase) {
        super(matricula, modelo, capacidadPasajeros, autonomiaKm);
        this.numeroAzafatas = numeroAzafatas;
        this.tienePrimeraClase = tienePrimeraClase;
        this.serviciosABordo = new ArrayList<>();
    }

    public int getNumeroAzafatas() {
        return numeroAzafatas;
    }

    public void setNumeroAzafatas(int numeroAzafatas) {
        this.numeroAzafatas = numeroAzafatas;
    }

    public boolean isTienePrimeraClase() {
        return tienePrimeraClase;
    }

    public void setTienePrimeraClase(boolean tienePrimeraClase) {
        this.tienePrimeraClase = tienePrimeraClase;
    }

    public ArrayList<String> getServiciosABordo() {
        return serviciosABordo;
    }

    @Override
    public double calcularConsumoCombustible() {
        // TO DO: Calcular consumo basado en capacidad y autonomía
        // Fórmula sugerida: (capacidadPasajeros * 0.1) + (autonomiaKm * 0.01)
        return 0.0;
    }

    /**
     * Agrega un servicio a la lista de servicios a bordo.
     * @param servicio Nombre del servicio a agregar.
     */
    public void agregarServicio(String servicio) {
        // TO DO: Implementar método para agregar servicio
    }

    /**
     * Muestra todos los servicios disponibles a bordo.
     */
    public void mostrarServicios() {
        // TO DO: Implementar método para mostrar servicios
    }
}