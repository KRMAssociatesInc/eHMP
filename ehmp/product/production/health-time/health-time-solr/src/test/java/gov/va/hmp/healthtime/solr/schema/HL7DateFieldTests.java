package gov.va.hmp.healthtime.solr.schema;

import org.apache.solr.common.SolrException;
import org.junit.Before;
import org.junit.Test;

public class HL7DateFieldTests {

    private HL7DateField hl7Date;

    @Before
    public void setUp() {
        hl7Date = new HL7DateField();
    }

    @Test
    public void testNull() {
        hl7Date.toInternal((String) null);
    }

    @Test
    public void testEmptyString() {
        hl7Date.toInternal("");
    }

    @Test(expected = SolrException.class)
    public void testInvalidDateString() {
        hl7Date.toInternal("2");
    }

    @Test
    public void testValidHL7DateString() {
        hl7Date.toInternal("20110113");
    }
}
