import java.util.ArrayList;

/**
 * Clase base que representa un animal en la veterinaria.
 */
public class Animal {
    private String nombre;
    private int edad;
    private ArrayList<String> vacunas;

    public Animal(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
        this.vacunas = new ArrayList<>();
    }

    /**
     * Añade una vacuna al historial del animal.
     * Si la vacuna ya existe, no se añade de nuevo.
     * @param vacuna Nombre de la vacuna
     */
    public void añadirVacuna(String vacuna) {
        // TO DO
    }

    /**
     * Calcula la edad aproximada en "años humanos".
     * Se debe tener en cuenta que 1 año del animal son 7 años humanos por defecto
     * @return Edad convertida
     */
    public int calcularEdadHumana() {
        // TODO: Implementar cálculo básico (1:1 por defecto)
        return 0;
    }

    // Setters y Getters
    public String getNombre() { return nombre; }
    public int getEdad() { return edad; }
    public ArrayList<String> getVacunas() { return new ArrayList<>(vacunas); }
    public void setEdad(int edad) { this.edad = edad; }
}