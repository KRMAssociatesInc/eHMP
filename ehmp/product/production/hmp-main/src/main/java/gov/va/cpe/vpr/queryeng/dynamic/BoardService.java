package gov.va.cpe.vpr.queryeng.dynamic;

import gov.va.cpe.roster.IRosterService;
import gov.va.cpe.vpr.PatientService;
import gov.va.cpe.vpr.frameeng.FrameRunner;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.queryeng.ColDef.DeferredViewDefDefColDef;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.dynamic.columns.DeferredBoardColumnTask;
import gov.va.cpe.vpr.sync.vista.VistaVprPatientObjectDao;
import gov.va.hmp.auth.UserContext;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ApplicationListener;
import org.springframework.security.concurrent.DelegatingSecurityContextCallable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.session.HttpSessionDestroyedEvent;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class BoardService implements ApplicationContextAware, ApplicationListener<HttpSessionDestroyedEvent>,
		IDynamicViewDefService {
	
	@Autowired
	IPatientDAO patientDAO;
	
	@Autowired
	IViewDefDefDAO vddDAO;
	
	@Autowired
	VistaVprPatientObjectDao vvdao;
	
	@Autowired
	ApplicationContext ctx;
	
	@Autowired
    IRosterService rosterService;
	
	@Autowired
	PatientService patientService;
	
	@Autowired
	FrameRunner runner;
	
	@Autowired
	UserContext userContext;

	private ExecutorService exec = Executors.newFixedThreadPool(10,  new ThreadFactory() {
		final AtomicInteger threadNumber = new AtomicInteger(1);
		public Thread newThread(Runnable runnable) {
            Thread thread = new Thread(runnable, "board-col-" + threadNumber.getAndIncrement());
            thread.setDaemon(true);
            return thread;
        }
    });
	
	@Override
	public ViewDef getViewDefByUid(String uid) {
		ViewDef vd = null;//dynamicViewDefs.get(name);
		if(vd==null) {
			ViewDefDef vdd = vddDAO.findByUid(uid);
			if(vdd!=null) {
				try {
					vd = (ViewDef) Class.forName(vdd.primaryViewDefClassName)
							.getConstructor(IRosterService.class, IPatientDAO.class, TreeSet.class, ApplicationContext.class)
							.newInstance(rosterService, patientDAO, vdd.cols, ctx);
					vd.init(null);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return vd;
	}

	@Override
	public void setViewDefDef(ViewDefDef def) {
		vddDAO.save(def);
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		// TODO: Is the intent here for handling post-context stuff? Pre-loading viewdefs or something?
	}
	
	private Map<String, ArrayList<DeferredBoardColumnTask>> tasks = new HashMap<String, ArrayList<DeferredBoardColumnTask>>();

	private Map<String, List<String>> sessToReqMap = Collections.synchronizedMap(new HashMap<String, List<String>>());

	@Override
	public DeferredBoardColumnTask submitDeferredColTask(
			String boardReqId,
			DeferredViewDefDefColDef dcol, 
			Map<String, Object> roe) {
		DeferredBoardColumnTask dt = new DeferredBoardColumnTask(dcol, roe);
        DelegatingSecurityContextCallable callable = new DelegatingSecurityContextCallable(dt, SecurityContextHolder.getContext());
		dt.runner = this.runner;
		dt.patientService = this.patientService;
		dt.boardReqId=boardReqId;
		dt.systemId=userContext.getCurrentUser().getVistaId();
		ArrayList<DeferredBoardColumnTask> dts = tasks.get(boardReqId);
		if(dts==null) {
			dts = new ArrayList<DeferredBoardColumnTask>();
			tasks.put(boardReqId, dts);
		}
		dts.add(dt);
		dt.future = exec.submit(callable);
		return dt;
	}

	@Override
	public ArrayList<DeferredBoardColumnTask> getCompletedUnsentDeferredTasks(
			String boardReqId) {
		ArrayList<DeferredBoardColumnTask> result = new ArrayList<DeferredBoardColumnTask>();
		if(tasks.containsKey(boardReqId)) {
			for(DeferredBoardColumnTask tsk: tasks.get(boardReqId)) {
				if(tsk.completed && !tsk.pushed) {
					result.add(tsk);
				}
			}
		}
		return result;
	}

	@Override
	public boolean checkForRemainingTasks(String boardReqId) {
		if(tasks.containsKey(boardReqId)) {
			for(DeferredBoardColumnTask tsk: tasks.get(boardReqId)) {
				Future<Map<String, Object>> fut = tsk.future;
				if(!tsk.pushed && (fut!=null && !fut.isDone())) {
					return true;
				}
			}
		}
		return false;
	}

	public void linkRequestToSession(String breq, String sessionId) {
		
		List<String> breqs = sessToReqMap.get(sessionId);
		if(breqs==null) {
			breqs = Collections.synchronizedList(new ArrayList<String>());
			sessToReqMap.put(sessionId, breqs);
		}
		breqs.add(breq);
	}

	@Override
	public void onApplicationEvent(HttpSessionDestroyedEvent event) {
		String blubber = event.getSession().getId();
		List<String> reqs = sessToReqMap.get(blubber);
		if(reqs!=null) {
			for(String req: reqs) {
				tasks.remove(req);
			}
		}
		sessToReqMap.remove(blubber);
	}

	@Override
	public void wakeTask(String boardReqId, String col, String pid) {
		 ArrayList<DeferredBoardColumnTask> colTasks = tasks.get(boardReqId);
		 if(colTasks!=null) {
			 for(DeferredBoardColumnTask task: colTasks) {
				 if(task.dcol.cdef.sequence.toString().equals(col) && task.roe.get("pid").equals(pid)) {
					 task.started = false;
					 task.completed = false;
					 task.pushed = false;
                     task.future = exec.submit( new DelegatingSecurityContextCallable(task, SecurityContextHolder.getContext()) );
				 }
			 }
		 }
	}

}
