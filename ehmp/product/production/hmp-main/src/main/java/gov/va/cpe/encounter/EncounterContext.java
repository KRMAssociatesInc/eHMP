package gov.va.cpe.encounter;

import gov.va.cpe.vpr.Encounter;

public interface EncounterContext {
    String getCurrentEncounterUid();
    Encounter getCurrentEncounter();
    void setCurrentEncounterUid(String encounterUid);
    void setCurrentEncounter(Encounter encounter);
}
