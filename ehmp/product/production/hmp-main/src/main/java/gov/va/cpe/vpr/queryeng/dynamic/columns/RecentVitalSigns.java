package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Observation;
import gov.va.cpe.vpr.util.GenUtil;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.PointInTimeFormat;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.*;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.RecentVitalSigns")
@Scope("prototype")
public class RecentVitalSigns extends ViewDefBasedBoardColumn {

	public RecentVitalSigns() {
		super(null);
	}

	public RecentVitalSigns(Map<String, Object> vals) {
		super(vals);
	}

    @PostConstruct
    public void init() {
		fieldName = "Last Vital Signs";
	}

	@Override
	public String getViewdefCode() {
		return "gov.va.cpe.vpr.queryeng.VitalsViewDef";
	}

	public List<Config> getViewdefFilterOptions() {
		ArrayList<Config> opts = new ArrayList<Config>();
		Config conf = new Config();
		conf.setName("filter_kind");
		conf.setLabel("Type");
		conf.setDataType(Config.DATA_TYPE_LIST);
		//		conf.setChoiceList(new ArrayList<String>(Arrays.asList("WEIGHT","PAIN","PULSE","PULSE OXIMETRY","HEIGHT","RESPIRATION","BLOOD PRESSURE","TEMPERATURE")));
		conf.addChoice("Weight", "WEIGHT");
		conf.addChoice("Pain", "PAIN");
		conf.addChoice("Pulse", "PULSE");
		conf.addChoice("Oximetry", "PULSE OXIMETRY");
		conf.addChoice("Height", "HEIGHT");
		conf.addChoice("Respiration", "RESPIRATION");
		conf.addChoice("Blood Pressure", "BLOOD PRESSURE");
		conf.addChoice("Temperature", "TEMPERATURE");
		opts.add(conf);
		return opts;
	}

	@JsonIgnore
	protected String uiAlias(String prop) {
		if(prop.equals("filter_kind")) {
			return "Types";
		} else {
			return prop;
		}
	}

	@Override
	public String getRenderClass() {
		return "brList";
	}

	@Override
	public String getName() {
		return "Last Vital Signs";
	}

	@Override
	public String getDescription() {
		return "For each type of vital sign measurement, returns the last chronological instance of that type.";
	}

