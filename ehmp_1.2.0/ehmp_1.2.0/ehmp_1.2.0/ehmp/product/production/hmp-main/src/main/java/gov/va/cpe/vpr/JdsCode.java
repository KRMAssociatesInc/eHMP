package gov.va.cpe.vpr;

import java.util.ArrayList;
import java.util.List;

public class JdsCode {
    private String code;
    private String system;
    private String display;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getSystem() {
        return system;
    }

    public void setSystem(String system) {
        this.system = system;
    }

    public String getDisplay() {
        return display;
    }

    public void setDisplay(String display) {
        this.display = display;
    }
    
    public static List<String> getCodesCodeList(List<JdsCode> codes) {
        List<String> list = new ArrayList<String>();
        
        if (codes != null) {
            for (JdsCode jdscode : codes) {
                list.add(jdscode.getCode());
            }
        }
        
        return list;
    }
    
    public static List<String> getCodesSystemList(List<JdsCode> codes) {
        List<String> list = new ArrayList<String>();
        
        if (codes != null) {
            for (JdsCode jdscode : codes) {
                list.add(jdscode.getSystem());
            }
        }
        
        return list;
    }
    
    public static List<String> getCodesDisplayList(List<JdsCode> codes) {
        List<String> list = new ArrayList<String>();
        
        if (codes != null) {
            for (JdsCode jdscode : codes) {
                list.add(jdscode.getDisplay());
            }
        }
        
        return list;
    }
}

