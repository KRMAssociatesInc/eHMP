package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.pom.POMIndex;
import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.joda.time.Days;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.*;

/**
 * Demographics information for the patient.
 *
 * @see <a href="http://wiki.hitsp.org/docs/C83/C83-3.html#_Ref232942628">HITSP/C83
 *      Personal Information</a>
 */
public class PatientDemographics extends AbstractPatientObject {

    protected PointInTime birthDate;
    protected String ssn;
    private String last4;
    private String last5;
    protected String icn;
    private String familyName;
    private String givenNames;
    private String fullName;
    private String displayName;
    private String genderCode;
    private String genderName;
    private String briefId;
    private PointInTime deceased;
    private Boolean sensitive;
    private String maritalStatusCode;
    private String maritalStatusName;
    private String scPercent;
    private boolean serviceConnected;
    private String serviceConnectedPercent;
    private String lrdfn;
    private String localId;

    // TODO: move this somewhere else - not demographics - sync metadata
    private Integer syncErrorCount = 0;

    private String religionCode;
    private String religionName;
    private boolean veteran;
    private PointInTime lastUpdated;
    private String domainUpdated;

    private Set<Alias> alias;
    private Set<Address> address;
    private Set<PatientDisability> disability;
    private SortedSet<PatientFacility> facility;
    private Set<PatientRecordFlag> patientRecordFlag;
    private Set<Telecom> telecom;
    private Set<PatientLanguage> language;
    private Set<PatientEthnicity> ethnicity;
    private Set<PatientRace> race;
    private Set<PatientExposure> exposure;
    private Set<PatientContact> contact;
    private Set<ServiceConnectedCondition> scCondition;
    private Set<PatientInsurance> insurance;

    public PatientDemographics() {
        super(null);
    }

    @JsonCreator
    public PatientDemographics(Map<String, Object> vals) {
        super(vals);
    }

    public String getReligionCode() {
        return religionCode;
    }

    public String getReligionName() {
        return religionName;
    }

    public boolean getVeteran() {
        return veteran;
    }

    @Deprecated
    public PointInTime getLastUpdated() {
        return lastUpdated;
    }

