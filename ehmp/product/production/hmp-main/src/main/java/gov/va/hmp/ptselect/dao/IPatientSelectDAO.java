package gov.va.hmp.ptselect.dao;

import gov.va.cpe.vpr.pom.IPOMObjectDAO;
import gov.va.cpe.vpr.pom.jds.JdsPOMObjectDAO;
import gov.va.hmp.ptselect.PatientSelect;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IPatientSelectDAO extends IPOMObjectDAO<PatientSelect> {
    PatientSelect findOneByPid(String pid);

    PatientSelect findOneByIcn(String icn);
    List<PatientSelect> findAllByIcn(String icn);

    /**
     * Finds a page of patients by name adhering to the pagination information in the {@link org.springframework.data.domain.Pageable} object.
     *
     * @param nameQuery
     * @param pageable pagination information
     * @return a page of patients
     */
    Page<PatientSelect> findAllByName(String nameQuery, Pageable pageable);

    /**
     * Finds a page of patients by social security number (SSN) adhering to the pagination information in the {@link Pageable} object.
     *
     * @param ssnQuery
     * @param pageable pagination information
     * @return a page of patients
     */
    Page<PatientSelect> findAllBySSN(String ssnQuery, Pageable pageable);

    /**
     * Finds a page of patients by the last 4 digits of their social security number (SSN) adhering to the pagination information in the {@link Pageable} object.
     *
     * @param last4Query
     * @param pageable pagination information
     * @return a page of patients
     */
    Page<PatientSelect> findAllByLast4(String last4Query, Pageable pageable);

    /**
     * Finds a page of patients by their "Last 5" adhering to the pagination information in the {@link Pageable} object.
     * <p/>
     * Last 5 is shorthand for the first initial of the last name and last 4 digits of the social security number (SSN).
     *
     * @param last5Query
     * @param pageable pagination information
     * @return a page of patients
     */
    Page<PatientSelect> findAllByLast5(String last5Query, Pageable pageable);

    List<PatientSelect> findAllPids(List<String> pids);

    List<PatientSelect> findAllLocalIds(String systemOrFacilityCode, List<String> localPatientIds);
}
