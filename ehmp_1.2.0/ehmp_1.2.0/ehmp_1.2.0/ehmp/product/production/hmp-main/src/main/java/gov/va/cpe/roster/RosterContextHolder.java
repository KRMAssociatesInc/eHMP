package gov.va.cpe.roster;

import org.springframework.core.NamedThreadLocal;
import org.springframework.util.Assert;

/**
 * Associates a given {@link RosterContext} with the current execution thread.
 */
public class RosterContextHolder {
    private static final ThreadLocal<RosterContext> contextHolder = new NamedThreadLocal<RosterContext>("CPE Roster Context");

    public static void clearContext() {
        contextHolder.remove();
    }

    public static RosterContext getContext() {
        RosterContext ctx = contextHolder.get();

        if (ctx == null) {
            ctx = createEmptyContext();
            contextHolder.set(ctx);
        }

        return ctx;
    }

    public static void setContext(RosterContext context) {
        Assert.notNull(context, "Only non-null TeamContext instances are permitted");
        contextHolder.set(context);
    }

    public static RosterContext createEmptyContext() {
        return new ThreadLocalRosterContext();
    }
}
