package gov.va.cpe.vpr.search;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import gov.va.cpe.vpr.search.PatientSearch.SummaryItem;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.domain.PageRequest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

public class SearchControllerTests {

    private SearchController c;
    private ISearchService mockSearchService;
    private HmpUserDetails mockUser;

    @Before
    public void setUp() throws Exception {
        mockUser = mock(HmpUserDetails.class);
        mockSearchService = mock(ISearchService.class);
        c = new SearchController();
        c.searchService = mockSearchService;
    }
    
    @Test
    public void testQuery() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();

        SummaryItem mockSummaryItem = new SummaryItem("urn:foo:23");
        mockSummaryItem.summary ="FOO";
        mockSummaryItem.type = "allergy";
        mockSummaryItem.where = "Camp Master";

        PatientSearch mockSearchResults = new PatientSearch(mockUser, "foo", "23", PatientSearch.SearchMode.SUGGEST);
        mockSearchResults.elapsed = 123;
        mockSearchResults.setAltQueryStr("bar");
        mockSearchResults.addResults(mockSummaryItem);

        when(mockSearchService.textSearchByPatient("foo", "23", null)).thenReturn(mockSearchResults);

        ModelAndView mav = c.query("1", "23", "foo", null, null, false, new PageRequest(0, 20), request);

        verify(mockSearchService).textSearchByPatient("foo", "23", null);

        assertThat(mav.getViewName(), equalTo(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        JsonCCollection<SummaryItem> r = (JsonCCollection) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertNotNull(r);

        assertNotNull(r.data);
        assertThat((Integer) r.get("elapsed"), equalTo(mockSearchResults.elapsed));
        assertThat((String) r.get("original"), equalTo(mockSearchResults.getOriginalQueryStr()));
        assertThat((String) r.get("altQuery"), equalTo(mockSearchResults.getAltQueryStr()));
        assertThat(r.getTotalItems(), equalTo(mockSearchResults.getResults().size()));
        assertThat(r.getCurrentItemCount(), equalTo(mockSearchResults.getResults().size()));
    }

    @Test
    public void testSuggest() throws Exception {
//        when(mockSearchService.textSuggestByPatient("foo", "23")).thenReturn(mockSearchResults);

        ModelAndView view = c.suggest("1", "23", "foo");
        assertThat(view.getViewName(), equalTo(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));
        verify(mockSearchService).textSuggestByPatient("foo", "23");
    }
  
    /**
     * Small little program to process the ClinicalSenceInventoryII file into a valid synonyms.txt file
     * that can be used by SOLR.
     * @throws FileNotFoundException
     * @throws IOException
     */
//    @Test
    public void testProcessSynonymns() throws FileNotFoundException, IOException {
    	File in = new File("/Users/brian/Temp/ClinicalSenseInventoryII_RefinedMasterFile.txt");
    	File out = new File("/Users/brian/Temp/synonyms-ClinicalSenseInventoryII.csv");
    	// parse each line
    	List<String> lines = IOUtils.readLines(new FileReader(in));
  
    	StringBuilder sb = new StringBuilder();
    	String abbr = null;
    	for (String line : lines) {
    		String[] fields = StringUtils.split(line, '|');
    		
    		// if the abbr changes, start a new line
    		if (abbr == null || !fields[0].equals(abbr)) {
    			// new line
    			sb.append("\n");
    			sb.append(fields[0]);
    		}
    		
    		String[] phrases = StringUtils.split(fields[1], ";");
    		for (String phrase : phrases) {
    			sb.append(",");
    			sb.append(StringUtils.replace(phrase, ",", "\\,"));
    		}
    	}
    	
    	FileWriter writer = new FileWriter(out);
    	writer.write(sb.toString());
    	writer.close();
    }
}

