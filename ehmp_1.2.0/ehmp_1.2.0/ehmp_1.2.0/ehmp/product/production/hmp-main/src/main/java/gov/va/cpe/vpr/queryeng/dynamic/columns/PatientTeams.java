package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.team.Team;
import gov.va.cpe.vpr.queryeng.editor.EditorOption;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.PatientTeams")
@Scope("prototype")
public class PatientTeams extends ViewDefBasedBoardColumn {

	public PatientTeams() {
		super(null);
	}

	public PatientTeams(Map<String, Object> vals) {
		super(vals);
	}

	@PostConstruct
	public void init() {
		fieldName = "Teams";
	}

	public List<Config> getConfigOptions() {
		ArrayList<Config> opts = new ArrayList<Config>();
		Config conf = new Config();
		conf.setName("teamCats");
		conf.setLabel("Team Categories");
		conf.setDataType(Config.DATA_TYPE_TEAMCAT);
		opts.add(conf);
		return opts;
	}

	@Override
	public String getViewdefCode() {
		return "gov.va.cpe.vpr.queryeng.PatientTeamsViewDef";
	}

	@Override
	public String getName() {
		return "Patient Teams";
	}

	@Override
	public String getRenderClass() {
		return "patientTeams";
	}

	@Override
	public EditorOption getEditOpt() {
		EditorOption eo = new EditorOption("patientTeams", "patientTeams");
		return eo;
	}

	public ArrayList<String> getFilterDescription() {
		ArrayList<String> rslt = new ArrayList<String>();

		Object tc = configProperties.get("teamCats");

		if (tc != null && tc instanceof List && ((List) tc).size() > 0) {
			StringBuilder cats = new StringBuilder();

			for (Object s : (List) tc) {
				if (s instanceof Map) {
					cats.append((cats.length() == 0 ? "" : ", ")
							+ ((Map) s).get("name"));
				}
			}

			rslt.add("Team Categories: " + cats);
		}

		return rslt;
	}

	@Override
	public String getDescription() {
		return "All teams that the patient is listed on.";
	}

	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Team.class.getSimpleName()); // Roster too, when we get there.
		return rslt;
	}

	@Override
	protected void appendResults(List results, RenderTask task,
			Map<String, Object> params) {
		List tc = null;
		if (configProperties.get("teamCats") != null) {
			tc = new ArrayList<String>();
			for (Object cat : (List) configProperties.get("teamCats")) {
				if (cat instanceof Map) {
					tc.add(((Map) cat).get("uid").toString());
				}
			}
		}
		Iterator<Map<String, Object>> iter = task.iterator();
		while (iter.hasNext()) {
			Map<String, Object> itm = iter.next();
			List icats = itm.get("categories") != null ? (List) itm
					.get("categories") : null;
			boolean addRec = true;
			if (tc != null && !tc.isEmpty()) {
				addRec = false;
				if (icats != null && icats instanceof List) {
					for (Object obj : icats) {
						if (obj instanceof Map) {
							if (tc.contains(((Map) obj).get("uid"))) {
								addRec = true;
								break;
							}
						}
					}
				}
			}
			if (addRec) {
				results.add(itm);
			}
		}
	}
}
