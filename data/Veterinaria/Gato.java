import java.util.ArrayList;

/**
 * Clase que representa un gato en la veterinaria.
 */
public class Gato extends Animal {
    private String color;
    private ArrayList<String> juguetesFavoritos;
    private final TipoAnimal tipo = TipoAnimal.GATO;

    public Gato(String nombre, int edad, String color) {
        super(nombre, edad);
        this.color = color;
        this.juguetesFavoritos = new ArrayList<>();
    }

    /**
     * Añade un juguete favorito del gato.
     * Si el juguete ya existe, no se añade de nuevo.
     * @param juguete Nombre del juguete
     */
    public void añadirJuguete(String juguete) {
        // TO DO
        
    }

    /**
     * Determina si el gato es mayor (+7 años).
     * @return true si es mayor
     */
    public boolean esMayor() {
        // TODO: Implementar lógica
        return false;
    }

    // Setters y Getters
    public String getColor() {
        return color;
    }
    public ArrayList<String> getJuguetesFavoritos() {
        return new ArrayList<>(juguetesFavoritos);
    }
    public TipoAnimal getTipo() {
        return tipo;
    }
}