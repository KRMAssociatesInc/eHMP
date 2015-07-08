package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.JdsCode;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.ProblemComment;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.JSONViews.JDBView;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.med.jmeadows.webservice.*;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static gov.va.jmeadows.JMeadowsClientUtils.*;

/**
 * JMeadows Problem Service
 */
@Service
public class JMeadowsProblemService implements IJMeadowsProblemService {

    public static final String DOMAIN_PROBLEM = "problem";
    static final Logger LOG = LoggerFactory.getLogger(JMeadowsProblemService.class);
    private JMeadowsData jMeadowsClient;

    /**
     * Constructs a JMeadowsProblemService instance.
     */
    @Autowired
    public JMeadowsProblemService(JMeadowsConfiguration jMeadowsConfiguration)
    {
        jMeadowsClient = JMeadowsClientFactory.getInstance(jMeadowsConfiguration);
    }

    /**
     * Sets JMeadowsClient
     * @param jMeadowsClient JMeadows client instance.
     */
    public void setJMeadowsClient(JMeadowsData jMeadowsClient)
    {
        this.jMeadowsClient = jMeadowsClient;
    }



    public List<VistaDataChunk> fetchDodPatientProblems(JMeadowsQuery query, PatientIds patientIds) throws JMeadowsException_Exception {

        LOG.debug("JMeadowsProblemService.fetchDodPatientProblems - Entering method...");

        List<VistaDataChunk> oaProblemChunk = new ArrayList<VistaDataChunk>();

        List<Problem> oaProblemResults = jMeadowsClient.getPatientProblemList(query);
        LOG.debug("JMeadowsProblemService.fetchPatientProblemList: " +
                ((oaProblemResults == null)? "NO" : "" + oaProblemResults.size()) +
                " Problems retrieved from JMeadows.");



        if ((oaProblemResults != null) && (oaProblemResults.size() > 0)) {

            oaProblemResults = (List<Problem>) filterOnSourceProtocol(oaProblemResults, SOURCE_PROTOCOL_DODADAPTER);
            int iNumProblems = calculateNumProblems(oaProblemResults);
            int oaProblemIdx = 1;		// One based index
            for(Problem oProblem : oaProblemResults)
            {

                VistaDataChunk oProblemChunk = transformProblemChunk((ProblemDetail)oProblem, patientIds, iNumProblems, oaProblemIdx);
                if (oProblemChunk != null) {
                    LOG.debug("JMeadowsProblemService.fetchPatientProblems: Found DoD Problem - Processing it... idx: " + oaProblemIdx);
                    oaProblemChunk.add(oProblemChunk);
                    oaProblemIdx++;
                }
            }
        }

        return oaProblemChunk;
    }


    /**
     * This routine will calculate the total number of problems that are in the result set.  It does this by
     * counting all the problems that are part of the DoD domain.  We ignore all that are from any VistA site.
     *
     * @param oaProblems The list of problems returned.
     * @return The number of problems that are from a DoD site.
     */
    private int calculateNumProblems(List<Problem> oaProblems) {

        int iNumProblems = 0;
        if ((oaProblems != null) && (oaProblems.size() > 0)) {
            for (Problem oaProblem : oaProblems) {
                iNumProblems++;
            }
        }

        return iNumProblems;
    }

    /**
     * Create an instance of a VistaDataChunk that represents this problem.
     *
     * @param oProblem The problem that was returned from JMeadows
     * @param oPatientIds Patient identifiers.
     * @param iNumProblems The number of allergies
     * @param iCurProblemIdx The index of this problem in the list.
     * @return The VistaDataChunk for this problem.
     */

    private VistaDataChunk transformProblemChunk(ProblemDetail oProblem, PatientIds oPatientIds, int iNumProblems, int iCurProblemIdx) {

        LOG.debug("JMeadowsProblemService.transformProblemChunk - Entering method...");

        VistaDataChunk oProblemChunk = new VistaDataChunk();

        oProblemChunk.setBatch(false);
        oProblemChunk.setDomain(DOMAIN_PROBLEM);
        oProblemChunk.setItemCount(iNumProblems);
        oProblemChunk.setItemIndex(iCurProblemIdx);

        String sSystemId = "";
        String sLocalPatientId = "";

        if (StringUtils.hasText(oPatientIds.getUid())) {
            sSystemId = UidUtils.getSystemIdFromPatientUid(oPatientIds.getUid());
            sLocalPatientId = UidUtils.getLocalPatientIdFromPatientUid(oPatientIds.getUid());
            oProblemChunk.setLocalPatientId(sLocalPatientId);
            oProblemChunk.setSystemId(sSystemId);

            HashMap<String, String> oParams = new HashMap<String, String>();
            oParams.put("vistaId", sSystemId);
            oParams.put("patientDfn", sLocalPatientId);
            oProblemChunk.setParams(oParams);
        }

        oProblemChunk.setPatientIcn(oPatientIds.getIcn());
        oProblemChunk.setPatientId(PidUtils.getPid("DOD", oPatientIds.getEdipi()));
        oProblemChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
        oProblemChunk.setType(VistaDataChunk.NEW_OR_UPDATE);

        oProblemChunk.setContent(transformProblemJson(oProblem, "DOD", oPatientIds.getEdipi()));

        return oProblemChunk;
    }

