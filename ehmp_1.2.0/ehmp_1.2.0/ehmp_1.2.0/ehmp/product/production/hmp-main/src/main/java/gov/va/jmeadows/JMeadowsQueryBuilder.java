package gov.va.jmeadows;

import gov.va.med.jmeadows.webservice.JMeadowsQuery;
import gov.va.med.jmeadows.webservice.Patient;
import gov.va.med.jmeadows.webservice.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.util.Calendar;
import java.util.GregorianCalendar;

/**
 * JMeadows QueryBean Builder.
 */
public class JMeadowsQueryBuilder
{
    private static final Logger LOG = LoggerFactory.getLogger(JMeadowsQueryBuilder.class);

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
