package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.JdsCode;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.JSONViews.JDBView;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.med.jmeadows.webservice.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.xml.datatype.XMLGregorianCalendar;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.PATIENT;
import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.USER;
import static gov.va.jmeadows.JMeadowsClientUtils.*;

/**
 * JMeadows Immunization Retriever Service
 */
@Service
public class JMeadowsImmunizationService implements IJMeadowsImmunizationService {

    public static final String DOMAIN_IMMUNIZATION = "immunization";
    private static final Logger LOG = LoggerFactory.getLogger(JMeadowsImmunizationService.class);
    private JMeadowsData jMeadowsClient;

    /**
     * Constructs a JMeadowsImmunizationService instance.
     */
    @Autowired
    public JMeadowsImmunizationService(JMeadowsConfiguration jMeadowsConfiguration) {
        jMeadowsClient = JMeadowsClientFactory.getInstance(jMeadowsConfiguration);
    }

    /**
     * Sets JMeadowsClient
     * @param jMeadowsClient JMeadows client instance.
     */
    public void setJMeadowsClient(JMeadowsData jMeadowsClient) {
        this.jMeadowsClient = jMeadowsClient;
    }

    /**
     * This routine will calculate the total number of immunizations that are in the result set.  It does this by
     * counting all the immunizations that are part of the DoD domain.  We ignore all that are from any VistA site.
     *
     * @param oaImmunization The list of immunizations returned.
     * @return The number of immunizations that are from a DoD site.
     */
    private int calculateNumImmunizations(List<Immunization> oaImmunization) {
        int iNumImmunizations = 0;

        if ((oaImmunization != null) && (oaImmunization.size() > 0)) {
            for (Immunization oImmunization : oaImmunization) {
                iNumImmunizations++;
            }
        }

        return iNumImmunizations;
    }

    /**
     * Retrieve DoD immunization data and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param query JMeadows query bean.
     * @param patientIds Patient identifier bean.
     * @return The VistaDataChunk list that contains the immunization data.
     * @throws gov.va.med.jmeadows.webservice.JMeadowsException_Exception If a serious error occurs.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
     */
    @Override
    public List<VistaDataChunk> fetchDodPatientImmunizations(JMeadowsQuery query, PatientIds patientIds) throws JMeadowsException_Exception {
        LOG.debug("JMeadowsImmunizationService.fetchDodPatientImmunizations - Entering method...");

        validateParams(query, patientIds, USER, PATIENT);

        List<VistaDataChunk> oaImmunizationChunk = new ArrayList<VistaDataChunk>();

        List<Immunization> oaImmunization = jMeadowsClient.getPatientImmunizations(query);
        LOG.debug("JMeadowsImmunizationService.fetchDodPatientImmunizations: " +
                ((oaImmunization == null)? "NO" : ""+oaImmunization.size()) +
                " results retrieved from JMeadows.");

        if ((oaImmunization != null) && (oaImmunization.size() > 0)) {

            //remove DoD adaptor status report
            oaImmunization = (List<Immunization>) filterOnSourceProtocol(oaImmunization, SOURCE_PROTOCOL_DODADAPTER);

            int iNumImmunizations = calculateNumImmunizations(oaImmunization);
            int iCurImmunizationIdx = 1;		// One based index
            for (Immunization oImmunization : oaImmunization) {
                LOG.debug("JMeadowsImmunizationService.fetchDodPatientImmunizations: Found DoD Immunization - Processing it... idx: " + iCurImmunizationIdx);
                VistaDataChunk oImmunizationChunk = transformImmunizationChunk(oImmunization, patientIds, iNumImmunizations, iCurImmunizationIdx);
                if (oImmunizationChunk != null) {
                    oaImmunizationChunk.add(oImmunizationChunk);
                    iCurImmunizationIdx++;
                }
            }
        }


        return oaImmunizationChunk;
    }

