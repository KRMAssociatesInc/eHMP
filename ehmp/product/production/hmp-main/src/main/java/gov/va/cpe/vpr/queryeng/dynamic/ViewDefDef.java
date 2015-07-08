package gov.va.cpe.vpr.queryeng.dynamic;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.team.Category;
import gov.va.cpe.vpr.pom.DraftablePOMObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDef;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;

public final class ViewDefDef extends DraftablePOMObject implements Comparable<ViewDefDef> {

    protected static final Logger logger = LoggerFactory.getLogger(ViewDefDef.class);

    public ViewDefDef() {
        super(null);
    }

    @JsonCreator
    public ViewDefDef(Map<String, Object> vals) {
        super(vals);
    }

    private List<Category> categories;

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPrimaryViewDefClassName() {
        return primaryViewDefClassName;
    }

    public void setPrimaryViewDefClassName(String primaryViewDefClassName) {
        this.primaryViewDefClassName = primaryViewDefClassName;
    }

    @JsonIgnore
    public TreeSet<ViewDefDefColDef> getCols() {
        return cols;
    }

    @JsonIgnore
    public void addColumn(ViewDefDefColDef col) {
        col.id = getNextColId();
        col.sequence = (cols.size() == 0 ? 1 : cols.last().sequence + 1);
        cols.add(col);
    }

    private Integer getNextColId() {
        Integer next = -1;
        for (ViewDefDefColDef col : cols) {
            if (col.id > next) {
                next = col.id;
            }
            ;
        }
        return ++next;
    }

    @JsonIgnore
    public ViewDefDefColDef getColBySequence(Integer seq) {
        ViewDefDefColDef rslt = null;
        for (ViewDefDefColDef cd : cols) {
            if (cd.getSequence().equals(seq)) {
                rslt = cd;
            }
        }
        return rslt;
    }

    @JsonIgnore
    public ViewDefDefColDef getColBySequence(String seq) {
        Integer seqi = Integer.parseInt(seq);
        ViewDefDefColDef rslt = null;
        for (ViewDefDefColDef cd : cols) {
            if (cd.getSequence().equals(seqi)) {
                rslt = cd;
            }
        }
        return rslt;
    }

    @JsonIgnore
    public ViewDefDefColDef getColById(Integer id) {
        ViewDefDefColDef rslt = null;
        for (ViewDefDefColDef cd : cols) {
            if (cd.id.equals(id)) {
                rslt = cd;
            }
        }
        return rslt;
    }

    @JsonIgnore
    public void setCols(TreeSet<ViewDefDefColDef> cols) {
        this.cols = cols;
    }

    String name;

    String description;

    public String primaryViewDefClassName;

    @JsonIgnore
    public
    TreeSet<ViewDefDefColDef> cols = new TreeSet<ViewDefDefColDef>();

    String bjw;

    public String getBjw() {
        return bjw;
    }

    public void setBjw(String bjw) {
        this.bjw = bjw;
    }

    @JsonIgnore
    public void prepareForBjw() {
        Map<String, Map<String, Object>> dat = new HashMap<String, Map<String, Object>>();
        for (ViewDefDefColDef vddcd : cols) {
            Map<String, Object> bs = vddcd.getData();
            bs.put("@class", vddcd.getClass().getName());
            dat.put(vddcd.sequence.toString(), bs);
        }
        bjw = POMUtils.toJSON(dat);
    }

    @JsonIgnore
    public void restoreFromBjw() {
        cols = new TreeSet<ViewDefDefColDef>();
        Map<String, Object> dat = POMUtils.parseJSONtoMap(bjw);
        for (String s : dat.keySet()) {
            Map<String, Object> mp = (Map<String, Object>) dat.get(s);//POMUtils.parseJSONtoMap(s);
            String className = mp.get("@class").toString();
            if (className != null) {
                try {
                    ViewDefDefColDef col = (ViewDefDefColDef) Class.forName(className).getConstructor(Map.class).newInstance(mp);
                    if (mp.get("sequence") != null) {
                        col.sequence = Integer.parseInt(mp.get("sequence").toString());
                    }
                    // Temporary workaround to keep old lists from breaking with the ID change; 2/11/13 JC
                    if (col.id == null || col.id.equals(Integer.valueOf(0))) {
                        col.id = getNextColId();
                    }
                    cols.add(col);
                } catch (Exception e) {
                    logger.error("Exception while rendering viewdef uid: " + uid, e);
                }
            }
        }
    }

    @Override
    public int compareTo(ViewDefDef o) {
        return this.getName().compareTo(o.getName());
    }

    private Map<String, Object> draft;

    public Map<String, Object> getDraft() {
		return draft;
	}
    
    
	public ViewDef buildViewDef() {
		if (!this.primaryViewDefClassName.equals("gov.va.cpe.vpr.queryeng.dynamic.PatientPanelViewDef")) {
			throw new UnsupportedOperationException("alternate primaryViewDefClass not supported yet");
		}
		return new PatientPanelViewDef(this);
	}
}
