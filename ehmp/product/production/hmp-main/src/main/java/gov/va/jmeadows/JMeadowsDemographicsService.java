package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.pom.JSONViews.JDBView;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.med.jmeadows.webservice.*;
import gov.va.med.jmeadows.webservice.PatientDemographics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * JMeadows Demographics Service
 */
@Service
public class JMeadowsDemographicsService implements IJMeadowsDemographicsService {


    private String DOD_STATUS_REPORT_FLAG = "DODADAPTER_SOURCE_STATUS_REPORT";
    public static final String DOMAIN_DEMOGRAPHICS = "patient";
    static final Logger LOG = LoggerFactory.getLogger(JMeadowsDemographicsService.class);
    private JMeadowsData jMeadowsClient;

    private SimpleDateFormat fmt = new SimpleDateFormat("dd MMM yyyy");

    /**
     * Constructs a JMeadowsDemographicsService instance.
     */
    @Autowired
    public JMeadowsDemographicsService(JMeadowsConfiguration jMeadowsConfiguration)
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



    public List<VistaDataChunk> fetchDodPatientDemographics(JMeadowsQuery query, PatientIds patientIds) throws JMeadowsException_Exception {

        LOG.debug("JMeadowsDemographicsService.fetchDodPatientDemographics - Entering method...");

        List<VistaDataChunk> oaDemographicsChunk = new ArrayList<VistaDataChunk>();

        List<PatientDemographics> oaDemographicsResults = jMeadowsClient.getPatientDemographics(query);

        LOG.debug("JMeadowsDemographicsService.fetchPatientDemographicsResults: " +
                ((oaDemographicsResults == null)? "NO" : ""+oaDemographicsResults.size()) +
                " Patients retrieved from JMeadows.");


        if ((oaDemographicsResults != null) && (oaDemographicsResults.size() > 0)) {

            int iNumLabs = calculateNumDemographics(oaDemographicsResults);
            int iCurDemIdx = 1;		// One based index
            for(PatientDemographics oDemographics : oaDemographicsResults)
            {
                if(oDemographics.getSite() != null)
                {
                    Site s = oDemographics.getSite();
                    if(!s.getMoniker().equals(DOD_STATUS_REPORT_FLAG))
                    {
                        LOG.debug("JMeadowsDemographicsService.fetchPatientDemographics: Found DoD Demographics - Processing it... idx: " + iCurDemIdx);

                        VistaDataChunk oDemographicsChunk = transformDemographicsChunk(oDemographics, patientIds, iNumLabs, iCurDemIdx);
                        if (oDemographicsChunk != null) {
                            oaDemographicsChunk.add(oDemographicsChunk);
                            iCurDemIdx++;
                        }
                    }
                }
            }
        }

        return oaDemographicsChunk;
    }


    /**
     * This routine will calculate the total number of demographics data that are in the result set.  It does this by
     * counting all the labs that are part of the DoD domain.  We ignore all that are from any VistA site.
     *
     * @param oaDemographics The list of demographics returned.
     * @return The number of labs that are from a DoD site.
     */
    private int calculateNumDemographics(List<PatientDemographics> oaDemographics) {

        int iNumDemographics = 0;
        if ((oaDemographics != null) && (oaDemographics.size() > 0)) {
            for (PatientDemographics oDem : oaDemographics) {
                iNumDemographics++;
            }
        }

        return iNumDemographics;
    }



    /**
     * Create an instance of a VistaDataChunk that represents this demographics.
     *
     * @param oDemographics The demographics that was returned from JMeadows
     * @param oPatientIds Patient identifiers.
     * @param iNumDemographics The number of demographics
     * @param iCurDemographicsIdx The index of this demographics in the list.
     * @return The VistaDataChunk for this demographics.
     */

