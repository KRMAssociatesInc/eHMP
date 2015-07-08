package gov.va.cpe.vpr.frameeng;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UserInterfaceRpcConstants;
import gov.va.cpe.vpr.frameeng.FrameAction.BaseFrameAction;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.InvokeTrigger;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.PatientEvent;
import gov.va.cpe.vpr.queryeng.ColDef;
import gov.va.cpe.vpr.queryeng.ProtocolViewDef;
import gov.va.cpe.vpr.queryeng.Query;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.ViewParam.PatientIDParam;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.vista.rpc.RpcTemplate;
import org.drools.KnowledgeBase;
import org.drools.definition.KnowledgePackage;
import org.drools.runtime.ObjectFilter;
import org.drools.runtime.StatefulKnowledgeSession;
import org.drools.runtime.rule.FactHandle;
import org.springframework.stereotype.Component;

import javax.script.ScriptEngine;
import java.io.File;
import java.io.FileReader;
import java.util.*;

/**
 * AdapterFrames are frames that delegate execution to some other external system,
 * ie: drools, M, javascript, etc.
 * 
 * In general, there will likely be a FrameLoader for each adapter to decide how many instances to create.
 */
public abstract class AdapterFrame extends Frame {
	
	public static class ScriptEngineFrameAdapter extends AdapterFrame {
		
		private File script;
		private ScriptEngine eng;

		public ScriptEngineFrameAdapter(ScriptEngine eng, File script) {
			this.script = script;
			this.eng = eng;
//			ScriptEngineManager mgr = new ScriptEngineManager();
//			javax.script.ScriptEngine eng = mgr.getEngineByExtension("js");

		}

		@Override
		public void exec(FrameTask ctx) throws FrameException {
			try (FileReader fr = new FileReader(this.script)) {
				Object obj = eng.eval(fr);
			} catch (Exception ex) {
				throw new FrameInitException(this, ex);
			}
		}
		
	}
	
	public static class ReminderFrame extends Frame {
		InvokeTrigger<PatientDemographics> trig;
		private RpcTemplate tpl;
		public ReminderFrame(String name, String uid) {
			setID(uid);
			setName(name);
			trig = addTrigger(new InvokeTrigger<PatientDemographics>(this, PatientDemographics.class, "gov.va.cpe.vpr.reminders"));
			declareParam(new PatientIDParam());
		}
		
		@Override
		protected void doInit(FrameJob task) throws Exception {
			tpl = task.getResource(RpcTemplate.class);
		}

		@Override
		public void exec(FrameTask task) throws FrameException {
			InvokeEvent<PatientDemographics> evt = trig.getEventOf(task);
            PatientDemographics pat = evt.getSource();
			
			Map<String, Object> params = new HashMap<String, Object>();
            params.put("command", "evaluateReminder");
            params.put("uid", getID());
            params.put("dfn", pat.getLocalPatientIdForSystem("F484")); // TODO: how to get the right "system id" with no user context?
            Map ret = tpl.executeForObject(Map.class, UserInterfaceRpcConstants.CONTROLLER_RPC_URI, params);
		}
	}
	
	@Component(value="gov.va.cpe.vpr.frameeng.AllRemindersFrame")
	public static class AllRemindersFrame extends ProtocolViewDef {
		private RpcTemplate tpl;
		private Map<String, String> reminderCache;
		
		public AllRemindersFrame() {
			declareParam(new ViewParam.ViewInfoParam(this, "Reminders Summary"));
			declareParam(new PatientIDParam());
			
			Query q1= addQuery(new AbstractQuery("uid", null) {
				@Override
				public void exec(RenderTask task) throws Exception {
					IPatientDAO dao = task.getResource(IPatientDAO.class);
					String pid = task.getParamStr("pid");
					PatientDemographics pat = dao.findByPid(pid);
					String dfn = (pat != null) ? pat.getLocalPatientIdForSystem("F484") : "";
					Map<String, String> reminders = getFrameList();
					for (String uid : reminders.keySet()) {
						String name = reminders.get(uid);
						ReminderAction act = evaluateReminder(dfn, uid);
						if (act == null) continue;
						Map<String, Object> ret = new HashMap<String, Object>();
						ret.put("uid", uid);
						ret.put("focus", name);
						ret.put("status", parseReminderStatus(act.getStatus(), act.getDue()));
//						ret.put("relevant_data", act.getDue());
						ret.put("last_done", act.getLast());
						ret.put("guidelines", "?");
						ret.put("selfLink", "/frame/goal/reminder/" + uid + "?dfn=" + dfn);
						task.add(ret);
					}
				}
			});
			
			addColumns(q1, "focus", "status", "relevant_data");
			getColumn("focus").setMetaData("width", 150);
			getColumn("status").setMetaData("width", 75);
			addColumn(new ColDef.HealthTimeColDef(q1, "last_done")).setMetaData("width", 85);
		}
		
