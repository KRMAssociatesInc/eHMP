package gov.va.hmp.auth;

import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.hmp.Bootstrap;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.conn.SystemInfo;
import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.hmp.vista.springframework.security.web.VistaAccessVerifyAuthenticationFilter.*;
import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;

@Controller
public class AuthController implements EnvironmentAware {

    private static Logger log = LoggerFactory.getLogger(AuthController.class);

    private UserContext userContext;

    private RpcOperations authenticationRpcTemplate;

    private IVistaAccountDao vistaAccountDao;

    private ISyncService syncService;

    private Environment environment;

    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
    }

    @Autowired
    @Qualifier("vistaAuthenticationProvider")
    private AuthenticationProvider authProvider;
    
    @Autowired
    @Qualifier("failureHandler")
    AuthenticationFailureHandler authFailureHandler;
    
    @Autowired
    AuthenticationSuccessHandler authSuccessHandler;

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setAuthenticationRpcTemplate(RpcOperations authenticationRpcTemplate) {
        this.authenticationRpcTemplate = authenticationRpcTemplate;
    }

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @RequestMapping(value = "/auth")
    public String index() {
        return "redirect:/auth/login";
    }

    @RequestMapping(value = "/auth/keepalive")
    @ResponseBody
    public String keepalive() {
        return "keepalive";
    }

    @RequestMapping(value = "/auth/login", method = RequestMethod.GET)
    public ModelAndView login(HttpServletRequest request, HttpServletResponse response) {
        if (!Bootstrap.isSetupComplete(environment)) {
            return new ModelAndView("redirect:/");
        }

        if (userContext.isLoggedIn()) {
            return new ModelAndView("redirect:/");
        }

        Map<String, Object> map = new HashMap<>();
        map.put("hmpVersion", environment.getProperty(HmpProperties.VERSION));
        map.put(HmpProperties.DEVELOPMENT_PROFILE, new Boolean(Bootstrap.isDevelopment(environment)).toString());
        if(syncService.isOperationalSynching()) {
            return new ModelAndView("/auth/initializing", map);
        }
        if(!syncService.isReindexAllComplete()) {
            return new ModelAndView("/auth/reindexing", map);
        }
        if(!syncService.isDataStreamEnabled()) {
            map.putAll(syncService.getDataStreamErrorDetails());
            return new ModelAndView("/auth/dataStreamError", map);
        }
        return new ModelAndView("/auth/login", map);
    }

    @RequestMapping(value = "/auth/logout")
    public String logout() {
        // TODO put any pre-logout code here

        return "redirect:/j_spring_security_logout";
    }

    @RequestMapping(value = "/auth/accounts", method = RequestMethod.GET)
    public ModelAndView accounts() throws InvalidKeyException, UnsupportedEncodingException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, InvalidAlgorithmParameterException {
        List<VistaAccount> accounts = vistaAccountDao
                .findAllByVistaIdIsNotNull();
        Map<String, List<VistaAccount>> map = new HashMap<String, List<VistaAccount>>();
        map.put("items", accounts);

        Map<String, Map<String, List<VistaAccount>>> dataMap = new HashMap<String, Map<String, List<VistaAccount>>>();
        dataMap.put("data", map);
        /*
         * This is a stop-gap until we come up with a permanent solution to protect synchronization credentials.
         */
        for(String s: map.keySet())
        {
        	for(VistaAccount vac: map.get(s))
        	{
        		vac.setVprUserCredentials(null);
        	}
        }
        return contentNegotiatingModelAndView(dataMap);
    }

    @RequestMapping(value = "/auth/welcome", method = RequestMethod.POST)
    @ResponseBody
    public String welcome(@RequestParam(required = true) String vistaId,
                          HttpServletResponse response) {
        List<VistaAccount> accounts = vistaAccountDao.findAllByVistaIdIsNotNull();
        VistaAccount currentAcct = null;

		if(accounts.size() == 0) 
		{
			String result = "unable to find valid account";
			log.error(result);
			return result;
		}

        for(VistaAccount acct : accounts) {
             currentAcct = acct;
        }

        response.setContentType("text/plain");
        String r = "VistA Welcome Message Here (TBD)";
        try {
        	if (currentAcct == null) {
        		log.error("Current vista account is null");
        	} else {
        		SystemInfo systemInfo = authenticationRpcTemplate.
        				fetchSystemInfo(new RpcHost(currentAcct.getHost(), currentAcct.getPort()));
        		r = systemInfo.getIntroText();
        	}
        } catch (DataAccessException e) {
            log.error("unable to fetch VistA welcome message", e);
            r = e.getCause() != null ? e.getCause().getMessage() : e.getMessage();
        }
        return r;
    }
    
    @RequestMapping(value = "/auth/update/verifycode", method = RequestMethod.POST)
    public void changeVerifyCode(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

    	VistaAuthenticationToken authRequest = 
        		 new VistaAuthenticationToken(obtain(request, VISTA_ID_KEY), 
        				 					  obtain(request, DIVISION_KEY), 
        				 					  obtainAccessCode(request), 
        				 					  obtainVerifyCode(request), 
					        				  obtain(request, NEW_VERIFY_CODE_KEY), 
					        				  obtain(request, CONFIRM_VERIFY_CODE_KEY), 
	 					  					  request.getRemoteAddr(),
                                              request.getRemoteHost());

         Authentication authentication = null;
         
         try {
        	 authentication = authProvider.authenticate(authRequest);
        	 authSuccessHandler.onAuthenticationSuccess(request, response, authentication);
         } catch (AuthenticationException ae) {
        	 authFailureHandler.onAuthenticationFailure(request, response, ae);
         }
    }

    private String obtain(HttpServletRequest request, String paramName) {
        return request.getParameter(paramName);
    }
    
    private String obtainAccessCode(HttpServletRequest request) {
        
    	String accessCode = request.getParameter(ACCESS_CODE_KEY);
        
    	if (accessCode == null ) {
        	accessCode = "";
        }
        else if (accessCode.contains(";")) {
           accessCode = accessCode.substring(0, accessCode.lastIndexOf(';'));
        }
        return accessCode;
    }

    private String obtainVerifyCode(HttpServletRequest request) {

    	String verifyCode = request.getParameter(VERIFY_CODE_KEY);
        
    	if (verifyCode == null ) {
        	verifyCode = "";
        }
        else if (!StringUtils.hasText(verifyCode)) {
            String accessCode = request.getParameter(ACCESS_CODE_KEY);
            if (accessCode.contains(";")) {
                verifyCode = accessCode.substring(accessCode.lastIndexOf(';') + 1);
            }
        }
        return verifyCode;
    }
}
