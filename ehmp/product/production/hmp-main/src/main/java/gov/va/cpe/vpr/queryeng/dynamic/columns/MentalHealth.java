package gov.va.cpe.vpr.queryeng.dynamic.columns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.queryeng.editor.EditorOption;
import gov.va.cpe.vpr.queryeng.RenderTask;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.dynamic.columns.MentalHealth")
@Scope("prototype")
public class MentalHealth extends ViewDefBasedBoardColumn {

    public MentalHealth() {
        super(null);
    }

    public MentalHealth(Map<String, Object> vals) {
        super(vals);
    }

    @PostConstruct
    public void init() {
        fieldName = "Mental Health";
    }

    @Override
    public String getViewdefCode() {
        return "gov.va.cpe.vpr.queryeng.MentalHealthViewDef";
    }

    @JsonIgnore
    protected String uiAlias(String prop) {
        if (prop.equals("range")) {
            return "Administered";
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
        return "Mental Health";
    }

    public List<Config> getViewdefFilterOptions() {
        List<Config> rslt = new ArrayList<Config>();
        Config conf = new Config();
        conf.setDataType(Config.DATA_TYPE_RANGE);
        conf.setLabel("Administered within");
        conf.setName("range");
        rslt.add(conf);
        return rslt;
    }

    @Override
    public String getDescription() {
        return "A count of mental health results from tests administered within the specified time period.";
    }

    public boolean getTitleEditable() {
        return false;
    }

    public ArrayList<String> getDomainClasses() {
        ArrayList<String> rslt = new ArrayList<String>();
        rslt.add(MentalHealth.class.getSimpleName());
        return rslt;
    }

    @Override
    public EditorOption getEditOpt() {
        EditorOption eo = new EditorOption("mentalHealth", "mentalHealth");
        return eo;
    }

    @Override
    protected void appendResults(List results, RenderTask task, Map<String,Object> params) {
//        results.addAll(task.getRows());
    }
}
