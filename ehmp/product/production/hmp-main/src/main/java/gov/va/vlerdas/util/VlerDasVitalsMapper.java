package gov.va.vlerdas.util;


import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.JdsCode;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.VitalSign;
import gov.va.cpe.vpr.pom.JSONViews.JDBView;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.util.NullChecker;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.xml.XMLConstants;
import javax.xml.namespace.QName;

import org.apache.abdera.Abdera;
import org.apache.abdera.model.Document;
import org.apache.abdera.model.Entry;
import org.apache.abdera.model.Feed;
import org.apache.abdera.parser.Parser;
import org.apache.abdera.parser.stax.FOMContent;
import org.apache.axiom.om.OMElement;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The Mapper class for transforming the Atom feed to VistaDataChunks.
 *
 * @author r_rockenbaugh
 */
public final class VlerDasVitalsMapper {

    /** The Constant LOG. */
    private static final Logger LOG = LoggerFactory.getLogger(VlerDasVitalsMapper.class);

    /** The Site ID for generated vital data */
    public static final String SITE_ID = "DAS";

    /** The Constant DOMAIN_VITAL. */
    private static final String DOMAIN_VITAL = "vital";

    /** The H l7_ dat e_ formatter. */
    private static final SimpleDateFormat HL7_DATE_FORMATTER = new SimpleDateFormat("yyyyMMddhhmmss");

    /** The vlerdas date formatter. */
    private static final SimpleDateFormat VLERDAS_DATE_FORMATTER  = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    /** The Constant QNAME_NAMESPACE. */
    public static final String QNAME_NAMESPACE = "http://www.w3.org/2005/Atom";

    /** The Constant QNAME_PREFIX. */
    public static final String QNAME_PREFIX = XMLConstants.DEFAULT_NS_PREFIX;

    /** The Constant QNAME_VITALS. */
    public static final QName QNAME_VITALS = new QName(QNAME_NAMESPACE, "vitals", QNAME_PREFIX);

    /** The Constant QNAME_VITAL. */
    public static final QName QNAME_VITAL = new QName(QNAME_NAMESPACE, "vital", QNAME_PREFIX);

    /** The Constant QNAME_NAME. */
    public static final QName QNAME_NAME = new QName(QNAME_NAMESPACE, "name", QNAME_PREFIX);

    /** The Constant QNAME_CODE. */
    public static final QName QNAME_CODE = new QName(QNAME_NAMESPACE, "code", QNAME_PREFIX);

    /** The Constant QNAME_CODE_SYSTEM_NAME. */
    public static final QName QNAME_CODE_SYSTEM_NAME = new QName(QNAME_NAMESPACE, "code_system_name", QNAME_PREFIX);

    /** The Constant QNAME_IDENTIFIERS. */
    public static final QName QNAME_IDENTIFIERS = new QName(QNAME_NAMESPACE, "identifiers", QNAME_PREFIX);

    /** The Constant QNAME_IDENTIFIER. */
    public static final QName QNAME_IDENTIFIER = new QName(QNAME_NAMESPACE, "identifier", QNAME_PREFIX);

    /** The Constant QNAME_DATE. */
    public static final QName QNAME_DATE = new QName(QNAME_NAMESPACE, "date", QNAME_PREFIX);

    /** The Constant QNAME_VALUE. */
    public static final QName QNAME_VALUE = new QName(QNAME_NAMESPACE, "value", QNAME_PREFIX);

    /** The Constant QNAME_UNIT. */
    public static final QName QNAME_UNIT = new QName(QNAME_NAMESPACE, "unit", QNAME_PREFIX);

    public static final String PGD = "PGD";

    public static final String PGD_TEXT = "Patient Generated Data";
    /**
     * Instantiates a new vler das vitals mapper.
     */
    private VlerDasVitalsMapper() {
    }

    /**
     * Gets the vista data chunks.
     *
     * @param feedXml the feed xml
     * @param patientIds the patient ids
     * @return the vista data chunks
     */
    public static List<VistaDataChunk> getVistaDataChunks(String feedXml, PatientIds patientIds) {
        LOG.debug("getVistaDataChunks: feedXml: " + feedXml);
        List<VistaDataChunk> chunk = Collections.emptyList();

        InputStream is = null;
        try {
            is = IOUtils.toInputStream(feedXml, "UTF-8");
            chunk = getVistaDataChunks(is, patientIds);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            IOUtils.closeQuietly(is);
        }

        return chunk;
    }

    /**
     * Gets the vista data chunks.
     *
     * @param in the in
     * @param patientIds the patient ids
     * @return the vista data chunks
     */
    public static List<VistaDataChunk> getVistaDataChunks(InputStream in, PatientIds patientIds) {
        Abdera abdera = new Abdera();
        Parser parser = abdera.getParser();
        org.apache.abdera.model.Document<Feed> doc = parser.parse(in);
        return getVistaDataChunks(doc, patientIds);
    }

