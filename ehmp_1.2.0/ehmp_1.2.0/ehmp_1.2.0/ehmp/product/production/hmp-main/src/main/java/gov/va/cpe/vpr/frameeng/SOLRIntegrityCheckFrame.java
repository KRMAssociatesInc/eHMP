package gov.va.cpe.vpr.frameeng;

import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.queryeng.Table;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewDef.ViewRenderAction;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.cpe.vpr.web.IntegrityCheckController;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component(value="gov.va.cpe.vpr.frameeng.SOLRIntegrityCheckFrame")
public class SOLRIntegrityCheckFrame extends Frame {
	private SolrServer solr;
	private ViewDef vd;
	private FrameRunner runner;
	private Map<String,String> domainMap;
	
	public SOLRIntegrityCheckFrame() {
		addTrigger(new IFrameTrigger.InvokeTrigger<Map>(this, Map.class, IntegrityCheckController.ENTRY_POINT));
	}
	
	@Override
	protected void doInit(FrameJob task) throws Exception {
		// need this map to compensate for the variations in the JDS collections and domains mapping in JDS.ro
		// TODO: There are more items that need to be added here
		domainMap = new HashMap<>();
		domainMap.put("result","lab");
		domainMap.put("encounter","visit");
		domainMap.put("treatment",null);
		domainMap.put("patient",null);
		domainMap.put("education",null);
		domainMap.put("exam",null);
		domainMap.put("diagnosis",null);
		domainMap.put("obs","observation");
		domainMap.put("ptf",null);
		// TODO: SOLR procedure includes JDS: procedure,surgery,image,consult
		// TODO: SOLR encounter includes JDS: encounter,visit
	}

	@Override
	public void exec(FrameTask task) throws FrameInitException, FrameExecException {
		// initalize if necessary (can't do this in doInit() due to circular reference
		if (solr == null || runner == null || vd == null) {
			solr = task.getResource(SolrServer.class);
			runner = task.getResource(FrameRunner.class);
			vd = (ViewDef) runner.getRegistry().findByID("gov.va.cpe.vpr.queryeng.VprPatientsViewDef");
		}
		
		Map<String,Object> src = (Map<String, Object>) task.getTriggerEvent().getSource();
		if (src == null || src.isEmpty()) {
			getJDSPatients(task);
		} else {
			testSOLRPatient(solr, src, task);
		}
	}
	
	private static final String MSG = "JDS-SOLR record count missmatch for pid/domain: %s/%s (JDS/SOLR=%s/%s) ";
	private void testSOLRPatient(SolrServer solr, Map<String, Object> src, FrameTask task) throws FrameExecException {
		String pid = (String) src.get("pid");
		SolrQuery q = new SolrQuery("*:*");
		q.addFilterQuery("pid:"+pid);
		q.addFacetField("domain");
		q.setFacetMinCount(0);
		q.setRows(0);
//		System.out.println("\n\nSRC:" + src);
		
		try {
			QueryResponse resp = solr.query(q);
			FacetField facet = resp.getFacetField("domain");
			for (FacetField.Count count : facet.getValues()) {
				// compensate for JDS/SOLR domain name miss-matches
				String name = count.getName();
				if (!src.containsKey(name) && domainMap.containsKey(name)) {
					name = domainMap.get(name);
				}
				if (name == null) continue; // skip some items for now.
				
				// get the counts for each system
				int o1 = (src.get(name) == null) ? -1 : (Integer) src.get(name);
				long o2 = count.getCount();
				if (o1 != o2) {
					// add an error message action if they do not match
					String msg = String.format(MSG, pid, count.getName(), o1, o2);
					task.addAction(new FrameAction.RefDataAction(Table.buildRow("error", msg, "class", null, "resolutions", null)));
				}
				
				// TODO: if a key in one count does not exist in the other, throw an error too
			}
		} catch (Exception ex) {
			throw new FrameExecException(this, "Error running SOLR Query", ex);
		}
	}
	
	private void getJDSPatients(FrameTask task) throws FrameInitException, FrameExecException {
		// first run the VprPatientsViewDef
		FrameTask subtask = runner.exec(vd, new HashMap<String,Object>());
		List<ViewRenderAction> acts = subtask.getActions(ViewRenderAction.class);
		for (ViewRenderAction act : acts) {
			RenderTask result = act.getResults();
			// launch a sub-task for each patient/row
			for (Map<String, Object> row : result.getRows()) {
				task.addSubTasks(new InvokeEvent(IntegrityCheckController.ENTRY_POINT, row, row));
			}
		}
		
	}
	
}