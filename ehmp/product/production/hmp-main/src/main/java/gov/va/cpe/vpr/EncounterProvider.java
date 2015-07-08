package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.Map;

public class EncounterProvider extends AbstractPOMObject {
    private Long id;
    private Boolean primary;
    private String role;
    private String providerUid;
    private String providerName;
    private String providerDisplayName;
    private Encounter encounter;

    public EncounterProvider() {
        super(null);
    }

    @JsonCreator
    public EncounterProvider(Map<String, Object> vals) {
        super(vals);
    }

    public Long getId() {
        return id;
    }

    public Boolean getPrimary() {
        return primary;
    }

    public void setPrimary(Boolean primary) {
        this.primary = primary;
    }

    public String getRole() {
        return role;
    }

    public String getProviderUid() {
        return providerUid;
    }

    public String getProviderName() {
        return providerName;
    }

    public String getProviderDisplayName() {
        if (providerDisplayName == null) {
            this.providerDisplayName = VistaStringUtils.nameCase(getProviderName());
        }
        return providerDisplayName;
    }

    @JsonBackReference("encounter-provider")
    public Encounter getEncounter() {
        return encounter;
    }

    void setEncounter(Encounter encounter) {
        this.encounter = encounter;
    }
}
