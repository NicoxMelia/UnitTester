/**
 * Clase abstracta que representa una aeronave genérica en el aeropuerto.
 * Define las propiedades y métodos básicos que todas las aeronaves deben tener.
 */
public abstract class Aeronave {
    private String matricula;
    private String modelo;
    private int capacidadPasajeros;
    private double autonomiaKm;

    /**
     * Constructor de la clase Aeronave.
     * @param matricula Identificador único de la aeronave.
     * @param modelo Modelo de la aeronave.
     * @param capacidadPasajeros Número máximo de pasajeros.
     * @param autonomiaKm Distancia máxima que puede recorrer sin repostar.
     */
    public Aeronave(String matricula, String modelo, int capacidadPasajeros, double autonomiaKm) {
        this.matricula = matricula;
        this.modelo = modelo;
        this.capacidadPasajeros = capacidadPasajeros;
        this.autonomiaKm = autonomiaKm;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public int getCapacidadPasajeros() {
        return capacidadPasajeros;
    }

    public void setCapacidadPasajeros(int capacidadPasajeros) {
        this.capacidadPasajeros = capacidadPasajeros;
    }

    public double getAutonomiaKm() {
        return autonomiaKm;
    }

    public void setAutonomiaKm(double autonomiaKm) {
        this.autonomiaKm = autonomiaKm;
    }

    /**
     * Método abstracto que calcula el consumo de combustible por kilómetro.
     * @return Consumo de combustible en litros por kilómetro.
     */
    public abstract double calcularConsumoCombustible();

    /**
     * Método que verifica si la aeronave puede realizar un vuelo de cierta distancia.
     * @param distanciaKm Distancia del vuelo en kilómetros.
     * @return true si la aeronave tiene autonomía suficiente, false en caso contrario.
     */
    public boolean puedeVolar(double distanciaKm) {
        // TO DO: Implementar lógica para verificar si la distancia es menor o igual a la autonomía
        return false;
    }
}