package us.vistacore.vxsync.dod;

import gov.va.med.jmeadows.webservice.JMeadowsQuery;
import gov.va.med.jmeadows.webservice.Patient;
import gov.va.med.jmeadows.webservice.Site;
import gov.va.med.jmeadows.webservice.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.util.*;

/**
 * JMeadows QueryBean Builder.
 */
public class JMeadowsQueryBuilder
{
    private static final Logger LOG = LoggerFactory.getLogger(JMeadowsQueryBuilder.class);

    /**
     * QueryBean parameter enumeration. For use with validateQueryBean helper method
     */
    public static enum QueryBeanParams {
        USER, PATIENT, RECORD_SITE_CODE, ITEM_ID, DATE_RANGE, STATUS, ACTIVE
    }



    private Integer active;
    private Calendar endDate;
    private String itemId;
    private Integer max;
    private Patient patient;
    private String recordSiteCode;
    private String sortBy;
    private Calendar startDate;
    private String status;
    private User user;
    private String requestingAppName;

    public JMeadowsQueryBuilder()
    {
        this.requestingAppName = "eHMP";
    }

    public JMeadowsQueryBuilder active(Integer active)
    {
        this.active = active;
        return this;
    }

    public JMeadowsQueryBuilder endDate(Calendar endDate)
    {
        this.endDate = endDate;
        return this;
    }

    public JMeadowsQueryBuilder itemId(String itemId)
    {
        this.itemId = itemId;
        return this;
    }

    public JMeadowsQueryBuilder max(Integer max)
    {
        this.max = max;
        return this;
    }

    public JMeadowsQueryBuilder patient(Patient patient)
    {
        this.patient = patient;
        return this;
    }

    public JMeadowsQueryBuilder recordSiteCode(String recordSiteCode)
    {
        this.recordSiteCode = recordSiteCode;
        return this;
    }

    public JMeadowsQueryBuilder sortBy(String sortBy)
    {
        this.sortBy = sortBy;
        return this;
    }

    public JMeadowsQueryBuilder startDate(Calendar startDate)
    {
        this.startDate = startDate;
        return this;
    }

    public JMeadowsQueryBuilder status(String status)
    {
        this.status = status;
        return this;
    }

    public JMeadowsQueryBuilder user(User user)
    {
        this.user = user;
        return this;
    }

    /**
     * Builds JMeadowsQuery Bean comprised of builder fields.
     * @return JMeadows query bean
     */
    public JMeadowsQuery build()
    {

        LOG.debug("JMeadowsQueryBuilder.build - Entering method...()");

        JMeadowsQuery queryBean = new JMeadowsQuery();
        queryBean.setActive(active);
        queryBean.setItemId(itemId);
        queryBean.setStatus(status);
        queryBean.setSortBy(sortBy);
        queryBean.setRecordSiteCode(recordSiteCode);
        queryBean.setMax(max);
        queryBean.setRequestingApp(requestingAppName);
        queryBean.setUser(user);
        queryBean.setPatient(patient);

        XMLGregorianCalendar startXmlDate = null;
        XMLGregorianCalendar endXmlDate = null;

        if (startDate != null) {
            startXmlDate = toXMLGregorianCalendar(pushCalendarToStartOfDay(startDate));
        }

        if (endDate != null) {
            endXmlDate = toXMLGregorianCalendar(pushCalendarToEndOfDay(endDate));
        }

        queryBean.setStartDate(startXmlDate);
        queryBean.setEndDate(endXmlDate);

        return queryBean;
    }

    public static JMeadowsQuery getJMeadowsQuery(String edipi)
    {
        LOG.debug("JMeadowsQueryBuilder.getJMeadowsQuery - edipi "+edipi);

        JMeadowsQueryBuilder queryBuilder = createDodJMeadowsQueryBuilder(edipi);
        JMeadowsQuery query = queryBuilder.build();

        //validateParams(query, getPatientIds(), QueryBeanParams.USER, QueryBeanParams.PATIENT);
        return query;
    }

