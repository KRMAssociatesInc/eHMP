package gov.va.hmp.audit;

import gov.va.hmp.HmpProperties;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

/**
 * Default implementation of {@link IUserAuditService}
 */
@Service
public class UserAuditService implements IUserAuditService, EnvironmentAware {

    public static final String DEFAULT_AUDIT_LOGGER = "audit";

    private Logger logger = LoggerFactory.getLogger(DEFAULT_AUDIT_LOGGER);

    private UserContext userContext;

    private Environment environment;

    private boolean convertVerbFromInfinitiveToPastTense = true;

    public void setLogger(Logger logger) {
        this.logger = logger;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Override
    public void setEnvironment(Environment environment) {
       this.environment = environment;
    }

    @Override
    public void audit(String verb, String object) {
        String serverId = getHmpServerId();
        String subject = getSubject();
        verb = modifyVerb(verb);
        audit(serverId, subject, verb, object);
    }

    public void setConvertVerbFromInfinitiveToPastTense(boolean convertVerbFromInfinitiveToPastTense) {
        this.convertVerbFromInfinitiveToPastTense = convertVerbFromInfinitiveToPastTense;
    }

    /**
     * @see "http://oxforddictionaries.com/words/verb-tenses-adding-ed-and-ing"
     */
    protected String modifyVerb(String verb) {
        if (convertVerbFromInfinitiveToPastTense) {
            // convert infinitive into past tense; not going to get too fancy (like in https://code.google.com/p/simplenlg/ for example)
            if (verb.endsWith("e")) {
                verb = verb + "d";
            } else {
                verb = verb + "ed";
            }
        }
        return verb;
    }

    private String getSubject() {
        if (userContext.isLoggedIn()) {
            HmpUserDetails user = userContext.getCurrentUser();
            return user.getDisplayName() + " (" + user.getUid() + ")";
        } else {
            return getHmpServerId();
        }
    }

    // note that timestamp is created along with log event itself
    protected void audit(String applicationId, String subject, String verb, String object) {
        if (object == null) {
            logger.info("{} {} (on {})", subject, verb, applicationId);
        } else {
            logger.info("{} {} {} (on {})", subject, verb, object, applicationId);
        }
    }

    private String getHmpServerId() {
        return environment.getProperty(HmpProperties.SERVER_ID);
    }
}
