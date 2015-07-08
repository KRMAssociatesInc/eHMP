package gov.va.hmp.vista.rpc.conn;

/**
 * The interface <code>SystemInfo</code> provides information about a VistA instance connected through a
 * <code>Connection</code> instance. A component calls the method {@link Connection#getSystemInfo()} to get a
 * <code>SystemInfo</code> instance.
 *
 * @see Connection
 */
public interface SystemInfo {
    String getServer();

    /**
     *
     * @see "VistA FileMan VOLUME SET,VOLUME SET(14.5,.01)"
     */
    String getVolume();

    /**
     * Return the User Class Identification (UCI) of the VistA instance.
     * @see "VistA FileMan RPC BROKER SITE PARAMETERS,LISTENER(8994.1,7)"
     */
    String getUCI();

    /**
     * TODO: I suspect Port means something different here, not TCP/IP port.
     * 
     */
    String getDevice();

    /**
     * This is the name of this installation of the VistA kernel, as it is known to the rest of the network.
     *
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,DOMAIN NAME(8989.3,.01)"
     * @see "VistA FileMan DOMAIN(4.2)"
     */
    String getDomainName();

    /**
     * A unique identifier for this VistA system.
     *
     * Defined as the hex string of the CRC-16 of the domain name of this VistA system.
     *
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,DOMAIN NAME(8989.3,.01)"
     */
    String getVistaId();

    /**
     * Returns whether or not the underlying VistA instance is a production system.
     *
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,PRODUCTION(8989.3,501)"
     */
    boolean isProductionAccount();

    /**
     * Returns the INTRO message from the underlying VistA instance.
     *
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,INTRO MESSAGE(8989.3,240)"
     */
    String getIntroText();

    /**
     * Returns the number of seconds the underlying VistA instance will wait before timing out an idle connection.
     *
     * @see "VistA FileMan KERNEL SYSTEM PARAMETERS,BROKER ACTIVITY TIMEOUT(8989.3,230)"
     */
    int getActivityTimeoutSeconds();
}
