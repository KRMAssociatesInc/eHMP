package gov.va.jmeadows;

import gov.va.cpe.idn.PatientIds;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.med.jmeadows.webservice.*;
import org.apache.commons.lang.StringUtils;

import javax.xml.datatype.XMLGregorianCalendar;
import java.text.SimpleDateFormat;
import java.util.*;

public class JMeadowsClientUtils {
    public static String SOURCE_PROTOCOL_DODADAPTER = "DODADAPTER";

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMddHHmmss");

    /**
     * Filters jMeadows results on the source protocol field.
     *
     * @param jmeadowsResults List of jMeadows results.
     * @param sourceProtocol  Source protocol value (ex: DOD).
     * @return A list of jMeadows results that matches source protocol criteria.
     */
    public static List<? extends DataBean> filterOnSourceProtocol(List<? extends DataBean> jmeadowsResults, String sourceProtocol) {
        if (jmeadowsResults == null) return null;

        if (sourceProtocol == null) {
            throw new IllegalArgumentException("Source protocol is null");
        }

        List<DataBean> removeList = new ArrayList<>();

        for (DataBean dataBean : jmeadowsResults) {
            if (dataBean.getSite() != null) {
                if (!sourceProtocol.equalsIgnoreCase(dataBean.getSourceProtocol())) {
                    removeList.add(dataBean);
                }
            }
        }
        List<DataBean> retList = new ArrayList<>(jmeadowsResults);
        retList.removeAll(removeList);
        return retList;
    }

    /**
     * Creates a jMeadows Query Builder thats configured to only query for DoD clinical data.
     * This utility method does not set patient identifier data.
     *
     * @param jMeadowsConfiguration JMeadows configuration object.
     * @return JMeadowsQueryBuilder instance.
     */
    public static JMeadowsQueryBuilder createDodJMeadowsQueryBuilder(IJMeadowsConfiguration jMeadowsConfiguration) {

        User user = new User();

        user.setAgency("VA");
        Site hostSite = new Site();
        user.setHostSite(hostSite);
        hostSite.setAgency("VA");

        hostSite.setId(0);
        hostSite.setMoniker(jMeadowsConfiguration.getUserSiteName());
        hostSite.setName(jMeadowsConfiguration.getUserSiteName());

        hostSite.setSiteCode(jMeadowsConfiguration.getUserSiteCode());
        hostSite.setStatus("active");

        user.setName(jMeadowsConfiguration.getUserSiteName());
        user.setUserIen(jMeadowsConfiguration.getUserIen());

        Calendar startDate = new GregorianCalendar();

        //set start date to thirty years in the past
        startDate.add(GregorianCalendar.YEAR, -30);

        Calendar endDate = new GregorianCalendar();

        return new JMeadowsQueryBuilder()
                .user(user)
                .startDate(startDate)
                .endDate(endDate);
    }

    public static void validateVlerPatientIds(PatientIds patientIds) {
        if (patientIds == null) {
            throw new IllegalArgumentException("PatentIds is null");
        }

        List<String> missingParams = new ArrayList<>();

        if (StringUtils.isBlank(patientIds.getPid()))
            missingParams.add("pid");
        if (StringUtils.isBlank(patientIds.getIcn()))
            missingParams.add("icn");

        if (missingParams.size() > 0) {
            throw new IllegalArgumentException("PatientIds is missing required identifier field(s): " + missingParams.toString());
        }
    }

    public static JMeadowsQueryBuilder createVlerJMeadowsQueryBuilder(PatientIds patientIds,
                                                                      JMeadowsConfiguration jMeadowsConfiguration) {
        Patient patient = new Patient();
        patient.setICN(patientIds.getIcn());

        return createDodJMeadowsQueryBuilder(jMeadowsConfiguration)
                .patient(patient);
    }