    @Deprecated
    public void setLastUpdated(PointInTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getDomainUpdated() {
        return domainUpdated;
    }

    @JsonManagedReference("patient-alias")
    public Set<Alias> getAlias() {
        return alias;
    }

    public Set<Address> getAddress() {
        return address;
    }

    @JsonManagedReference("patient-disability")
    public Set<PatientDisability> getDisability() {
        return disability;
    }

    @JsonManagedReference("patient-facility")
    public SortedSet<PatientFacility> getFacility() {
        return facility;
    }

    @JsonManagedReference("patient-record-flag")
    public Set<PatientRecordFlag> getPatientRecordFlag() {
        return patientRecordFlag;
    }

    public Set<Telecom> getTelecom() {
        return telecom;
    }

    @JsonManagedReference("patient-language")
    public Set<PatientLanguage> getLanguage() {
        return language;
    }

    @JsonManagedReference("patient-ethnicity")
    public Set<PatientEthnicity> getEthnicity() {
        return ethnicity;
    }

    @JsonManagedReference("patient-race")
    public Set<PatientRace> getRace() {
        return race;
    }

    @JsonManagedReference("patient-exposure")
    public Set<PatientExposure> getExposure() {
        return exposure;
    }

    @JsonManagedReference("patient-contact")
    public Set<PatientContact> getContact() {
        return contact;
    }

    @JsonManagedReference("patient-scCondition")
    public Set<ServiceConnectedCondition> getScCondition() {
        return scCondition;
    }

    @JsonManagedReference("patient-insurance")
    public Set<PatientInsurance> getInsurance() {
        return insurance;
    }

    public PatientFacility getHomeFacility() {
        if (facility == null) {
            return null;
        }

        for (PatientFacility facility : this.facility) {
            if (facility.isHomeSite()) {
                return facility;
            }
        }
        return null;
    }

    // Note: localId mapping stuff should probably be managed somewhere other than facility list in future
    public String getLocalPatientIdForSystem(String systemId) {
        Assert.hasText(systemId, "[Assertion failed] - 'systemId' must have text; it must not be null, empty, or blank");

        String localPatientId = null;
        if (StringUtils.hasText(getUid())) {
            String systemIdInUid = UidUtils.getSystemIdFromPatientUid(getUid());
            if (systemIdInUid.equalsIgnoreCase(systemId)) {
                localPatientId = UidUtils.getLocalPatientIdFromPatientUid(getUid());
            }
        }
        if (localPatientId != null) return localPatientId;

        if (facility == null) return null;
        for (PatientFacility f : facility) {
            if (systemId.equalsIgnoreCase(f.getSystemId()) && f.getLocalPatientId() != null) {
                return f.getLocalPatientId();
            }
        }
        return null;
    }

    // Note: list of facility currently only on PatientDemographics, but not Patient object, localId mapping stuff should probably be managed somewhere other than facility list in future
    public String getLocalPatientIdForFacility(String facilityCode) {
        Assert.hasText(facilityCode, "[Assertion failed] - 'systemId' must have text; it must not be null, empty, or blank");
        if (facility == null) return null;

        for (PatientFacility f : facility) {
            if (facilityCode.equalsIgnoreCase(f.getCode()) && f.getLocalPatientId() != null) {
                return f.getLocalPatientId();
            }
        }
        return null;
    }

    @JsonIgnore
    @POMIndex.MultiValueJDSIndex(name = "patient-ids", subfield = "")
    public Set<String> getPatientIds() {
        List<String> ptIds = new ArrayList<String>();
        if (StringUtils.hasText(pid)) {
            // as long as this turns into a urn:va:vpr:123-ish format we are ok here
            ptIds.add(pid);
        }
        if (StringUtils.hasText(getUid())) {
            String systemId = UidUtils.getSystemIdFromPatientUid(getUid());
            String localPatientId = UidUtils.getLocalPatientIdFromPatientUid(getUid());
            ptIds.add(systemId + ";" + localPatientId);
        }
        if (StringUtils.hasText(getIcn())) {
            ptIds.add(getIcn());
        }
        if (StringUtils.hasText(getSsn())) {
            // are SSN's unique in the va?
            ptIds.add(getSsn());
        }

        Set<String> patientIds = new TreeSet<String>(ptIds);
        if (facility != null) {
            for (PatientFacility fac : facility) {
                if (fac.getSystemId() != null && fac.getLocalPatientId() != null) {
                    patientIds.add(fac.getSystemId() + ";" + fac.getLocalPatientId());
                }
                if (fac.getCode() != null && fac.getLocalPatientId() != null) {
                    patientIds.add(fac.getCode() + ";" + fac.getLocalPatientId());
                }
            }
        }
        return patientIds;
    }

    public String getFamilyName() {
        return familyName;
    }

    public String getGivenNames() {
        return givenNames;
    }

    public String getGenderCode() {
        return genderCode;
    }

    public String getGenderName() {
        return genderName;
    }

    public String getBriefId() {
        return briefId;
    }

    public String getSsn() {
        return ssn;
    }

    /**
     * Last 4 digits of social security number (SSN).
     */
    public String getLast4() {
        if (last4 == null) {
            if (ssn != null && ssn.length() == 9) {
                last4 = ssn.substring(5);
            }
        }
        return last4;
    }

    /**
     * "Last 5" is shorthand for the first initial of the last name followed by the last 4 digits of social security
     * number (SSN).
     */
    public String getLast5() {
        if (last5 == null) {
            if (familyName != null && familyName.length()>0) {
                String last4 = getLast4();
                if (last4 != null) {
                    last5 = familyName.substring(0, 1).toUpperCase() + last4;
                }
            }
        }
        return last5;
    }

    @JsonIgnore
    public boolean isMale() {
        return getGenderCode().endsWith("M");
    }

    public String getFullName() {
        return fullName;
    }

    public String getDisplayName() {
        if (displayName == null) {
            displayName = VistaStringUtils.nameCase(getFullName());
        }
        return displayName;
    }

    @JsonIgnore
    public boolean isFemale() {
        return getGenderCode().endsWith("F");
    }

    public String getIcn() {
        return icn;
    }

    public PointInTime getBirthDate() {
        return birthDate;
    }

    public PointInTime getDeceased() {
        return deceased;
    }

    @JsonView(JSONViews.WSView.class)
    public Integer getAge() {
        return calculateAge(birthDate, deceased);
    }

    public String getMaritalStatusCode() {
        return maritalStatusCode;
    }

    public String getMaritalStatusName() {
        return maritalStatusName;
    }

    public String getScPercent() {
        return scPercent;
    }

    public boolean isServiceConnected() {
        return serviceConnected;
    }

    public String getServiceConnectedPercent() {
        return serviceConnectedPercent;
    }

    public boolean isVeteran() {
        return veteran;
    }

    public String getLrdfn() {
        return lrdfn;
    }

    public String getLocalId() {
        return localId;
    }

    @JsonIgnore
    public Integer getAgeInDays() {
        if (birthDate == null) {
            return null;
        }
        if (deceased != null) {
            return Days.daysBetween(birthDate.toLocalDate(), deceased.toLocalDate()).getDays();
        } else {
            return Days.daysBetween(birthDate.toLocalDate(), PointInTime.today()).getDays();
        }
    }

    // it feels weird decorating domain objects with WS specific info - maybe implement in separate marshaller?
    @JsonView(JSONViews.WSView.class)
    public String getPhotoHRef() {
        return "/vpr/v1/" + getPid() + "/photo";
    }

    public Boolean isSensitive() {
        return sensitive;
    }

    public void addToRaces(PatientRace race) {
        if (this.race == null) {
            this.race = new HashSet<PatientRace>();
        }
        this.race.add(race);
        race.setPatient(this);
    }

    public void addToEthnicities(PatientEthnicity ethnicity) {
        if (this.ethnicity == null) {
            this.ethnicity = new HashSet<PatientEthnicity>();
        }
        this.ethnicity.add(ethnicity);
        ethnicity.setPatient(this);
    }

    public void addToLanguages(PatientLanguage language) {
        if (this.language == null) {
            this.language = new HashSet<PatientLanguage>();
        }
        this.language.add(language);
        language.setPatient(this);
    }

    public void addToDisabilities(PatientDisability disability) {
        if (this.disability == null) {
            this.disability = new HashSet<PatientDisability>();
        }
        this.disability.add(disability);
        disability.setPatient(this);
    }

    public void addToFacilities(PatientFacility patientFacility) {
        if (facility == null) {
            facility = new TreeSet<PatientFacility>();
        }
        facility.add(patientFacility);
        patientFacility.setPatient(this);
    }

    public void addToAddresses(Address address) {
        if (this.address == null) {
            this.address = new HashSet<Address>();
        }
        this.address.add(address);
    }

    public void addToAliases(Alias alias) {
        if (this.alias == null) {
            this.alias = new HashSet<Alias>();
        }
        this.alias.add(alias);
        alias.setPatient(this);
    }

    public void addToTelecoms(Telecom telecom) {
        if (this.telecom == null) {
            this.telecom = new HashSet<Telecom>();
        }
        this.telecom.add(telecom);
    }

    public void addToPatientRecordFlags(PatientRecordFlag flag) {
        if (patientRecordFlag == null) {
            patientRecordFlag = new HashSet<PatientRecordFlag>();
        }
        patientRecordFlag.add(flag);
        flag.setPatient(this);
    }

    public void addToContacts(PatientContact support) {
        if (this.contact == null) {
            this.contact = new HashSet<PatientContact>();
        }
        this.contact.add(support);
        support.setPatient(this);
    }

    public void addToExposures(PatientExposure exposure) {
        if (this.exposure == null) {
            this.exposure = new HashSet<PatientExposure>();
        }
        this.exposure.add(exposure);
        exposure.setPatient(this);
    }

    public void addToScConditions(ServiceConnectedCondition scCondition) {
        if (this.scCondition == null) {
            this.scCondition = new HashSet<ServiceConnectedCondition>();
        }
        this.scCondition.add(scCondition);
        scCondition.setPatient(this);
    }

    public void addToInsurance(PatientInsurance insurance) {
        if (this.insurance == null) {
            this.insurance = new HashSet<PatientInsurance>();
        }
        this.insurance.add(insurance);
        insurance.setPatient(this);
    }

    @Override
    public String toString() {
        StringBuffer buff = new StringBuffer();
        buff.append(this.getClass().getName());
        Map<String, Object> ids = new HashMap<String, Object>();
        ids.put("pids", getPatientIds());
        buff.append(ids);
        return buff.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PatientDemographics)) return false;

