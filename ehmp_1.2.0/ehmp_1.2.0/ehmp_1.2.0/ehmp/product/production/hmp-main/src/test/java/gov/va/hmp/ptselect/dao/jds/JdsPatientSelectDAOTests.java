package gov.va.hmp.ptselect.dao.jds;

import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.hmp.ptselect.PatientSelect;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static gov.va.cpe.vpr.pom.jds.JdsDaoSupport.quoteAndWildcardQuery;
import static gov.va.hmp.ptselect.dao.jds.JdsPatientSelectDAO.*;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class JdsPatientSelectDAOTests {
    private JdsOperations mockJdsTemplate;
    private IGenericPOMObjectDAO mockGenericDao;
    private JdsPatientSelectDAO dao;

    @Before
    public void setUp() throws Exception {
        mockJdsTemplate = mock(JdsOperations.class);
        mockGenericDao = mock(IGenericPatientObjectDAO.class);

        dao = new JdsPatientSelectDAO(mockGenericDao, mockJdsTemplate);
    }

    @Test
    public void testFindOneByPid() throws Exception {
        dao.findOneByPid("22");

        verify(mockGenericDao).findOneByIndexAndRange(PatientSelect.class, JdsPatientSelectDAO.PT_PID_INDEX, "22");
    }

    @Test
    public void testFindOneByIcn() throws Exception {
        dao.findOneByIcn("456");

        verify(mockGenericDao).findOneByIndexAndRange(PatientSelect.class, JdsPatientSelectDAO.PT_ICN_INDEX, "456");
    }

    @Test
    public void testFindAllPids() throws Exception {
        PatientSelect p1 = new PatientSelect();
        p1.setData("pid", "F484;123");
        PatientSelect p2 = new PatientSelect();
        p2.setData("pid", "F484;234");

        List<String> pids = Arrays.asList("F484;123", "F484;234", "F484;345");
        String commaSeparatedPids = StringUtils.collectionToCommaDelimitedString(pids);

        when(mockGenericDao.findAllByIndexAndRange(PatientSelect.class, JdsPatientSelectDAO.PT_PID_INDEX, commaSeparatedPids)).thenReturn(Arrays.asList(p1,p2));

        List<PatientSelect> expected = dao.findAllPids(pids);
        assertThat(expected.size(), is(equalTo(2)));

        verify(mockGenericDao).findAllByIndexAndRange(PatientSelect.class, JdsPatientSelectDAO.PT_PID_INDEX, commaSeparatedPids);
    }

    @Test
    public void testFindAllPidsWithEmptyList() throws Exception {
        List<PatientSelect> expected = dao.findAllPids(Collections.<String>emptyList());
        assertThat(expected.isEmpty(), is(true));
        assertThat(expected.size(), is(equalTo(0)));
    }

    @Test
    public void testFindAllLocalIds() throws Exception {
        PatientSelect p1 = new PatientSelect();
        p1.setData("pid", "F484;123");
        PatientSelect p2 = new PatientSelect();
        p2.setData("pid", "F484;234");

        when(mockGenericDao.findByUID(PatientSelect.class, UidUtils.getPatientSelectUid("F484", "123"))).thenReturn(p1);
        when(mockGenericDao.findByUID(PatientSelect.class, UidUtils.getPatientSelectUid("F484", "234"))).thenReturn(p2);
        when(mockGenericDao.findByUID(PatientSelect.class, UidUtils.getPatientSelectUid("F484", "345"))).thenReturn(null);

        List<PatientSelect> expected = dao.findAllLocalIds("F484", Arrays.asList("123", "234", "345"));

        assertThat(expected.size(), is(equalTo(2)));

        verify(mockGenericDao).findByUID(PatientSelect.class, UidUtils.getPatientSelectUid("F484", "123"));
        verify(mockGenericDao).findByUID(PatientSelect.class, UidUtils.getPatientSelectUid("F484", "234"));
        verify(mockGenericDao).findByUID(PatientSelect.class, UidUtils.getPatientSelectUid("F484", "345"));
    }

    @Test
    public void testFindAllLocalIdsWithEmptyList() throws Exception {
        List<PatientSelect> expected = dao.findAllLocalIds("F484", Collections.<String>emptyList());
        assertThat(expected.isEmpty(), is(true));
        assertThat(expected.size(), is(equalTo(0)));
    }

    @Test
    public void testFindAllByName() throws Exception {
        PatientSelect p1 = new PatientSelect();
        p1.setData("pid", "12");
        PatientSelect p2 = new PatientSelect();
        p2.setData("pid", "22");

        when(mockGenericDao.findAllByIndexAndRangeWithTemplate(PatientSelect.class, PT_NAME_INDEX, quoteAndWildcardQuery("foobar"), SUMMARY_TEMPLATE, new PageRequest(0, 5))).thenReturn(new PageImpl<>(Arrays.asList(p1, p2)));

        Page<PatientSelect> expected = dao.findAllByName("foobar", new PageRequest(0, 5));

        assertThat(expected, notNullValue());
        assertThat(expected.getTotalElements(), is(equalTo(2L)));

        verify(mockGenericDao).findAllByIndexAndRangeWithTemplate(PatientSelect.class, PT_NAME_INDEX, quoteAndWildcardQuery("foobar"), SUMMARY_TEMPLATE, new PageRequest(0, 5));
    }

    @Test
    public void testFindAllBySSN() throws Exception {
        PatientSelect p1 = new PatientSelect();
        p1.setData("pid", "12");
        PatientSelect p2 = new PatientSelect();
        p2.setData("pid", "22");

        when(mockGenericDao.findAllByIndexAndRangeWithTemplate(PatientSelect.class, PT_SSN_INDEX, quoteAndWildcardQuery("12345"), SUMMARY_TEMPLATE, new PageRequest(30, 5))).thenReturn(new PageImpl<PatientSelect>(Arrays.asList(p1, p2)));

        Page<PatientSelect> expected = dao.findAllBySSN("12345", new PageRequest(30, 5));

        assertThat(expected, notNullValue());
        assertThat(expected.getTotalElements(), is(equalTo(2L)));

        verify(mockGenericDao).findAllByIndexAndRangeWithTemplate(PatientSelect.class, PT_SSN_INDEX, quoteAndWildcardQuery("12345"), SUMMARY_TEMPLATE, new PageRequest(30, 5));
    }

    @Test
    public void testFindAllByLast4() throws Exception {
        PatientSelect p1 = new PatientSelect();
        p1.setData("pid", "12");
        PatientSelect p2 = new PatientSelect();
        p2.setData("pid", "22");

        when(mockGenericDao.findAllByIndexAndRangeWithTemplate(PatientSelect.class, PT_LAST4_INDEX, quoteAndWildcardQuery("6789"), SUMMARY_TEMPLATE, new PageRequest(10, 5))).thenReturn(new PageImpl<PatientSelect>(Arrays.asList(p1, p2)));

        Page<PatientSelect> expected = dao.findAllByLast4("6789", new PageRequest(10, 5));

        assertThat(expected, notNullValue());
        assertThat(expected.getTotalElements(), is(equalTo(2L)));

        verify(mockGenericDao).findAllByIndexAndRangeWithTemplate(PatientSelect.class, PT_LAST4_INDEX, quoteAndWildcardQuery("6789"), SUMMARY_TEMPLATE, new PageRequest(10, 5));
    }

    @Test
    public void testFindAllByLast5() throws Exception {
        PatientSelect p1 = new PatientSelect();
        p1.setData("pid", "12");
        PatientSelect p2 = new PatientSelect();
        p2.setData("pid", "22");

        when(mockGenericDao.findAllByIndexAndRangeWithTemplate(PatientSelect.class, JdsPatientSelectDAO.PT_LAST5_INDEX, quoteAndWildcardQuery("B6789"), SUMMARY_TEMPLATE, new PageRequest(20, 5))).thenReturn(new PageImpl<PatientSelect>(Arrays.asList(p1, p2)));

        Page<PatientSelect> expected = dao.findAllByLast5("B6789", new PageRequest(20, 5));

        assertThat(expected, notNullValue());
        assertThat(expected.getTotalElements(), is(equalTo(2L)));

        verify(mockGenericDao).findAllByIndexAndRangeWithTemplate(PatientSelect.class, JdsPatientSelectDAO.PT_LAST5_INDEX, quoteAndWildcardQuery("B6789"), SUMMARY_TEMPLATE, new PageRequest(20, 5));
    }

}
