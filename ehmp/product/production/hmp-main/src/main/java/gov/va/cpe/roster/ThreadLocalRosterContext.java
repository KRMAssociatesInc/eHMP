package gov.va.cpe.roster;

import gov.va.cpe.ctx.AbstractThreadLocalContext;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import org.springframework.beans.factory.annotation.Autowired;

public class ThreadLocalRosterContext extends AbstractThreadLocalContext<Roster> implements RosterContext {

    public static final String ROSTER_CONTEXT_USER_PREF_KEY = "cpe.context.roster";
    private static final long serialVersionUID = 3018956966063868083L;

    private transient ISyncService syncService;
    private transient UserContext userContext;

    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Override
    protected Class<Roster> getObjectType() {
        return Roster.class;
    }

    @Override
    protected String getUserPreferenceKey() {
        return ROSTER_CONTEXT_USER_PREF_KEY;
    }

    @Override
    public String getCurrentRosterUid() {
        return getCurrentUid();
    }

    @Override
    public Roster getCurrentRoster() {
        return getCurrentObject();
    }

    @Override
    public void setCurrentRosterUid(String rosterUid) {
        setCurrentUid(rosterUid);
        HmpUserDetails currentUser = userContext.getCurrentUser();
        if (currentUser != null) {
            Roster roster = getCurrentRoster();
            // FIXME: have rosters use PatientSelect objects?  their own RosterPatient objects?
//            for (Patient pt : roster.getPatients()) {
//                if (!syncService.isPatientLoaded(pt)) {
//                    syncService.subscribePatient(pt, currentUser.getVistaId());
//                }
//            }
        }
    }

    @Override
    public void setCurrentRoster(Roster roster) {
        setCurrentObject(roster);
    }
}
