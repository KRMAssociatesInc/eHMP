package gov.va.cpe.vpr.pom;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class ImprovedNamingStrategyTests {
    private ImprovedNamingStrategy namingStrategy = new ImprovedNamingStrategy();

    @Test
    public void testCollectionNameFromClass() throws Exception {
        assertThat(namingStrategy.collectionName(TestPatientObject.class), is("test_patient_object"));
    }

    @Test
    public void testPropertyName() throws Exception {
        assertThat(namingStrategy.propertyName("testPropertyName"), is("test_property_name"));
        assertThat(namingStrategy.propertyName("TestPropertyName"), is("test_property_name"));
    }
}
