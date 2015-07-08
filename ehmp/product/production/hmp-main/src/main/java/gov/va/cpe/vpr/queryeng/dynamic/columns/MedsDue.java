package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import gov.va.hmp.healthtime.format.PointInTimeFormat;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.MedsDue")
@Scope("prototype")
public class MedsDue extends ViewDefBasedBoardColumn {

    public MedsDue() {
        super(null);
    }

    public MedsDue(Map<String, Object> vals) {
        super(vals);
    }

    @PostConstruct
    public void init() {
        fieldName = "Inpt. Meds Due";
    }

    public boolean getTitleEditable() {
        return false;
    }

    @Override
    public String getViewdefCode() {
        return "gov.va.cpe.vpr.queryeng.MedsViewDef";
    }

    @JsonIgnore
    protected String uiAlias(String prop) {
        if (prop.equals("qualifiedName")) {
            return "Med Names";
        } else if (prop.equals("qfilter_status")) {
            return "";
        } else if (prop.equals("filter_kind")) {
            return "";
        } else {
            return prop;
        }
    }

    public List<Config> getConfigOptions() {
        ArrayList<Config> opts = new ArrayList<Config>();
        Config conf = new Config();
        conf.setName("qualifiedName");
        conf.setLabel("Name (Blank=ALL)");
        conf.setDataType(Config.DATA_TYPE_STRING);
        opts.add(conf);

        return opts;
    }

    public Map<String, Object> getViewdefFilters() {
        Map<String, Object> vals = new HashMap<String, Object>();
        vals.put("qfilter_status", Arrays.asList("ACTIVE"));
        vals.put("filter_kind", Arrays.asList("I"));
        // Theoretically, we could have a med with a start date way in the past (?) that is still active...
        // So I will omit start date filtering
        return vals;
    }

    @Override
    public String getRenderClass() {
        return "brList";
    }

    @Override
    public String getName() {
        return "Inpt. Meds Due";
    }

    @Override
    public String getDescription() {
        return "Inpatient Active meds to be administered today.";
    }

    public ArrayList<String> getDomainClasses() {
        ArrayList<String> rslt = new ArrayList<String>();
        rslt.add(Medication.class.getSimpleName());
        return rslt;
    }

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        boolean showNameInTooltip = configProperties.get("nameInTooltip") != null ? Boolean.parseBoolean(configProperties.get("nameInTooltip").toString()) : false;
        ArrayList<String> filterz = configPropertyToArray("qualifiedName", configProperties);
        PointInTime now = PointInTime.now();
        for (Map<String, Object> itm : task) {
            Object prods = itm.get("products");
            if (prods != null && prods instanceof List) {
                for (Map<String, Object> prod : (List<Map<String, Object>>) prods) {
                    Object ingredient = prod.get("ingredientName");
                    if (ingredient != null) {
                        String type = ingredient.toString();
                        if (type != null && (filterz == null || poorManFuzzySearch(filterz, type))) {
                            List<Map<String, Object>> dosages = (List<Map<String, Object>>) itm.get("dosages");
                            if (dosages != null) {
                                for (Map<String, Object> dosage : dosages) {
                                    PointInTime start = HL7DateTimeFormat.parse((String) dosage.get("start"));
                                    PointInTime stop = HL7DateTimeFormat.parse((String) dosage.get("stop"));
                                    if (start != null && start.before(now)) {
                                        if (stop == null || stop.after(now)) {
                                            StringBuilder sb = new StringBuilder("<table>");
                                            String prefix = showNameInTooltip ? "<text title='" + ingredient + "'>" : "";
                                            String suffix = showNameInTooltip ? "</text>" : " " + ingredient;
                                            if (dosage.get("adminTimes") != null) {
                                                String[] dt = dosage.get("adminTimes").toString().split("-");
                                                for (String time : dt) {
                                                    if (time.length() == 2) {
                                                        time = time + ":00";
                                                    }
                                                    if (time.length() == 4) {
                                                        time = time.substring(0, 2) + ":" + time.substring(2, 4);
                                                    }
                                                    results.add(prefix + time + suffix + "<br>");
                                                }
                                            } else {
                                                results.add(prefix + PointInTimeFormat.time().print(start) + suffix + "<br>");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
