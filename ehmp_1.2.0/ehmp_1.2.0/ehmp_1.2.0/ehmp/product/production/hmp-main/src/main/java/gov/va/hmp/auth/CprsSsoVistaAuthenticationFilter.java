package gov.va.hmp.auth;

import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import gov.va.hmp.vista.springframework.security.web.VistaAppHandleAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.util.StringUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class CprsSsoVistaAuthenticationFilter extends VistaAppHandleAuthenticationFilter {

    public static final String SERVER_KEY = "S";
    public static final String PORT_KEY = "P";
    public static final String USER_DUZ_KEY = "U";
    public static final String APP_HANDLE_KEY = "H";

    private IVistaAccountDao vistaAccountDao;

    public CprsSsoVistaAuthenticationFilter() {
        setPostOnly(false);
        setAppHandleParameter(APP_HANDLE_KEY);
    }

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        if (!request.isSecure()) {
            throw new AuthenticationServiceException("Authentication scheme not supported: " + request.getScheme());
        }

        Authentication authentication = super.attemptAuthentication(request, response);
        if (authentication instanceof VistaAuthenticationToken) {
            VistaAuthenticationToken vistaAuthenticationToken = (VistaAuthenticationToken) authentication;
            String requestedDuz = obtainUserDuz(request);
            if (!vistaAuthenticationToken.getDuz().equals(requestedDuz)) {
                throw new UserDUZMismatchException("The requested user's DUZ does not match the authenticated user's DUZ.");
            }
        }

        return authentication;
    }

    @Override
    protected String obtainVistaId(HttpServletRequest request) {
        String server = request.getParameter(SERVER_KEY);
        String portStr = request.getParameter(PORT_KEY);
        if (!StringUtils.hasText(server)) throw new VistaHostValidationException("missing hostname");
        if (!StringUtils.hasText(portStr)) throw new VistaHostValidationException("missing port");
        try {
            int port = Integer.valueOf(portStr);

            List<VistaAccount> vistaAccounts = vistaAccountDao.findAllByHostAndPort(server, port);
            if (vistaAccounts.isEmpty()) throw new VistaHostValidationException(new RpcHost(server, port));

            VistaAccount vistaAccount = vistaAccounts.get(0);
            String vistaId = vistaAccount.getVistaId();

            return vistaId;
        } catch (NumberFormatException e) {
            throw new VistaHostValidationException("invalid port number");
        } catch (VistaHostValidationException e) {
            throw e;
        }
    }

    @Override
    protected String obtainDivision(HttpServletRequest request) {
        return null;
    }

    protected String obtainUserDuz(HttpServletRequest request) {
        String duz = request.getParameter(USER_DUZ_KEY);
        return duz;
    }
}
