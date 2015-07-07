package gov.va.cpe.team;

import org.springframework.core.NamedThreadLocal;
import org.springframework.util.Assert;

/**
 * Associates a given {@link TeamContext} with the current execution thread.
 */
public class TeamContextHolder {
    private static final ThreadLocal<TeamContext> contextHolder = new NamedThreadLocal<TeamContext>("CPE Team Context");

    public static void clearContext() {
        contextHolder.remove();
    }

    public static TeamContext getContext() {
        TeamContext ctx = contextHolder.get();

        if (ctx == null) {
            ctx = createEmptyContext();
            contextHolder.set(ctx);
        }

        return ctx;
    }

    public static void setContext(TeamContext context) {
        Assert.notNull(context, "Only non-null TeamContext instances are permitted");
        contextHolder.set(context);
    }

    public static TeamContext createEmptyContext() {
        return new ThreadLocalTeamContext();
    }
}
