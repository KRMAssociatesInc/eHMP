package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Task;
import gov.va.cpe.vpr.frameeng.FrameRegistry;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.PendingTasks")
@Scope("prototype")
public class PendingTasks extends ViewDefBasedBoardColumn {

	@Autowired
	FrameRegistry registry;
	
	@Autowired
	ApplicationContext ctx;

    public PendingTasks() {
    	super(null);
    }
    
    public PendingTasks(Map<String, Object> vals) {
		super(vals);
	}
	
	@PostConstruct
	public void init() {
		fieldName = "Pending Tasks";
	}

	@Override
	public String getViewdefCode() {
		/**
		 * Here's where we might plug in a frame.. or something with some input/output logic?
		 * Multiple chained frames or viewdefs?
		 * Need to learn more about the frame concept, work with BB on that.
		 */
		return "gov.va.cpe.vpr.queryeng.TasksViewDef";
	}

	@Override
	public String getRenderClass() {
		return "brList";
	}

	@Override
	public String getName() {
		return "Pending Tasks";
	}
	
	@JsonIgnore
	protected String uiAlias(String prop) {
		if(prop.equals("range")) {
			return "Due Date Range";
		} else if(prop.equals("filter.incomplete")) {
			return "";
		} else {
			return prop;
		}
	}
	
	public List<Config> getViewdefFilterOptions() {
		ArrayList<Config> opts = new ArrayList<Config>();
		Config conf = new Config();
		conf.setName("range");
		conf.setLabel("Due Date Range");
		opts.add(conf);
		return opts;
	}
	
	@Override
	public Map<String, Object> getViewdefFilters() {
		viewdefFilters.put("filter_incomplete", "true");
		return viewdefFilters;
	}

	@Override
	public String getDescription() {
		return "All incomplete tasks.";
	}

	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Task.class.getSimpleName());
		return rslt;
	}

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        //			Iterator<Map<String, Object>> iter = task.iterator();

//			while(iter.hasNext()) {
//				Map<String, Object> itm = iter.next();
//				results.add("Due "+ PointInTimeFormat.dateTime().print(HL7DateTimeFormat.parse(itm.get("dueDate").toString()))+": "+itm.get("summary").toString()+"<br>");
//			}
        // Per Sandy and clinicians, they just want a simple count.
        results.add(task.getRows().size()+" Pending<br>");

			/*
			 * This is a blatantly ugly hack that is just intended as a proof of concept.
			 * The column really wants to play a dual role, as both an action and informational column.
			 *
			 * A.K.A. "Black Magic part 1 of 2"
			 */
        results.add("<a href=\"javascript:;\" onmousedown=\"gov.va.cpe.TaskWindow.showTaskForPatient(event, "+params.get("pid")+")" +
                "\">Add Task</a><br>");
    }
}
