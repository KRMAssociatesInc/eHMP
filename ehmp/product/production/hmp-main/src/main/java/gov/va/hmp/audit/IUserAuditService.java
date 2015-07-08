package gov.va.hmp.audit;

/**
 * Interface for logging audit messages of user actions.
 * <p/>
 * An audit message consists of a subject, a verb (the action) and an object.  The audit service automatically set's the subject to
 * the user carrying out the action via SpringSecurity's {@link org.springframework.security.core.context.SecurityContext}
 * <pre>
 * {@code
 *    service.audit("ate", "cereal");
 * }
 * </pre>
 */
public interface IUserAuditService {
    void audit(String verb, String object);
}
