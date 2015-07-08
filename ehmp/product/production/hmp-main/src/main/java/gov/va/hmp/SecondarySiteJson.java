package gov.va.hmp;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.va.cpe.vpr.sync.expirationrulesengine.ExpirationRule;
import gov.va.cpe.vpr.sync.expirationrulesengine.IntegrationLevelExpirationRule;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.h2.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.core.io.Resource;

public class SecondarySiteJson implements ApplicationContextAware, ISecondarySiteConfig {
    
    private ApplicationContext applicationContext;
    private ObjectMapper jsonMapper = new ObjectMapper();
    public static final String SECONDARY_SITE_CONFIG_FILENAME = "secondary-sites.json";
    private static Logger LOG = LoggerFactory.getLogger(SecondarySiteJson.class);
    private IVistaAccountDao vistaAccountDao;
    
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }
    
    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }


    private Resource getSecondarySiteConfig() throws IOException {
        Resource hmpHome = Bootstrap.getHmpHomeDirectory(this.applicationContext);
        Resource SecondarySiteConfig = hmpHome.createRelative(SECONDARY_SITE_CONFIG_FILENAME);
        LOG.info("Loading Secondary Site Config from " + (SecondarySiteConfig == null ? null : SecondarySiteConfig.getFile().getAbsolutePath()));
        return SecondarySiteConfig;
    }    
    
    private JsonNode getSecondarySiteJson() {
        InputStream is = null;
        try {
            Resource vistaAccountConfig = getSecondarySiteConfig();
            is = vistaAccountConfig.getInputStream();           
            return jsonMapper.readTree(is);            
        } catch (Exception ex) {
            LOG.warn("unable to load " + SECONDARY_SITE_CONFIG_FILENAME + " config", ex);
            return null;
        } finally {
            IOUtils.closeSilently(is);
        }
    }
    

    /* (non-Javadoc)
     * @see gov.va.hmp.ISecondarySiteConfig#getSecondarySiteRulesMap()
     */
    @Override
    @SuppressWarnings("unchecked")
    public Map<String, ExpirationRule> getSecondarySiteRulesMap(){
        LOG.debug("calling getSecondarySiteRulesMap().");
        JsonNode json = getSecondarySiteJson();
        if(json == null){
            return null;
        }
        //top level elements should be siteId
        List<JsonNode> items = json.findValues("rules");
        Map<String, ExpirationRule> expirationRuleMap = new HashMap<String, ExpirationRule>();
        for (JsonNode item : items)
        {
            try {
                expirationRuleMap.putAll((Map<? extends String, ? extends ExpirationRule>) jsonMapper.convertValue(item, jsonMapper.getTypeFactory().constructType(new TypeReference<Map<String, ExpirationRule>>() { })));
            } catch (Exception ex) {
                throw new RuntimeException("Unable to parse JSON.", ex);
            }                
        }

        LOG.info("**BEGIN RULE MAP**");
        for (Map.Entry<String, ExpirationRule> entry : expirationRuleMap.entrySet()) {
            if (entry.getValue() instanceof IntegrationLevelExpirationRule) {
                if (vistaAccountDao != null) {
                    IntegrationLevelExpirationRule rule = (IntegrationLevelExpirationRule) entry.getValue();

                    Map<String, Integer> integrationLevelMap = new HashMap<String, Integer>();
                    List<VistaAccount> vistas = vistaAccountDao.findAllByVistaIdIsNotNull();
                    for (VistaAccount vista : vistas) {
                        integrationLevelMap.put(vista.getVistaId(), vista.getIntegrationLevel(rule.getSiteId()));
                    }

                    rule.setIntegrationLevelsByVistaId(integrationLevelMap);
                    expirationRuleMap.put(entry.getKey(), rule);
                } else {
                    LOG.error("null value for SecondarySiteJson.vistaAccountDao--probably indicates autowiring problem.");
                }
            }
            LOG.info(entry.getKey() + ": " + entry.getValue().toString());
        }
        LOG.info("**END RULE MAP**");
        return expirationRuleMap;
    }

}
