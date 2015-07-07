package gov.va.cpe.vpr.pom;

import gov.va.cpe.vpr.PatientDemographics;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface IPatientDAO extends IPatientObjectDAO<PatientDemographics> {

    PatientDemographics findByIcn(String icn);

    /**
     * Attempts to find a patient from any patient identifier, or <code>pid</code> used in VistA/VPR.
     * <p/>
     * Accepts patient identifiers in 3 forms
     * <ol>
     *     <li><code>{facilityCode;localPatientId}</code> - In VistA this is <code>{stationNumber;dfn}</code></li>
     *     <li><code>icn</code> - if there is no semicolon, interpret pid as an ICN</li>
     *     <li><code>vprId</code> - if there is no patient with the given ICN, interpret pid as an internal VPR patient id</li>
     * </ol>
     *
     * @param pid One of three types of patient identifier
     * @return corresponding Patient object, if found, null otherwise.
     */

//    Patient findByAnyPid(String pid);
//
//    PatientDemographics findByVprPid(String pid);

    PatientDemographics findByPid(String pid);
    List<PatientDemographics> findListByPid(String pid);
    PatientDemographics findByUid(String uid);

    /* Simplifiying....
    Patient findBySystemIdAndLocalPatientId(String systemId, String localPatientId);
    PatientFacility findFacilityByCodeAndLocalPatientId(String facilityCode, String localPatientId);
    PatientFacility findFacilityBySystemIdAndLocalPatientId(String systemId, String localPatientId);
	*/
//    Patient findByLocalID(String systemOrFacilityCode, String localPatientId);

    PatientDemographics findByLocalId(String systemOrFacilityCode, String localPatientId);

    Page<PatientDemographics> findAll(Pageable pageable);

    @Deprecated
    List<String> listLoadedPatientIds();

    Map<String, Object> getSynchedCollectionCounts(String pid);

    // TODO: uncomment and implement a pageable version of all patient ids
//    Page<String> listPatientIds(Pageable pageable);

    int count();

//    Patient save(Patient pat);

    PatientDemographics save(PatientDemographics pat);
    
    PatientDemographics save(String pid, PatientDemographics pat);

}