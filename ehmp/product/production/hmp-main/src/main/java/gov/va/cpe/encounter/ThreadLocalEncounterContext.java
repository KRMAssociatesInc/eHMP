package gov.va.cpe.encounter;

import gov.va.cpe.ctx.AbstractThreadLocalContext;
import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.NotFoundException;
import org.apache.commons.lang.StringUtils;
import org.springframework.util.ClassUtils;

public class ThreadLocalEncounterContext extends AbstractThreadLocalContext<Encounter> implements EncounterContext {

    public static final String ENCOUNTER_CONTEXT_USER_PREF_KEY = "cpe.context.encounter";
    private static final long serialVersionUID = 7136281588072208200L;

    @Override
    protected Class<Encounter> getObjectType() {
        return Encounter.class;
    }

    @Override
    protected String getUserPreferenceKey() {
        return ENCOUNTER_CONTEXT_USER_PREF_KEY;
    }

    @Override
    public String getCurrentEncounterUid() {
        return getCurrentUid();
    }

    @Override
    public Encounter getCurrentEncounter() {
        return getCurrentObject();
    }

    @Override
    public void setCurrentEncounterUid(String encounter) {
       setCurrentUid(encounter);
    }

    @Override
    public void setCurrentEncounter(Encounter encounter) {
        setCurrentObject(encounter);
    }

    @Override
    protected void setCurrentUid(String uid) {
        setCurrentUid(uid, false);    // Do NOT try to find encounter obj ... just save uid
    }
}
