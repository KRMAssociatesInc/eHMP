package gov.va.cpe.web;

import gov.va.cpe.vpr.web.BadRequestException;
import gov.va.hmp.Bootstrap;
import gov.va.hmp.HmpEncryption;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.SetupCommand;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.VistaAccountValidator;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.vista.rpc.ConnectionCallback;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.conn.Connection;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.util.DefaultPropertiesPersister;
import org.springframework.util.PropertiesPersister;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Controller
public class SetupController implements ApplicationContextAware, EnvironmentAware {

    private static Logger LOG = LoggerFactory.getLogger(SetupController.class);

    private Validator vistaAccountValidator;
    private Validator setupValidator;
    private ApplicationContext applicationContext;
    private Environment environment;
    private RpcOperations synchronizationRpcTemplate;
    private IVistaAccountDao vistaAccountDao;
    private RestTemplate restTemplate = new RestTemplate();
    private PropertiesPersister propertiesPersister = new DefaultPropertiesPersister();

    public SetupController() {
        vistaAccountValidator = new VistaAccountValidator();
        setupValidator = new SetupCommandValidator(vistaAccountValidator);
    }

    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @Autowired
    public void setSynchronizationRpcTemplate(RpcOperations synchronizationRpcTemplate) {
        this.synchronizationRpcTemplate = synchronizationRpcTemplate;
    }

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    HmpEncryption hmpEncryption;

    @Autowired
    public void setHmpEncryption(HmpEncryption hmpEncryption) {
        this.hmpEncryption=hmpEncryption;
    }

