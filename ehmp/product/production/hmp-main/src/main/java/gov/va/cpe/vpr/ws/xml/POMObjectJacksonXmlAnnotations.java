package gov.va.cpe.vpr.ws.xml;

import javax.xml.bind.annotation.XmlAnyElement;
import javax.xml.bind.annotation.XmlTransient;
import java.util.Map;

/**
 * Jackson mix-in to add xml serialization annotations to {@link gov.va.cpe.vpr.pom.IPOMObject} objects.
 */
public interface POMObjectJacksonXmlAnnotations {
    @XmlTransient
    Map<String, Object> getData();

    @XmlAnyElement
    Map<String, Object> getProperties();
}
