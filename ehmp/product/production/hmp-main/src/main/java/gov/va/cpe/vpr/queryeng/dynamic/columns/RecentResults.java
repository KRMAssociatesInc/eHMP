package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.util.GenUtil;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.RecentResults")
@Scope("prototype")
public class RecentResults extends ViewDefBasedBoardColumn {

    public RecentResults() {
        super(null);
    }

    public RecentResults(Map<String, Object> vals) {
        super(vals);
    }

    @PostConstruct
    public void init() {
        fieldName = "Lab Results";
        getViewdefFilters().put("range", "-1mo"); // default to past month's results
        getConfigProperties().put("nameInTooltip", true);
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
        return "Lab Results";
    }

    @JsonIgnore
    protected String uiAlias(String prop) {
        if (prop.equals("typeFilters")) {
            return "Types";
        } else if (prop.equals("range")) {
            return "Observed Date Range";
        } else if (prop.equals("nameInTooltip")) {
            return "";
        } else if (prop.equals("filter.catCodes")) {
            return "";
        } else {
            return prop;
        }
    }

    public List<Config> getConfigOptions() {

        ArrayList<Config> opts = new ArrayList<Config>();
        Config conf = new Config();
        conf.setName("typeFilters");
        conf.setLabel("Types (Blank=ALL)");
        conf.setDataType(Config.DATA_TYPE_STRING);
        opts.add(conf);
        conf = new Config();
        conf.setName("nameInTooltip");
        conf.setLabel("Show Details of Lab in Tooltip instead of Column");
        conf.setDataType(Config.DATA_TYPE_BOOLEAN);
        opts.add(conf);
        return opts;
    }

    public List<Config> getViewdefFilterOptions() {

        ArrayList<Config> opts = new ArrayList<Config>();
        Config conf = new Config();
        conf.setName("range");
        conf.setLabel("Observed Range");
        opts.add(conf);
        return opts;
    }

    public Map<String, Object> getViewdefFilters() {
        viewdefFilters.put("filter.catCodes", Arrays.asList("urn:va:lab-category:CH", "urn:va:lab-category:CY", "urn:va:lab-category:EM", "urn:va:lab-category:SP", "urn:va:lab-category:AU"));
        return viewdefFilters;
    }

    private String filterValue(Object obj) {
        if (obj == null) {
            return "";
        }
        if (obj.toString().equalsIgnoreCase("neg.")) {
            return "0.01";
        }
        if (obj.toString().endsWith("+")) {
            return obj.toString().substring(0, obj.toString().length() - 1);
        }
        return obj.toString();
    }

    @Override
    public String getDescription() {
        return "All results within the specified time period that match the specified free-text (CSV) filter. High and low values are colored red and blue, respectively.";
    }

    public ArrayList<String> getDomainClasses() {
        ArrayList<String> rslt = new ArrayList<String>();
        rslt.add(Result.class.getSimpleName());
        return rslt;
    }

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        boolean showNameInTooltip = configProperties.get("nameInTooltip") != null ? Boolean.parseBoolean(configProperties.get("nameInTooltip").toString()) : false;
        Iterator<Map<String, Object>> iter = task.iterator();
        ArrayList<String> filterz = configPropertyToArray("typeFilters", configProperties);
        while (iter.hasNext()) {
            Map<String, Object> itm = iter.next();
            String type = (itm.get("display") == null ? "" : itm.get("display").toString());
            if (filterz == null || poorManFuzzySearch(filterz, type)) {
                StringBuilder sb = new StringBuilder();
                Object interpret = itm.get("interpretationCode");
                StringBuilder val = new StringBuilder();
                String summary = itm.get("summary").toString();
                if (summary.contains("<em") && summary.contains("/em>")) {
                    summary = summary.substring(0, summary.indexOf("<em"));
                }
                if (summary.contains("&lt;em") && summary.contains("/em&gt;")) {
                    summary = summary.substring(0, summary.indexOf("&lt;em"));
                }
                String dtxt = GenUtil.formatDate(itm.get("observed")) + ": " + summary;

                if (showNameInTooltip) {
                    val.append("<span title='" + dtxt + "'>" + itm.get("result") + " " + itm.get("units") + "</span>");
                } else {
                    val.append("<span>" + dtxt + "</span>");
                }
                if (interpret != null) {
                    sb.append("<em style=\"color: red; font-weight: bold;\">" + interpret + " </em>");
                    sb.append("<b>" + val + "</b>");
                } else {
                    sb.append(val);
                }
                sb.append("<br>");
                results.add(sb.toString());
            }
        }
    }
}
