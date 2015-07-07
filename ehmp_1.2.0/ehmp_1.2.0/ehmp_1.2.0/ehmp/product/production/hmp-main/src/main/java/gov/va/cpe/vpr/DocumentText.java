package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.healthtime.PointInTime;

import java.util.List;
import java.util.Map;

import static gov.va.cpe.vpr.DocumentClinician.Role;

public class DocumentText extends AbstractPOMObject {

    private List<DocumentClinician> clinicians;
    private String content;
    private PointInTime dateTime;
    private String status;
    private String urgency;
    private PointInTime enteredDateTime;

    @JsonCreator
    public DocumentText(Map<String, Object> vals) {
        super(vals);
    }

    public DocumentText() {
        super(null);
    }

    public String getUrgency() {
        return urgency;
    }

    public PointInTime getEnteredDateTime() {
        return enteredDateTime;
    }

    public List<DocumentClinician> getClinicians() {
        return clinicians;
    }

    public String getContent() {
        return content;
    }

    public PointInTime getDateTime() {
        return dateTime;
    }

    /**
     * @see "VistA FileMan TIU DOCUMENT,AUTHOR/DICTATOR(8925,1208)"
     */
    public String getStatus() {
        return status;
    }

    public String getAuthorUid() {
        return getClinicianUidForRole(Role.AUTHOR_DICTATOR);
    }

    public String getAuthor() {
        return getClinicianNameForRole(Role.AUTHOR_DICTATOR);
    }

    public String getAuthorDisplayName() {
        return getClinicianDisplayNameForRole(Role.AUTHOR_DICTATOR);
    }

    public String getCosignerUid() {
        return getClinicianUidForRole(Role.COSIGNER);
    }

    public String getCosigner() {
        return getClinicianNameForRole(Role.COSIGNER);
    }

    public String getCosignerDisplayName() {
        return getClinicianDisplayNameForRole(Role.COSIGNER);
    }

    public String getSignerUid() {
        return getClinicianUidForRole(Role.SIGNER);
    }

    public String getSigner() {
        return getClinicianNameForRole(Role.SIGNER);
    }

    public String getSignerDisplayName() {
        return getClinicianDisplayNameForRole(Role.SIGNER);
    }

    public String getAttendingUid() {
        return getClinicianUidForRole(Role.ATTENDING_PHYSICIAN);
    }

    public String getAttending() {
        return getClinicianNameForRole(Role.ATTENDING_PHYSICIAN);
    }

    public String getAttendingDisplayName() {
        return getClinicianDisplayNameForRole(Role.ATTENDING_PHYSICIAN);
    }

    private String getClinicianUidForRole(Role role) {
        DocumentClinician clinician = getClinicianForRole(role);
        if (clinician == null) {
            return null;
        }
        return clinician.getUid();
    }

    private String getClinicianNameForRole(Role role) {
        DocumentClinician clinician = getClinicianForRole(role);
        if (clinician == null) {
            return null;
        }
        return clinician.getName();
    }

    private String getClinicianDisplayNameForRole(Role role) {
        DocumentClinician clinician = getClinicianForRole(role);
        if (clinician == null) {
            return null;
        }
        return clinician.getDisplayName();
    }

    // TODO: consider using a map here to avoid loops?
    private DocumentClinician getClinicianForRole(Role role) {
        if (clinicians == null) return null;
        for (DocumentClinician clinician : clinicians) {
            if (role.equals(clinician.getRole())) {
                return clinician;
            }
        }
        return null;
    }
}
