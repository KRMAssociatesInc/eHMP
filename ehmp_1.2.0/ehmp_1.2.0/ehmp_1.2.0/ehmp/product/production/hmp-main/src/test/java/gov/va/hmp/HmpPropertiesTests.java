package gov.va.hmp;

import gov.va.hmp.HmpProperties;
import org.junit.Test;

import java.util.Set;

import static gov.va.hmp.HmpProperties.*;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.assertThat;
import static org.hamcrest.CoreMatchers.hasItems;

public class HmpPropertiesTests {

    @Test
    public void testGetPropertyNames() throws Exception {
        Set<String> props = HmpProperties.getPropertyNames();

        assertThat(props.isEmpty(), is(false)); // 22 props at time of writing, arbitrarily testing for someTHING
        assertThat(props, hasItems(VERSION, BUILD_DATE, INFO_BUTTON_URL, SERVER_PORT_HTTPS)); // picked a few arbitrary ones
        assertThat(props, not(hasItems("password", "username")));

    }

    @Test
    public void testGetPropertyNamesIncludingSensitive() throws Exception {
        Set<String> props = HmpProperties.getPropertyNames(true);

        assertThat(props.isEmpty(), is(false)); // 22 props at time of writing, arbitrarily testing for someTHING
        assertThat(props, hasItems(VERSION, BUILD_DATE, INFO_BUTTON_URL, SERVER_PORT_HTTPS)); // picked a few arbitrary ones
    }
}