    /**
     * Creates a jMeadows Query Builder thats configured to only query for DoD clinical data.
     *
     * @param patientIds            Patient identifiers
     * @param jMeadowsConfiguration JMeadows configuration object.
     * @return JMeadowsQueryBuilder instance.
     */
    public static JMeadowsQueryBuilder createDodJMeadowsQueryBuilder(PatientIds patientIds,
                                                                     JMeadowsConfiguration jMeadowsConfiguration) {
        Patient patient = new Patient();

        patient.setEDIPI(patientIds.getEdipi());

        return createDodJMeadowsQueryBuilder(jMeadowsConfiguration)
                .patient(patient);
    }

    /**
     * QueryBean parameter enumeration. For use with validateQueryBean helper method
     */
    public static enum QueryBeanParams {
        USER, PATIENT, RECORD_SITE_CODE, ITEM_ID, DATE_RANGE, STATUS, ACTIVE
    }


    /**
     * Helper method that throws an IllegalArgumentException if any of the specified QueryBeanParams values
     * are missing from the provided QueryBean instance.
     *
     * @param queryBean      QueryBean to check.
     * @param checkParamArgs QueryBeanParameters to check.
     * @throws IllegalArgumentException if required parameters are missing or invalid
     */
    public static void validateQueryBean(JMeadowsQuery queryBean, QueryBeanParams... checkParamArgs) {
        if (queryBean == null) {
            throw new IllegalArgumentException("QueryBean param is null or empty");
        }

        if (checkParamArgs == null) {
            throw new IllegalArgumentException("Missing required params");
        }

        List<QueryBeanParams> checkParams = Arrays.asList(checkParamArgs);

        boolean checkProvider = checkParams.contains(QueryBeanParams.USER);
        boolean checkPatient = checkParams.contains(QueryBeanParams.PATIENT);
        boolean checkRecordSite = checkParams.contains(QueryBeanParams.RECORD_SITE_CODE);
        boolean checkItemId = checkParams.contains(QueryBeanParams.ITEM_ID);
        boolean checkDateRange = checkParams.contains(QueryBeanParams.DATE_RANGE);
        boolean checkStatus = checkParams.contains(QueryBeanParams.STATUS);
        boolean checkActive = checkParams.contains(QueryBeanParams.ACTIVE);

        StringBuilder errorMsgSB = new StringBuilder("QueryBean is missing required parameter(s): ");

        List<String> missingParams = new ArrayList<>();

        if (checkProvider && (queryBean.getUser() == null)) {
            missingParams.add("user");
        } else if (checkProvider && (queryBean.getUser().getUserIen() == null ||
                queryBean.getUser().getUserIen().isEmpty())) {
            missingParams.add("user user id");
        } else if (checkProvider && (queryBean.getUser().getHostSite() == null)) {
            missingParams.add("user login site");
        }
        if (checkProvider && StringUtils.isBlank(queryBean.getUser().getHostSite().getSiteCode())) {
            missingParams.add("user login site code");
        }
        if (checkProvider && StringUtils.isBlank(queryBean.getUser().getHostSite().getAgency())) {
            missingParams.add("user login site agency");
        }
        if (checkProvider && StringUtils.isBlank(queryBean.getUser().getHostSite().getMoniker())) {
            missingParams.add("user login site moniker");
        }
        if (checkProvider && StringUtils.isBlank(queryBean.getUser().getHostSite().getName())) {
            missingParams.add("user login site name");
        }

        if (checkPatient && (queryBean.getPatient() == null)) {
            missingParams.add("patient");
        }
        //throw error if patient missing all identifiers
        else if (checkPatient) {
            boolean hasEDIPI = StringUtils.isNotBlank(queryBean.getPatient().getEDIPI());
            boolean hasICN = StringUtils.isNotBlank(queryBean.getPatient().getICN());
            boolean hasVistaIENs =
                    queryBean.getPatient().getPatientIens() != null && !queryBean.getPatient().getPatientIens().isEmpty() &&
                            queryBean.getPatient().getVistaSites() != null && !queryBean.getPatient().getVistaSites().isEmpty();

            if (!hasEDIPI && !hasICN && !hasVistaIENs) {
                missingParams.add("patient identifiers");
            }
        }

        if (checkItemId && (queryBean.getItemId() == null || queryBean.getItemId().isEmpty())) {
            missingParams.add("itemId");
        }

        if (checkRecordSite) {
            if (StringUtils.isBlank(queryBean.getRecordSiteCode())) {
                missingParams.add("recordSite");
            }
        }

        if (checkDateRange && (queryBean.getStartDate() == null || queryBean.getEndDate() == null)) {
            missingParams.add("startDate");
            missingParams.add("endDate");
        }

        if (checkStatus && (queryBean.getStatus() == null || queryBean.getStatus().isEmpty())) {
            missingParams.add("status");
        }

        if (checkActive && queryBean.getActive() == null) {
            missingParams.add("active");
        }

        int missingParamsSize = missingParams.size();
        for (int i = 0; i < missingParamsSize; i++) {
            errorMsgSB.append(missingParams.get(i));

            if (i < (missingParamsSize - 1)) {
                errorMsgSB.append(", ");
            }
        }

        if (missingParamsSize > 0)
            throw new IllegalArgumentException(errorMsgSB.toString());
    }

