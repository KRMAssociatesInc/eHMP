package gov.va.cpe.board;

import org.springframework.core.NamedThreadLocal;
import org.springframework.util.Assert;

public class BoardContextHolder {
    private static final ThreadLocal<BoardContext> contextHolder = new NamedThreadLocal<BoardContext>("CPE Board Context");

    public static void clearContext() {
        contextHolder.remove();
    }

    public static BoardContext getContext() {
        BoardContext ctx = contextHolder.get();

        if (ctx == null) {
            ctx = createEmptyContext();
            contextHolder.set(ctx);
        }

        return ctx;
    }

    public static void setContext(BoardContext context) {
        Assert.notNull(context, "Only non-null BoardContext instances are permitted");
        contextHolder.set(context);
    }

    public static BoardContext createEmptyContext() {
        return new ThreadLocalBoardContext();
    }
}
