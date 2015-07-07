package gov.va.cpe.vpr.queryeng.dynamic.columns;

import gov.va.cpe.vpr.queryeng.ViewDef.ViewRenderAction;
import gov.va.cpe.vpr.queryeng.editor.EditorOption;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.RoadTrip")
@Scope("prototype")
public class RoadTrip extends ViewDefBasedBoardColumn {

    public RoadTrip() {
        super(null);
    }

    public RoadTrip(Map<String, Object> vals) {
        super(vals);
    }
    
    /*
     * TODO: Convert to viewdef that filters itself based on a "removed" flag being null or false.
     */

    @PostConstruct
    public void init() {
        fieldName = "Transports";
//		restEndpoint = "/patientDomain/roadTrip";
    }

    @Override
    public String getViewdefCode() {
        return "gov.va.cpe.vpr.queryeng.RoadTripViewDef";
    }

    @Override
    public String getRenderClass() {
        return "roadTrip";//ViewDefDefColDef.JSON;
    }

    @Override
    public String getName() {
        return "Transports";
    }

    @Override
    public String getDescription() {
        return "This column allows the input and viewing of scheduled off ward activities and transports for inpatients.";
    }

    @Override
    public EditorOption getEditOpt() {
        EditorOption eo = new EditorOption("roadTrip", "roadTrip");
        return eo;
    }

    public ArrayList<String> getDomainClasses() {
        ArrayList<String> rslt = new ArrayList<String>();
        rslt.add(gov.va.cpe.vpr.RoadTrip.class.getSimpleName());
        return rslt;
    }

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        Collection<Map<String, Object>> rose = task.getAction(ViewRenderAction.class).getResults().getRows();
        for (Map<String, Object> row : rose) {
            row.put("pid", row.get("pid"));
        }
        results.addAll(rose);
    }
}
