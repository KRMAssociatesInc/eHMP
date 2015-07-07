package gov.va.cpe.web;

import java.util.List;

public class ApiParamDescriptor {
    private String name;
    private String type = "xsd:string";
    private String style = "query";
    private String title;
    private String description;
    private boolean required = false;
    private List options;

    public ApiParamDescriptor() {
    }

    public ApiParamDescriptor(String name) {
        this.name = name;
    }

    public void setStyle(String style) {
        this.style = style;
        if (this.style.equals("template")) {
            this.required = true;
        }

    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStyle() {
        return style;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List getOptions() {
        return options;
    }

    public void setOptions(List options) {
        this.options = options;
    }
}
