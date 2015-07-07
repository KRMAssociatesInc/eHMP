package gov.va.jmeadows;

import static gov.va.jmeadows.JMeadowsClientUtils.SOURCE_PROTOCOL_DODADAPTER;
import static gov.va.jmeadows.JMeadowsClientUtils.filterOnSourceProtocol;
import static gov.va.jmeadows.JMeadowsClientUtils.formatCalendar;
import static gov.va.jmeadows.JMeadowsClientUtils.validateParams;
import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.PATIENT;
import static gov.va.jmeadows.JMeadowsClientUtils.QueryBeanParams.USER;
import gov.va.cpe.idn.PatientIds;
//import gov.va.cpe.vpr.Appointment;
import gov.va.cpe.vpr.EncounterProvider;
import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.JSONViews.JDBView;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.med.jmeadows.webservice.*;


import gov.va.hmp.healthtime.PointInTime;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.xml.datatype.XMLGregorianCalendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class JMeadowsAppointmentService implements IJMeadowsAppointmentService {
    public static final String DOMAIN_APPOINTMENT_VISIT = "appointment";
    private static final String DOD_APPOINTMENT = "DoD Appointment";
    private static final Logger LOG = LoggerFactory.getLogger(JMeadowsAppointmentService.class);
    private JMeadowsData jMeadowsClient;

    /**
     * Constructs a JMeadowsAppointmentService instance.
     */
    @Autowired
    public JMeadowsAppointmentService(JMeadowsConfiguration jMeadowsConfiguration) {
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
     * This routine will calculate the total number of appointments that are in the result set.  It does this by
     * counting all the appointments that are part of the DoD domain.  We ignore all that are from any VistA site.
     *
     * @param oaPatientAppointment The list of appointments returned.
     * @return The number of appointments that are from a DoD site.
     */
    private int calculateNumAppointments(List<PatientAppointments> oaPatientAppointment) {
        int iNumAppointments = 0;

        if ((oaPatientAppointment != null) && (oaPatientAppointment.size() > 0)) {
            for (PatientAppointments oPatientAppointment : oaPatientAppointment) {
                iNumAppointments++;
            }
        }

        return iNumAppointments;
    }

    /**
     * Retrieve DoD appointment data and format it into a VistaChunk to be included into the set of data returned to the system.
     *
     * @param query      JMeadows query bean.
     * @param patientIds Patient identifier bean.
     * @return The VistaDataChunk list that contains the appointment data.
     * @throws JMeadowsException_Exception If a serious error occurs.
     * @throws IllegalArgumentException    if required parameters are missing or invalid.
     */
    @Override
    public List<VistaDataChunk> fetchDodPatientAppointments(JMeadowsQuery query,
                                                          PatientIds patientIds) throws JMeadowsException_Exception {
        LOG.debug("JMeadowsAppointmentService.fetchDodPatientAppointments - Entering method...");

        validateParams(query, patientIds, USER, PATIENT);

        List<VistaDataChunk> oaAppointmentChunk = new ArrayList<VistaDataChunk>();

        List<PatientAppointments> oaPatientAppointment = jMeadowsClient.getPatientAppointments(query);
        LOG.debug("JMeadowsAppointmentService.fetchDodPatientAppointments: " +
                ((oaPatientAppointment == null) ? "NO" : "" + oaPatientAppointment.size()) +
                " results retrieved from JMeadows.");

        if ((oaPatientAppointment != null) && (oaPatientAppointment.size() > 0)) {

            //remove DoD adaptor status report
            oaPatientAppointment = (List<PatientAppointments>) filterOnSourceProtocol(oaPatientAppointment, SOURCE_PROTOCOL_DODADAPTER);

            int iNumAppointments = calculateNumAppointments(oaPatientAppointment);
            int iCurAppointmentIdx = 1;        // One based index
            for (PatientAppointments oPatientAppointment : oaPatientAppointment) {
                LOG.debug("JMeadowsAppointmentService.fetchDodPatientAppointments: Found DoD Appointment - Processing it... idx: " + iCurAppointmentIdx);
                VistaDataChunk oAppointmentChunk = transformPatientAppointmentChunk(oPatientAppointment, patientIds, iNumAppointments, iCurAppointmentIdx);
                if (oAppointmentChunk != null) {
                    oaAppointmentChunk.add(oAppointmentChunk);
                    iCurAppointmentIdx++;
                }
            }
        }


        return oaAppointmentChunk;
    }

    /**
     * Create an instance of a VistaDataChunk that represents this appointment.
     *
     * @param oPatientAppointment       The appointment that was returned from JMeadows
     * @param oPatientIds    Patient identifiers.
     * @param iNumAppointments  The number of allergies
     * @param iCurAppointmentIdx The index of this appointment in the list.
     * @return The VistaDataChunk for this appointment.
     */
    private VistaDataChunk transformPatientAppointmentChunk(PatientAppointments oPatientAppointment, PatientIds oPatientIds, int iNumAppointments, int iCurAppointmentIdx) {
        LOG.debug("JMeadowsAppointmentService.transformAppointmentChunk - Entering method...");
        VistaDataChunk oAppointmentChunk = new VistaDataChunk();

        oAppointmentChunk.setBatch(false);
        oAppointmentChunk.setDomain(DOMAIN_APPOINTMENT_VISIT);
        oAppointmentChunk.setItemCount(iNumAppointments);
        oAppointmentChunk.setItemIndex(iCurAppointmentIdx);
        //		oPatientAppointmentChunk.setJson(null);

        String sSystemId = "";
        String sLocalPatientId = "";
        if (StringUtils.hasText(oPatientIds.getUid())) {
            sSystemId = UidUtils.getSystemIdFromPatientUid(oPatientIds.getUid());
            sLocalPatientId = UidUtils.getLocalPatientIdFromPatientUid(oPatientIds.getUid());


            oAppointmentChunk.setLocalPatientId(sLocalPatientId);
            oAppointmentChunk.setSystemId(sSystemId);

            HashMap<String, String> oParams = new HashMap<String, String>();
            oParams.put("vistaId", sSystemId);
            oParams.put("patientDfn", sLocalPatientId);
            oAppointmentChunk.setParams(oParams);
        }

        oAppointmentChunk.setPatientIcn(oPatientIds.getIcn());
        oAppointmentChunk.setPatientId(PidUtils.getPid("DOD", oPatientIds.getEdipi()));
        oAppointmentChunk.setRpcUri("vrpcb://9E7A/HMP SYNCHRONIZATION CONTEXT/HMPDJFS API");
        oAppointmentChunk.setType(VistaDataChunk.NEW_OR_UPDATE);

        oAppointmentChunk.setContent(transformPatientAppointmentJson(oPatientAppointment, "DOD", oPatientIds.getEdipi()));

        return oAppointmentChunk;
    }

    /**
     * This method will transform the Appointment from the DoD JMeadows format to the VPR format and return it as a
     * JSON string.
     *
     * @param oPatientAppointment  The DoD JMeadows format of the data.
     * @param sSystemId The site system ID
     * @param sEdipi    The patient EDIPI
     * @return The JSON for this appointment data in VPR format.
     */
    private String transformPatientAppointmentJson(PatientAppointments oPatientAppointment, String sSystemId, String sEdipi) {

        LOG.debug("JMeadowsAppointmentService.transformPatientAppointmentJson - Entering method...");
        gov.va.cpe.vpr.Encounter oVprAppointment = new gov.va.cpe.vpr.Encounter();

        if(oPatientAppointment.getApptDate() != null)
        {
            oVprAppointment.setData("dateTime", calendarToPointInTime(oPatientAppointment.getApptDate()));
        }

        oVprAppointment.setData("categoryName", DOD_APPOINTMENT);
        oVprAppointment.setData("locationName", oPatientAppointment.getClinic());
        oVprAppointment.setData("facilityName", sSystemId);
        oVprAppointment.setData("facilityCode", sSystemId);
        oVprAppointment.setData("appointmentStatus", oPatientAppointment.getStatus());
        oVprAppointment.setData("typeName", oPatientAppointment.getApptType());
        oVprAppointment.setData("typeDisplayName", oPatientAppointment.getApptType());
        oVprAppointment.setData("reasonName", oPatientAppointment.getReason());


        Set<EncounterProvider> appointmentProviders = new LinkedHashSet<EncounterProvider>();
        EncounterProvider provider = new EncounterProvider();
        appointmentProviders.add(provider);

        if ((oPatientAppointment.getProviderName() != null) && (oPatientAppointment.getProviderName().length() > 0)) {
            provider.setData("providerName", oPatientAppointment.getProviderName());
        }
        oVprAppointment.setData("providers", appointmentProviders);

        oVprAppointment.setData("uid", UidUtils.getAppointmentUid(sSystemId, sEdipi, oPatientAppointment.getCdrEventId()));

        String sAppointmentJson = oVprAppointment.toJSON(JDBView.class);
        LOG.debug("JMeadowsAppointmentService.transformAppointmentJson - Returning JSON String: " + sAppointmentJson);
        return sAppointmentJson;
    }

    private PointInTime calendarToPointInTime(XMLGregorianCalendar calendar) {
        if(calendar != null)
            return new PointInTime(formatCalendar(calendar.toGregorianCalendar()));

        return null;
    }

}
