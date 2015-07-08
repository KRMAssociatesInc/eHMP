package gov.va.cpe.vpr.frameeng;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.cpe.vpr.PatientAlert;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.query.QueryDefCriteria;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * TODO: Should frameaction extend/implement IPOMObject?
 * @author brian
 */
public interface FrameAction {
	
	public class BaseFrameAction implements FrameAction {
    	protected static ObjectMapper MAPPER = POMUtils.MAPPER;
	}
	
	public abstract static class PatientAction extends BaseFrameAction {
		private String pid;
		public PatientAction(String pid) {
			this.pid = pid;
		}
		
		public String getType() {
			return getClass().getSimpleName();
		}
		
		public String getPid() {
			return this.pid;
		}
	}
	
	public static interface IPatientSerializableAction {
		public String getUid();
		public String getPid();
		public String toJSON() throws IOException;
	}
	
	public static interface IHTTPResponseWritableAction {
		public void write(HttpServletResponse resp) throws Exception;
	}
	
	public static interface IFrameActionExec {
		public void exec(FrameJob job) throws Exception;
	}

	
	public static class NewInstanceFrameAction extends PatientAction {
		public NewInstanceFrameAction(String pid) {
			super(pid);
		}
	}
	
	public static class ObsRequestAction extends PatientAction {
		private String title;
		private String value;
		
		@JsonCreator
		public ObsRequestAction(Map<String, Object> data) {
			this((String) data.get("pid"), (String) data.get("title"), (String) data.get("value"));
		}

		public ObsRequestAction(String pid, String title, String value) {
			super(pid);
			this.title = title;
			this.value = value;
		}
		
		public String getTitle() {
			return title;
		}
		
		public String getValue() {
			return value;
		}
	}
	
	public static class ObsDateRequestAction extends PatientAction {
		private String title;
		private String value;

		@JsonCreator
		public ObsDateRequestAction(Map<String, Object> data) {
			this((String) data.get("pid"), (String) data.get("title"), (String) data.get("value"));
		}
		
		public ObsDateRequestAction(String pid, String title, String value) {
			super(pid);
			this.title = title;
			this.value = value;
		}
		
		public String getTitle() {
			return title;
		}
		
		public String getValue() {
			return value;
		}
	}
	
	/**
	 * This action represents an item that displays in the Action Menu
	 * 
	 * Subclasses can specify more properties/features.
	 */
	public static class ActionMenuItem extends BaseFrameAction {
        public String hint;
        public boolean disabled = false;
		private Map<String, Object> props;
        
        /** Set a hover hint to display to the user */
        public ActionMenuItem setHint(String hint) {
			this.hint = hint;
			return this;
		}
        
        /** sets the menu item as enabled/disabled. */
        public ActionMenuItem setDisabled(boolean disabled) {
			this.disabled = disabled;
			return this;
		}
        
        /** 
         * Set to: staging, incubating, acceptance-candidate, master, etc. to only show
         * depending on the users current environment
         *  
         * TODO: Probably need to find a more generic way to do this.
         */
        public ActionMenuItem setTargetEnv(String env) {
        	this.setProperty("environment", env);
        	return this;
        }
        
        /** See {@link #setTargetEnv(String)}.  Will enable the link depending on the environment */
        public ActionMenuItem enableIfEnvironment(String env) {
        	this.setProperty("enableIfEnvironment", env);
        	return this;
        }

        
        @JsonAnySetter
        public ActionMenuItem setProperty(String key, Object val) {
        	if (this.props == null) this.props = new HashMap<>(); // lazy init
        	this.props.put(key, val);
        	return this;
        }
        
        @JsonAnyGetter
        public Map<String, Object> getProperties() {
        	return this.props;
        }
	}
	
	public static class URLActionMenuItem extends ActionMenuItem {
		private String title;
		private String url;
		private String heading;
		private String hint;
		private String subtitle;

		public URLActionMenuItem(String url, String title) {
			this(url, title, null, null, null);
		}
		
		public URLActionMenuItem(String url, String title, String heading, String subtitle, String hint) {
			this.url = url;
			this.title = title;
			this.subtitle = subtitle;
			this.hint = hint;
			this.heading = heading;
		}
		
