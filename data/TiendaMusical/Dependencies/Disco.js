/**
 * Clase que representa un disco musical.
 * Asume que existe una clase Producto de la que hereda.
 */
class Disco extends Producto {
    /**
     * @param {string} id 
     * @param {string} titulo 
     * @param {number} precio 
     * @param {string} artista 
     * @param {number} anioLanzamiento 
     */
    constructor(id, titulo, precio, artista, anioLanzamiento) {
        super(id, titulo, precio);
        this.artista = artista;
        this.anioLanzamiento = anioLanzamiento;
        /**
         * Objeto que almacena las canciones del disco.
         * @type {Object.<number, string>}
         * Clave: número de pista, Valor: nombre de la canción
         */
        this.canciones = {};
    }

    /**
     * Añade una canción al disco.
     * @param {number} numeroPista Número de pista
     * @param {string} cancion Nombre de la canción
     */
    añadirCancion(numeroPista, cancion) {
        this.canciones[numeroPista] = cancion;
    }

    /**
     * Calcula la duración total estimada del disco.
     * Se asume que cada canción dura aproximadamente 3.5 minutos.
     * @return {number} Duración en minutos (estimación)
     */
    calcularDuracionTotal() {
        return Object.keys(this.canciones).length * 3.5;
    }

    // Getters
    getArtista() {
        return this.artista;
    }
    
    getAñoLanzamiento() {
        return this.añoLanzamiento;
    }
    
    getCanciones() {
        return {...this.canciones}; // Devuelve una copia del objeto
    }
}