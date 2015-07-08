package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.AllergyComment;
import gov.va.cpe.vpr.AllergyProduct;
import gov.va.cpe.vpr.JdsCode;
import gov.va.cpe.vpr.PidUtils;
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
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.PATIENT;
import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.USER;
import static gov.va.jmeadows.JMeadowsClientUtils.*;

/**
 * JMeadows Allergy Retriever Service
 */
@Service
public class JMeadowsAllergyService implements IJMeadowsAllergyService {
    public static final String DOMAIN_ALLERGY = "allergy";
    private static final Logger LOG = LoggerFactory.getLogger(JMeadowsAllergyService.class);
    private JMeadowsData jMeadowsClient;

    /**
     * Constructs a JMeadowsAllergyService instance.
     */
    @Autowired
    public JMeadowsAllergyService(JMeadowsConfiguration jMeadowsConfiguration) {
        jMeadowsClient = JMeadowsClientFactory.getInstance(jMeadowsConfiguration);
    }

    /**
     * Sets JMeadowsClient
     *
     * @param jMeadowsClient JMeadows client instance.
     */
    public void setJMeadowsClient(JMeadowsData jMeadowsClient) {
        this.jMeadowsClient = jMeadowsClient;
    }

    /**
     * This routine will calculate the total number of allergies that are in the result set.  It does this by
     * counting all the allergies that are part of the DoD domain.  We ignore all that are from any VistA site.
     *
     * @param oaAllergy The list of allergies returned.
     * @return The number of allergies that are from a DoD site.
     */
    private int calculateNumAllergies(List<Allergy> oaAllergy) {
        int iNumAllergies = 0;

        if ((oaAllergy != null) && (oaAllergy.size() > 0)) {
            for (Allergy oAllergy : oaAllergy) {
                iNumAllergies++;
            }
        }

        return iNumAllergies;
    }

    /**
     * Retrieve DoD allergy data and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param query      JMeadows query bean.
     * @param patientIds Patient identifier bean.
     * @return The VistaDataChunk list that contains the allergy data.
     * @throws JMeadowsException_Exception If a serious error occurs.
     * @throws IllegalArgumentException    if required parameters are missing or invalid.
     */
    @Override
    public List<VistaDataChunk> fetchDodPatientAllergies(JMeadowsQuery query, PatientIds patientIds) throws JMeadowsException_Exception {
        LOG.debug("JMeadowsAllergyService.fetchDodPatientAllergies - Entering method...");

        validateParams(query, patientIds, USER, PATIENT);

        List<VistaDataChunk> oaAllergyChunk = new ArrayList<VistaDataChunk>();

        List<Allergy> oaAllergy = jMeadowsClient.getPatientAllergies(query);
        LOG.debug("JMeadowsAllergyService.fetchDodPatientAllergies: " +
                ((oaAllergy == null) ? "NO" : "" + oaAllergy.size()) +
                " results retrieved from JMeadows.");

        if ((oaAllergy != null) && (oaAllergy.size() > 0)) {

            //remove DoD adaptor status report
            oaAllergy = (List<Allergy>) filterOnSourceProtocol(oaAllergy, SOURCE_PROTOCOL_DODADAPTER);

            int iNumAllergies = calculateNumAllergies(oaAllergy);
            int iCurAllergyIdx = 1;        // One based index
            for (Allergy oAllergy : oaAllergy) {
                LOG.debug("JMeadowsAllergyService.fetchDodPatientAllergies: Found DoD Allergy - Processing it... idx: " + iCurAllergyIdx);
                VistaDataChunk oAllergyChunk = transformAllergyChunk(oAllergy, patientIds, iNumAllergies, iCurAllergyIdx);
                if (oAllergyChunk != null) {
                    oaAllergyChunk.add(oAllergyChunk);
                    iCurAllergyIdx++;
                }
            }
        }


        return oaAllergyChunk;
    }

