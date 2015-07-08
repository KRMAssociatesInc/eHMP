package gov.va.cpe.vpr.termeng.jlv;

import java.util.Iterator;
import java.util.Map;

import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.util.LoggingUtil;
import gov.va.hmp.util.NullChecker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jms.core.JmsOperations;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JLVDocDefUtil {
    private static final Logger LOG = LoggerFactory.getLogger(JLVDocDefUtil.class);
    
    private JdsOperations jdsTemplate;

    public JLVDocDefUtil(JdsOperations jdsTemplate) {
        super();
        this.jdsTemplate = jdsTemplate;
    }

    public JdsOperations getJdsTemplate() {
        return jdsTemplate;
    }

    public void setJdsTemplate(JdsOperations jdsTemplate) {
        this.jdsTemplate = jdsTemplate;
    }
    
    private String getVuidForDocDefId(String sDocDefUid) {
        String sVuid = "";
        
        JsonNode jsonResponse = jdsTemplate.getForJsonNode("/data/" + sDocDefUid);
        if (jsonResponse != null) {
            JsonNode itemsNode = jsonResponse.path("data").path("items");
            if ((itemsNode != null) && 
                (itemsNode.isArray())) {
                Iterator<JsonNode> itemIterator = itemsNode.iterator();
                while (itemIterator.hasNext()) {
                    JsonNode itemNode = itemIterator.next();
                    JsonNode nationalTitleVuidNode = itemNode.path("nationalTitle").path("vuid");
                    if ((nationalTitleVuidNode != null) &&
                        (nationalTitleVuidNode.isTextual())) {
                        sVuid = nationalTitleVuidNode.asText();
                    }
                }
            }
        }
        
        return sVuid;
    }

    public void insertVuidFromDocDefUid(VistaDataChunk chunk) {
        if ((chunk != null) && (jdsTemplate != null)) {
            LOG.debug("insertVuidFromDocDefUid: jmsTemplate was AutoWired - Yeah!!!");
            @SuppressWarnings("unused")
            Map<String, Object> chunkMap = chunk.getJsonMap();
            LOG.debug("insertVuidFromDocDefUid: before change - chunkMap:" + LoggingUtil.mapContentsOutput("   ", "chunkMap: ", chunkMap));
            LOG.debug("insertVuidFromDocDefUid: before change - content:" + chunk.getContent());
            LOG.debug("insertVuidFromDocDefUid: before change - json:" + chunk.getJson());
            
            Object oDocDefUid = chunkMap.get("documentDefUid");
            if ((oDocDefUid != null) &&
                (oDocDefUid instanceof String)) {
                String sDocDefUid = (String) oDocDefUid;
                String sVuid = getVuidForDocDefId(sDocDefUid);
                
                if (NullChecker.isNotNullish(sVuid)) {
                    chunkMap.put("documentDefUidVuid", sVuid);
                    ObjectMapper jsonMapper = new ObjectMapper();
                    try {
                        String sContent = jsonMapper.writeValueAsString(chunkMap);
                        chunk.setContent(sContent);
                    } catch (JsonProcessingException e) {
                        LOG.error("insertVuidFromDocDefUid: Exception occurred updating content  for vuid: " + sVuid, e);
                    }

                    LOG.debug("insertVuidFromDocDefUid: inserted vuid: " + sVuid + " into map for documentDefUid: " + sDocDefUid);
                }
                else {
                    LOG.debug("insertVuidFromDocDefUid: no vuid found for documentDefUid: " + sDocDefUid);
                }
            }
            else {
                LOG.debug("insertVuidFromDocDefUid: no documentDefUid found");
            }
        }
        else {
            LOG.debug("insertVuidFromDocDefUid: jmsTemplate was null - Boo!!!");
        }
    }
}
