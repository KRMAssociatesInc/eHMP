package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

/**
 * Placeholder for additional patient demographics info that is fetched at patient context change time and isn't in
 * {@link gov.va.cpe.vpr.PatientDemographics} because of its volatility.
 */
public class PatientDemographicsAdditional implements Serializable {

    private String admissionUid;
    private String roomBed;
    private String inpatientLocation;
    private String shortInpatientLocation;
    private String cwadf;
    private TeamInfo teamInfo;

    public PatientDemographicsAdditional(String admissionUid, String roomBed, String inpatientLocation, String shortInpatientLocation, String cwadf, TeamInfo teamInfo) {
        this.admissionUid = admissionUid;
        this.roomBed = roomBed;
        this.inpatientLocation = inpatientLocation;
        this.shortInpatientLocation = shortInpatientLocation;
        this.cwadf = cwadf;
        this.teamInfo = teamInfo;
    }

    public String getAdmissionUid() {
        return admissionUid;
    }

    public String getRoomBed() {
        return roomBed;
    }

    public String getInpatientLocation() {
        return inpatientLocation;
    }

    public String getShortInpatientLocation() {
        return shortInpatientLocation;
    }

    public String getCwadf() {
        return cwadf;
    }

    public TeamInfo getTeamInfo() {
        return teamInfo;
    }
}
