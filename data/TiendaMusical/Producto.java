/**
 * Clase base que representa un producto en la tienda de música.
 */
public class Producto {
    private String id;
    private String titulo;
    private double precio;

    public Producto(String id, String titulo, double precio) {
        this.id = id;
        this.titulo = titulo;
        this.precio = precio;
    }

    /**
     * Calcula el precio con descuento.
     * @param porcentaje Descuento a aplicar
     * @return Precio con descuento
     */
    public double calcularDescuento(double porcentaje) {
        // TO DO
        return 0.0;
    }

    // Setters y Getters
    public String getId() { return id; }
    public String getTitulo() { return titulo; }
    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }
}