package gov.va.cpe.vpr.search;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;

import gov.va.cpe.vpr.search.PatientSearch.SummaryItem;

import gov.va.hmp.auth.HmpUserDetails;
import org.junit.Before;
import org.junit.Test;

public class PatientSearchTests {

	private HmpUserDetails mockUser;

    @Before
    public void setUp() throws Exception {
        mockUser = mock(HmpUserDetails.class);
    }

    @Test
	public void testDuplicateItems() {
		String uid = "urn:foo:bar:baz";
		SummaryItem item = new SummaryItem(uid);
		item.type = "test";
		item.kind = "test1";
		SummaryItem item2 = new SummaryItem(uid);
		item2.type = "test";
		item.kind = "test2";
		
		
		PatientSearch search = new PatientSearch(mockUser, "term", "1", PatientSearch.SearchMode.SEARCH);
		assertTrue(search.getResults().isEmpty());
		search.addResults(item);
		assertTrue(search.getResults().contains(item));
		
		// adding another summaryItem with the same type/UID should override the first one
		search.addResults(item2);
		assertEquals(1, search.getResults().size());
		assertEquals("test2", search.getResults().get(0).kind);
		
		
	}

    @Test
    public void testEqualsAndHashCode() throws Exception {
        SummaryItem item1 = new SummaryItem("urn:foo:bar:baz");
        SummaryItem item2 = new SummaryItem("urn:foo:bar:baz");

        assertThat(item1.equals(item2), is(true));
        assertThat(item2.equals(item1), is(true));

        assertThat(item1.hashCode(), is(equalTo(item2.hashCode())));

        item2 = new SummaryItem("urn:foo:bar:spaz");

        assertThat(item1.equals(item2), is(false));
        assertThat(item2.equals(item1), is(false));

        assertThat(item1.hashCode(), is(not(equalTo(item2.hashCode()))));
    }
}
