package gov.va.cpe.web;

import gov.va.cpe.board.BoardContext;
import gov.va.cpe.board.BoardContextHolder;
import gov.va.cpe.encounter.EncounterContext;
import gov.va.cpe.encounter.EncounterContextHolder;
import gov.va.cpe.pt.PatientContext;
import gov.va.cpe.pt.PatientContextHolder;
import gov.va.cpe.roster.RosterContext;
import gov.va.cpe.roster.RosterContextHolder;
import gov.va.cpe.team.TeamContext;
import gov.va.cpe.team.TeamContextHolder;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.util.ClassUtils;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.*;

/**
 * Populates the various thread-local bound context holders with information obtained from the HttpSession prior to the request, and once
 * the request has completed and clears the context holders.
 *
 * @see gov.va.cpe.ctx.AbstractThreadLocalContext
 */
public class CPESessionContextIntegrationFilter extends GenericFilterBean {
    static final String FILTER_APPLIED = "__spe_scif_applied";

    public static final String CPE_PATIENT_CONTEXT_KEY = "CPE_PATIENT_CONTEXT";
    public static final String CPE_TEAM_CONTEXT_KEY = "CPE_TEAM_CONTEXT";
    public static final String CPE_ROSTER_CONTEXT_KEY = "CPE_ROSTER_CONTEXT";
    public static final String CPE_BOARD_CONTEXT_KEY = "CPE_BOARD_CONTEXT";
    public static final String CPE_ENCOUNTER_CONTEXT_KEY = "CPE_ENCOUNTER_CONTEXT";

    private final Map<String, List<Class>> sessionKeyToContextClasses;

    public CPESessionContextIntegrationFilter() {
        Map<String, List<Class>> keysToContextClasses = new HashMap<>();
        keysToContextClasses.put(CPE_TEAM_CONTEXT_KEY, Arrays.<Class>asList(TeamContext.class, TeamContextHolder.class));
        keysToContextClasses.put(CPE_PATIENT_CONTEXT_KEY, Arrays.<Class>asList(PatientContext.class, PatientContextHolder.class));
        keysToContextClasses.put(CPE_ROSTER_CONTEXT_KEY, Arrays.<Class>asList(RosterContext.class, RosterContextHolder.class));
        keysToContextClasses.put(CPE_BOARD_CONTEXT_KEY, Arrays.<Class>asList(BoardContext.class, BoardContextHolder.class));
        keysToContextClasses.put(CPE_ENCOUNTER_CONTEXT_KEY, Arrays.<Class>asList(EncounterContext.class, EncounterContextHolder.class));
        sessionKeyToContextClasses = Collections.unmodifiableMap(keysToContextClasses);
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        if (request.getAttribute(FILTER_APPLIED) != null) {
            // ensure that filter is only applied once per request
            chain.doFilter(request, response);
            return;
        }

        final boolean debug = logger.isDebugEnabled();

        request.setAttribute(FILTER_APPLIED, Boolean.TRUE);

        HttpSession httpSession = request.getSession(false);

        Map<String, Object> contextsBeforeChainExecution = readContextsFromSession(httpSession);

        autowireAndInitialize(req, contextsBeforeChainExecution);

        try {
            setContextHolders(contextsBeforeChainExecution);

            chain.doFilter(request, response);
        } finally {
            Map<String, Object> contextsAfterChainExecution = getContextsFromContextHolders();

            // Crucial removal of all the ContextHolder contents - do this before anything else.
            clearContextHolders();

            // If HttpSession exists, store current contexts but only if each has actually changed in this thread
            if (httpSession != null) {
                storeContextsInSession(httpSession, contextsBeforeChainExecution, contextsAfterChainExecution);
            }

            request.removeAttribute(FILTER_APPLIED);

            if (debug) {
                logger.debug("All ContextHolders now cleared, as request processing completed");
            }
        }
    }

    private void storeContextsInSession(HttpSession httpSession, Map<String, Object> contextsBeforeChainExecution, Map<String, Object> contextsAfterChainExecution) {
        for (String sessionKey : sessionKeyToContextClasses.keySet()) {
            Object contextBeforeChainExecution = contextsBeforeChainExecution.get(sessionKey);
            Object contextAfterChainExecution = contextsAfterChainExecution.get(sessionKey);

            // We may have a new session, so check also whether the context attribute is set SEC-1561
            if ((contextBeforeChainExecution != contextAfterChainExecution) || httpSession.getAttribute(sessionKey) == null) {
                httpSession.setAttribute(sessionKey, contextAfterChainExecution);

                if (logger.isDebugEnabled()) {
                    logger.debug(ClassUtils.getShortName(sessionKeyToContextClasses.get(sessionKey).get(0)) + " stored to HttpSession: '" + contextAfterChainExecution + "'");
                }
            }
        }
    }

