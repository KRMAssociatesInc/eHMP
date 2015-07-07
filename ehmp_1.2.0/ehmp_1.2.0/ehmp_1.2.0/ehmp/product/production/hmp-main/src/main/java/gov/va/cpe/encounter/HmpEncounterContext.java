package gov.va.cpe.encounter;

import gov.va.cpe.vpr.Encounter;
import org.springframework.stereotype.Service;

/**
 * Singleton service bean used to inject a {@link EncounterContext} instance into other service beans.  This allows clients
 * to not have to reference {@link EncounterContextHolder} directly.
 */
@Service("encounterContext")
public class HmpEncounterContext implements EncounterContext {
    @Override
    public String getCurrentEncounterUid() {
        EncounterContext context = EncounterContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentEncounterUid();
    }

    @Override
    public Encounter getCurrentEncounter() {
        EncounterContext context = EncounterContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentEncounter();
    }

    @Override
    public void setCurrentEncounterUid(String boardUid) {
        EncounterContext context = EncounterContextHolder.getContext();
        if (context != null) {
            context.setCurrentEncounterUid(boardUid);
        }
    }

    @Override
    public void setCurrentEncounter(Encounter encounter) {
        EncounterContext context = EncounterContextHolder.getContext();
        if (context != null) {
            context.setCurrentEncounter(encounter);
        }
    }
}
