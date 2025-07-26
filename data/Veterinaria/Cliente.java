import java.util.HashMap;

/**
 * Clase que representa un cliente de la veterinaria.
 */
public class Cliente {
    private String id;
    private String nombre;
    private HashMap<String, Animal> mascotas; // Clave: nombre de la mascota, Valor: objeto Animal

    public Cliente(String id, String nombre) {
        this.id = id;
        this.nombre = nombre;
        this.mascotas = new HashMap<>();
    }

    /**
     * Registra una nueva mascota.
     * @param mascota Animal a registrar
     */
    public void registrarMascota(Animal mascota) {
        // TO DO
    }

    /**
     * Cuenta las mascotas por tipo.
     * 
     * @return Mapa con conteo de mascotas por tipo
     */
    public HashMap<TipoAnimal, Integer> contarMascotasPorTipo() {
        //TO DO
        Integer cantidadPerros = 0;
        Integer cantidadGatos = 0;
        return null;
    }

    // Setters y Getters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public HashMap<String, Animal> getMascotas() { return new HashMap<>(mascotas); }
}