    /**
     * Retrieve DoD vital data and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param document the document
     * @param patientIds Patient identifier bean.
     * @return The VistaDataChunk list that contains the vital data.
     */
    public static List<VistaDataChunk> getVistaDataChunks(Document<Feed> document, PatientIds patientIds) {
        LOG.debug("started VlerDasVitalsMapper.getVistaDataChunks");

        List<VistaDataChunk> oaVitalChunk = new ArrayList<VistaDataChunk>();

        List<VitalSign> oaVital = transformFeed(document, patientIds);

        if ((oaVital != null) && (oaVital.size() > 0)) {

            int iNumVitals = oaVital.size();
            int iCurVitalIdx = 1;       // One based index
            for (VitalSign oVital : oaVital) {
                VistaDataChunk oVitalChunk = transformVitalChunk(oVital, patientIds, iNumVitals, iCurVitalIdx);
                if (oVitalChunk != null) {
                    oaVitalChunk.add(oVitalChunk);
                    iCurVitalIdx++;
                }
            }
        }

        LOG.debug("finished VlerDasVitalsMapper.getVistaDataChunks");
        return oaVitalChunk;
    }

    /**
     * Transform feed.
     *
     * @param document the document
     * @param patientIds the patient ids
     * @return the list
     */
    @SuppressWarnings("unchecked")
    private static List<VitalSign> transformFeed(Document<Feed> document, PatientIds patientIds) {
        List<VitalSign> list = new ArrayList<VitalSign>();

        Feed feed = document.getRoot();
        //should only have 1 entry
        if (feed.getEntries().iterator().hasNext()) {
            Entry entry = feed.getEntries().iterator().next();
            FOMContent content = (FOMContent) entry.getContentElement();
            Iterator<OMElement> vitalsIter = content.getChildrenWithName(QNAME_VITALS);
            while (vitalsIter.hasNext()) {
                OMElement vitalsElement = vitalsIter.next();
                VitalSign vitalSign = new VitalSign();
                transformCode(vitalSign, vitalsElement);
                transformUid(vitalSign, vitalsElement, patientIds);
                transformObserved(vitalSign, vitalsElement);
                transformResult(vitalSign, vitalsElement);
                transformUnits(vitalSign, vitalsElement);
                transformTypeName(vitalSign, vitalsElement);
                mapPatientGeneratedData(vitalSign);
                list.add(vitalSign);
            }
        }


        return list;
    }

    /**
     * Transform observed.
     *
     * @param vitalSign the vital sign
     * @param vitalsElement the vitals element
     */
    private static void transformObserved(VitalSign vitalSign, OMElement vitalsElement) {
        OMElement dateElement = vitalsElement.getFirstChildWithName(QNAME_DATE);
        dateElement = dateElement.getFirstChildWithName(QNAME_DATE);
        String dateValue = dateElement.getText();

        if (dateValue != null) {
            String formattedDate = format(dateValue);
            if (formattedDate != null) {
                vitalSign.setData("observed", formattedDate);
                vitalSign.setData("resulted", formattedDate);
            }

        }

    }

    /**
     * Transform units.
     *
     * @param vitalSign the vital sign
     * @param vitalsElement the vitals element
     */
    private static void transformUnits(VitalSign vitalSign, OMElement vitalsElement) {
        OMElement unitElement = vitalsElement.getFirstChildWithName(QNAME_UNIT);
        vitalSign.setData("units", unitElement.getText());
    }

    /**
     * Transform result.
     *
     * @param vitalSign the vital sign
     * @param vitalsElement the vitals element
     */
    private static void transformResult(VitalSign vitalSign, OMElement vitalsElement) {
        OMElement valueElement = vitalsElement.getFirstChildWithName(QNAME_VALUE);
        vitalSign.setData("result", valueElement.getText());
    }

    /**
     * Transform type name.
     *
     * @param vitalSign the vital sign
     * @param vitalsElement the vitals element
     */
    private static void transformTypeName(VitalSign vitalSign, OMElement vitalsElement) {
        OMElement vitalElement = vitalsElement.getFirstChildWithName(QNAME_VITAL);
        OMElement nameElement = vitalElement.getFirstChildWithName(QNAME_NAME);
        vitalSign.setData("typeName", nameElement.getText());
    }



    /**
     * Transform code.
     *
     * @param vitalSign the vital sign
     * @param vitalsElement the vitals element
     * @return the vital sign
     */
    protected static VitalSign transformCode(VitalSign vitalSign, OMElement vitalsElement) {

        OMElement vitalElement = vitalsElement.getFirstChildWithName(QNAME_VITAL);
        OMElement nameElement = vitalElement.getFirstChildWithName(QNAME_NAME);
        OMElement codeElement = vitalElement.getFirstChildWithName(QNAME_CODE);
        OMElement codeSystemNameElement = vitalElement.getFirstChildWithName(QNAME_CODE_SYSTEM_NAME);

        List<JdsCode> codes = new ArrayList<JdsCode>();
        JdsCode jdsCode = new JdsCode();
        jdsCode.setCode(codeElement.getText());
        jdsCode.setDisplay(nameElement.getText());
        jdsCode.setSystem(codeSystemNameElement.getText());
        codes.add(jdsCode);

        vitalSign.setCodes(codes);

        return vitalSign;
    }
    /**
     * Make any vitals retrieved from VlerDas service patient generated data
     */
    private static void mapPatientGeneratedData(VitalSign vitalSign) {
    	// GUI folks said they check facility fields rather than location
    	// So will set both location and facility fields
    	// They plan on keying off facilityCode field for PGD and using that 
    	// to show PGD in the "source" column - 3rd source in addition to DOD or VA
    	vitalSign.setData("facilityCode", PGD);
    	vitalSign.setData("facilityName", PGD_TEXT);
    	vitalSign.setData("locationCode", PGD);
    	vitalSign.setData("locationName", PGD_TEXT);
    	vitalSign.setData("patientGeneratedDataFlag", true);
    }

