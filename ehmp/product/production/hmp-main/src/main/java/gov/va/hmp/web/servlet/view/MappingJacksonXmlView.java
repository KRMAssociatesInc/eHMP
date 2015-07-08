package gov.va.hmp.web.servlet.view;

import gov.va.cpe.vpr.pom.POMXmlMapper;

public class MappingJacksonXmlView extends MappingJacksonJsonView {

    public static final String CONTENT_TYPE = "application/xml";

    public MappingJacksonXmlView() {
        super();
        setContentType(CONTENT_TYPE);
        setObjectMapper(new POMXmlMapper());
    }
}
