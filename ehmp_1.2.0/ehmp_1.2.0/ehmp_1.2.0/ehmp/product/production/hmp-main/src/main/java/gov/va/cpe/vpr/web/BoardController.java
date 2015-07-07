package gov.va.cpe.vpr.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.va.cpe.roster.RosterContext;
import gov.va.cpe.vpr.NotFoundException;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.FrameRegistry;
import gov.va.cpe.vpr.frameeng.FrameRunner;
import gov.va.cpe.vpr.queryeng.ColDef;
import gov.va.cpe.vpr.queryeng.ColDef.DeferredViewDefDefColDef;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewDef.ViewRenderAction;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.dynamic.IDynamicViewDefService;
import gov.va.cpe.vpr.queryeng.dynamic.columns.DeferredBoardColumnTask;
import gov.va.cpe.vpr.sync.vista.VistaVprPatientObjectDao;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.web.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;
import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.stringModelAndView;

@Controller
class BoardController {

    @Autowired
    FrameRegistry registry;

    @Autowired
    FrameRunner runner;

    @Autowired
    IDynamicViewDefService boardService;

    @Autowired
    UserContext userContext;

    @Autowired
    VistaVprPatientObjectDao vvdao;

    @Autowired
    RosterContext rosterContext;

    static AtomicLong boardReqId = new AtomicLong();

    @RequestMapping(value = "/vpr/board/{board}")
    public ModelAndView renderBoard(@PathVariable(value = "board") String board,
                                    @RequestParam(required = false) String mode,
                                    @RequestParam(required = false) String debug,
                                    @RequestParam(required = false) String breq,
                                    @RequestParam(value = "roster.uid", required = false) String rosterUid,
                                    HttpServletRequest request) throws Exception {

        ViewDef viewdef = getViewDef(board);
        if (viewdef == null) {
            throw new NotFoundException("Board '" + board + "' not found.");
        }

        Map<String, Object> params = WebUtils.extractGroupAndSortParams(request);
        params.put(ViewParam.SystemIDParam.SYSTEM_ID, userContext.getCurrentUser().getVistaId());

        if (rosterUid == null) {
            params.put("roster.uid", rosterContext.getCurrentRosterUid());
        }

        // execute the viewdef
        FrameTask task = runner.exec(viewdef, params);
        ViewRenderAction action = task.getAction(ViewRenderAction.class);

        // Get raw JSON so we can add in the faux board request ID.
        // Further requests for supplemental column data will use this board ID to get task data related to this original board request.
        JsonNode knowed = action.renderToJSON();
        if (breq == null) {
            breq = boardReqId.incrementAndGet() + "";
        }
        ((ObjectNode) knowed.get("metaData")).put("boardReqId", breq + "");
        String rslt = knowed.toString();
        int cds = 0;
        for (Map<String, Object> roe : action.getResults().getRows()) {
            for (ColDef cd : viewdef.getColumns()) {
                if (cd instanceof DeferredViewDefDefColDef) {
                    cds++;
                    DeferredViewDefDefColDef vc = (DeferredViewDefDefColDef) cd;
                    boardService.submitDeferredColTask(breq + "", vc, roe);
                }
            }
        }
        if (cds > 0) {
            HttpSession sess = request.getSession();
            String sessionId = request.getSession().getId();
            boardService.linkRequestToSession(breq, sessionId);
            //boardService.setupDaoListeners(vvdao, breq, sessionId);
        }
        return stringModelAndView(rslt, "application/json");
    }

    @RequestMapping(value = "/vpr/board/deferred/{boardReqId}")
    public ModelAndView getDeferredLoadData(
            @PathVariable(value = "boardReqId") String boardReqId,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String debug,
            HttpServletRequest request) {
        ArrayList<DeferredBoardColumnTask> completed = boardService.getCompletedUnsentDeferredTasks(boardReqId);
//		System.out.println("Found "+completed.size()+" completed tasks for req ID: "+boardReqId);
        ArrayList<Map<String, Object>> taskRecs = new ArrayList<Map<String, Object>>();
        for (DeferredBoardColumnTask tsk : completed) {
            tsk.pushed = true;
            taskRecs.add(tsk.getData());
            tsk.future = null; // Lose the reference to all that old rendered data.
        }
        Map<String, Object> rslt = new HashMap<String, Object>();
        boolean moore = boardService.checkForRemainingTasks(boardReqId);
        rslt.put("butWaitTheresMore", moore);
        rslt.put("tasks", taskRecs);
        return contentNegotiatingModelAndView(rslt);
    }

    @RequestMapping(value = "/vpr/board/reload/{boardReqId}")
    public ModelAndView reloadBoardCells(
            @PathVariable(value = "boardReqId") String boardReqId,
            @RequestParam(required = true) ArrayList<String> columns,
            @RequestParam(required = true) String pid,
            HttpServletRequest request) {
        for (String col : columns) {
            boardService.wakeTask(boardReqId, col, pid);
        }
        return contentNegotiatingModelAndView("{'success':'true'}");
    }

    private ViewDef getViewDef(String view) {
        return (ViewDef) registry.findByID(view);
    }
}
