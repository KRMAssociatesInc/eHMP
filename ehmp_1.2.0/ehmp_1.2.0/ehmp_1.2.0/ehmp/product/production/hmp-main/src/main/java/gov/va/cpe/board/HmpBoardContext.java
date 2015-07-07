package gov.va.cpe.board;

import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;
import org.springframework.stereotype.Service;

/**
 * Singleton service bean used to inject a {@link BoardContext} instance into other service beans.  This allows clients
 * to not have to reference {@link BoardContextHolder} directly.
 */
@Service("boardContext")
public class HmpBoardContext implements BoardContext {
    @Override
    public String getCurrentBoardUid() {
        BoardContext context = BoardContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentBoardUid();
    }

    @Override
    public ViewDefDef getCurrentBoard() {
        BoardContext context = BoardContextHolder.getContext();
        if (context == null) return null;
        return context.getCurrentBoard();
    }

    @Override
    public void setCurrentBoardUid(String boardUid) {
        BoardContext context = BoardContextHolder.getContext();
        if (context != null) {
            context.setCurrentBoardUid(boardUid);
        }
    }

    @Override
    public void setCurrentBoard(ViewDefDef board) {
        BoardContext context = BoardContextHolder.getContext();
        if (context != null) {
            context.setCurrentBoard(board);
        }
    }
}
