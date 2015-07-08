package gov.va.cpe.vpr.service;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.hmp.healthtime.IntervalOfTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface IDomainService {
    Page queryForPage(PatientDemographics pt, String domain, IntervalOfTime dateRange, String queryName, Map remainingRequestParams, Pageable pageable);

    Class getDomainClass(String domain);
}
