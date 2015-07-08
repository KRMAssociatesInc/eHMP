package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.JdsCode;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.VitalSign;
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

import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.PATIENT;
import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.USER;
import static gov.va.jmeadows.JMeadowsClientUtils.*;

/**
 * JMeadows Vital Retriever Service
 */
@Service
public class JMeadowsVitalService implements IJMeadowsVitalService {
    public static final String DOMAIN_VITAL= "vital";
	private static final Logger LOG = LoggerFactory.getLogger(JMeadowsVitalService.class);
    private JMeadowsData jMeadowsClient;

    /**
     * Constructs a JMeadowsVitalService instance.
     */
    @Autowired
    public JMeadowsVitalService(JMeadowsConfiguration jMeadowsConfiguration) {
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
	 * This routine will calculate the total number of vitals that are in the result set.  It does this by
	 * counting all the vitals that are part of the DoD domain.  We ignore all that are from any VistA site.
	 *
	 * @param oaVital The list of vitals returned.
	 * @return The number of vitals that are from a DoD site.
	 */
	private int calculateNumVitals(List<Vitals> oaVital) {
		int iNumVitals = 0;

		if ((oaVital != null) && (oaVital.size() > 0)) {
			for (Vitals oVital : oaVital) {
                iNumVitals++;
			}
		}

		return iNumVitals;
	}

	/**
	 * Retrieve DoD vital data and format it into a VistaChunk to be included into the set of data returned to the system.
	 *
	 * @param query JMeadows query bean.
     * @param patientIds Patient identifier bean.
	 * @return The VistaDataChunk list that contains the vital data.
	 * @throws gov.va.med.jmeadows.webservice.JMeadowsException_Exception If a serious error occurs.
     * @throws IllegalArgumentException if required parameters are missing or invalid.
	 */
	@Override
    public List<VistaDataChunk> fetchDodPatientVitals(JMeadowsQuery query, PatientIds patientIds) throws JMeadowsException_Exception {
		LOG.debug("JMeadowsVitalService.fetchDodPatientVitals - Entering method...");
	
		validateParams(query, patientIds, USER, PATIENT);

        List<VistaDataChunk> oaVitalChunk = new ArrayList<VistaDataChunk>();
		
		List<Vitals> oaVital = jMeadowsClient.getPatientVitals(query);
		LOG.debug("JMeadowsVitalService.fetchDodPatientVitals: " +
				  ((oaVital == null)? "NO" : ""+oaVital.size()) +
				  " results retrieved from JMeadows.");
		
		if ((oaVital != null) && (oaVital.size() > 0)) {

            //remove DoD adaptor status report
            oaVital = (List<Vitals>) filterOnSourceProtocol(oaVital, SOURCE_PROTOCOL_DODADAPTER);

            int iNumVitals = calculateNumVitals(oaVital);
			int iCurVitalIdx = 1;		// One based index
			for (Vitals oVital : oaVital) {
                LOG.debug("JMeadowsVitalService.fetchDodPatientVitals: Found DoD Vital - Processing it... idx: " + iCurVitalIdx);
                if (StringUtils.isBlank(oVital.getVitalType()) || StringUtils.isBlank(oVital.getRate())) {
                    LOG.debug("skip not enough vital chunk data");
                }else {
                    VistaDataChunk oVitalChunk = transformVitalChunk(oVital, patientIds, iNumVitals, iCurVitalIdx);
                    if (oVitalChunk != null) {
                        oaVitalChunk.add(oVitalChunk);
                        iCurVitalIdx++;
                    }
                }
			}
		}
		
		
		return oaVitalChunk;
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
		private VistaDataChunk transformVitalChunk(Vitals oVital, PatientIds oPatientIds, int iNumVitals, int iCurVitalIdx) {
			LOG.debug("JMeadowsVitalService.transformVitalChunk - Entering method...");
			VistaDataChunk oVitalChunk = new VistaDataChunk();
			
			oVitalChunk.setBatch(false);
			oVitalChunk.setDomain(DOMAIN_VITAL);
			oVitalChunk.setItemCount(iNumVitals);
			oVitalChunk.setItemIndex(iCurVitalIdx);
	//		oVitalChunk.setJson(null);
				
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
	        oVitalChunk.setPatientId(PidUtils.getPid("DOD", oPatientIds.getEdipi()));
	        oVitalChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
	        oVitalChunk.setType(VistaDataChunk.NEW_OR_UPDATE);

			oVitalChunk.setContent(transformVitalJson(oVital, "DOD", oPatientIds.getEdipi()));
			
			return oVitalChunk;
		}

	/**
	 * This method will transform the vital from the DoD JMeadows format to the VPR format and return it as a
	 * JSON string.
	 * 
	 * @param oVital The DoD JMeadows format of the data.
	 * @param sSystemId The site system ID
	 * @param sEdipi The patient EDIPI
	 * @return The JSON for this vital data in VPR format.
	 */
	private String transformVitalJson(Vitals oVital, String sSystemId, String sEdipi) {
		LOG.debug("JMeadowsVitalService.transformVitalJson - Entering method...");
		VitalSign oVprVital = new VitalSign();
	
		// Extract the codes
		//--------------------
        if (CollectionUtils.isNotEmpty(oVital.getCodes())) {
			List<JdsCode> oaJdsCode = new ArrayList<JdsCode>();
			for (Code oCode : oVital.getCodes()) {
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
				oVprVital.setData("codes", oaJdsCode);
			}
		}
		
		
        if (oVital.getDateTimeTaken() != null) {
            oVprVital.setData("observed", formatCalendar(oVital.getDateTimeTaken().toGregorianCalendar()));
        }
        oVprVital.setData("typeName", oVital.getVitalType());
        oVprVital.setData("result", oVital.getRate());
        oVprVital.setData("units", oVital.getUnits());

		oVprVital.setData("facilityName", sSystemId);
		oVprVital.setData("facilityCode", sSystemId);

		oVprVital.setData("uid", UidUtils.getVitalSignUid(sSystemId, sEdipi, oVital.getCdrEventId()));

		String sVitalJson = oVprVital.toJSON(JDBView.class);
		LOG.debug("JMeadowsVitalService.transformVitalJson - Returning JSON String: " + sVitalJson);
		return sVitalJson;
	}
}