    /**
     * Helper method to validate PatientIds.
     *
     * @param patientIds PatientIds instance.
     * @throws IllegalArgumentException If patientIds instance is invalid.
     */
    public static void validatePatientIds(PatientIds patientIds) {
        if (patientIds == null) {
            throw new IllegalArgumentException("PatentIds is null");
        }

        List<String> missingParams = new ArrayList<>();

        if (StringUtils.isBlank(patientIds.getPid()))
            missingParams.add("pid");
        if (StringUtils.isBlank(patientIds.getEdipi()))
            missingParams.add("edipi");

        if (missingParams.size() > 0) {
            throw new IllegalArgumentException("PatientIds is missing required identifier field(s): " + missingParams.toString());
        }
    }

    /**
     * Helper method to validate JMeadows service query parameters.
     *
     * @param query          JMeadows query.
     * @param patientIds     PatientIds instance.
     * @param checkParamArgs QueryBeanParameters to check.
     * @throws IllegalArgumentException If parameters are invalid.
     */
    public static void validateParams(JMeadowsQuery query, PatientIds patientIds, QueryBeanParams... checkParamArgs) {
        StringBuilder errorMsg = new StringBuilder();

        try {
            validateQueryBean(query, checkParamArgs);
        } catch (IllegalArgumentException e) {
            errorMsg.append(e.getMessage());
        }

        try {
            validatePatientIds(patientIds);
        } catch (IllegalArgumentException e) {
            if (errorMsg.length() > 0) {
                errorMsg.append("::");
            }

            errorMsg.append(e.getMessage());
        }

        if (errorMsg.length() > 0)
            throw new IllegalArgumentException(errorMsg.toString());
    }

    /**
     * Converts XMLGregorianCalendar to a PointInTime object.
     * @param xmlCal XMLGregorianCalendar instance.
     * @return Converted PointInTime instance, null if input is null.
     */
    public static PointInTime calendarToPointInTime(XMLGregorianCalendar xmlCal)
    {
        if (xmlCal != null)
            return calendarToPointInTime(xmlCal.toGregorianCalendar());

        return null;
    }

    /**
     * Converts Calendar to a PointInTime object.
     * @param calendar Calendar instance.
     * @return Converted PointInTime instance, null if input is null.
     */
    public static PointInTime calendarToPointInTime(Calendar calendar)
    {
        if(calendar != null)
            return new PointInTime(formatCalendar(calendar));

        return null;
    }

    /**
     * Calendar to String format.
     *
     * Method is synchronized because instances of SimpleDateFormat are not thread safe.
     *
     * @param calendar Calendar instance
     * @return Formatted date string as yyyyMMddHHmmss, null if Calendar is null.
     */
    public static synchronized String formatCalendar(Calendar calendar) {
        if (calendar == null) return null;

        DATE_FORMAT.setCalendar(calendar);
        return DATE_FORMAT.format(calendar.getTime());
    }

}
