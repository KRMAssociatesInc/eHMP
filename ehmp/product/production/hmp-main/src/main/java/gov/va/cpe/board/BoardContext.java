package gov.va.cpe.board;

import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;

public interface BoardContext {
    String getCurrentBoardUid();
    ViewDefDef getCurrentBoard();
    void setCurrentBoardUid(String boardUid);
    void setCurrentBoard(ViewDefDef board);
}