    private Map<String, Object> readContextsFromSession(HttpSession httpSession) {
        Map<String, Object> contexts = new HashMap<>();
        for (Map.Entry<String, List<Class>> entry : sessionKeyToContextClasses.entrySet()) {
            Object context = readContextFromSession(entry.getValue().get(0), httpSession, entry.getKey());
            if (context == null) {
                if (logger.isDebugEnabled()) {
                    logger.debug("No " + ClassUtils.getShortName(entry.getValue().get(0)) + " was available from the HttpSession. A new one will be created.");
                }
                context = createNewContext(entry.getValue().get(1));
            }
            if (context != null) {
                contexts.put(entry.getKey(), context);
            }
        }
        return contexts;
    }

    // tries to call "createEmptyContext" on ContextHolder - a convention the ContextHolder class should adhere to
    private Object createNewContext(Class contextHolderClass) {
        try {
            Method createEmptyContextMethod = contextHolderClass.getMethod("createEmptyContext");
            return createEmptyContextMethod.invoke(null);
        } catch (Exception e) {
            logger.error("Unable to invoke createEmptyContext() on " + contextHolderClass.getName(), e);
            return null;
        }
    }

    private Map<String, Object> getContextsFromContextHolders() {
        Map<String, Object> contexts = new HashMap<>();
        for (Map.Entry<String, List<Class>> entry : sessionKeyToContextClasses.entrySet()) {
            Class contextHolderClass = entry.getValue().get(1);
            try {
                Method getContextMethod = contextHolderClass.getMethod("getContext");
                Object context = getContextMethod.invoke(null);
                contexts.put(entry.getKey(), context);
            } catch (Exception e) {
                logger.error("Unable to invoke getContext() on " + contextHolderClass.getName(), e);
            }
        }
        return contexts;
    }

    private void setContextHolders(Map<String, Object> contexts) {
        for (Map.Entry<String, Object> entry : contexts.entrySet()) {
            Class contextClass = sessionKeyToContextClasses.get(entry.getKey()).get(0);
            Class contextHolderClass = sessionKeyToContextClasses.get(entry.getKey()).get(1);
            try {
                Method setContextMethod = contextHolderClass.getMethod("setContext", contextClass);
                setContextMethod.invoke(null, entry.getValue());
            } catch (Exception e) {
                logger.error("Unable to set " + ClassUtils.getShortName(contextClass) + " in " + contextHolderClass.getName(), e);
            }
        }
    }

    private void clearContextHolders() {
        for (List<Class> contextClasses : sessionKeyToContextClasses.values()) {
            Class contextHolderClass = contextClasses.get(1);
            try {
                Method clearContextMethod = contextHolderClass.getMethod("clearContext");
                clearContextMethod.invoke(null);
            } catch (Exception e) {
                logger.error("Unable to clear context in " + contextHolderClass.getName(), e);
            }
        }
    }

    private void autowireAndInitialize(ServletRequest req, Map<String, Object> contexts) {
        ApplicationContext appContext = WebApplicationContextUtils.getWebApplicationContext(req.getServletContext());
        AutowireCapableBeanFactory autowirer = appContext.getAutowireCapableBeanFactory();
        for (Map.Entry<String,Object> entry : contexts.entrySet()) {
            Object context = entry.getValue();
            autowirer.autowireBean(context);
            try {
                if (context instanceof InitializingBean) {
                    ((InitializingBean) context).afterPropertiesSet();
                }
            } catch (Exception e) {
                logger.warn("Invocation of init method failed of context: " + entry.getKey(), e);
            }

        }
    }

    private <T> T readContextFromSession(Class<T> clazz, HttpSession httpSession, String sessionAttribute) {
        final boolean debug = logger.isDebugEnabled();

        if (httpSession == null) {
            if (debug) {
                logger.debug("No HttpSession currently exists");
            }

            return null;
        }

        // Session exists, so try to obtain a context from it.

        Object contextFromSession = httpSession.getAttribute(sessionAttribute);

        if (contextFromSession == null) {
            if (debug) {
                logger.debug("HttpSession returned null object for " + sessionAttribute);
            }

            return null;
        }

        // We now have the team context object from the session.
        if (!(clazz.isAssignableFrom(contextFromSession.getClass()))) {
            if (logger.isWarnEnabled()) {
                logger.warn(sessionAttribute + " did not contain a " + clazz.getName() + " but contained: '"
                        + contextFromSession + "'; are you improperly modifying the HttpSession directly "
                        + "(you should always use TeamContextHolder) or using the HttpSession attribute "
                        + "reserved for this class?");
            }

            return null;
        }

        if (debug) {
            logger.debug("Obtained a valid " + clazz.getName() + " from " + sessionAttribute + ": '" + contextFromSession + "'");
        }

        // Everything OK. The only non-null return from this method.

        return (T) contextFromSession;
    }

}
