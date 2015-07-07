package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.pom.JSONViews.JDBView;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.med.jmeadows.webservice.*;
import gov.va.med.jmeadows.webservice.Medication;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.PATIENT;
import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.USER;
import static gov.va.jmeadows.JMeadowsClientUtils.*;

/**
 * JMeadows Medication Retriever Service
 */
@Service
public class JMeadowsMedicationService implements IJMeadowsMedicationService {
    public static final String DOMAIN_MEDICATION = "med";
    private static final Logger LOG = LoggerFactory.getLogger(JMeadowsMedicationService.class);
    private JMeadowsData jMeadowsClient;

    /**
     * Constructs a JMeadowsMedicationService instance.
     */
    @Autowired
    public JMeadowsMedicationService(JMeadowsConfiguration jMeadowsConfiguration) {
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
     * This routine will calculate the total number of medications that are in the result set.  It does this by
     * counting all the medications that are part of the DoD domain.  We ignore all that are from any VistA site.
     *
     * @param oaMeds The list of meds returned.
     * @return The number of meds that are from a DoD site.
     */
    private int calculateNumMeds(List<Medication> oaMeds) {
        int iNumMeds = 0;

        if ((oaMeds != null) && (oaMeds.size() > 0)) {
            for (Medication oMed : oaMeds) {
                iNumMeds++;
            }
        }

        return iNumMeds;
    }

    /**
     * Retrieve DoD outpatient med data and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param query JMeadows query bean.
     * @param patientIds Patient identifier bean.
     * @return The VistaDataChunk list that contains the med data.
     * @throws gov.va.med.jmeadows.webservice.JMeadowsException_Exception If a serious error occurs.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
     */
    @Override
    public List<VistaDataChunk> fetchDodPatientOutpatientMedications(JMeadowsQuery query, PatientIds patientIds) throws JMeadowsException_Exception {
        LOG.debug("JMeadowsMedicationService.fetchDodPatientOutpatientMedications - Entering method...");

        query.setStatus("O");  //outpatient meds

        validateParams(query, patientIds, USER, PATIENT);

        List<VistaDataChunk> oaMedChunk = new ArrayList<VistaDataChunk>();

        List<Medication> oaMedication = jMeadowsClient.getPatientMedications(query);
        LOG.debug("JMeadowsMedicationService.fetchDodOutpatientMedications: " +
                ((oaMedication == null)? "NO" : ""+oaMedication.size()) +
                " results retrieved from JMeadows.");

        if ((oaMedication != null) && (oaMedication.size() > 0)) {

            //remove DoD adaptor status report
            oaMedication = (List<Medication>) filterOnSourceProtocol(oaMedication, SOURCE_PROTOCOL_DODADAPTER);

            int iNumMeds = calculateNumMeds(oaMedication);
            int iCurMedIdx = 1;		// One based index
            for (Medication oMed : oaMedication) {
                LOG.debug("JMeadowsMedicationService.fetchDodPatientOutpatientMedications: Found DoD Medication - Processing it... idx: " + iCurMedIdx);
                VistaDataChunk oMedChunk = transformMedicationChunk(oMed, patientIds, iNumMeds, iCurMedIdx);
                if (oMedChunk != null) {
                    oaMedChunk.add(oMedChunk);
                    iCurMedIdx++;
                }
            }
        }


        return oaMedChunk;
    }

    /**
     * Retrieve DoD inpatient med data and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param query JMeadows query bean.
     * @param patientIds Patient identifier bean.
     * @return The VistaDataChunk list that contains the med data.
     * @throws gov.va.med.jmeadows.webservice.JMeadowsException_Exception If a serious error occurs.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
     */

    @Override
    public List<VistaDataChunk> fetchDodPatientInpatientMedications(JMeadowsQuery query, PatientIds patientIds) throws JMeadowsException_Exception {
        LOG.debug("JMeadowsMedicationService.fetchDodPatientInpatientMedications - Entering method...");

        validateParams(query, patientIds, USER, PATIENT);

        query.setStatus("I");  //inpatient meds

        List<VistaDataChunk> oaMedChunk = new ArrayList<VistaDataChunk>();

        List<Medication> oaMedication = jMeadowsClient.getPatientMedications(query);
        LOG.debug("JMeadowsMedicationService.fetchDodInpatientMedications: " +
                ((oaMedication == null)? "NO" : ""+oaMedication.size()) +
                " results retrieved from JMeadows.");

        if ((oaMedication != null) && (oaMedication.size() > 0)) {

            //remove DoD adaptor status report
            oaMedication = (List<Medication>) filterOnSourceProtocol(oaMedication, SOURCE_PROTOCOL_DODADAPTER);

            int iNumMeds = calculateNumMeds(oaMedication);
            int iCurMedIdx = 1;		// One based index
            for (Medication oMed : oaMedication) {
                LOG.debug("JMeadowsMedicationService.fetchDodPatientInpatientMedications: Found DoD Medication - Processing it... idx: " + iCurMedIdx);
                VistaDataChunk oMedChunk = transformMedicationChunk(oMed, patientIds, iNumMeds, iCurMedIdx);
                if (oMedChunk != null) {
                    oaMedChunk.add(oMedChunk);
                    iCurMedIdx++;
                }
            }
        }


        return oaMedChunk;
    }


    /**
     * Create an instance of a VistaDataChunk that represents this medication.
     *
     * @param oMed The med that was returned from JMeadows
     * @param oPatientIds Patient identifiers.
     * @param iNumMeds The number of medications
     * @param iCurMedIdx The index of this medication in the list.
     * @return The VistaDataChunk for this medication.
     */
    private VistaDataChunk transformMedicationChunk(Medication oMed, PatientIds oPatientIds, int iNumMeds, int iCurMedIdx) {
        LOG.debug("JMeadowsMedicationService.transformMedicationChunk - Entering method...");
        VistaDataChunk oMedChunk = new VistaDataChunk();

        oMedChunk.setBatch(false);
        oMedChunk.setDomain(DOMAIN_MEDICATION);
        oMedChunk.setItemCount(iNumMeds);
        oMedChunk.setItemIndex(iCurMedIdx);

        String sSystemId = "";
        String sLocalPatientId = "";
        if (org.springframework.util.StringUtils.hasText(oPatientIds.getUid())) {
            sSystemId = UidUtils.getSystemIdFromPatientUid(oPatientIds.getUid());
            sLocalPatientId = UidUtils.getLocalPatientIdFromPatientUid(oPatientIds.getUid());
            oMedChunk.setLocalPatientId(sLocalPatientId);
            oMedChunk.setSystemId(sSystemId);

            HashMap<String, String> oParams = new HashMap<String, String>();
            oParams.put("vistaId", sSystemId);
            oParams.put("patientDfn", sLocalPatientId);
            oMedChunk.setParams(oParams);
        }

        oMedChunk.setPatientIcn(oPatientIds.getIcn());
        oMedChunk.setPatientId(PidUtils.getPid("DOD", oPatientIds.getEdipi()));
        oMedChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
        oMedChunk.setType(VistaDataChunk.NEW_OR_UPDATE);

        oMedChunk.setContent(transformMedicationJson(oMed, "DOD", oPatientIds.getEdipi()));

        return oMedChunk;
    }

    /**
     * This method will transform the medication from the DoD JMeadows format to the VPR format and return it as a
     * JSON string.
     *
     * @param oMed The DoD JMeadows format of the data.
     * @param sSystemId The site system ID
     * @param sEdipi The patient EDIPI
     * @return The JSON for this medication data in VPR format.
     */
    private String transformMedicationJson(Medication oMed, String sSystemId, String sEdipi) {
        LOG.debug("JMeadowsMedicationService.transformMedicationJson - Entering method...");

        gov.va.cpe.vpr.Medication oVprMedication = new gov.va.cpe.vpr.Medication();

        // Extract the codes
        //--------------------
        if (CollectionUtils.isNotEmpty(oMed.getCodes())) {
            List<JdsCode> oaJdsCode = new ArrayList<JdsCode>();
            for (Code oCode : oMed.getCodes()) {
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
                oVprMedication.setData("codes", oaJdsCode);
            }
        }

        if(oMed.getActive() != null)
            oVprMedication.setData("vaStatus", oMed.getActive());
        else {
            oVprMedication.setData("vaStatus", "Unknown");
        }

        oVprMedication.setData("medStatus", oMed.getActive());
        oVprMedication.setData("medType", oMed.getMedType());
        oVprMedication.setData("vaType", transformVaType(oMed.getMedType()));
        oVprMedication.setData("patientInstruction", oMed.getComment());
        oVprMedication.setData("productFormName", oMed.getDrugName());
        oVprMedication.setData("productFormCode", oMed.getMedId());
        oVprMedication.setData("name", oMed.getDrugName());

        List<MedicationProduct> medicationProducts = new ArrayList<MedicationProduct>();
        MedicationProduct product = new MedicationProduct();
        product.setData("suppliedName", oMed.getDrugName());
        medicationProducts.add(product);

        oVprMedication.setData("products", medicationProducts);


        if(oMed.getFillOrderDate() != null)
            oVprMedication.setData("overallStart", calendarToPointInTime(oMed.getFillOrderDate()));

        if(oMed.getStopDate() != null)
            oVprMedication.setData("overallStop", calendarToPointInTime(oMed.getStopDate()));


        List<PrescriptionFill> dodFills = oMed.getPrescriptionFills();
        List<MedicationFill> vprFills = new ArrayList<MedicationFill>();

        for(PrescriptionFill aFill : dodFills)
        {
            HashMap<String, Object> vprMedFillsVals = new HashMap<String, Object>();

            vprMedFillsVals.put("dispenseDate", calendarToPointInTime(aFill.getDispenseDate())) ;
            vprMedFillsVals.put("quantityDispensed", aFill.getDispensingQuantity());
            vprMedFillsVals.put("dispensingPharmacy", aFill.getDispensingPharmacy());

            MedicationFill mf = new MedicationFill(vprMedFillsVals);

            vprFills.add(mf);

        }

        oVprMedication.setData("fills", vprFills);


        List<MedicationOrder> vprOrders = new ArrayList<MedicationOrder>();
         ;
        HashMap<String, Object> vprOrderVals = new HashMap<String, Object>();

        vprOrderVals.put("daysSupply", Integer.parseInt(oMed.getDaysSupply()));
        vprOrderVals.put("quantityOrdered", Integer.parseInt(oMed.getQuantity()));
        vprOrderVals.put("fillsRemaining", Integer.parseInt(oMed.getRefills()));
        vprOrderVals.put("providerName", oMed.getOrderingProvider());

        MedicationOrder order1 = new MedicationOrder(vprOrderVals);

        vprOrders.add(order1);

        oVprMedication.setData("orders", vprOrders);

        oVprMedication.setData("sig", oMed.getSigCode());
        oVprMedication.setData("facilityName", sSystemId);
        oVprMedication.setData("facilityCode", sSystemId);

        oVprMedication.setData("uid", UidUtils.getMedicationUid(sSystemId, sEdipi, oMed.getCdrEventId()));

        String sMedicationJson = oVprMedication.toJSON(JDBView.class);
        LOG.debug("JMeadowsMedicationService.transformMedicationJson - Returning JSON String: " + sMedicationJson);
        return sMedicationJson;
    }

    /**
     * The vaType is transformed to an enum and can only be from the valid set of types.   This method is used
     * to transform the DoD representation to a VA representation.Valid VA med types are as follows:
     * 
     *  I = ("Medication, Inpatient"),
     *   O = ("Medication, Outpatient"),
     *   N = ("Medication, Non-VA"),
     *   V = ("Medication, Infusion"),
     *   IMO = ("Medication, Clinic Order"),
     *   SUPPLY = ("Medication, Supply"),
     *   UNKNOWN = ("Medication");
     * 
     * @param dodMedType The type of Med from the DoD
     * @return The vaType value for this. 
     */
    private String transformVaType(String dodMedType) {
        String vaType = "";
        
        if ((dodMedType != null) &&
            ((dodMedType.equalsIgnoreCase(gov.va.cpe.vpr.Medication.MedicationKind.I.name())) ||
             (dodMedType.equalsIgnoreCase(gov.va.cpe.vpr.Medication.MedicationKind.O.name())) ||       
             (dodMedType.equalsIgnoreCase(gov.va.cpe.vpr.Medication.MedicationKind.N.name())) ||       
             (dodMedType.equalsIgnoreCase(gov.va.cpe.vpr.Medication.MedicationKind.V.name())) ||       
             (dodMedType.equalsIgnoreCase(gov.va.cpe.vpr.Medication.MedicationKind.IMO.name())) ||       
             (dodMedType.equalsIgnoreCase(gov.va.cpe.vpr.Medication.MedicationKind.SUPPLY.name())) ||       
             (dodMedType.equalsIgnoreCase(gov.va.cpe.vpr.Medication.MedicationKind.UNKNOWN.name())))) {
            vaType = dodMedType.toUpperCase();
        }
        else {
            vaType = gov.va.cpe.vpr.Medication.MedicationKind.UNKNOWN.name();
        }
        
        return vaType;

	}
}
