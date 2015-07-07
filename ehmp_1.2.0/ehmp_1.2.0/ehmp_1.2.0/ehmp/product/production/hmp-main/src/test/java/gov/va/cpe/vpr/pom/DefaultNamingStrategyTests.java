package gov.va.cpe.vpr.pom;

import gov.va.cpe.vpr.pom.jds.JdsCollectionName;
import org.junit.Test;

import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class DefaultNamingStrategyTests {

    private DefaultNamingStrategy namingStrategy = new DefaultNamingStrategy();

    @Test
    public void testCollectionNameFromClass() throws Exception {
       assertThat(namingStrategy.collectionName(TestPatientObject.class), is("testpatientobject"));
    }

    @Test
    public void testPropertyName() throws Exception {
        assertThat(namingStrategy.propertyName("testPropertyName"), is("testPropertyName"));
        assertThat(namingStrategy.propertyName("TestPropertyName"), is("testPropertyName"));
    }
}