    /**
     * Transform uid.
     *
     * @param vitalSign the vital sign
     * @param vitalsElement the vitals element
     * @param patientIds the patient ids
     * @return the vital sign
     */
    protected static VitalSign transformUid(VitalSign vitalSign, OMElement vitalsElement, PatientIds patientIds) {


        OMElement identifiersElement = vitalsElement.getFirstChildWithName(QNAME_IDENTIFIERS);
        OMElement identifierElement = identifiersElement.getFirstChildWithName(QNAME_IDENTIFIER);

        String systemId = SITE_ID;

//        if (patientIds.getUid() != null) {
//            systemId = UidUtils.getSystemIdFromPatientUid(patientIds.getUid());
//        }

        vitalSign.setData("facilityName", SITE_ID);
        vitalSign.setData("facilityCode", SITE_ID);

        String sDfn = "";
        if (NullChecker.isNotNullish(patientIds.getPid())) {
            if (patientIds.getPid().indexOf(";") >= 0) {
                sDfn = PidUtils.getDfn(patientIds.getPid());
            }
            else {
                sDfn = patientIds.getPid();
            }
        }
        vitalSign.setData("uid", createUid(DOMAIN_VITAL, systemId, sDfn, identifierElement.getText()));


        return vitalSign;
    }

    /**
     * Create an instance of a VistaDataChunk that represents this vital.
     *
     * @param oVital The vital that was returned from JMeadows
     * @param oPatientIds Patient identifiers.
     * @param iNumVitals The number of vitals
     * @param iCurVitalIdx The index of this vital in the list.
     * @return The VistaDataChunk for this vital.
     */
    private static VistaDataChunk transformVitalChunk(VitalSign oVital, PatientIds oPatientIds, int iNumVitals, int iCurVitalIdx) {

        VistaDataChunk oVitalChunk = new VistaDataChunk();

        oVitalChunk.setBatch(false);
        oVitalChunk.setDomain(DOMAIN_VITAL);
        oVitalChunk.setItemCount(iNumVitals);
        oVitalChunk.setItemIndex(iCurVitalIdx);
//      oVitalChunk.setJson(null);

        String sSystemId = "";
        String sLocalPatientId = "";
        if (org.springframework.util.StringUtils.hasText(oPatientIds.getUid())) {
            sSystemId = UidUtils.getSystemIdFromPatientUid(oPatientIds.getUid());
            sLocalPatientId = UidUtils.getLocalPatientIdFromPatientUid(oPatientIds.getUid());
            oVitalChunk.setLocalPatientId(sLocalPatientId);
            oVitalChunk.setSystemId(sSystemId);

            HashMap<String, String> oParams = new HashMap<String, String>();
            oParams.put("vistaId", sSystemId);
            oParams.put("patientDfn", sLocalPatientId);
            oVitalChunk.setParams(oParams);
        }

        oVitalChunk.setPatientIcn(oPatientIds.getIcn());
        
        String siteLocalId = "";
        if (NullChecker.isNotNullish(oPatientIds.getIcn())) {
            siteLocalId = oPatientIds.getIcn();
        }
        else if (NullChecker.isNotNullish(oPatientIds.getEdipi())) {
            siteLocalId = "E" + oPatientIds.getEdipi();
        }
        
        oVitalChunk.setPatientId(PidUtils.getPid(SITE_ID, siteLocalId));
        oVitalChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
        oVitalChunk.setType(VistaDataChunk.NEW_OR_UPDATE);

        oVitalChunk.setContent(oVital.toJSON(JDBView.class));

        return oVitalChunk;
    }
    
    


    /**
     * Create a UID from the given values.
     *
     * @param sDomain The domain of the data to be stored.
     * @param sSystemId The Site iD
     * @param sPatientId the patient id
     * @param sEventId The record event ID
     * @return the string
     */
    private static String createUid(String sDomain, String sSystemId, String sPatientId, String sEventId) {
        return "urn:va:" + sDomain + ":" + sSystemId + ":" + sPatientId + ":" + sEventId;
    }

    /**
     * Formats the date for HL7.
     *
     * @param dateValue the date value
     * @return the string
     */
    private static synchronized String format(String dateValue) {
        String formattedDate = null;

        try {
            Date date = VLERDAS_DATE_FORMATTER.parse(dateValue);
            formattedDate = HL7_DATE_FORMATTER.format(date);
        } catch (ParseException e) {

            e.printStackTrace();
        }
        return formattedDate;
    }

}
