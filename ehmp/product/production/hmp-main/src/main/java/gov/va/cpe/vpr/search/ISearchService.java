package gov.va.cpe.vpr.search;

import gov.va.cpe.vpr.frameeng.Frame.FrameException;
import gov.va.cpe.vpr.search.PatientSearch.SuggestItem;
import org.apache.solr.client.solrj.SolrServerException;

import java.util.List;
import java.util.Map;

public interface ISearchService {
    PatientSearch textSearchByPatient(String queryText, String vprPatient, Map<String, Object> params) throws SolrServerException, FrameException;
    List<SuggestItem> textSuggestByPatient(String prefix, String vprPatient) throws SolrServerException, FrameException;
    List<SuggestItem> textBrowseByPatient(String prefix, String vprPatient, String frameID) throws SolrServerException, FrameException;
    /**
     * use SOLR to hit highlight any/all matching fields in document based on search terms
     * <p/>
     * - this will accomodate stemming, proximity matching, stopwords, synonyms, case-insentive, etc.
     * - only fields that are stored (in schema.xml) are eligible for hit highlighting
     * <p/>
     * TODO: merge/update the fields parameter, but need to reverse the camle-to-underscore field naming
     */
    Map<String, List<String>> doSearchHighlight(String uid, String searchTerm) throws SolrServerException;
}
