package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.Protocols")
@Scope("prototype")
public class Protocols extends ViewDefBasedBoardColumn {

    public Protocols() {
        super(null);
    }

    public Protocols(Map<String, Object> vals) {
        super(vals);
    }

    @PostConstruct
    public void init() {
        fieldName = "Protocols";
        getViewdefFilters().put("filter.kind", "PROTOCOL");
    }

    @Override
    public String getViewdefCode() {
        return "gov.va.cpe.vpr.queryeng.AlertViewDef";
    }

    @Override
    public String getRenderClass() {
        return "brList";
    }

    @Override
    @JsonIgnore
    public List<Config> getViewdefFilterOptions() {
        ArrayList<Config> opts = new ArrayList<Config>();
        Config conf = new Config();
        conf.setName("filter.frameIDs");
        conf.setLabel("Frame ID(s) (Blank=ALL)");
        conf.setDataType(Config.DATA_TYPE_STRING);
        opts.add(conf);

        return opts;
    }

    @JsonIgnore
    protected String uiAlias(String prop) {
        if (prop.equals("filter.frameIDs")) {
            return "Frames: ";
        } else {
            return prop;
        }
    }

    @Override
    public String getName() {
        return "Protocols";
    }

    @Override
    public String getDescription() {
        return getName();
    }

    public ArrayList<String> getDomainClasses() {
        ArrayList<String> rslt = new ArrayList<String>();
        rslt.add("Alert"); // BB?
        return rslt;
    }

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        for (Map<String, Object> itm : task) {
            results.add((String) itm.get("summary"));
        }
    }
}
