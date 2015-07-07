package gov.va.cpe.vpr.sync.convert;

import gov.va.cpe.odc.Person;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.sync.vista.IImportPostProcessor;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.junit.Before;
import org.junit.Test;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static gov.va.cpe.vpr.pom.POMUtils.convertObjectToNode;
import static org.hamcrest.CoreMatchers.instanceOf;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class VistaDataChunkToPOMObjectConverterTest {

    private VistaDataChunkToPOMObjectConverter c;

    @Test
    public void testConvert() throws Exception {
        c = new VistaDataChunkToPOMObjectConverter();

        Map<String, Object> data = new HashMap<String, Object>();
        data.put("uid", UidUtils.getUserUid("ABCD", "42"));

        Person person = new Person(data);

        VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk("ABCD", "/foo/bar", convertObjectToNode(person), "person", 0, 1);

        IPOMObject o = c.convert(chunk);

        assertThat(o, is(instanceOf(Person.class)));
        Person p = (Person) o;
        assertThat(p.getUid(), is(UidUtils.getUserUid("ABCD", "42")));
    }

    @Test
    public void testConvertAndPostProcess() throws Exception {
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("uid", UidUtils.getUserUid("ABCD", "42"));

        Person person = new Person(data);

        IImportPostProcessor<Person> postProcessor = new IImportPostProcessor<Person>() {
            @Override
            public Person postProcess(Person item) {
                item.setData("foo", "bar");
                return item;
            }
        };

        c = new VistaDataChunkToPOMObjectConverter(Collections.<Class<? extends IPOMObject>, IImportPostProcessor>singletonMap(Person.class, postProcessor));

        VistaDataChunk chunk = VistaDataChunk.createVistaDataChunk("ABCD", "/foo/bar", convertObjectToNode(person), "person", 0, 1);

        IPOMObject o = c.convert(chunk);

        assertThat(o, is(instanceOf(Person.class)));
        Person p = (Person) o;
        assertThat(p.getUid(), is(UidUtils.getUserUid("ABCD", "42")));
        assertThat((String) p.getData().get("foo"), is("bar"));
    }
}