        PatientDemographics patient = (PatientDemographics) o;
        if (pid == null && icn == null) return false;

        if (pid != null ? !pid.equals(patient.pid) : patient.pid != null) return false;
        if (icn != null ? !icn.equals(patient.icn) : patient.icn != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = pid != null ? pid.hashCode() : 0;
        result = 31 * result + (icn != null ? icn.hashCode() : 0);
        if (result == 0)
            return super.hashCode();
        else
            return result;
    }

    public static Integer calculateAge(PointInTime dateOfBirth, PointInTime died) {
        if (dateOfBirth == null) {
            return null;
        }
        PointInTime endPoint = (died!=null?died:PointInTime.today());
        IntervalOfTime ivt = new IntervalOfTime(dateOfBirth, endPoint);
        return ivt.toPeriod().getYears();
    }

    // TODO: move this somewhere else - not demographics - sync metadata
    public Integer getSyncErrorCount() {
        return syncErrorCount;
    }

    // TODO: move this somewhere else - not demographics - sync metadata
    public void incrementSyncErrorCount() {
        syncErrorCount++;
    }

    public static final Set<String> SHORT_DEMOGRAPHICS_PROPERTIES = Collections.unmodifiableSet(new HashSet(Arrays.asList("pid", "uid", "icn", "ssn", "displayName", "fullName", "familyName", "givenNames", "birthDate", "deceased", "sensitive", "genderCode", "genderName")));
}
