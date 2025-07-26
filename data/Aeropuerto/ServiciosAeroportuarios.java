/**
 * Interfaz que define los servicios que puede ofrecer el aeropuerto.
 */
public interface ServiciosAeroportuarios {
    /**
     * Método para asignar una puerta de embarque a un vuelo.
     * @param codigoVuelo Código del vuelo.
     * @param numeroPuerta Número de puerta a asignar.
     */
    void asignarPuertaEmbarque(String codigoVuelo, int numeroPuerta);

    /**
     * Método para verificar el estado de un vuelo.
     * @param codigoVuelo Código del vuelo a verificar.
     * @return Estado actual del vuelo.
     */
    EstadoVuelo verificarEstadoVuelo(String codigoVuelo);

    /**
     * Método para ofrecer servicios premium a un pasajero.
     * @param pasaporte Número de pasaporte del pasajero.
     * @param servicio Tipo de servicio premium a ofrecer.
     */
    void ofrecerServicioPremium(String pasaporte, ServicioPremium servicio);
}