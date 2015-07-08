package gov.va.jmeadows;

import gov.va.med.jmeadows.webservice.JMeadowsQuery;
import gov.va.med.jmeadows.webservice.Patient;
import gov.va.med.jmeadows.webservice.User;
import org.junit.Before;
import org.junit.Test;

import java.util.Calendar;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

public class JMeadowsQueryBuilderTest
{
    private Integer active = 1;
    private String itemId = "test.itemid";
    private Integer max = 100;
    private String recordSiteCode = "test.sitecode";
    private String sortBy = "test.sortby";
    private String status = "test.status";

    private User user;
    private Patient patient;
    private Calendar startDate;
    private Calendar endDate;

    @Before
    public void setup()
    {
        user = new User();
        user.setName("test.name");

        patient = new Patient();
        patient.setName("test.name");

        startDate = Calendar.getInstance();
        endDate = Calendar.getInstance();
    }

    @Test
    public void testBuild()
    {
        JMeadowsQuery query = new JMeadowsQueryBuilder()
                .active(active)
                .endDate(endDate)
                .itemId(itemId)
                .max(max)
                .patient(patient)
                .recordSiteCode(recordSiteCode)
                .sortBy(sortBy)
                .startDate(startDate)
                .status(status)
                .user(user)
                .build();

        assertThat(query.getActive(), is(active));

        endDate.set(Calendar.HOUR_OF_DAY, 23);
        endDate.set(Calendar.MINUTE, 59);
        endDate.set(Calendar.SECOND, 59);

        assertThat(query.getEndDate().toGregorianCalendar().getTime(), is(endDate.getTime()));
        assertThat(query.getItemId(), is(itemId));
        assertThat(query.getMax(), is(max));
        assertThat(query.getPatient().getName(), is(patient.getName()));
        assertThat(query.getRecordSiteCode(), is(recordSiteCode));
        assertThat(query.getSortBy(), is(sortBy));

        startDate.set(Calendar.HOUR_OF_DAY, 0);
        startDate.set(Calendar.MINUTE, 0);
        startDate.set(Calendar.SECOND, 0);

        assertThat(query.getStartDate().toGregorianCalendar().getTime(), is(startDate.getTime()));
        assertThat(query.getStatus(), is(status));
        assertThat(query.getUser().getName(), is(user.getName()));
    }
}