    /**
     * Creates a jMeadows Query Builder thats configured to only query for DoD clinical data.
     * This utility method does not set patient identifier data.
     *
     * @return JMeadowsQueryBuilder instance.
     */
    public static JMeadowsQueryBuilder createDodJMeadowsQueryBuilder() {

        LOG.debug("JMeadowsQueryBuilder.createDodJMeadowsQueryBuilder : Enter");

        User user = new User();

        user.setAgency("VA");
        Site hostSite = new Site();
        user.setHostSite(hostSite);
        hostSite.setAgency("VA");

        hostSite.setId(0);
        hostSite.setMoniker(JMeadowsConnection.getJMeadowsConfig().getUserSiteName());
        hostSite.setName(JMeadowsConnection.getJMeadowsConfig().getUserSiteName());
        hostSite.setSiteCode(JMeadowsConnection.getJMeadowsConfig().getUserSiteCode());
        hostSite.setStatus("active");
        user.setName(JMeadowsConnection.getJMeadowsConfig().getUserSiteName());
        user.setUserIen(JMeadowsConnection.getJMeadowsConfig().getUserIen());

        Calendar startDate = new GregorianCalendar();
        //set start date to thirty years in the past
        startDate.add(GregorianCalendar.YEAR, -30);
        Calendar endDate = new GregorianCalendar();

        return new JMeadowsQueryBuilder()
                .user(user)
                .startDate(startDate)
                .endDate(endDate);
    }

    public static JMeadowsQueryBuilder createDodJMeadowsQueryBuilder(String edipi) {

        LOG.debug("JMeadowsQueryBuilder.createDodJMeadowsQueryBuilder : edipi "+edipi);

        Patient patient = new Patient();

        patient.setEDIPI(edipi);

        return createDodJMeadowsQueryBuilder()
                .patient(patient);
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

        LOG.debug("JMeadowsQueryBuilder.validateQueryBean : Enter ");

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
        if (checkProvider && isBlank(queryBean.getUser().getHostSite().getSiteCode())) {
            missingParams.add("user login site code");
        }
        if (checkProvider && isBlank(queryBean.getUser().getHostSite().getAgency())) {
            missingParams.add("user login site agency");
        }
        if (checkProvider && isBlank(queryBean.getUser().getHostSite().getMoniker())) {
            missingParams.add("user login site moniker");
        }
        if (checkProvider && isBlank(queryBean.getUser().getHostSite().getName())) {
            missingParams.add("user login site name");
        }

        if (checkPatient && (queryBean.getPatient() == null)) {
            missingParams.add("patient");
        }
        //throw error if patient missing all identifiers
        else if (checkPatient) {
            boolean hasEDIPI = !isBlank(queryBean.getPatient().getEDIPI());
            boolean hasICN = !isBlank(queryBean.getPatient().getICN());
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
            if (isBlank(queryBean.getRecordSiteCode())) {
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

    public static boolean isBlank(String str) {
        if (str == null)
            return true;
        if (str.length() == 0)
            return true;
        return false;
    }



 



    /**
     * Converts a Calendar instance into a XMLGregorianCalendar representation.
     * @param cal Calendar to convert.
     * @return XMLGregorianCalendar instance.
     */
    private XMLGregorianCalendar toXMLGregorianCalendar(Calendar cal)
    {
        if (cal == null) return null;

        XMLGregorianCalendar xmlCal = null;

        GregorianCalendar gregorianCalendar = new GregorianCalendar();
        gregorianCalendar.setTime(cal.getTime());

        try {
            xmlCal = DatatypeFactory.newInstance().newXMLGregorianCalendar(gregorianCalendar);
        } catch (DatatypeConfigurationException e) {
            LOG.error(e.getMessage(), e);
        }

        return xmlCal;
    }

    /**
     * Pushes the Calendar's time to 12:00AM (00:00:00) of the given date MM/DD/YYYY.
     * Please note a new Calendar instance is not returned, this method will write over the Calendar parameter's time
     *
     * @param cal
     * @return Calendar pushed to start of day
     */
    private Calendar pushCalendarToStartOfDay(Calendar cal)
    {
        Calendar cal2 = Calendar.getInstance();
        cal2.setTimeInMillis(cal.getTimeInMillis());
        cal2.set(Calendar.HOUR_OF_DAY, 00);
        cal2.set(Calendar.MINUTE, 00);
        cal2.set(Calendar.SECOND, 00);

        cal = cal2;

        return cal;
    }

    /**
     * Pushes the Calendar's time to 11:59PM (23:59:59) of the given date MM/DD/YYYY.
     * Please note a new Calendar instance is not returned, this method will write over the Calendar parameter's time
     *
     * @param cal
     * @return Calendar pushed to end of day
     */
    private Calendar pushCalendarToEndOfDay(Calendar cal)
    {
        Calendar cal2 = Calendar.getInstance();
        cal2.setTimeInMillis(cal.getTimeInMillis());
        cal2.set(Calendar.HOUR_OF_DAY, 23);
        cal2.set(Calendar.MINUTE, 59);
        cal2.set(Calendar.SECOND, 59);

        cal = cal2;

        return cal;
    }
}


