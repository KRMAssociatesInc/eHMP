package gov.va.hmp.healthtime.jackson;

import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.hmp.healthtime.jackson.HealthTimeModule;
import org.junit.Before;

public class HealthTimeModuleTestBase {
    protected ObjectMapper jsonMapper;

    @Before
    public void setUp() throws Exception {
        jsonMapper = new ObjectMapper();
        jsonMapper.registerModule(new HealthTimeModule());

    }
}
