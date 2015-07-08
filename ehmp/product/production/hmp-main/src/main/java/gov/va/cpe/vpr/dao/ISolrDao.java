package gov.va.cpe.vpr.dao;

import gov.va.cpe.vpr.pom.IDataStoreDAO;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.response.QueryResponse;

public interface ISolrDao extends IDataStoreDAO {
    public QueryResponse search(String query);

    public QueryResponse search(SolrQuery solrQuery);

    public void deleteByQuery(String query);
}
