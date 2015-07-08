package gov.va.hmp.vista.springframework.security.userdetails;

import org.springframework.dao.DataAccessException;

/**
 * Defines an interface for implementations that wish to provide data access
 * services to the {@link gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationProvider}.
 * <p/>
 * <p>
 * The interface requires only one read-only method, which simplifies support
 * of new data access strategies.
 * </p>
 */
public interface VistaUserDetailsService {
    /**
     * Locates the user based on the username. In the actual implementation, the search may possibly be case
     * insensitive, or case insensitive depending on how the implementaion instance is configured. In this case, the
     * <code>UserDetails</code> object that comes back may have a username that is of a different case than what was
     * actually requested..
     * <p/>
     * //     * @param username the username presented to the {@link org.springframework.security.authentication.dao.DaoAuthenticationProvider}
     *
     * @return a fully populated user record (never <code>null</code>)
     * @throws org.springframework.security.core.userdetails.UsernameNotFoundException
     *          if the user could not be found or the user has no GrantedAuthority
     * @throws org.springframework.dao.DataAccessException
     *          if user could not be found for a repository-specific reason
     */
    VistaUserDetails login(String vistaId, String division, String accessCode, String verifyCode, String newVerifyCode, String confirmNewVerifyCode, String remoteAddress, String remoteHostName)
            throws DataAccessException;

    VistaUserDetails login(String vistaId, String division, String appHandle, String remoteAddress, String remoteHostName)
            throws DataAccessException;

    /**
     * @param user
     */
    void logout(VistaUserDetails user) throws DataAccessException;
}