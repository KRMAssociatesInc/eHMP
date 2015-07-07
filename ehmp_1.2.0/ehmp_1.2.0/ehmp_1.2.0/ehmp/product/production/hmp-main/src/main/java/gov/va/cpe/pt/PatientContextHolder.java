package gov.va.cpe.pt;

import org.springframework.core.NamedThreadLocal;
import org.springframework.util.Assert;

public class PatientContextHolder {
    private static final ThreadLocal<PatientContext> contextHolder = new NamedThreadLocal<PatientContext>("CPE Patient Context");

    public static void clearContext() {
        contextHolder.remove();
    }

    public static PatientContext getContext() {
        PatientContext ctx = contextHolder.get();

        if (ctx == null) {
            ctx = createEmptyContext();
            contextHolder.set(ctx);
        }

        return ctx;
    }

    public static void setContext(PatientContext context) {
        Assert.notNull(context, "Only non-null PatientContext instances are permitted");
        contextHolder.set(context);
    }

    public static PatientContext createEmptyContext() {
        return new ThreadLocalPatientContext();
    }
}
