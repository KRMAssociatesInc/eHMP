package gov.va.cpe.vpr.sync.hdr;

import static gov.va.hmp.util.NullChecker.isNotNullish;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.healthtime.PointInTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class HdrExtractDAO implements IHdrExtractDAO, EnvironmentAware {
    private static final Logger LOG = LoggerFactory.getLogger(HdrExtractDAO.class);

    private String hdrBaseUrl;
    private String hdrUrlStyle;
    private Boolean hdrEnabled = false;
    private SAXParser xmlParser;
    private Environment environment;

    public HdrExtractDAO() {
        // disable external entity resolution to avoid security issue
        try {
            SAXParserFactory fact = SAXParserFactory.newInstance();
            fact.setFeature("http://javax.xml.XMLConstants/feature/secure-processing", true);
            fact.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            xmlParser = fact.newSAXParser();
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;

        this.hdrEnabled = environment.getProperty(HmpProperties.HDR_ENABLED, Boolean.class, false);
        this.hdrBaseUrl = environment.getRequiredProperty(HmpProperties.HDR_BASEURL);
        this.hdrUrlStyle = environment.getProperty(HmpProperties.HDR_URLSTYLE);
    }

    @Override
    public List<VistaDataChunk> fetchHdrData(String vistaId, String division, PatientDemographics pt, String domain) throws Exception {
        if (!hdrEnabled) return Collections.emptyList();

        String composedUrl = hdrBaseUrl + domain.toUpperCase() + "?clientName=HMP&clientRequestInitiationTime=" + PointInTime.now().toString()
                             + "&requestId=65756756&nationalId=" + pt.getIcn() + "&excludeIdentifier=" + pt.getPid() + "-" + division + "-USVHA"
                             + "&max=100&_type=xml&templateId=GenericObservationRead1&filterId=GENERIC_VISTA_LIST_DATA_FILTER";
        if (isNotNullish(hdrUrlStyle) && hdrUrlStyle.equalsIgnoreCase("old")) {
            composedUrl = hdrBaseUrl + "GenericObservationRead1/GENERIC_VISTA_LIST_DATA_FILTER/" + pt.getIcn() + "/" + domain 
                          + "?_type=json&max=100&clientName=HMP&excludedAssigningFacility=" + division + "&excludedAssigningAuthority=USVHA&requestId=65756756";
        }
        HdrSAXParseHandler hndlr = new HdrSAXParseHandler(vistaId, composedUrl, domain, pt);

        URL url = new URL(composedUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        try (InputStream inputstream = conn.getInputStream()) {
            xmlParser.parse(inputstream, hndlr);
        }
        return hndlr.getDataChunks();
    }

    private static class HdrSAXParseHandler extends DefaultHandler {
        private boolean procVal = false;
        private String url = null;
        private String vistaId = null;
        private String domain = null;
        private PatientDemographics pt = null;
        private  List<VistaDataChunk> chunks = new ArrayList<VistaDataChunk>();

        private HdrSAXParseHandler(String vistaId, String url, String domain, PatientDemographics pt) {
            this.url = url;
            this.vistaId = vistaId;
            this.domain = domain;
            this.pt = pt;
        }

        public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
            if (qName.equalsIgnoreCase("OBSERVATIONVALUE")) {
                procVal = true;
            }
        }

        public void endElement(String uri, String localName, String qName) throws SAXException {
            if (qName.equalsIgnoreCase("OBSERVATIONVALUE")) {
                procVal = false;
            }
        }

        public void characters(char ch[], int start, int length) throws SAXException {
            if (procVal) {
                try {
                    String rawJson = new String(ch);
                    JsonNode json = POMUtils.parseJSONtoNode(rawJson);
                    chunks.addAll(VistaDataChunk.createVistaDataChunks(vistaId, url, json, domain, pt, null));
                } catch (RuntimeException e) {
                    LOG.error("Couldn't parse the junk returned from " + url, e);
                }
            }
        }

        public List<VistaDataChunk> getDataChunks() {
            return chunks;
        }
    }
}
