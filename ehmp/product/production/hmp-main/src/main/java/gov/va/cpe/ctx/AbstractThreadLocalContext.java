package gov.va.cpe.ctx;

import gov.va.cpe.param.IParamService;
import gov.va.cpe.vpr.NotFoundException;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.hmp.auth.UserContext;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ClassUtils;

import java.io.IOException;
import java.io.Serializable;

/**
 * Base class for context management objects stored in user's session.  Only the objects UID is stored in the session, and
 * is persisted to the HMP user preferences object stored in a VistA parameter.  If the context is getting reinitialized
 * (during user sign-on, for example), the UID is retrieved from the VistA parameter and then fetchObject() is called to
 * retrieve the associated object back into memory so it can be accessed easily.
 *
 * @see gov.va.cpe.web.CPESessionContextIntegrationFilter
 */
public abstract class AbstractThreadLocalContext<T extends IPOMObject> implements InitializingBean, Serializable {
    private static final long serialVersionUID = 5356696603810188723L;

    protected String currentUid;

    private transient boolean initialized = false;
    private transient T currentObject;

    protected transient IGenericPOMObjectDAO jdsDao;
    protected transient IParamService paramService;
    protected transient UserContext userContext;

    protected transient Logger logger = LoggerFactory.getLogger(getClass());

    protected abstract Class<T> getObjectType();

    protected abstract String getUserPreferenceKey();

    @Autowired
    public void setJdsDao(IGenericPOMObjectDAO jdsDao) {
        this.jdsDao = jdsDao;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setParamService(IParamService paramService) {
        this.paramService = paramService;
    }

    @Override
    public final void afterPropertiesSet() throws Exception {
        if (!initialized && userContext != null && userContext.isLoggedIn()) {
            try {
                if (StringUtils.isEmpty(this.currentUid)) {
                    String uid = (String) this.paramService.getUserPreference(getUserPreferenceKey());
                    if (StringUtils.isNotEmpty(uid)) {
                        this.currentUid = uid;
                    }
                    logger.debug("Restoring {} to '{}'", ClassUtils.getShortName(this.getClass()), this.currentUid);
               }
            } catch (IllegalStateException e) {
                // NOOP: this occasionally happens when reinflating a session from disk and there is no web request bound to the thread yet
            }

            // prime the current object
            if (StringUtils.isNotEmpty(currentUid)) {
                T current = this.getCurrentObject();
                if (current == null) {
                    logger.warn("Unable to restore {} to '{}'", ClassUtils.getShortName(this.getClass()), this.currentUid);
                    this.currentUid = null;
                }
            }

            initialized = true;
        }
   }

	protected String getCurrentUid() {
        return currentUid;
    }

    protected void setCurrentUid(String uid, boolean findObj) {
        String oldUid = this.currentUid;
        clearContext();
        this.currentUid = uid;
        if (!StringUtils.equals(oldUid, this.currentUid)) {
            if (jdsDao != null && StringUtils.isNotEmpty(this.currentUid) && findObj) {
                T o = jdsDao.findByUID(getObjectType(), this.currentUid);
                if (o == null)
                    throw new NotFoundException("A " + ClassUtils.getShortName(getObjectType()) + " with uid '" + this.currentUid + "' was not found.");
                this.currentObject = o;
            }
            if (paramService != null) {
                paramService.setUserPreference(getUserPreferenceKey(), (StringUtils.isNotEmpty(this.currentUid) ? this.currentUid : ""));
                logger.debug("Saved {} '{}'", ClassUtils.getShortName(this.getClass()), this.currentUid);
            }
        }
    }

    public boolean isInitialized() {
        return initialized;
    }

    protected final T getCurrentObject() {
        if (currentObject == null && StringUtils.isNotEmpty(currentUid)) {
            currentObject = fetchCurrentObject();
        }
        return currentObject;
    }

    protected T fetchCurrentObject() {
        return jdsDao.findByUID(getObjectType(), currentUid);
    }

    protected void setCurrentObject(T o) {
        if (o == null) {
            setCurrentUid(null, false);
            this.currentObject = null;
        } else {
            setCurrentUid(o.getUid(), false);
            this.currentObject = o;
        }
    }

    protected void clearContext() {
        this.currentUid = null;
        this.currentObject = null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AbstractThreadLocalContext that = (AbstractThreadLocalContext) o;

        if (currentUid != null ? !currentUid.equals(that.currentUid) : that.currentUid != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        return currentUid != null ? currentUid.hashCode() : 0;
    }

    private void readObject(java.io.ObjectInputStream in) throws IOException, ClassNotFoundException {
        in.defaultReadObject();

        if (this.logger == null) {
            this.logger = LoggerFactory.getLogger(getClass());
        }
    }

    protected void setCurrentUid(String uid) {
        setCurrentUid(uid, true);
    }
}
