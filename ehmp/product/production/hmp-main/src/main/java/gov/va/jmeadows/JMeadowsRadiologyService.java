package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.Procedure;
import gov.va.cpe.vpr.pom.JSONViews.JDBView;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.med.jmeadows.webservice.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.PATIENT;
import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.USER;
import static gov.va.jmeadows.JMeadowsClientUtils.*;

/**
 * JMeadows Radiology Report Retriever Service
 */
@Service
public class JMeadowsRadiologyService implements IJMeadowsRadiologyService {

    public static final String DOMAIN_RADIOLOGY = "image";
    private static final Logger LOG = LoggerFactory.getLogger(JMeadowsRadiologyService.class);
    private JMeadowsData jMeadowsClient;

    /**
     * Constructs a JMeadowsRadiologyService instance.
     */
    @Autowired
    public JMeadowsRadiologyService(JMeadowsConfiguration jMeadowsConfiguration) {
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
     * This routine will calculate the total number of radiology reports that are in the result set.  It does this by
     * counting all the radiology reports that are part of the DoD domain.  We ignore all that are from any VistA site.
     *
     * @param oaRad The list of reports returned.
     * @return The number of radiology reports that are from a DoD site.
     */
    private int calculateNumRadiologyReports(List<RadiologyReport> oaRad) {
        int iNumRad = 0;

        if ((oaRad != null) && (oaRad.size() > 0)) {
            for (RadiologyReport oRad : oaRad) {
                iNumRad++;
            }
        }

        return iNumRad;
    }

    /**
     * Retrieve DoD radiology report and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param query JMeadows query bean.
     * @param patientIds Patient identifier bean.
     * @return The VistaDataChunk list that contains the radiology data.
     * @throws gov.va.med.jmeadows.webservice.JMeadowsException_Exception If a serious error occurs.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
     */
    @Override
    public List<VistaDataChunk> fetchDodPatientRadiologyReports(JMeadowsQuery query, PatientIds patientIds) throws JMeadowsException_Exception {
        LOG.debug("JMeadowsRadiologyService.fetchDodPatientRadiologyReports - Entering method...");

        validateParams(query, patientIds, USER, PATIENT);

        List<VistaDataChunk> oaRadChunk = new ArrayList<VistaDataChunk>();

        List<RadiologyReport> oaRads = jMeadowsClient.getPatientRads(query);
        LOG.debug("JMeadowsRadiologyService.fetchDodPatientRadiologyReports: " +
                ((oaRads == null)? "NO" : ""+oaRads.size()) +
                " results retrieved from JMeadows.");

        if ((oaRads != null) && (oaRads.size() > 0)) {

            //remove DoD adaptor status report
            oaRads = (List<RadiologyReport>) filterOnSourceProtocol(oaRads, SOURCE_PROTOCOL_DODADAPTER);

            int iNumRads = calculateNumRadiologyReports(oaRads);
            int iCurRadIdx = 1;		// One based index
            for (RadiologyReport oRad : oaRads) {
                LOG.debug("JMeadowsRadiologyService.fetchDodPatientRadiologyReports: Found DoD Radiology Report - Processing it... idx: " + iCurRadIdx);
                VistaDataChunk oRadChunk = transformRadiologyChunk(oRad, patientIds, iNumRads, iCurRadIdx);
                if (oRadChunk != null) {
                    oaRadChunk.add(oRadChunk);
                    iCurRadIdx++;
                }
            }
        }


        return oaRadChunk;
    }

    /**
     * Create an instance of a VistaDataChunk that represents this radiology report.
     *
     * @param oRad The radiology report that was returned from JMeadows
     * @param oPatientIds Patient identifiers.
     * @param iNumRads The number of radiology reports
     * @param iCurRadIdx The index of this radiology report in the list.
     * @return The VistaDataChunk for this radiology report.
     */
    private VistaDataChunk transformRadiologyChunk(RadiologyReport oRad, PatientIds oPatientIds, int iNumRads, int iCurRadIdx) {
        LOG.debug("JMeadowsRadiologyService.transformRadiologyChunk - Entering method...");
        VistaDataChunk oRadChunk = new VistaDataChunk();

        oRadChunk.setBatch(false);
        oRadChunk.setDomain(DOMAIN_RADIOLOGY);
        oRadChunk.setItemCount(iNumRads);
        oRadChunk.setItemIndex(iCurRadIdx);

        String sSystemId = "";
        String sLocalPatientId = "";
        if (org.springframework.util.StringUtils.hasText(oPatientIds.getUid())) {
            sSystemId = UidUtils.getSystemIdFromPatientUid(oPatientIds.getUid());
            sLocalPatientId = UidUtils.getLocalPatientIdFromPatientUid(oPatientIds.getUid());
            oRadChunk.setLocalPatientId(sLocalPatientId);
            oRadChunk.setSystemId(sSystemId);

            HashMap<String, String> oParams = new HashMap<String, String>();
            oParams.put("vistaId", sSystemId);
            oParams.put("patientDfn", sLocalPatientId);
            oRadChunk.setParams(oParams);
        }

        oRadChunk.setPatientIcn(oPatientIds.getIcn());
        oRadChunk.setPatientId(PidUtils.getPid("DOD", oPatientIds.getEdipi()));
        oRadChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
        oRadChunk.setType(VistaDataChunk.NEW_OR_UPDATE);

        oRadChunk.setContent(transformRadiologyJson(oRad, "DOD", oPatientIds.getEdipi()));

        return oRadChunk;
    }

    /**
     * This method will transform the radiology report from the DoD JMeadows format to the VPR format and return it as a
     * JSON string.
     *
     * @param oRad The DoD JMeadows format of the data.
     * @param sSystemId The site system ID
     * @param sEdipi The patient EDIPI
     * @return The JSON for this radiology report in VPR format.
     */
    private String transformRadiologyJson(RadiologyReport oRad, String sSystemId, String sEdipi) {

        LOG.debug("JMeadowsRadiologyService.transformRadiologyJson - Entering method...");

        Procedure oVprProc = new Procedure();

        // Extract the codes
        //--------------------
        if (CollectionUtils.isNotEmpty(oRad.getCodes())) {
            List<JdsCode> oaJdsCode = new ArrayList<JdsCode>();
            for (Code oCode : oRad.getCodes()) {
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
                oVprProc.setData("codes", oaJdsCode);
            }
        }

        oVprProc.setData("facilityCode", sSystemId);
        oVprProc.setData("facilityName", sSystemId);

        Map<String, Object> reportTextData = parseRadiologyReportText(oRad.getReportText());

        if(reportTextData.containsKey("Requesting Location"))
        {
            oVprProc.setData("imageLocation", reportTextData.get("Requesting Location"));
            oVprProc.setData("locationName", reportTextData.get("Requesting Location"));
        }

        if(reportTextData.containsKey("Status"))
        {
            oVprProc.setData("statusName", reportTextData.get("Status"));
        }else
        {
            oVprProc.setData("statusName", "Not Available");
        }



        oVprProc.setData("name", oRad.getStudy());
        oVprProc.setData("typeName", "RADIOLOGIC EXAMINATION, " + oRad.getStudy());

        oVprProc.setData("kind", "Radiology");
        oVprProc.setData("localId", oRad.getAccessionNumber());
        oVprProc.setData("encounterUid", oRad.getExamId());
        oVprProc.setData("dateTime", calendarToPointInTime(oRad.getExamDate()));
        oVprProc.setData("hasImages", false);

        oVprProc.setData("reason", oRad.getReasonForOrder());
        oVprProc.setData("status", oRad.getStatus());
        oVprProc.setData("category", "RA");

        List<ProcedureProvider> providerList = new ArrayList<ProcedureProvider>();
        ProcedureProvider provider = new ProcedureProvider();
        provider.setData("providerName", oRad.getInterpretingHCP());
        provider.setData("providerDisplayName", oRad.getInterpretingHCP());

        providerList.add(provider);

        oVprProc.setData("providers", providerList);

        List<ProcedureResult> resultList = new ArrayList<ProcedureResult>();
        ProcedureResult result = new ProcedureResult();
        result.setData("localTitle", oRad.getStudy());
        if(reportTextData.containsKey("Result Code"))
        {
             result.setData("report", oRad.getReportText());
        }


        resultList.add(result);

        oVprProc.setData("results", resultList);

        oVprProc.setData("uid", UidUtils.getRadiologyUid(sSystemId, sEdipi, oRad.getCdrEventId()));

        String sRadJson = oVprProc.toJSON(JDBView.class);
        LOG.debug("JMeadowsRadiologyService.transformRadiologyJson - Returning JSON String: " + sRadJson);

        return sRadJson;
    }

    private Map<String, Object> parseRadiologyReportText(String reportText)
    {

        Map<String, Object> map = new HashMap<String, Object>();

        String [] split = reportText.split("\n");

        int i = 0,
            len = split.length;

        while (i < len)
        {
            String item = split[i];
            String [] pair = item.split(":");

            if(pair.length == 2)
            {
                String key = pair[0];
                String val = pair[1];

                map.put(key, val);
            }

            i++;
        }

        return map;

    }



}

