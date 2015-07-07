package gov.va.hmp.ptselect;

import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.hmp.healthtime.PointInTime;

/**
 * Object that carries the extra patient selection metadata like appointment time in clinic or room/bed on the ward to
 * be displayed alongside other patient selection info.
 */
public class VistaPatientSelect {
    private String pid;
    private String sourceDisplayName;
    private String sourceName;
    private String sourceShortName;
    private String sourceUid;
    private String locationName;
    private String locationShortName;
    private String locationUid;
    private String roomBed;
    private PointInTime appointment;
    private String patientType;
    private String appointmentUid;
    private String admissionUid;

    @JsonCreator
    public VistaPatientSelect() {
    }

    public VistaPatientSelect(String pid, String sourceDisplayName, String patientType, String roomBed, PointInTime appointment, String appointmentUid, String admissionUid) {
        this.pid = pid;
        this.sourceDisplayName = sourceDisplayName;
        this.patientType = patientType;
        this.roomBed = roomBed;
        this.appointment = appointment;
        this.appointmentUid = appointmentUid;
        this.admissionUid = admissionUid;
    }

    public String getPid() {
        return pid;
    }

    public String getSourceDisplayName() {
        return sourceDisplayName;
    }

    public String getSourceName() {
        return sourceName;
    }

    public String getSourceShortName() {
        return sourceShortName;
    }

    public String getSourceUid() {
        return sourceUid;
    }

    public String getPatientType() {
        return patientType;
    }

    public String getLocationName() {
        return locationName;
    }

    public String getLocationShortName() {
        return locationShortName;
    }

    public String getLocationUid() {
        return locationUid;
    }

    public PointInTime getAppointment() {
        return appointment;
    }

    public String getRoomBed() {
        return roomBed;
    }

    public String getAppointmentUid() { return appointmentUid; }

    public String getAdmissionUid() {
        return admissionUid;
    }
}
