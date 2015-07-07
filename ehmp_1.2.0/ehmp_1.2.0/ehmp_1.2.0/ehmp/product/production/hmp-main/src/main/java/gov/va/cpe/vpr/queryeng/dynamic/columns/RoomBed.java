package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.Encounter;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.RoomBed")
@Scope("prototype")
public class RoomBed extends ViewDefBasedBoardColumn {

    public RoomBed() {
        super(null);
    }

    public RoomBed(Map<String, Object> vals) {
        super(vals);
    }

    @PostConstruct
    public void init() {
        fieldName = "Room/Bed";
    }

    @Override
    public String getViewdefCode() {
        return "gov.va.cpe.vpr.queryeng.EncounterViewDef";
    }

    @JsonIgnore
    protected String uiAlias(String prop) {
        if (prop.equals("range")) {
            return "Start Date Range";
        } else {
            return prop;
        }
    }

    public List<Config> getViewdefFilterOptions() {
        ArrayList<Config> opts = new ArrayList<Config>();
        Config conf = new Config();
        conf.setName("range");
        conf.setLabel("Start Date Range");
        opts.add(conf);
        return opts;
    }

    @Override
    public String getRenderClass() {
        return "brList";
    }

    @Override
    public String getName() {
        return "Room/Bed";
    }

    @Override
    public String getDescription() {
        return "Looks at admissions and pulls any room/bed assignments from them.";
    }

    public ArrayList<String> getDomainClasses() {
        ArrayList<String> rslt = new ArrayList<String>();
        rslt.add(Encounter.class.getSimpleName());
        return rslt;
    }

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
        for (Map<String, Object> itm : task) {
            Object roomBed = itm.get("roomBed");
            Object current = itm.get("current");
            if (roomBed != null && current!=null && !(current.toString().equalsIgnoreCase("false"))) {
                results.add(roomBed.toString() + "<br>");
            }
        }
    }
}
