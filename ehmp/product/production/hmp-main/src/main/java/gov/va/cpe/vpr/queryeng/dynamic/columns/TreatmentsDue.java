package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Treatment;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import gov.va.hmp.healthtime.format.PointInTimeFormat;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.TreatmentsDue")
@Scope("prototype")
public class TreatmentsDue extends ViewDefBasedBoardColumn {

    public TreatmentsDue() {
        super(null);
    }

    public TreatmentsDue(Map<String, Object> vals) {
        super(vals);
    }

    @PostConstruct
    public void init() {
        fieldName = "Treatments Due";
        getViewdefFilters().put("filter_status", Arrays.asList("ACTIVE"));
        getConfigProperties().put("nameInTooltip", true);
    }

    @JsonIgnore
    protected String uiAlias(String prop) {
        if (prop.equals("filter_status")) {
            return "Status";
        } else if (prop.equals("range")) {
            return "Start Date Range";
        } else if (prop.equals("nameInTooltip")) {
            return "";
        } else {
            return prop;
        }
    }

    @Override
    public String getViewdefCode() {
        return "gov.va.cpe.vpr.queryeng.TreatmentViewDef";
    }

    @Override
    public String getRenderClass() {
        return "brList";
    }

    public List<Config> getViewdefFilterOptions() {

        ArrayList<Config> opts = new ArrayList<Config>();
        Config conf = new Config();
        conf.setName("filter_status");
        conf.setLabel("Status");
        conf.setDataType(Config.DATA_TYPE_LIST);
//		conf.setChoiceList(new ArrayList<String>(Arrays.asList("ACTIVE","PENDING","DISCONTINUED","EXPIRED")));
        conf.addChoice("Active", "ACTIVE");
        conf.addChoice("Pending", "PENDING");
        conf.addChoice("Discontinued", "DISCONTINUED");
        conf.addChoice("Expired", "EXPIRED");
        opts.add(conf);
        conf = new Config();
        conf.setName("range");
        conf.setLabel("Start Date Range");
        opts.add(conf);
        return opts;
    }

    @Override
    public String getName() {
        return "Treatments Due";
    }

    public List<Config> getConfigOptions() {

        ArrayList<Config> opts = new ArrayList<Config>();
        Config conf = new Config();
        conf.setName("nameInTooltip");
        conf.setLabel("Show Treatment in Tooltip instead of Column");
        conf.setDataType(Config.DATA_TYPE_BOOLEAN);
        opts.add(conf);
        return opts;
    }

    @Override
    public String getDescription() {
        return "Shows treatments that start before/on today and end on/after today, or have no end time.";
    }

    public ArrayList<String> getDomainClasses() {
        ArrayList<String> rslt = new ArrayList<String>();
        rslt.add(Treatment.class.getSimpleName()); // ?? Not sure if we will be basing this on a new class or med data
        return rslt;
    }

    @Override
    protected void appendResults(List results, RenderTask task, Map<String, Object> params) {
        boolean showNameInTooltip = configProperties.get("nameInTooltip") != null ? Boolean.parseBoolean(configProperties.get("nameInTooltip").toString()) : false;

        Iterator<Map<String, Object>> iter = task.iterator();
        PointInTime now = PointInTime.now();
        while (iter.hasNext()) {
            Map<String, Object> itm = iter.next();
            if (itm.get("start") != null && !itm.get("start").toString().equals("") && new PointInTime(itm.get("start").toString()).compareTo(now) < 1) {
                if (itm.get("stop") == null || itm.get("stop").toString().equals("") || new PointInTime(itm.get("stop").toString()).compareTo(now) > 0) {
                    String prefix = showNameInTooltip ? "<text title='" + itm.get("content") + "'>" : "";
                    String suffix = showNameInTooltip ? "</text>" : " " + itm.get("content");
                    if (itm.get("adminTimes") != null) {
                        String[] dt = itm.get("adminTimes").toString().split("-");
                        for (String time : dt) {
                            if (time.length() == 2) {
                                time = time + ":00";
                            }
                            results.add(prefix + time + suffix + "<br>");
                        }
                    } else {
                        results.add(prefix + PointInTimeFormat.time().print(HL7DateTimeFormat.parse(itm.get("start").toString())) + suffix + "<br>");
                    }
                }
            }
        }
    }
}
