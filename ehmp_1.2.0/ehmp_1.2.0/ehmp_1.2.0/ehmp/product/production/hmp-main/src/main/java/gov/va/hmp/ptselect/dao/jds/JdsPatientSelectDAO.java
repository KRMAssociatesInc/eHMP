package gov.va.hmp.ptselect.dao.jds;

import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.jds.JdsDaoSupport;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.pom.jds.JdsPOMObjectDAO;
import gov.va.hmp.ptselect.PatientSelect;
import gov.va.hmp.ptselect.dao.IPatientSelectDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class JdsPatientSelectDAO extends JdsPOMObjectDAO<PatientSelect> implements IPatientSelectDAO {

    public static final String SUMMARY_TEMPLATE = "summary";

    public static final String PT_PID_INDEX = "pt-select-pid";
    public static final String PT_ICN_INDEX = "pt-select-icn";
    public static final String PT_NAME_INDEX = "pt-select-name";
    public static final String PT_SSN_INDEX = "pt-select-ssn";
    public static final String PT_LAST4_INDEX = "pt-select-last4";
    public static final String PT_LAST5_INDEX = "pt-select-last5";

    public JdsPatientSelectDAO(IGenericPOMObjectDAO genericDao, JdsOperations jdsTemplate) {
        super(PatientSelect.class, genericDao, jdsTemplate);
    }

    @Override
    public PatientSelect findOneByPid(String pid) {
        return getGenericDao().findOneByIndexAndRange(getType(), PT_PID_INDEX, pid);
    }

    @Override
    public PatientSelect findOneByIcn(String icn) {
        return getGenericDao().findOneByIndexAndRange(getType(), PT_ICN_INDEX, icn);
    }

    @Override
    public List<PatientSelect> findAllByIcn(String icn) {
        return (List<PatientSelect>) getGenericDao().findAllByIndexAndRange(getType(), PT_ICN_INDEX, icn);
    }

    @Override
    public List<PatientSelect> findAllPids(List<String> pids) {
        if (pids.isEmpty()) return Collections.emptyList();
        String commaSeparatedPids = StringUtils.collectionToCommaDelimitedString(pids);
        List<PatientSelect> ptSelects = getGenericDao().findAllByIndexAndRange(PatientSelect.class, PT_PID_INDEX, commaSeparatedPids);
        return ptSelects;
    }

    @Override
    public List<PatientSelect> findAllLocalIds(String systemOrFacilityCode, List<String> localPatientIds) {
        if (localPatientIds.isEmpty()) return Collections.emptyList();

        // TODO: this is a brute force way to fetch a list of patients by their local ID which won't scale; enhance JDS to return a batch of patients
        List<PatientSelect> patients = new ArrayList<>(localPatientIds.size());
        for (String localPatientId: localPatientIds) {
            PatientSelect pt = getGenericDao().findByUID(PatientSelect.class, UidUtils.getPatientSelectUid(systemOrFacilityCode, localPatientId));
            if (pt != null) patients.add(pt);
        }
        return patients; // FIXME
    }

    @Override
    public Page<PatientSelect> findAllByName(String nameQuery, Pageable pageable) {
        nameQuery = quoteAndWildcardQuery(nameQuery);
        Page<PatientSelect> patients = getGenericDao().findAllByIndexAndRangeWithTemplate(PatientSelect.class, PT_NAME_INDEX, nameQuery, SUMMARY_TEMPLATE, pageable);
        return patients;
    }

    @Override
    public Page<PatientSelect> findAllBySSN(String ssnQuery, Pageable pageable) {
        ssnQuery = quoteAndWildcardQuery(ssnQuery);
        Page<PatientSelect> patients = getGenericDao().findAllByIndexAndRangeWithTemplate(PatientSelect.class, PT_SSN_INDEX, ssnQuery, SUMMARY_TEMPLATE, pageable);
        return patients;
    }

    @Override
    public Page<PatientSelect> findAllByLast4(String last4Query, Pageable pageable) {
        last4Query = quoteAndWildcardQuery(last4Query);
        Page<PatientSelect> patients = getGenericDao().findAllByIndexAndRangeWithTemplate(PatientSelect.class, PT_LAST4_INDEX, last4Query, SUMMARY_TEMPLATE, pageable);
        return patients;
    }

    @Override
    public Page<PatientSelect> findAllByLast5(String last5Query, Pageable pageable) {
        last5Query = quoteAndWildcardQuery(last5Query);
        Page<PatientSelect> patients = getGenericDao().findAllByIndexAndRangeWithTemplate(PatientSelect.class, PT_LAST5_INDEX, last5Query, SUMMARY_TEMPLATE, pageable);
        return patients;
    }


}
