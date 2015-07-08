package gov.va.cpe.encounter;

import org.springframework.core.NamedThreadLocal;
import org.springframework.util.Assert;

public class EncounterContextHolder {
    private static final ThreadLocal<EncounterContext> contextHolder = new NamedThreadLocal<EncounterContext>("CPE Encounter Context");

    public static void clearContext() {
        contextHolder.remove();
    }

    public static EncounterContext getContext() {
        EncounterContext ctx = contextHolder.get();

        if (ctx == null) {
            ctx = createEmptyContext();
            contextHolder.set(ctx);
        }

        return ctx;
    }

    public static void setContext(EncounterContext context) {
        Assert.notNull(context, "Only non-null EncounterContext instances are permitted");
        contextHolder.set(context);
    }

    public static EncounterContext createEmptyContext() {
        return new ThreadLocalEncounterContext();
    }
}
