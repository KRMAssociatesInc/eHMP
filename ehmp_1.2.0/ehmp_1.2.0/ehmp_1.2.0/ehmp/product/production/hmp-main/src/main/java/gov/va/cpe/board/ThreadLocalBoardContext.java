package gov.va.cpe.board;

import gov.va.cpe.ctx.AbstractThreadLocalContext;
import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;

public class ThreadLocalBoardContext extends AbstractThreadLocalContext<ViewDefDef> implements BoardContext {

    public static final String BOARD_CONTEXT_USER_PREF_KEY = "cpe.context.board";
    private static final long serialVersionUID = 7136281588072208261L;

    @Override
    protected Class<ViewDefDef> getObjectType() {
        return ViewDefDef.class;
    }

    @Override
    protected String getUserPreferenceKey() {
        return BOARD_CONTEXT_USER_PREF_KEY;
    }

    @Override
    public String getCurrentBoardUid() {
        return getCurrentUid();
    }

    @Override
    public ViewDefDef getCurrentBoard() {
        return getCurrentObject();
    }

    @Override
    public void setCurrentBoardUid(String boardUid) {
       setCurrentUid(boardUid);
    }

    @Override
    public void setCurrentBoard(ViewDefDef board) {
        setCurrentObject(board);
    }
}
