package gov.va.cpe.vpr.service;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.format.IntervalOfTimeFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DomainService implements IDomainService {

    private IGenericPatientObjectDAO genericPatientObjectDao;

    @Autowired
    public void setGenericPatientObjectDao(IGenericPatientObjectDAO genericPatientObjectDao) {
        this.genericPatientObjectDao = genericPatientObjectDao;
    }

    public Page queryForPage(PatientDemographics pt, String domain, IntervalOfTime dateRange, String queryName, Map remainingRequestParams, Pageable pageable) {
        Class domainClass = getDomainClass(domain);
        Page page = genericPatientObjectDao.findAllByPIDIndexAndRange(domainClass, pt.getPid(), queryName, IntervalOfTimeFormat.print(dateRange), pageable);
        return page;
    }

    public Class getDomainClass(String domain) {
        return UidUtils.getDomainClass(domain);
    }
}