    /**
     * Create an instance of a VistaDataChunk that represents this immunization.
     *
     * @param oImmunization The immunization that was returned from JMeadows
     * @param oPatientIds Patient identifiers.
     * @param iNumImmunizations The number of immunizations
     * @param iCurImmunizationIdx The index of this Immunization in the list.
     * @return The VistaDataChunk for this immunization.
     */
    private VistaDataChunk transformImmunizationChunk(Immunization oImmunization, PatientIds oPatientIds, int iNumImmunizations, int iCurImmunizationIdx) {
        LOG.debug("JMeadowsImmunizationService.transformImmunizationChunk - Entering method...");
        VistaDataChunk oImmunizationChunk = new VistaDataChunk();

        oImmunizationChunk.setBatch(false);
        oImmunizationChunk.setDomain(DOMAIN_IMMUNIZATION);
        oImmunizationChunk.setItemCount(iNumImmunizations);
        oImmunizationChunk.setItemIndex(iCurImmunizationIdx);
        //		oImmunizationChunk.setJson(null);

        String sSystemId = "";
        String sLocalPatientId = "";
        if (org.springframework.util.StringUtils.hasText(oPatientIds.getUid())) {
            sSystemId = UidUtils.getSystemIdFromPatientUid(oPatientIds.getUid());
            sLocalPatientId = UidUtils.getLocalPatientIdFromPatientUid(oPatientIds.getUid());
            oImmunizationChunk.setLocalPatientId(sLocalPatientId);
            oImmunizationChunk.setSystemId(sSystemId);

            HashMap<String, String> oParams = new HashMap<String, String>();
            oParams.put("vistaId", sSystemId);
            oParams.put("patientDfn", sLocalPatientId);
            oImmunizationChunk.setParams(oParams);
        }

        oImmunizationChunk.setPatientIcn(oPatientIds.getIcn());
        oImmunizationChunk.setPatientId(PidUtils.getPid("DOD", oPatientIds.getEdipi()));
        oImmunizationChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
        oImmunizationChunk.setType(VistaDataChunk.NEW_OR_UPDATE);

        oImmunizationChunk.setContent(transformImmunizationJson(oImmunization, "DOD", oPatientIds.getEdipi()));

        return oImmunizationChunk;
    }

    /**
     * This method will transform the immunization from the DoD JMeadows format to the VPR format and return it as a
     * JSON string.
     *
     * @param oImmunization The DoD JMeadows format of the data.
     * @param sSystemId The site system ID
     * @param sEdipi The patient EDIPI
     * @return The JSON for this immunization data in VPR format.
     */
    private String transformImmunizationJson(Immunization oImmunization, String sSystemId, String sEdipi) {
        LOG.debug("JMeadowsImmunizationService.transformImmunizationJson - Entering method...");

        gov.va.cpe.vpr.Immunization oVprImmunization = new gov.va.cpe.vpr.Immunization();

        // Extract the codes
        //--------------------
        if (CollectionUtils.isNotEmpty(oImmunization.getCodes())) {
            List<JdsCode> oaJdsCode = new ArrayList<JdsCode>();
            for (Code oCode : oImmunization.getCodes()) {
                boolean bHasData = false;
                JdsCode oJdsCode = new JdsCode();
                if (StringUtils.isNotEmpty(oCode.getCode())) {
                    oJdsCode.setCode(oCode.getCode());
                    bHasData = true;
                }
                if (StringUtils.isNotEmpty(oCode.getSystem())) {
                    JLVTerminologySystem termSystem = JLVTerminologySystem.getSystemByName(oCode.getSystem());

                    //pass OID urn if one exists
                    if (termSystem != null) {
                        oJdsCode.setSystem(termSystem.getUrn());
                    }
                    //default to code system display name
                    else oJdsCode.setSystem(oCode.getSystem());

                    bHasData = true;
                }
                if (StringUtils.isNotEmpty(oCode.getDisplay())) {
                    oJdsCode.setDisplay(oCode.getDisplay());
                    bHasData = true;
                }
                if (bHasData) {
                    oaJdsCode.add(oJdsCode);
                }
            }

            if (CollectionUtils.isNotEmpty(oaJdsCode)) {
                oVprImmunization.setData("codes", oaJdsCode);
            }
        }

        if(oImmunization.getDateTime() != null)
        {
            oVprImmunization.setData("administeredDateTime", calendarToPointInTime(oImmunization.getDateTime()));
        }

        oVprImmunization.setData("name", oImmunization.getName());
        oVprImmunization.setData("seriesName", oImmunization.getSeries());

        oVprImmunization.setData("facilityName", sSystemId);
        oVprImmunization.setData("facilityCode", sSystemId);

        oVprImmunization.setData("uid", UidUtils.getImmunizationUid(sSystemId, sEdipi, oImmunization.getCdrEventId()));

        String sImmunizationJson = oVprImmunization.toJSON(JDBView.class);
        LOG.debug("JMeadowsImmunizationService.transformImmunizationJson - Returning JSON String: " + sImmunizationJson);
        return sImmunizationJson;
    }

    private PointInTime calendarToPointInTime(XMLGregorianCalendar calendar)
    {
        if(calendar != null)
            return new PointInTime(formatCalendar(calendar.toGregorianCalendar()));

        return null;
    }

}
