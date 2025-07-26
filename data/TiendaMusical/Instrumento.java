import java.util.ArrayList;

/**
 * Clase que representa un instrumento musical.
 */
public class Instrumento extends Producto {

    /**
     * Tipo de instrumento (ej. guitarra, bajo, bateria).
     */
    private TipoInstrumento tipo;

    private String material;
    private ArrayList<String> accesoriosIncluidos;

    public Instrumento(String id, String titulo, double precio, TipoInstrumento tipo, String material) {
        super(id, titulo, precio);
        this.tipo = tipo;
        this.material = material;
        this.accesoriosIncluidos = new ArrayList<>();
    }

    /**
     * Añade un accesorio incluido con el instrumento.
     * Debe validar que el accesorio no esté en la lista antes de añadirlo.
     * @param accesorio Nombre del accesorio
     */
    public void añadirAccesorio(String accesorio) {
        //TO DO
    }

    /**
     * Calcula el peso estimado del instrumento.
     * Se asume la siguiente lógica:
     * - Guitarras: 2.5 kg
     * - Bajos: 3.0 kg
     * - Baterías: 10.0 kg
     * - Otros: 5.0 kg
     * @return Peso en kg (estimación)
     */
    public double estimarPeso() {
        // TODO: Implementar estimación según tipo y material
        return 0.0;
    }

    // Setters y Getters
    public TipoInstrumento getTipo() {
        return tipo;
    }
    public String getMaterial() {
        return material;
    }
    public ArrayList<String> getAccesoriosIncluidos() {
        return new ArrayList<>(accesoriosIncluidos);
    }
}