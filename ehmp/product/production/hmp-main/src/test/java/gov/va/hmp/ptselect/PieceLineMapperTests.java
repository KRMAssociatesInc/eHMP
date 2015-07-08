package gov.va.hmp.ptselect;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class PieceLineMapperTests {
    @Test
    public void testMapLine() throws Exception {
        PieceLineMapper m = new PieceLineMapper(2);

        String foobar = m.mapLine("42^FOOBAR^BAZSPAZ", 23);
        assertThat(foobar, is("FOOBAR"));
    }
}