    private VistaDataChunk transformDemographicsChunk(PatientDemographics oDemographics, PatientIds oPatientIds, int iNumDemographics, int iCurDemographicsIdx) {

        LOG.debug("JMeadowsDemographicsService.transformDemographicsChunk - Entering method...");

        VistaDataChunk oDemographicsChunk = new VistaDataChunk();

        oDemographicsChunk.setBatch(false);
        oDemographicsChunk.setDomain(DOMAIN_DEMOGRAPHICS);
        oDemographicsChunk.setItemCount(iNumDemographics);
        oDemographicsChunk.setItemIndex(iCurDemographicsIdx);

        String sSystemId = "";
        String sLocalPatientId = "";

        if (StringUtils.hasText(oPatientIds.getUid())) {
            sSystemId = UidUtils.getSystemIdFromPatientUid(oPatientIds.getUid());
            sLocalPatientId = UidUtils.getLocalPatientIdFromPatientUid(oPatientIds.getUid());
            oDemographicsChunk.setLocalPatientId(sLocalPatientId);
            oDemographicsChunk.setSystemId(sSystemId);

            HashMap<String, String> oParams = new HashMap<String, String>();
            oParams.put("vistaId", sSystemId);
            oParams.put("patientDfn", sLocalPatientId);
            oDemographicsChunk.setParams(oParams);
        }

        oDemographicsChunk.setPatientIcn(oPatientIds.getIcn());
        oDemographicsChunk.setPatientId(PidUtils.getPid("DOD", oPatientIds.getEdipi()));
        oDemographicsChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
        oDemographicsChunk.setType(VistaDataChunk.NEW_OR_UPDATE);

        oDemographicsChunk.setContent(transformDemographicsJson(oDemographics, "DOD", oPatientIds.getEdipi(), oPatientIds.getIcn()));

        return oDemographicsChunk;
    }

    /**
     * This method will transform the demographics data from the DoD JMeadows format to the VPR format and return it as a
     * JSON string.
     *
     * @param oDemographics The DoD JMeadows format of the data.
     * @param sSystemId The site system ID
     * @param sEdipi The patient EDIPI
     * @return The JSON for this demographics data in VPR format.
     */

    private String transformDemographicsJson(PatientDemographics oDemographics, String sSystemId, String sEdipi, String sIcn) {

        LOG.debug("JMeadowsDemographicsService.transformDemographicsJson - Entering method...");

        gov.va.cpe.vpr.PatientDemographics aPatientDemographics =
                new gov.va.cpe.vpr.PatientDemographics();

        aPatientDemographics.setData("fullName", oDemographics.getName());
        aPatientDemographics.setData("displayName", oDemographics.getName());

        aPatientDemographics.setData("ssn", oDemographics.getSSN());
        aPatientDemographics.setData("genderName", oDemographics.getGender());
        aPatientDemographics.setData("icn", sIcn);      // Note we must maintain the ICN for this patient to tie things together in the JDS

        try {

            String dob = oDemographics.getDob();

            Calendar cal = calendarFromString(dob);

            PointInTime pt = new PointInTime(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH));
            aPatientDemographics.setData("birthDate", pt);

        }
        catch (ParseException e)
        {

            LOG.debug("Parse Exception in JMeadowsDemographicsService.transformDemographicsJson -", e.getMessage(), e);

        }

        Address address1 = new Address();
        address1.setCity(oDemographics.getCity());
        address1.setLine1(oDemographics.getAddress1());
        address1.setLine2(oDemographics.getAddress2());
        address1.setZip(oDemographics.getZipCode());
        address1.setState(oDemographics.getState());

        Set<Address> addrSet = new HashSet<Address>();
        addrSet.add(address1);

        aPatientDemographics.setData("addresses", addrSet);

        aPatientDemographics.setData("uid", UidUtils.getPatientUid(sSystemId, sEdipi));

        String sDemographicsJson = aPatientDemographics.toJSON(JDBView.class);
        //LOG.debug("JMeadowsDemographicsService.transformDemographicsJson - Returning JSON String: " + sDemographicsJson);
        return sDemographicsJson;

    }

    private Calendar calendarFromString(String dateString) throws ParseException {

        Calendar cal = Calendar.getInstance();
        synchronized (this) {
            cal.setTime(fmt.parse(dateString));
        }
        return cal;

    }

}