    /**
     * This method will transform the allergy from the DoD JMeadows format to the VPR format and return it as a
     * JSON string.
     *
     * @param oProblem The DoD JMeadows format of the data.
     * @param sSystemId The site system ID
     * @param sEdipi The patient EDIPI
     * @return The JSON for this allergy data in VPR format.
     */

    private String transformProblemJson(ProblemDetail oProblem, String sSystemId, String sEdipi) {

        LOG.debug("JMeadowsProblemService.transformProblemJson - Entering method...");

        gov.va.cpe.vpr.Problem oVprProblem = new gov.va.cpe.vpr.Problem();
        // Extract the codes
        //--------------------
        if (CollectionUtils.isNotEmpty(oProblem.getCodes())) {
            List<JdsCode> oaJdsCode = new ArrayList<JdsCode>();
            for (Code oCode : oProblem.getCodes()) {
                boolean bHasData = false;
                JdsCode oJdsCode = new JdsCode();
                if (org.apache.commons.lang.StringUtils.isNotEmpty(oCode.getCode())) {
                    oJdsCode.setCode(oCode.getCode());
                    bHasData = true;
                }
                if (org.apache.commons.lang.StringUtils.isNotEmpty(oCode.getSystem())) {
                    JLVTerminologySystem termSystem = JLVTerminologySystem.getSystemByName(oCode.getSystem());

                    //pass OID urn if one exists
                    if (termSystem != null) {
                        oJdsCode.setSystem(termSystem.getUrn());
                    }
                    //default to code system display name
                    else oJdsCode.setSystem(oCode.getSystem());

                    bHasData = true;
                }
                if (org.apache.commons.lang.StringUtils.isNotEmpty(oCode.getDisplay())) {
                    oJdsCode.setDisplay(oCode.getDisplay());
                    bHasData = true;
                }
                if (bHasData) {
                    oaJdsCode.add(oJdsCode);
                }
            }

            if (CollectionUtils.isNotEmpty(oaJdsCode)) {
                oVprProblem.setData("codes", oaJdsCode);
            }
        }

        //do transformation
        oVprProblem.setData("facilityCode", sSystemId);
        oVprProblem.setData("facilityName", sSystemId);
        oVprProblem.setData("locationName", oProblem.getHospitalLocation());

        if(oProblem.getDescription() != null)
            oVprProblem.setData("problemText", oProblem.getDescription());
        else
            oVprProblem.setData("problemText", "NULL");

        oVprProblem.setData("providerName", oProblem.getEnteredBy());
        oVprProblem.setData("providerDisplayName", oProblem.getEnteredBy());
        oVprProblem.setData("icdCode", oProblem.getIcdCode());
        oVprProblem.setData("statusName", oProblem.getStatus());
        oVprProblem.setData("acuityName", oProblem.getAcuity());

        if(oProblem.getEnteredDate() != null)
            oVprProblem.setData("entered", calendarToPointInTime(oProblem.getEnteredDate()));

        if(oProblem.getLastModifiedDate() != null)
            oVprProblem.setData("updated", calendarToPointInTime(oProblem.getLastModifiedDate()));

        if(oProblem.getOnsetDate() != null)
            oVprProblem.setData("onset", calendarToPointInTime(oProblem.getOnsetDate()));


        List<ProblemNote> notes = oProblem.getNotes();

        if(notes != null)
        {
            List<ProblemComment> comments = new ArrayList<ProblemComment>();

            for(ProblemNote note : notes)
            {
                ProblemComment oVprComment = new ProblemComment();
                oVprComment.setData("comment", note.getNoteText());

                comments.add(oVprComment);
            }

            oVprProblem.setData("comments", comments);
        }

        oVprProblem.setData("uid", UidUtils.getProblemUid(sSystemId, sEdipi, oProblem.getCdrEventId()));

        String sProblemJson = oVprProblem.toJSON(JDBView.class);
        LOG.debug("JMeadowsProblemService.transformProblemJson - Returning JSON String: " + sProblemJson);
        return sProblemJson;
    }
}
