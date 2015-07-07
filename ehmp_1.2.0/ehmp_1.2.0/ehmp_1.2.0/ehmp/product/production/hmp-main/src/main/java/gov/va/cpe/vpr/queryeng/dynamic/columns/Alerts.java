package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.Alerts")
@Scope("prototype")
public class Alerts extends ViewDefBasedBoardColumn {

    public Alerts() {
        super(null);
    }

    public Alerts(Map<String, Object> vals) {
        super(vals);
    }

    @PostConstruct
    public void init() {
        fieldName = "Clinical Advice";
    }

    @Override
    public String getViewdefCode() {
        return "gov.va.cpe.vpr.queryeng.AlertViewDef";
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
    @JsonIgnore
    public List<Config> getViewdefFilterOptions() {
        ArrayList<Config> opts = new ArrayList<Config>();
        Config conf = new Config();
        conf.setName("filter.frameIDs");
        conf.setLabel("Clinical Advice Frame ID(s) (Blank=ALL)");
        conf.setDataType(Config.DATA_TYPE_STRING);
        opts.add(conf);

        return opts;
    }

    @Override
    public String getRenderClass() {
        return "brList";
    }

    @Override
    public String getName() {
        return "Clinical Advice";
    }

    @Override
    public String getDescription() {
        return getName();
    }

    public ArrayList<String> getDomainClasses() {
        ArrayList<String> rslt = new ArrayList<String>();
//		rslt.add(Alert.class.getSimpleName());
        rslt.add("Alert"); // ?? Guessing here. Are we persisting Alerts yet? BB?
        return rslt;
    }

    public boolean getTitleEditable() {
        return false;
    }

    @Override
    protected void appendResults(List results, RenderTask rt, Map<String,Object> params) {
        for (Map<String, Object> itm : rt) {
            results.add((String) itm.get("title"));
        }

        Iterator<Map<String, Object>> iter = rt.iterator();
        ArrayList<String> filterz = configPropertyToArray("qualifiedName", configProperties);
        while (iter.hasNext()) {
            Map<String, Object> itm = iter.next();
            String type = (itm.get("name") != null ? itm.get("name").toString() : null);
            if (type != null && itm.get("Status") != null && itm.get("Summary") != null && (filterz == null || poorManFuzzySearch(filterz, type))) {
                results.add(itm.get("Status") + " " + itm.get("Summary") + (itm.get("start") != null ? itm.get("start") : "") + "<br>");
            }
        }
    }
}