    /**
     * Create an instance of a VistaDataChunk that represents this allergy.
     *
     * @param oAllergy       The allergy that was returned from JMeadows
     * @param oPatientIds    Patient identifiers.
     * @param iNumAllergies  The number of allergies
     * @param iCurAllergyIdx The index of this allergy in the list.
     * @return The VistaDataChunk for this allergy.
     */
    private VistaDataChunk transformAllergyChunk(Allergy oAllergy, PatientIds oPatientIds, int iNumAllergies, int iCurAllergyIdx) {
        LOG.debug("JMeadowsAllergyService.transformAllergyChunk - Entering method...");
        VistaDataChunk oAllergyChunk = new VistaDataChunk();

        oAllergyChunk.setBatch(false);
        oAllergyChunk.setDomain(DOMAIN_ALLERGY);
        oAllergyChunk.setItemCount(iNumAllergies);
        oAllergyChunk.setItemIndex(iCurAllergyIdx);
        //		oAllergyChunk.setJson(null);

        String sSystemId = "";
        String sLocalPatientId = "";
        if (StringUtils.hasText(oPatientIds.getUid())) {
            sSystemId = UidUtils.getSystemIdFromPatientUid(oPatientIds.getUid());
            sLocalPatientId = UidUtils.getLocalPatientIdFromPatientUid(oPatientIds.getUid());
            oAllergyChunk.setLocalPatientId(sLocalPatientId);
            oAllergyChunk.setSystemId(sSystemId);

            HashMap<String, String> oParams = new HashMap<String, String>();
            oParams.put("vistaId", sSystemId);
            oParams.put("patientDfn", sLocalPatientId);
            oAllergyChunk.setParams(oParams);
        }

        oAllergyChunk.setPatientIcn(oPatientIds.getIcn());
        oAllergyChunk.setPatientId(PidUtils.getPid("DOD", oPatientIds.getEdipi()));
        oAllergyChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
        oAllergyChunk.setType(VistaDataChunk.NEW_OR_UPDATE);

        oAllergyChunk.setContent(transformAllergyJson(oAllergy, "DOD", oPatientIds.getEdipi()));

        return oAllergyChunk;
    }

    /**
     * This method will transform the allergy from the DoD JMeadows format to the VPR format and return it as a
     * JSON string.
     *
     * @param oAllergy  The DoD JMeadows format of the data.
     * @param sSystemId The site system ID
     * @param sEdipi    The patient EDIPI
     * @return The JSON for this allergy data in VPR format.
     */
    private String transformAllergyJson(Allergy oAllergy, String sSystemId, String sEdipi) {

        LOG.debug("JMeadowsAllergyService.transformAllergyJson - Entering method...");
        gov.va.cpe.vpr.Allergy oVprAllergy = new gov.va.cpe.vpr.Allergy();

        List<AllergyProduct> oaProduct = new ArrayList<AllergyProduct>();
        AllergyProduct oProduct = new AllergyProduct();
        oaProduct.add(oProduct);

        if ((oAllergy.getAllergyName() != null) && (oAllergy.getAllergyName().length() > 0)) {
            oProduct.setData("name", oAllergy.getAllergyName());
        }
        oVprAllergy.setData("products", oaProduct);

        // Extract the codes
        //--------------------
        if ((oAllergy.getCodes() != null) &&
                (oAllergy.getCodes().size() > 0)) {
            List<JdsCode> oaJdsCode = new ArrayList<JdsCode>();
            for (Code oCode : oAllergy.getCodes()) {
                boolean bHasData = false;
                JdsCode oJdsCode = new JdsCode();
                if ((oCode.getCode() != null) && (oCode.getCode().length() > 0)) {
                    oJdsCode.setCode(oCode.getCode());
                    bHasData = true;
                }

                if ((oCode.getSystem() != null) && (oCode.getSystem().length() > 0)) {

                    JLVTerminologySystem termSystem = JLVTerminologySystem.getSystemByName(oCode.getSystem());

                    //pass OID urn if one exists
                    if (termSystem != null) {
                        oJdsCode.setSystem(termSystem.getUrn());
                    }
                    //default to code system display name
                    else oJdsCode.setSystem(oCode.getSystem());

                    bHasData = true;
                }

                if ((oCode.getDisplay() != null) && (oCode.getDisplay().length() > 0)) {
                    oJdsCode.setDisplay(oCode.getDisplay());
                    bHasData = true;
                }

                if (bHasData) {
                    oaJdsCode.add(oJdsCode);
                }
            }

            if (CollectionUtils.isNotEmpty(oaJdsCode)) {
                oVprAllergy.setData("codes", oaJdsCode);
            }
        }


        if ((oAllergy.getComment() != null) && (oAllergy.getComment().length() > 0)) {
            AllergyComment allergyComment = new AllergyComment();
            allergyComment.setData("comment", oAllergy.getComment());
            List<AllergyComment> allergyCommentList = Arrays.asList(allergyComment);
            oVprAllergy.setData("comments", allergyCommentList);
        }

        oVprAllergy.setData("facilityName", sSystemId);
        oVprAllergy.setData("facilityCode", sSystemId);

        oVprAllergy.setData("uid",UidUtils.getAllergyUid(sSystemId, sEdipi, oAllergy.getCdrEventId()));

        String sAllergyJson = oVprAllergy.toJSON(JDBView.class);
        LOG.debug("JMeadowsAllergyService.transformAllergyJson - Returning JSON String: " + sAllergyJson);
        return sAllergyJson;
    }

}