    @RequestMapping(value = {"/setup", "/setup/index"})
    public ModelAndView index(SetupCommand setup, Errors setupErrors, @RequestParam(required = false) String access, @RequestParam(required = false) String verify, @RequestParam(required = false) Boolean done) {
        try {
            if (Bootstrap.isSetupComplete(environment)) {
                return new ModelAndView("redirect:/");
            } else if (Bootstrap.getHmpPropertiesResource(applicationContext).exists()) {
                return new ModelAndView("/setup/restart");
            } else {
                if (!StringUtils.hasText(setup.getServerId()))
                    setup.setServerId(environment.getProperty(HmpProperties.SERVER_ID));
                if (!StringUtils.hasText(setup.getServerHost()))
                    setup.setServerHost(environment.getProperty(HmpProperties.SERVER_HOST));
                if (setup.getHttpPort() == null)
                    setup.setHttpPort(Integer.parseInt(environment.getProperty(HmpProperties.SERVER_PORT_HTTP)));
                if (setup.getHttpsPort() == null)
                    setup.setHttpsPort(Integer.parseInt(environment.getProperty(HmpProperties.SERVER_PORT_HTTPS)));

                if (setup.getVistaAccount() != null) {
                    final VistaAccount v = vistaAccountDao.findByDivisionHostAndPort(setup.getVistaAccount().getDivision(), setup.getVistaAccount().getHost(), setup.getVistaAccount().getPort());
                    if (v != null) setup.setVistaAccount(v);
                }


                ValidationUtils.invokeValidator(setupValidator, setup, setupErrors);
                if (!setupErrors.hasErrors()) {
                    if (!StringUtils.hasText(access))
                        throw new BadRequestException("missing required parameter 'access'");
                    if (!StringUtils.hasText(verify))
                        throw new BadRequestException("missing required parameter 'verify'");

                    if (done) {
                        try {
                            setup.encrypt(hmpEncryption);
                            vistaAccountDao.save(setup.getVistaAccount());
                            completeSetup(setup);
                            setup.decrypt(hmpEncryption);
                        } catch (NoSuchAlgorithmException e) {
                            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                        } catch (InvalidKeyException e) {
                            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                        } catch (BadPaddingException e) {
                            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                        } catch (NoSuchPaddingException e) {
                            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                        } catch (IllegalBlockSizeException e) {
                            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                        }
                        return new ModelAndView("redirect:/");
                    }

                }


                Map<String, Object> model = new HashMap();
                model.put("setup", setup);
                model.put("vistaAccounts", vistaAccountDao.findAll());
                return new ModelAndView("/setup/index", model);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void completeSetup(SetupCommand setup) {
        Properties props = new Properties();
        props.setProperty(HmpProperties.PROPERTIES_ENCRYPTED, "true");
        props.setProperty(HmpProperties.SERVER_ID, setup.getServerId());
        props.setProperty(HmpProperties.SERVER_HOST, setup.getServerHost());
        props.setProperty(HmpProperties.SERVER_PORT_HTTP, setup.getHttpPort().toString());
        props.setProperty(HmpProperties.SERVER_PORT_HTTPS, setup.getHttpsPort().toString());
        props.setProperty(HmpProperties.SETUP_COMPLETE, "true");

        Resource hmpPropertiesResource = null;
        try {
            hmpPropertiesResource = Bootstrap.getHmpPropertiesResource(applicationContext);
            if (!hmpPropertiesResource.exists()) {
                hmpPropertiesResource.getFile().createNewFile();
            }
            if (hmpPropertiesResource != null) {
            	try(FileOutputStream fis = new FileOutputStream(hmpPropertiesResource.getFile())) {
            		propertiesPersister.store(props, fis, "Health Management Platform Properties");
            	}
            }
        } catch (IOException ex) {
            try {
                LOG.error("unable to store " + hmpPropertiesResource.getFile().getCanonicalPath(), ex);
            } catch (IOException e) {
                // NOOP
            }
        }

    }

    @RequestMapping(value = "/setup/test", method = RequestMethod.POST)
    public ModelAndView test(HttpServletRequest request) {
        final SetupCommand setup = new SetupCommand();

        // I'm sure there's a better way but I don't know the guts of Spring well enough.
        // The SetupCommand class as a parameter was not working due to some sort of Spring-related validation magic not being parseable by Jackson.
        setup.setVistaAccount(new VistaAccount());
        setup.getVistaAccount().setDivision(request.getParameter("vista.division"));
        setup.getVistaAccount().setHost(request.getParameter("vista.host"));
        setup.getVistaAccount().setPort(Integer.parseInt(request.getParameter("vista.port")));
        setup.getVistaAccount().setName(request.getParameter("vista.name"));
        setup.getVistaAccount().setId(StringUtils.hasText(request.getParameter("vista.id")) ? Integer.parseInt(request.getParameter("vista.id")) : null);
        setup.getVistaAccount().setVprUserCredentials(request.getParameter("vista.vprUserCredentials"));
        setup.getVistaAccount().setProduction(Boolean.parseBoolean(request.getParameter("vista.production")));
        setup.getVistaAccount().setRegion(StringUtils.hasText(request.getParameter("vista.region")) ? Integer.parseInt(request.getParameter("vista.region")) : null);
        setup.getVistaAccount().setVistaId(request.getParameter("vista.vistaId"));

        final String access = request.getParameter("access");
        final String verify = request.getParameter("verify");

        synchronizationRpcTemplate.execute(new ConnectionCallback<String>() {
            public String doInConnection(Connection c) {
                setup.getVistaAccount().setVistaId(c.getSystemInfo().getVistaId());
                setup.getVistaAccount().setVprUserCredentials(access + ";" + verify);
                return setup.getVistaAccount().getVistaId();
            }

        }, new RpcHost(setup.getVistaAccount().getHost(), setup.getVistaAccount().getPort()), setup.getVistaAccount().getDivision(), access, verify);

        VistaAccount v = vistaAccountDao.findByDivisionHostAndPort(setup.getVistaAccount().getDivision(), setup.getVistaAccount().getHost(), setup.getVistaAccount().getPort());
        if (v != null) {
            v.setName(setup.getVistaAccount().getName());
            v.setVistaId(setup.getVistaAccount().getVistaId());
            v.setVprUserCredentials(setup.getVistaAccount().getVprUserCredentials());
            setup.setVistaAccount(v);
        }

        vistaAccountDao.save(setup.getVistaAccount());

        JsonCResponse jsonc = JsonCResponse.create(request, Collections.singletonMap("vistaId", setup.getVistaAccount().getVistaId()));
        return ModelAndViewFactory.contentNegotiatingModelAndView(jsonc);
    }
}