		public String getUrl() {
			return url;
		}
		
		public String getHint() {
			return hint;
		}
		
		public String getTitle() {
			return title;
		}
		
		public String getSubTitle() {
			return subtitle;
		}
		
		public String getHeading() {
			return heading;
		}
		
		public String getType() {
			return "link";
		}
	}
	
	public static class OrderActionMenuItem extends ActionMenuItem {
		public String orderDialogID;
		public String orderMessage;
		public String orderData;
        public String orderSummary;

        public OrderActionMenuItem(String orderDialogID, String orderMessage, String orderData) {
			this.orderDialogID = orderDialogID;
			this.orderMessage = orderMessage;
			this.orderData = orderData;
		}

        public OrderActionMenuItem(String orderDialogID, String orderMessage, String orderData, String orderSummary) {
			this.orderDialogID = orderDialogID;
			this.orderMessage = orderMessage;
			this.orderData = orderData;
            this.orderSummary = orderSummary;
		}
	}
	
	public static class RetractAction extends PatientAction implements IFrameActionExec {
		private String frameID;

		// retract all alert for specified patient from specified frame
		public RetractAction(String pid, String frameID) {
			super(pid);
			assert frameID != null;
			this.frameID = frameID;
		}

		@Override
		public void exec(FrameJob job) {
			IGenericPatientObjectDAO dao = job.getResource(IGenericPatientObjectDAO.class);
			
			// query for alerts with the specified frame
			QueryDef qry = new QueryDef("alert");
			qry.addCriteria(QueryDefCriteria.where("pid").is(getPid()));
			qry.addCriteria(QueryDefCriteria.where("frameID").is(frameID));
			List<PatientAlert> results = dao.findAllByQuery(PatientAlert.class, qry, null);
			for (PatientAlert a : results) {
				dao.deleteByUID(a.getUid());
			}
		}
	}
	
	public static class RefDataAction extends BaseFrameAction {
		private Map<String, Object> data;
		
		public RefDataAction() {
			this(new HashMap<String, Object>());
		}

		public RefDataAction(Map<String, Object> data) {
			this.data = data;
		}
		
		public <T> T setValue(String key, T value) {
			this.data.put(key, value);
			return value;
		}
		
		public Map<String, Object> getData() {
			return data;
		}
	}
	/**
	 * ?? Should I just be using RefDataAction - might not make sense to create a specific class when its a simple map.
	 * @author vhaislchandj
	 *
	 */
	public static class PatientPostingsAction extends BaseFrameAction {
		private Map<String, Object> data;
		
		public PatientPostingsAction() {
			this(new HashMap<String, Object>());
		}

		public PatientPostingsAction(Map<String, Object> data) {
			this.data = data;
		}
		
		public <T> T setValue(String key, T value) {
			this.data.put(key, value);
			return value;
		}
		
		public Map<String, Object> getData() {
			return data;
		}
	}
	
	public static class HTMLAction extends BaseFrameAction {
		
		private String html;

		public HTMLAction(String html) {
			this.html = html;
		}
		
		public String getHTML() {
			return html;
		}
	}
	
	/**
	 * Common action to hold debug information that can later be collected and send to the client if requested.
	 * @author brian
	 */
	public static class DebugInfo extends BaseFrameAction {
		private Map<String, Object> map;

		public DebugInfo() {
			this.map = new HashMap<>();
		}
		
		public DebugInfo(String key, String val) {
			this();
			this.put(key, val);
		}
		
		public DebugInfo(Map<String, Object> map) {
			this.map = map;
		}
		
		public DebugInfo put(String key, Object val) {
			if (val == null) return this; // exclude null values
			this.map.put(key, val);
			return this;
		}
		
		public Map<String, Object> getData() {
			return map;
		}
	}
	
	/** Not really used... 
	public static class WrapperAction<T> implements FrameAction {
		private T obj;

		public WrapperAction(T obj) {
			this.obj = obj;
		}
		
		public T getObject() {
			return obj;
		}
	}
	*/
}
