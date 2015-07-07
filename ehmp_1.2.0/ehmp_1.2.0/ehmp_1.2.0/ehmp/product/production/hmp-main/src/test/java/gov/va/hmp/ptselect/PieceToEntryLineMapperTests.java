package gov.va.hmp.ptselect;

import gov.va.hmp.vista.util.VistaStringUtils;
import org.junit.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class PieceToEntryLineMapperTests {

    @Test
    public void testDefaultMapLine() throws Exception {
        PieceToEntryLineMapper m = new PieceToEntryLineMapper();

        Map<String, String> foobar = m.mapLine("42^FOOBAR", 23);
        assertThat(foobar.get("localId"), is("42"));
        assertThat(foobar.get("name"), is("FOOBAR"));
        assertThat(foobar.get("displayName"), is(VistaStringUtils.nameCase("FOOBAR")));
    }

    @Test
    public void testMapLine() throws Exception {
        Map<Integer, String> p2k = new HashMap<>();
        p2k.put(1, "localId");
        p2k.put(2, "name");

        PieceToEntryLineMapper m = new PieceToEntryLineMapper(p2k, new HashSet(Arrays.asList(2)));

        Map<String, String> foobar = m.mapLine("42^FOOBAR", 23);
        assertThat(foobar.get("localId"), is("42"));
        assertThat(foobar.get("name"), is("FOOBAR"));
        assertThat(foobar.get("displayName"), is(VistaStringUtils.nameCase("FOOBAR")));
    }
}
