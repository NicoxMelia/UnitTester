import java.util.HashMap;

/**
 * Clase que representa un disco musical.
 */
public class Disco extends Producto {
    private String artista;
    private int anioLanzamiento;
    /**
     * Mapa que almacena las canciones del disco.
     * La clave es el número de pista (1, 2, 3, ...) y el valor es el nombre de la canción.
     */
    private HashMap<Integer, String> canciones; // Número de pista -> Nombre canción

    public Disco(String id, String titulo, double precio, String artista, int anioLanzamiento) {
        super(id, titulo, precio);
        this.artista = artista;
        this.anioLanzamiento = anioLanzamiento;
        this.canciones = new HashMap<>();
    }

    /**
     * Añade una canción al disco.
     * No debe hacer ninguna validacion extra.
     * @param numeroPista Número de pista
     * @param cancion Nombre de la canción
     */
    public void añadirCancion(int numeroPista, String cancion) {
        //TO DO: Implementar el método
    }

    /**
     * Calcula la duración total estimada del disco.
     * Se asume que cada canción dura aproximadamente 3.5 minutos.
     * @return Duración en minutos (estimación)
     */
    public double calcularDuracionTotal() {
        // TO DO
        return 0.0;
    }

    // Setters y Getters
    public String getArtista() {
        return artista;
    }
    public int getAñoLanzamiento() {
        return anioLanzamiento;
    }
    public HashMap<Integer, String> getCanciones() {
        return new HashMap<>(canciones);
    }
}