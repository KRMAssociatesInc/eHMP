package gov.va.cpe.vpr.sync.msg;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.team.Category;
import gov.va.cpe.team.TeamPosition;
import gov.va.cpe.vpr.dao.IVprSyncErrorDao;
import gov.va.cpe.vpr.frameeng.FrameRegistry;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;
import gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDefConfigTemplate;
import gov.va.cpe.vpr.sync.SyncError;
import gov.va.cpe.vpr.sync.vista.IVistaOperationalDataDAO;
import gov.va.hmp.app.Page;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jms.listener.SessionAwareMessageListener;
import org.springframework.jms.support.converter.SimpleMessageConverter;
import org.springframework.util.Assert;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import static gov.va.cpe.vpr.sync.SyncMessageConstants.DOMAIN;
import static gov.va.cpe.vpr.sync.SyncMessageConstants.VISTA_ID;

public class InitOperationalDomainMessageHandler implements SessionAwareMessageListener {

    private final Logger LOG = LoggerFactory.getLogger(InitOperationalDomainMessageHandler.class);

    private IGenericPOMObjectDAO jdsDao;

    private IVistaOperationalDataDAO vistaOperationalDataService;

    private ResourceLoader resourceLoader;

    private IVprSyncErrorDao errorDao;

	 private static Logger LOGGER = LoggerFactory.getLogger(ReindexPatientMessageHandler.class);
	
	 @Autowired
    public void setErrorDao(IVprSyncErrorDao errorDao) {
        this.errorDao = errorDao;
    }   
    
    @Autowired
    public void setVistaOperationalDataService(IVistaOperationalDataDAO vistaOperationalDataService) {
        this.vistaOperationalDataService = vistaOperationalDataService;
    }

    @Autowired
    public void setJdsDao(IGenericPOMObjectDAO jdsDao) {
        this.jdsDao = jdsDao;
    }

    @Autowired
    public void setResourceLoader(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Autowired
    SimpleMessageConverter converter;

    @Override
    public void onMessage(Message message, Session session) {
        Map msg = null;
        try {
            msg = (Map) converter.fromMessage(message);
            String vistaId = (String) msg.get(VISTA_ID);
            String domainClassName = (String) msg.get(DOMAIN);
            Assert.hasText(vistaId, "[Assertion failed] - " + VISTA_ID + " must have text; it must not be null, empty, or blank");
            Assert.hasText(domainClassName, "[Assertion failed] - " + DOMAIN + " must have text; it must not be null, empty, or blank");

            Class domain = null;
            try {
                domain = ClassUtils.forName(domainClassName, this.getClass().getClassLoader());
            } catch (ClassNotFoundException e) {
                throw new IllegalArgumentException("[Assertion failed] - '" + DOMAIN + "' must correspond to a Class on the classpath: " + domainClassName + " does not");
            }
            if (domain == ViewDefDef.class) {
                FrameRegistry.reloader(FrameRegistry.ViewDefDefFrameLoader.class);
            } else if (domain == Category.class) {
                initialize(vistaId, domain, "classpath:gov/va/cpe/team/team-categories.json");
            } else if (domain == TeamPosition.class) {
                initialize(vistaId, domain, "classpath:gov/va/cpe/team/team-positions.json");
            } else if (domain == Page.class) {
                initialize(vistaId, domain, "classpath:gov/va/cpe/mega/megamenu-pages.json");
            } else if (domain == ViewDefDefColDefConfigTemplate.class) {
                initialize(vistaId, domain, "classpath:gov/va/cpe/viewdefdef/boardcolumn-config-templates.json");
            }
        } catch (Exception e) {
            LOGGER.error("Error synching patient data: " + e.getMessage(), e);
            try {
                errorDao.save(new SyncError(message, msg, e));
                session.recover();
            } catch (JMSException e1) {
                e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        }

    }

    private <T extends IPOMObject> void initialize(String vistaId, Class<T> domainClass, String resourceLocation) {
        LOG.info("initializing domain " + StringUtils.quote(domainClass.getName()) + " from " + StringUtils.quote(resourceLocation));
        InputStream is=null;
        try {
            Resource resource = resourceLoader.getResource(resourceLocation);
            is = resource.getInputStream();
            JsonNode json = POMUtils.parseJSONtoNode(resource.getInputStream());

            JsonNode itemsNode = json.path("data").path("items");
            for (JsonNode itemNode : itemsNode) {
                T item = POMUtils.newInstance(domainClass, itemNode);
                item = vistaOperationalDataService.save(vistaId, item);
                jdsDao.save(item);
            }
        } catch (IOException e) {
            LOG.error("unable to initialize domain " + StringUtils.quote(domainClass.getName()) + " from " + StringUtils.quote(resourceLocation), e);
        } finally {
        	IOUtils.closeQuietly(is);
        }
    }
}
