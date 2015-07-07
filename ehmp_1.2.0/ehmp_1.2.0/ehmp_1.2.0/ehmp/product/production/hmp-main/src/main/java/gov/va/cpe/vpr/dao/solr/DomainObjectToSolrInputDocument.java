package gov.va.cpe.vpr.dao.solr;

import com.google.common.base.CaseFormat;

import gov.va.cpe.vpr.pom.*;

import org.apache.solr.common.SolrInputDocument;
import org.springframework.core.convert.converter.Converter;

import java.util.Map;

public class DomainObjectToSolrInputDocument implements Converter<IPOMObject, SolrInputDocument> {
	
	boolean storeJSONDocument = false;
	boolean storeSMILEDocument = false;
	
	/** if true, store the whole JSON document in a field called 'json' */
	public void setStoreJSONDocument(boolean val) {
		this.storeJSONDocument = val;
	}
	
	/** if true, store the whole SMILE-encoded JSON document in a field called 'smile' */
	public void setStoreSMILEDocument(boolean val) {
		this.storeSMILEDocument = val;
	}

    @Override
    public synchronized SolrInputDocument convert(IPOMObject entity) {
        if (entity == null) return null;

        SolrInputDocument solrInputDocument = new SolrInputDocument();
        Map<String, Object> data = entity.getData(JSONViews.SolrView.class);
        for (Map.Entry<String, Object> item : data.entrySet()) {
            String fieldName = CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, item.getKey());
            solrInputDocument.addField(fieldName, item.getValue());
        }
        
        // if set, also append the JSON and/or SMILE fields (use the JDB view though, not SOLR view)
        if (storeSMILEDocument) {
        	solrInputDocument.addField("smile", POMUtils.toSMILE(entity, JSONViews.JDBView.class));
        } 
        if (storeJSONDocument) {
        	solrInputDocument.addField("json", POMUtils.toJSON(entity, JSONViews.JDBView.class));
        }
        return solrInputDocument;
    }
}
