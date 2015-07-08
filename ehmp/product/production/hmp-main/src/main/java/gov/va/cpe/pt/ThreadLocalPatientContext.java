package gov.va.cpe.pt;

import gov.va.cpe.ctx.AbstractThreadLocalContext;
import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.sync.ISyncService;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.hmp.audit.IUserAuditService;
import gov.va.hmp.auth.UserContext;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ClassUtils;

import java.util.HashMap;
import java.util.Map;

public class ThreadLocalPatientContext extends AbstractThreadLocalContext<PatientDemographics> implements PatientContext {

    public static final String PATIENT_CONTEXT_USER_PREF_KEY = "cpe.context.patient";
    private static final long serialVersionUID = 5947355752231911886L;

    private transient VistaPatientContextInfo vistaPatientContextInfo;

    private transient IVistaPatientContextService vistaPatientContextService;
    private transient PatientService patientService;
    private transient ISyncService syncService;
    private transient IUserAuditService auditService;

    @Override
    protected Class<PatientDemographics> getObjectType() {
        return PatientDemographics.class;
    }

    @Override
    protected String getUserPreferenceKey() {
        return PATIENT_CONTEXT_USER_PREF_KEY;
    }

    @Autowired
    public void setAuditService(IUserAuditService auditService) {
        this.auditService = auditService;
    }

    @Autowired
    public void setVistaPatientContextService(IVistaPatientContextService vistaPatientContextService) {
        this.vistaPatientContextService = vistaPatientContextService;
    }

    @Autowired
    public void setSyncService(ISyncService syncService) {
        this.syncService = syncService;
    }

    @Autowired
    public void setPatientService(PatientService patientService) {
        this.patientService = patientService;
    }

    public String getCurrentPatientPid() {
        return getCurrentUid();
    }

    protected void postInit() {
        if (StringUtils.isNotEmpty(getCurrentPatientPid())) {
            try {
                fetchVistaPatientContextInfoAndSetCurrentPatientDemographics(false);
            } catch (IllegalArgumentException e) {
                setCurrentPatientPid(null);
            }
        }
    }
    public void setCurrentPatientPid(String pid) {
        String oldPid = getCurrentPatientPid();
        clearContext();
        this.currentUid = pid;
        if (!StringUtils.equals(oldPid, getCurrentPatientPid())) {
            // force load of demographics object (and additional stuff) from VistA
            getCurrentPatient();
        }
    }

    @Override
    protected PatientDemographics fetchCurrentObject() {
        if (StringUtils.isNotEmpty(getCurrentPatientPid())) {
            if (vistaPatientContextInfo == null) {
                try {
                    return fetchVistaPatientContextInfoAndSetCurrentPatientDemographics(isInitialized());
                } catch (IllegalArgumentException e) {
                    logger.warn("unable to fetch VistA patient context info for pid '" + getCurrentPatientPid() + "'", e);
                }
            }
        }
        clearContext();
        return null;
    }

    private PatientDemographics fetchVistaPatientContextInfoAndSetCurrentPatientDemographics(boolean updateJdsAndUserParam) {
        if (this.vistaPatientContextService == null) {
            logger.error("vistaPatientContextService has not been set; unable to fetch patient context info from VistA");
            return null;
        }

            if (syncService.isNotLoadedAndNotLoading(getCurrentPatientPid())) {
                syncService.subscribePatient(PidUtils.getVistaId(getCurrentPatientPid()), getCurrentPatientPid());
                auditService.audit("sync", String.format("patient pid=%s via patient context change", getCurrentPatientPid()));
            }
            this.vistaPatientContextInfo = this.vistaPatientContextService.fetchVistaPatientContextInfo(getCurrentPatientPid(), updateJdsAndUserParam);
            if (updateJdsAndUserParam && logger.isDebugEnabled()) {
                logger.debug("Saved {} '{}'", ClassUtils.getShortName(this.getClass()), getCurrentPatientPid());
            }
            if (this.vistaPatientContextInfo != null) {
                PatientDemographics demographics = this.vistaPatientContextInfo.getPatientDemographics();
                if (updateJdsAndUserParam) {
                    demographics = jdsDao.save(demographics);
                }

                return demographics;
            }

            return null;

    }

    @Override
    protected void clearContext() {
        super.clearContext();
        this.vistaPatientContextInfo = null;
    }

    public PatientDemographics getCurrentPatient() {
        return getCurrentObject();
    }

    @Override
    public PatientChecks getCurrentPatientChecks() {
        return this.vistaPatientContextInfo != null ? this.vistaPatientContextInfo.getPatientChecks() : null;
    }

    @Override
    public PatientDemographicsAdditional getCurrentPatientAdditionalDemographics() {
        return this.vistaPatientContextInfo != null ? this.vistaPatientContextInfo.getAdditionalPatientDemographics() : null;
    }

    @Override
    public SyncStatus getCurrentPatientSyncStatus() {
        SyncStatus syncStatus = syncService.getPatientSyncStatus(getCurrentPatientPid());
        return syncStatus;
    }

    public Map<String, Object> getCurrentPatientLocation() {
        Map<String, Object> rslt = null;
        if (!syncService.isNotLoadedAndNotLoading(getCurrentPatientPid())) {
            Encounter enc = patientService.getCurrentVisit(getCurrentPatientPid());
            if (enc != null) {
                rslt = new HashMap<String, Object>();
                rslt.put("location", enc.getLocationName());
                rslt.put("roomBed", enc.getRoomBed());
            }
        }
        return rslt;
    }

    @Override
    public Boolean isCurrentPatientInPatient() {
        if (!syncService.isNotLoadedAndNotLoading(getCurrentPatientPid())) {
            return patientService.isInPatient(getCurrentPatientPid());
        }
        return false;
    }

    public void setCurrentPatient(PatientDemographics patient) {
        if (patient == null) {
            setCurrentPatientPid(null);
        } else {
            setCurrentPatientPid(patient.getPid());
        }
    }
}
