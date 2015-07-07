package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.DrugTherapy;
import gov.va.cpe.vpr.DrugTherapy.MedType;
import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameTrigger.PatientEventTrigger;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.PatientEvent;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.healthtime.HealthTimePrinterSet;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.*;


/**
 * Attempt 2.0 at a summarized and consolidated medication display
 * @author brian
 */
@Component(value = "gov.va.cpe.vpr.queryeng.MedHistViewDef")
@Scope("prototype")
public class MedHistViewDef extends ViewDef {
    private PatientEventTrigger<Medication> altTrig;

	public MedHistViewDef() {
		
    	this.domainClasses.add(Medication.class.getSimpleName());
    	
        // declare the view parameters
        declareParam(new ViewParam.ViewInfoParam(this, "Meds History"));
        declareParam(new ViewParam.PatientIDParam());
        declareParam(new ViewParam.SortParam("groupName", true));
        
        // drug class/type/name filters
        declareParam(new ViewParam.BooleanParam("filter_current", true));
        declareParam(new ViewParam.SimpleViewParam("filter_qname"));
        declareParam(new ViewParam.SimpleViewParam("filter_type"));
        declareParam(new ViewParam.AsArrayListParam("filter_class_code"));
        declareParam(new ViewParam.SimpleViewParam("filter_category"));
        
        // runtime params
        declareParam(new ViewParam.CachedFor("1H"));
        declareParam(new ViewParam.ExecTimeout(15000));
        
        // freshness triggers
        altTrig = addTrigger(new PatientEventTrigger<Medication>(Medication.class));
        
        QueryDef qry = new QueryDef("medication");
        qry.limit(5000);
        qry.where("qualifiedName").is("?:filter_qname");
        qry.where("vaType").is("?:filter_type");
		qry.where("products[].drugClassCode").in("?:filter_class_code");
		addQuery(new MedsDAOQuery(qry));
//		addQuery(new Query.PerRowFrameQuery("actions", "viewdefactions", Medication.class));
    }
    
    @Override
    protected void execAlt(FrameTask task) {
        if (altTrig.isTriggerOf(task)) {
    		PatientEvent<Medication> evt = altTrig.getEventOf(task);
    		Medication med = evt.getSource();
    		
    		// run the primary query sync in the current thread
    		RenderTask rendertask = new RenderTask(task, this, this);
    		rendertask.setParam("filter_qname", med.getQualifiedName());
    		rendertask.setAsync(false);
    		task.addSubTask(rendertask);
            // for now use viewdef'Refresh'action
            //rendertask.addAction(new ViewDefUpdateAction(rendertask, evt));
    		rendertask.addAction(new ViewDefRefreshAction(rendertask.getViewDef(), evt));
    	}
    }
    
    public static class MedsDAOQuery extends AbstractQuery {
    	private Map<String, Object> params;
		private QueryDef def;

		public MedsDAOQuery(QueryDef def) {
			this(def, null);
		}
		
		public MedsDAOQuery(QueryDef def, Map<String, Object> params) {
			super("uid", null);
			this.params = params;
			this.def = def;
		}

		@Override
		public void exec(RenderTask task) throws Exception {
			Map<String, Object> params = task.getParams();
			if (this.params != null) {
				params = this.params;
			}
			
			// fetch raw data
			IGenericPatientObjectDAO dao = task.getResource(IGenericPatientObjectDAO.class);
            List<Medication> meds = null;
            // this is the case when invoked by an event .. don't render
            if (task.getParamStr("pid") == null) return;

            // MedsPanel requests with param 'uid' to locate & highlight the row in the view
            // if no uid is present, go to the usual path.  If there is, run query using this uid
            if (task.getParamStr("uid") == null) {
                meds = dao.findAllByQuery(Medication.class, this.def, params);
            }
            else {
                IPOMObject med = dao.findByUID(Medication.class, task.getParamStr("uid"));
                if (med != null) {
                    meds = new ArrayList<>();
                    meds.add((Medication)med);
                }
            }

			if (meds == null) return;
			boolean currentOnly = task.getParam(Boolean.class, "filter_current");
			String sort1 = task.getParam(String.class, "group");
			String sort2 = task.getParam(String.class, "sort");
			String filterCat = task.getParam(String.class, "filter_category");
			MedType filterType = null;
			if (filterCat != null) {
				filterType = MedType.valueOf(filterCat);
			}
			
			// build DrugTherapy objects
			Map<String, DrugTherapy> ret = new HashMap<String, DrugTherapy>();
			for (Medication med : meds) {
                if (!StringUtils.hasText(med.getQualifiedName())) continue;  // skip if no qualified name
                
                // get the default type/category classification
                MedType type = DrugTherapy.MedType.typeOf(med);
                String dispName = med.getQualifiedName();
                String key = type.getGroup() + ":" + dispName;
                
                // Initialize a new DrugTherapy if we don't have one yet and add the med to it
                DrugTherapy dt = ret.get(key);
                if (dt == null) {
                	ret.put(key, dt = new DrugTherapy(type, dispName));
                }
                dt.addMed(med);
			}
			
            // if no meds to process in drugTherapy, remove it!
            Iterator<DrugTherapy> iter = ret.values().iterator();
            while (iter.hasNext()) {
                DrugTherapy dt = iter.next();
                if (!dt.hasMeds()) iter.remove();
            }
			// sort appropriately (either alphabetically or grouped)
			DrugTherapy[] ary = ret.values().toArray(new DrugTherapy[] {});
			Comparator<DrugTherapy> comparator = (sort2 != null && sort2.equals("az")) ? DrugTherapy.AZ_SORTER : DrugTherapy.CLASS_SORTER;
			Arrays.sort(ary, comparator);
			
			// convert therapy into row and sort
            HealthTimePrinterSet dateTimePrinters = task.getResource(UserContext.class).getHealthTimePrinterSet();
			for (DrugTherapy dt : ary) {
				// skip rows that are filtered out
				if (filterType != null && dt.getType() != filterType) continue;
				if (currentOnly && !dt.isRecent()) {
					continue;
				}
				task.addAction(dt);
				task.add(dt.buildRow(task.getParams(), dateTimePrinters));
			}
		}
    }
}



