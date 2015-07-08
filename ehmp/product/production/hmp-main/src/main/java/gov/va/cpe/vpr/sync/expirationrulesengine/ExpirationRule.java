package gov.va.cpe.vpr.sync.expirationrulesengine;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.SyncStatus.VistaAccountSyncStatus;
import gov.va.hmp.healthtime.PointInTime;

import org.slf4j.Logger;

@JsonTypeInfo(  
    use = JsonTypeInfo.Id.NAME,  
    include = JsonTypeInfo.As.PROPERTY,  
    property = "type")  
@JsonSubTypes({
    @Type(value = BasicExpirationRule.class, name = "basic"),
    @Type(value = IntegrationLevelExpirationRule.class, name = "integration")
})
public abstract class ExpirationRule {

    public abstract String getSiteId();
    public abstract PointInTime evaluate(SyncStatus syncStatus);
    protected abstract Logger getLogger();

    @JsonIgnore
    protected VistaAccountSyncStatus getVistaAccountSyncStatus(SyncStatus syncStatus) {
        if (syncStatus == null) {
            getLogger().error("ExpirationRule.getVistaAccountSyncStatus(SyncStatus) called with null parameter; this should never happen.");
            return null;
        }

        return syncStatus.getVistaAccountSyncStatusForSystemId(getSiteId());
    }

}
