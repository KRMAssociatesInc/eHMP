package gov.va.cpe.vpr.pom;

import gov.va.cpe.vpr.pom.jds.JdsCollectionName;
import org.junit.Test;

import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class JdsNamingStrategyTests {

    private JdsNamingStrategy namingStrategy = new JdsNamingStrategy();

    @Test
    public void testCollectionNameFromJdsCollectionAnnotation() throws Exception {
        assertThat(namingStrategy.collectionName(AnnotatedTestPatientObject.class), is("foo"));
    }

    @JdsCollectionName("foo")
    public static class AnnotatedTestPatientObject extends TestPatientObject {
        AnnotatedTestPatientObject(Map<String, Object> vals) {
            super(vals);
        }
    }
}
