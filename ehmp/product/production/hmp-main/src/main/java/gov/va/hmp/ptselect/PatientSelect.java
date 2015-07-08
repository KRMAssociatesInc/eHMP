package gov.va.hmp.ptselect;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.pom.jds.JdsCollectionName;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.joda.time.Days;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.*;

/**
 * Models a "handle" for a patient, including its various local identifiers, national identifiers, and VPR identifiers
 * and a small set of demographic information.
 * <p/>
 * In the VA, patient's are identified using a
 */
@JdsCollectionName("pt-select")
public class PatientSelect extends AbstractPOMObject {

    private String pid;
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

    public PatientSelect() {
        super();
    }

    public PatientSelect(Map<String, Object> vals) {
        super(vals);
    }

    public String getPid() {
        return pid;
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

    @Override
    public String getSummary() {
        return getDisplayName();
    }

    @JsonView(JSONViews.JDBView.class)
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
        return PatientDemographics.calculateAge(birthDate, deceased);
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

    @JsonIgnore
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

        return new TreeSet<String>(ptIds);
    }

    // Note: list of facilities currently only on PatientDemographics, but not Patient object, localId mapping stuff should probably be managed somewhere other than facility list in future
    public String getLocalPatientIdForSystem(String systemId) {
        Assert.hasText(systemId, "[Assertion failed] - 'systemId' must have text; it must not be null, empty, or blank");
        if (!StringUtils.hasText(getUid())) return null;
        String systemIdInUid = UidUtils.getSystemIdFromPatientUid(getUid());
        if (systemIdInUid.equalsIgnoreCase(systemId)) {
            String localPatientIdInUid = UidUtils.getLocalPatientIdFromPatientUid(getUid());
            return localPatientIdInUid;
        }
        return null;
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
        if (!(o instanceof PatientSelect)) return false;

        PatientSelect patient = (PatientSelect) o;
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
}
