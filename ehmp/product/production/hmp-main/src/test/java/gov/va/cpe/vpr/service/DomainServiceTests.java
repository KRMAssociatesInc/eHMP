package gov.va.cpe.vpr.service;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.Procedure;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.sync.vista.MockPatientUtils;
import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.format.IntervalOfTimeFormat;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.CoreMatchers.sameInstance;
import static org.mockito.Mockito.*;

public class DomainServiceTests {

    private DomainService service;
    private IGenericPatientObjectDAO mockPatientObjectDao;

    @Before
    public void setUp() throws Exception {
        mockPatientObjectDao = mock(IGenericPatientObjectDAO.class);

        service = new DomainService();
        service.setGenericPatientObjectDao(mockPatientObjectDao);
    }

    @Test
    public void testGetDomainClass() throws Exception {
        for (String domain : UidUtils.getAllDomains()) {
            Assert.assertSame(UidUtils.getDomainClass(domain), service.getDomainClass(domain));
        }
    }

    @Test
    public void testQueryForPage() throws Exception {
        PatientDemographics mockPt = MockPatientUtils.create();
        IntervalOfTime dateRange = IntervalOfTime.forTheLast(1);
        PageRequest pageRequest = new PageRequest(0, 100);
        Page mockPage = new PageImpl(Arrays.asList(), pageRequest, 12345L);
        when(mockPatientObjectDao.findAllByPIDIndexAndRange(Procedure.class, mockPt.getPid(), "all", IntervalOfTimeFormat.print(dateRange), pageRequest)).thenReturn(mockPage);

        Page page = service.queryForPage(mockPt, "consult", dateRange, "all", Collections.emptyMap(), pageRequest);

        Assert.assertThat(page, sameInstance(mockPage));
        Class<? extends IPOMObject> pr = UidUtils.getDomainClass("consult");
        verify(mockPatientObjectDao).findAllByPIDIndexAndRange(Procedure.class, mockPt.getPid(), "all", IntervalOfTimeFormat.print(dateRange), pageRequest);
    }
}