		private String parseReminderStatus(String status, String dueDate) {
			String title = "";
			if (dueDate != null && dueDate.trim().length() > 0) {
				title += "Due: " + dueDate;
			}
			if (status.equals("DUE NOW")) {
				return "<b style=\"color: red; font-weight: bold;\" title=\"" + title + "\">DUE NOW</b>";
			} else if (status.equals("DUE SOON")) {
				return "<b style=\"color: gold; font-weight: bold;\">DUE SOON</b>";
			}
			return status;
		}
		
		@Override
		protected void doInit(FrameJob task) throws Exception {
			tpl = task.getResource(RpcTemplate.class, "rpcTemplate");
		}
		
		public Map<String, String> getFrameList() {
			if (reminderCache != null) {
				return reminderCache;
			}
			
			Map<String, Object> params = new HashMap<String, Object>();
            params.put("command", "getReminderList");
            params.put("user", "");
            params.put("location", "");
            
            JsonNode resp = tpl.executeForJson(UserInterfaceRpcConstants.CONTROLLER_RPC_URI, params);
            ArrayNode reminders = (ArrayNode) resp.get("reminders");
            
            Map<String,String> ret = new HashMap<String,String>();
            java.util.Iterator<JsonNode> itr = reminders.iterator();
			while (itr.hasNext()) {
				JsonNode node = itr.next();
				String name = node.get("name").asText();
				String uid = node.get("uid").asText();
				ret.put(uid, name);
			}
			
			return reminderCache = ret;
		}
		
		private ReminderAction evaluateReminder(String dfn, String uid) {
			Map<String, Object> params = new HashMap<String, Object>();
            params.put("command", "evaluateReminder");
            params.put("uid", uid);
            params.put("patientId", dfn); // TODO: how to get the right "system id" with no user context? 
            JsonNode ret = null;
            try {
            	ret = tpl.executeForJson(UserInterfaceRpcConstants.CONTROLLER_RPC_URI, params);
            } catch (Exception ex) {
            	System.out.println("params:" + params);
            	System.out.println(tpl.executeForString(UserInterfaceRpcConstants.CONTROLLER_RPC_URI, params));
            	return null;
            }
            String status = ret.get("status").asText();
            String due = ret.get("dueDate").asText();
            String last = ret.get("lastDone").asText();
            String text = ret.get("clinicalMaintenance").asText();
            return new ReminderAction(status, due, last, text);
		}

		@Override
		public void exec(FrameTask task) throws FrameException {
			if (task.getTriggerEvent() instanceof CallEvent) {
				super.exec(task);
				return;
			}
		}
	}
	
	public static class ReminderAction extends BaseFrameAction {
		private String status;
		private String due;
		private String last;
		private String text;

		public ReminderAction(String status, String due, String last, String text) {
			this.status = status;
			this.due = due;
			this.last = last;
			this.text = text;
		}
		
		public String getStatus() {
			return status;
		}
		
		public String getDue() {
			return due;
		}
		
		public String getLast() {
			return last;
		}
		
		public String getText() {
			return text;
		}
	}

	
	/**
	 * Delegates to a Drools knowledge base. Basically this frame triggers on everything and evalutes the WorkingMemory for any 
	 * action results and returns them.  There should be one instance of this frame for each drools knowledge base you want 
	 * to work with.
	 */
	public static class DroolsFrameAdapter extends AdapterFrame {
		private KnowledgeBase kb;

		public DroolsFrameAdapter(KnowledgeBase kb) {
			this.kb = kb;
			setName("Drools Runtime Engine");
			List<String> names = new ArrayList<String>();
			for (KnowledgePackage pkg : kb.getKnowledgePackages()) {
				names.add(pkg.getName());
			}
			addMeta("drools.packages", names);
			
			// custom 'ALL' trigger, let the KnowledgeBase resolve what it wants to do.
			addTrigger(new IFrameTrigger<PatientEvent<IPatientObject>>(PatientEvent.class, null) {
				protected boolean doEval(PatientEvent<IPatientObject> event) {
					// TODO: only return true if there was an activation?
					return true;
				}
			});
		}

		@Override
		public void exec(FrameTask ctx) {
			StatefulKnowledgeSession kbsess = kb.newStatefulKnowledgeSession();
			try {
				// this knowledge session will be the session for all Drools rules
				kbsess.insert(ctx.getTriggerEvent());
				kbsess.setGlobal("DAO", ctx.getResource(IGenericPatientObjectDAO.class));
				kbsess.fireAllRules();
				
				// Harvest all the actions out of working memory
				ObjectFilter frameActionFilter = new ObjectFilter() {
					@Override
					public boolean accept(Object object) {
						return object instanceof FrameAction;
					}
				};
				Collection<FactHandle> actions = kbsess.getFactHandles(frameActionFilter);
				for (FactHandle handle : actions) {
					FrameAction action = (FrameAction) kbsess.getObject(handle);
					ctx.addAction(action);
				}
			} finally {
				// clear working memory for next transaction
				kbsess.dispose();
			}
		}
		
	}
}