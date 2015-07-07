package gov.va.jmeadows;

import static gov.va.jmeadows.JMeadowsClientUtils.SOURCE_PROTOCOL_DODADAPTER;
import static gov.va.jmeadows.JMeadowsClientUtils.filterOnSourceProtocol;
import static gov.va.jmeadows.JMeadowsClientUtils.formatCalendar;
import static gov.va.jmeadows.JMeadowsClientUtils.validateParams;
import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.PATIENT;
import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.USER;
import gov.va.cpe.idn.PatientIds;
//import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.JSONViews.JDBView;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.med.jmeadows.webservice.Code;
import gov.va.med.jmeadows.webservice.JMeadowsData;
import gov.va.med.jmeadows.webservice.JMeadowsException_Exception;
import gov.va.med.jmeadows.webservice.JMeadowsQuery;
import gov.va.med.jmeadows.webservice.PatientEncounter;
import gov.va.cpe.vpr.EncounterProvider;
import gov.va.cpe.vpr.EncounterMovement;
import gov.va.cpe.vpr.PidUtils;
import gov.va.hmp.healthtime.PointInTime;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.datatype.XMLGregorianCalendar;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class JMeadowsEncounterService implements IJMeadowsEncounterService {
    public static final String DOMAIN_ENCOUNTER_VISIST = "visit";
    private static final String DOD_ENCOUNTER = "DoD Encounter";
    private static final Logger LOG = LoggerFactory.getLogger(JMeadowsEncounterService.class);
    private JMeadowsData jMeadowsClient;

    /**
     * Constructs a JMeadowsEncounterService instance.
     */
    @Autowired
    public JMeadowsEncounterService(JMeadowsConfiguration jMeadowsConfiguration) {
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
     * This routine will calculate the total number of encounters that are in the result set.  It does this by
     * counting all the encounters that are part of the DoD domain.  We ignore all that are from any VistA site.
     *
     * @param oaPatientEncounter The list of encounters returned.
     * @return The number of encounters that are from a DoD site.
     */
    private int calculateNumEncounters(List<PatientEncounter> oaPatientEncounter) {
        int iNumEncounters = 0;

        if ((oaPatientEncounter != null) && (oaPatientEncounter.size() > 0)) {
            for (PatientEncounter oPatientEncounter : oaPatientEncounter) {
            	iNumEncounters++;
            }
        }

        return iNumEncounters;
    }

    /**
     * Retrieve DoD encounter data and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param query      JMeadows query bean.
     * @param patientIds Patient identifier bean.
     * @return The VistaDataChunk list that contains the encounter data.
     * @throws JMeadowsException_Exception If a serious error occurs.
     * @throws IllegalArgumentException    if required parameters are missing or invalid.
     */
    @Override
	public List<VistaDataChunk> fetchDodPatientEncounters(JMeadowsQuery query,
			PatientIds patientIds) throws JMeadowsException_Exception {
    	LOG.debug("JMeadowsEncounterService.fetchDodPatientEncounters - Entering method...");

        validateParams(query, patientIds, USER, PATIENT);

        List<VistaDataChunk> oaEncounterChunk = new ArrayList<VistaDataChunk>();

        List<PatientEncounter> oaPatientEncounter = jMeadowsClient.getPatientEncounters(query);
        LOG.debug("JMeadowsEncounterService.fetchDodPatientEncounters: " +
                ((oaPatientEncounter == null) ? "NO" : "" + oaPatientEncounter.size()) +
                " results retrieved from JMeadows.");

        if ((oaPatientEncounter != null) && (oaPatientEncounter.size() > 0)) {

            //remove DoD adaptor status report
        	oaPatientEncounter = (List<PatientEncounter>) filterOnSourceProtocol(oaPatientEncounter, SOURCE_PROTOCOL_DODADAPTER);

            int iNumEncounters = calculateNumEncounters(oaPatientEncounter);
            int iCurEncounterIdx = 1;        // One based index
            for (PatientEncounter oPatientEncounter : oaPatientEncounter) {
                LOG.debug("JMeadowsEncounterService.fetchDodPatientEncounters: Found DoD Encounter - Processing it... idx: " + iCurEncounterIdx);
                VistaDataChunk oEncounterChunk = transformPatientEncounterChunk(oPatientEncounter, patientIds, iNumEncounters, iCurEncounterIdx);
                if (oEncounterChunk != null) {
                	oaEncounterChunk.add(oEncounterChunk);
                    iCurEncounterIdx++;
                }
            }
        }


        return oaEncounterChunk;
	}

    /**
     * Create an instance of a VistaDataChunk that represents this encounter.
     *
     * @param oPatientEncounter       The encounter that was returned from JMeadows
     * @param oPatientIds    Patient identifiers.
     * @param iNumEncounters  The number of allergies
     * @param iCurEncounterIdx The index of this encounter in the list.
     * @return The VistaDataChunk for this encounter.
     */
    private VistaDataChunk transformPatientEncounterChunk(PatientEncounter oPatientEncounter, PatientIds oPatientIds, int iNumEncounters, int iCurEncounterIdx) {
        LOG.debug("JMeadowsEncounterService.transformEncounterChunk - Entering method...");
        VistaDataChunk oEncounterChunk = new VistaDataChunk();

        oEncounterChunk.setBatch(false);
        oEncounterChunk.setDomain(DOMAIN_ENCOUNTER_VISIST);
        oEncounterChunk.setItemCount(iNumEncounters);
        oEncounterChunk.setItemIndex(iCurEncounterIdx);
        //		oPatientEncounterChunk.setJson(null);

        String sSystemId = "";
        String sLocalPatientId = "";
        if (StringUtils.hasText(oPatientIds.getUid())) {
            sSystemId = UidUtils.getSystemIdFromPatientUid(oPatientIds.getUid());
            sLocalPatientId = UidUtils.getLocalPatientIdFromPatientUid(oPatientIds.getUid());
            
            
            oEncounterChunk.setLocalPatientId(sLocalPatientId);
            oEncounterChunk.setSystemId(sSystemId);

            HashMap<String, String> oParams = new HashMap<String, String>();
            oParams.put("vistaId", sSystemId);
            oParams.put("patientDfn", sLocalPatientId);
            oEncounterChunk.setParams(oParams);
        }

        oEncounterChunk.setPatientIcn(oPatientIds.getIcn());
        oEncounterChunk.setPatientId(PidUtils.getPid("DOD", oPatientIds.getEdipi()));
        oEncounterChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
        oEncounterChunk.setType(VistaDataChunk.NEW_OR_UPDATE);

        oEncounterChunk.setContent(transformPatientEncounterJson(oPatientEncounter, "DOD", oPatientIds.getEdipi()));

        return oEncounterChunk;
    }

    /**
     * This method will transform the Encounter from the DoD JMeadows format to the VPR format and return it as a
     * JSON string.
     *
     * @param oPatientEncounter  The DoD JMeadows format of the data.
     * @param sSystemId The site system ID
     * @param sEdipi    The patient EDIPI
     * @return The JSON for this encounter data in VPR format.
     */
    private String transformPatientEncounterJson(PatientEncounter oPatientEncounter, String sSystemId, String sEdipi) {

        LOG.debug("JMeadowsEncounterService.transformPatientEncounterJson - Entering method...");
        gov.va.cpe.vpr.Encounter oVprEncounter = new gov.va.cpe.vpr.Encounter();

        if(oPatientEncounter.getAppointmentDate() != null)
        {
        	oVprEncounter.setData("dateTime", calendarToPointInTime(oPatientEncounter.getAppointmentDate()));
        }
        
        oVprEncounter.setData("categoryName", DOD_ENCOUNTER);
        oVprEncounter.setData("locationName", oPatientEncounter.getClinic()); 
        oVprEncounter.setData("facilityName", sSystemId);
        oVprEncounter.setData("facilityCode", sSystemId);
        oVprEncounter.setData("appointmentStatus", oPatientEncounter.getStatus());
        oVprEncounter.setData("typeName", oPatientEncounter.getAppointmentType());
        oVprEncounter.setData("typeDisplayName", oPatientEncounter.getAppointmentType());
        oVprEncounter.setData("dispositionName", oPatientEncounter.getDischargeDisposition());
        oVprEncounter.setData("reasonName", oPatientEncounter.getVisitReason());
        

        Set<EncounterProvider> encounterProviders = new LinkedHashSet<EncounterProvider>();
        EncounterProvider provider = new EncounterProvider();
        encounterProviders.add(provider);

        if ((oPatientEncounter.getProvider() != null) && (oPatientEncounter.getProvider().length() > 0)) {
        	provider.setData("providerName", oPatientEncounter.getProvider());
        }
        oVprEncounter.setData("providers", encounterProviders);
        
        

        // Extract the codes
        //--------------------
        /*if ((oPatientEncounter.getCodes() != null) &&
                (oPatientEncounter.getCodes().size() > 0)) {
            List<JdsCode> oaJdsCode = new ArrayList<JdsCode>();
            for (Code oCode : oPatientEncounter.getCodes()) {
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
                oVprEncounter.setData("codes", oaJdsCode);
            }
        }*/


        oVprEncounter.setData("uid", UidUtils.getVisitUid(sSystemId, sEdipi, oPatientEncounter.getCdrEventId()));

        String sEncounterJson = oVprEncounter.toJSON(JDBView.class);
        LOG.debug("JMeadowsEncounterService.transformEncounterJson - Returning JSON String: " + sEncounterJson);
        return sEncounterJson;
    }

    private PointInTime calendarToPointInTime(XMLGregorianCalendar calendar) {
        if(calendar != null)
            return new PointInTime(formatCalendar(calendar.toGregorianCalendar()));

        return null;
    }

}
