package gov.va.cpe.vpr.pom;

import com.codahale.metrics.json.MetricsModule;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.JacksonXmlModule;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import gov.va.cpe.vpr.ws.xml.POMObjectJacksonXmlAnnotations;
import gov.va.hmp.healthtime.jackson.HealthTimeModule;

import java.util.concurrent.TimeUnit;

public class POMXmlMapper extends XmlMapper {
    public POMXmlMapper() {
        JacksonXmlModule xmlModule = new JacksonXmlModule();
        xmlModule.setDefaultUseWrapper(false);

        registerModule(xmlModule);
//        registerModule(new JaxbAnnotationModule());
        registerModule(new HealthTimeModule());
        registerModule(new MetricsModule(TimeUnit.SECONDS, TimeUnit.MILLISECONDS, false));

        configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        configure(JsonGenerator.Feature.AUTO_CLOSE_TARGET, false);
        setSerializationInclusion(JsonInclude.Include.NON_NULL);

//        setAnnotationIntrospector(new JaxbAnnotationIntrospector(TypeFactory.defaultInstance()));

        addMixInAnnotations(IPOMObject.class, POMObjectJacksonXmlAnnotations.class);
    }
}
