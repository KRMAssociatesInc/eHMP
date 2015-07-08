package gov.va.cpe.vpr.queryeng.dynamic.columns;


import javax.annotation.PostConstruct;
import java.util.Map;

// Shelved till someone takes this column seriously.
//@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.DiabetesAnalysisVDDCD")
//@Scope("prototype")
public class DiabetesAnalysisVDDCD extends ViewDefDefColDef {

	public DiabetesAnalysisVDDCD() {
		super(null);
	}
	
	public DiabetesAnalysisVDDCD(Map<String, Object> vals) {
		super(vals);
	}
	
	@PostConstruct
	public void init() {
		fieldName = "Diabetes Analysis";
	}

	@Override
	public String getViewdefCode() {
		return "gov.va.cpe.vpr.queryeng.LabViewDef";
	}

	@Override
	public String getRenderClass() {
		return "brList";
	}

	@Override
	public String getName() {
		return "Diabetes Analysis";
	}

	@Override
	public String getDescription() {
		return "TODO: This column is still in alpha.";
	}

	@Override
	public Map<String, Object> runDeferred(DeferredBoardColumnTask task) {
		// TODO Auto-generated method stub
		return null;
	}
}