	public boolean getTitleEditable() {
		return false;
	}

	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Observation.class.getSimpleName());
		return rslt;
	}

	private Object[][] typeAlias = {
			{"WEIGHT","WT",true},
			{"PAIN","PN",false},
			{"PULSE","P",false},
			{"PULSE OXIMETRY","POX",false},
			{"HEIGHT","HT",true},
			{"RESPIRATION","R",false},
			{"BLOOD PRESSURE","BP",false},
			{"TEMPERATURE","T",true},
			{"BMI","BMI",false}
	};

	public ArrayList<String> getFilterDescription() {
		ArrayList<String> filterDesc = new ArrayList<String>();
		StringBuilder rslt = new StringBuilder();
		Object filterz = viewdefFilters.get("filter_kind");
		if(filterz instanceof List) {
			for(Object o: (List)filterz) {
				if(typeAlias!=null) {
					for(Object[] alias: typeAlias) {
						if(alias[0].toString().equalsIgnoreCase(o.toString())) {
							rslt.append(rslt.length()>0?",":"");
							rslt.append(alias[1]);
						}
					}
				}
			}
		}
		filterDesc.add(rslt.toString());
		return filterDesc;
	}

	private String buildString(Map<String, Object> row) {
		StringBuilder rslt = new StringBuilder();
		String type = row.get("typeName").toString();
		for(Object[] alias: typeAlias) {
			if(alias[0].equals(type)) {
				rslt.append("<tr>");
				rslt.append("<td width=\"40px\">");
				rslt.append(alias[1]);
				rslt.append("</td><td>");
				rslt.append(row.get("result"));
				if(alias[2].equals(Boolean.TRUE)) {
					rslt.append(" ");
					rslt.append(row.get("units"));
				}
				rslt.append("</td></tr>");
			}
		}
		return rslt.toString();
	}

	private void bmiCheck(TreeSet<Map<String, Object>> vals) {
		PointInTime dt = null;
		BigDecimal lbs = BigDecimal.ZERO;
		BigDecimal inches = BigDecimal.ZERO;
		for(Map<String, Object> val: vals) {
			String typeName = val.get("typeName").toString();
			if(typeName.equals("HEIGHT") || typeName.equals("WEIGHT")) {
				PointInTime tm = new PointInTime(val.get("observed").toString());
				if(dt==null || dt.compareTo(tm)<0) {
					dt = tm;
				}
				if(typeName.equals("HEIGHT")) {
					try {
						inches = new BigDecimal(val.get("result").toString());
					} catch (NumberFormatException e) {
						log.error("Vitals (UID: "+val.get("uid")+") Height inches value of "+val.get("result")+" could not be parsed into BigDecimal.", e);
					}
				} else {
					try {
						lbs = new BigDecimal(val.get("result").toString());
					} catch (NumberFormatException e) {
						log.error("Vitals (UID: "+val.get("uid")+") Weight lbs value of "+val.get("result")+" could not be parsed into BigDecimal.", e);
					}
				}
			}
		}
		if(lbs.compareTo(BigDecimal.ZERO)>0 && inches.compareTo(BigDecimal.ZERO)>0 && dt != null) {
			String bmi = GenUtil.calcBMI(lbs, inches);
			Map<String, Object> bmiRow = new HashMap<String, Object>();
			bmiRow.put("observed", dt.toString());
			bmiRow.put("typeName","BMI");
			bmiRow.put("result",bmi);
			vals.add(bmiRow);
		}
	}

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        Iterator<Map<String, Object>> iter = task.iterator();
        Map<String, Map<String, Object>> typeValues = new HashMap<String, Map<String, Object>>();
        while(iter.hasNext()) {
            Map<String, Object> itm = iter.next();
            Object observed = itm.get("observed");
            Object typeName = itm.get("typeName");
            Object value = "" + itm.get("result") + itm.get("units");
            if(observed != null && typeName != null && value != null) {
                Map<String, Object> oldVals = typeValues.get(typeName.toString());
                PointInTime obs = null;
                if(oldVals!=null) {
                    obs = new PointInTime(oldVals.get("observed").toString());
                }
                if(oldVals!=null && (new PointInTime(itm.get("observed").toString())).compareTo(obs)<0) {
                    // do nothing.
                } else {
                    typeValues.put(typeName.toString(), itm);
                }
            }
        }
        Comparator<Map<String, Object>> tc = new Comparator<Map<String, Object>>() {

            @Override
            public int compare(Map<String, Object> row1, Map<String, Object> row2) {
                PointInTime p1 = new PointInTime(row1.get("observed").toString());
                PointInTime p2 = new PointInTime(row2.get("observed").toString());
                int rslt = p2.compareTo(p1); // Intentionally inversed for newer (larger) dates at top.
                if(rslt==0) {
                    rslt = row1.get("typeName").toString().compareTo(row2.get("typeName").toString());
                }
                return rslt;
            }

        };
        TreeSet<Map<String, Object>> dateVals = new TreeSet<Map<String, Object>>(tc);
        for(String typeName: typeValues.keySet()) {
            dateVals.add(typeValues.get(typeName));
        }
        bmiCheck(dateVals);
        PointInTime dt = null;
        boolean ts = false;
        for(Map<String, Object> vals: dateVals) {
            PointInTime pit = new PointInTime(vals.get("observed").toString());
            if(dt==null || pit.compareTo(dt)!=0) {
                dt = pit;
                if(ts) {
                    results.add("</table>");
                }
                results.add("<div><b>"+PointInTimeFormat.dateTime().print(dt)+"</b><br>");
                results.add("<table class=\"hmp-labeled-values\"></div>");
                ts = true;
            }
            results.add(buildString(vals));
        }
        if(ts) {
            results.add("</table>");
        }
    }
}
