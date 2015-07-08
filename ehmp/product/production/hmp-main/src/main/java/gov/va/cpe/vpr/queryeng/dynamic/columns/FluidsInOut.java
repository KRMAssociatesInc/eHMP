package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Observation;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.hmp.healthtime.PointInTime;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.*;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.FluidsInOut")
@Scope("prototype")
public class FluidsInOut extends ViewDefBasedBoardColumn {
	
    public FluidsInOut() {
    	super(null);
    }
    
    public FluidsInOut(Map<String, Object> vals) {
		super(vals);
	}

    @PostConstruct
    public void init() {
        fieldName = "Fluids In/Out";
        getConfigProperties().put("nameInTooltip", true);
    }

	@Override
	public String getViewdefCode() {
		return "gov.va.cpe.vpr.queryeng.ObservationsViewDef";
	}

	@Override
	public Map<String, Object> getViewdefFilters() {
		Map<String, Object> rslt = new HashMap<String, Object>();
		rslt.put("range","-1d..T+1");
		return rslt;
	}

	@Override
	public String getRenderClass() {
		return "brList";
	}
	
	@Override
	public String getName() {
		return "Fluids In/Out";
	}

	@JsonIgnore
	protected String uiAlias(String prop) {
		if(prop.equals("nameInTooltip")) {
			return "";
		} else {
			return prop;
		}
	}
	
	public List<Config> getConfigOptions() {
		ArrayList<Config> opts = new ArrayList<Config>();
		Config conf = new Config();
		conf.setName("nameInTooltip");
		conf.setLabel("Show Details in Tooltip instead of Column");
		conf.setDataType(Config.DATA_TYPE_BOOLEAN);
		opts.add(conf);
		return opts;
	}
	
	private BigDecimal getTotalForDay(PointInTime pit, Map<String, Object> itm) {
		BigDecimal bd = BigDecimal.ZERO;
		PointInTime start = itm.get("observed")==null?null:new PointInTime(itm.get("observed").toString());
		if(start!=null && start.getDate() == pit.getDate() && start.getMonth() == pit.getMonth() && start.getYear() == pit.getYear() && itm.get("units").equals("ml") && itm.get("result")!=null ) {
			try{
				bd = new BigDecimal(itm.get("result").toString());
				if(itm.get("typeName").toString().toUpperCase().contains("OUTPUT")) {
					bd = bd.negate();
				}
			} catch(Exception e) {
				log.error(e.getMessage(), e);
			}
		}
		return bd;
	}

	@Override
	public String getDescription() {
		return "Net fluids in/out for the patient. Sum totals for today and yesterday.";
	}
	
	public ArrayList<String> getDomainClasses() {
		ArrayList<String> rslt = new ArrayList<String>();
		rslt.add(Observation.class.getSimpleName());
		return rslt;
	}

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        Iterator<Map<String, Object>> iter = task.iterator();
        BigDecimal todayIn = BigDecimal.ZERO;
        BigDecimal yesterdayIn = BigDecimal.ZERO;
        BigDecimal todayOut = BigDecimal.ZERO;
        BigDecimal yesterdayOut = BigDecimal.ZERO;
        PointInTime now = PointInTime.now();
        PointInTime yesterday = now.subtractDays(1);
        while(iter.hasNext()) {
            Map<String, Object> itm = iter.next();
            if(itm.get("units")!=null && itm.get("result")!=null) {
                BigDecimal val = getTotalForDay(now, itm);
                if(val.compareTo(BigDecimal.ZERO)<0) {
                    todayOut = todayOut.add(val);
                } else if(val.compareTo(BigDecimal.ZERO)>0) {
                    todayIn = todayIn.add(val);
                }
                val = getTotalForDay(yesterday, itm);
                if(val.compareTo(BigDecimal.ZERO)<0) {
                    yesterdayOut = yesterdayOut.add(val);
                } else if(val.compareTo(BigDecimal.ZERO)>0) {
                    yesterdayIn = yesterdayIn.add(val);
                }
            }
        }
        StringBuilder sb = new StringBuilder();
        boolean showNameInTooltip = configProperties.get("nameInTooltip")!=null?Boolean.parseBoolean(configProperties.get("nameInTooltip").toString()):false;
        if(showNameInTooltip) {
            sb.append("<text ");
            sb.append("title='");
            sb.append("Today In: "+todayIn+"\r\n");
            sb.append("Today Out: "+todayOut.negate()+"\r\n");
            sb.append("Today Total: "+todayIn.add(todayOut)+"\r\n");
            sb.append("Yesterday In: "+yesterdayIn+"\r\n");
            sb.append("Yesterday Out: "+yesterdayOut.negate()+"\r\n");
            sb.append("Yesterday Total: "+yesterdayIn.add(yesterdayOut)+"\r\n");
            sb.append("Net Total: "+todayIn.add(todayOut).add(yesterdayIn).add(yesterdayOut));
            sb.append("'>T: "+todayIn.add(todayOut)+" + Y: "+yesterdayIn.add(yesterdayOut)+" = "+todayIn.add(todayOut).add(yesterdayIn).add(yesterdayOut)+"</text>");
        } else {
            sb.append("<span class=\"hmp-pt-loaded\"><table width='300'>");
            sb.append("<tr><td width='20%'>Yesterday</td><td align='right' width='10%'>In: </td><td width='20%'>"+yesterdayIn+"</td><td align='right' width='10%'>Out: </td><td width='20%'>"+yesterdayOut.negate()+"</td><td width='20%'><b>"+yesterdayIn.add(yesterdayOut)+"</b></td></tr>");
            sb.append("<tr><td>Today</td><td align='right'>In: </td><td>"+todayIn+"</td><td align='right'>Out: </td><td>"+todayOut.negate()+"</td><td><b>"+todayIn.add(todayOut)+"</b></td></tr>");
            sb.append("<tr><td/><td/><td/><td/><td/><td><b>"+todayIn.add(todayOut).add(yesterdayIn).add(yesterdayOut)+"</b></td></tr>");
            sb.append("</table></span>");
        }
        results.add(sb.toString());
    }
}
