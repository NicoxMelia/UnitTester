import java.util.HashMap;

/**
 * Clase que representa un perro en la veterinaria.
 */
public class Perro extends Animal {
    private String raza;
    private HashMap<String, NivelEntrenamiento> entrenamientos; // Comando -> Nivel
    private final TipoAnimal tipo = TipoAnimal.PERRO;
    private int peso;

    public Perro(String nombre, int edad, String raza, int peso) {
        super(nombre, edad);
        this.raza = raza;
        this.peso = peso;
        this.entrenamientos = new HashMap<>();
    }

    /**
     * Añade un entrenamiento aprendido.
     * @param comando Comando aprendido
     * @param nivel Nivel de dominio (Básico, Intermedio, Avanzado)
     */
    public void añadirEntrenamiento(String comando, NivelEntrenamiento nivel) {
        // TO DO
    }

    /**
     * Calcula la cantidad de comida diaria recomendada.
     * Varia segun el peso del perro
     * Si pesa menos de 5 kg, se recomienda 50 gramos por día.
     * Si pesa entre 5 y 10 kg, se recomienda 100 gramos por día
     * Si pesa más de 10 kg, se recomienda 150 gramos por día.
     * @return Cantidad en gramos
     */
    public int calcularComidaDiaria() {
        // TODO: Implementar según raza y edad
        return 0;
    }

    // Setters y Getters
    public String getRaza() {
        return raza;
    }
    public HashMap<String, NivelEntrenamiento> getEntrenamientos() {
        return new HashMap<>(entrenamientos);
    }
    public TipoAnimal getTipo() {
        return TipoAnimal.PERRO;
    }
}