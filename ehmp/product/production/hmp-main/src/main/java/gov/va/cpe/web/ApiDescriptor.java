package gov.va.cpe.web;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ApiDescriptor {

    private String name;
    private String title;
    private String description;
    private String version = "0.7";

    public ApiDescriptor(String name, String description) {
        this.name = name;
        this.description = description;
    }

    @JsonIgnore
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return "/" + getName();
    }

    @JsonIgnore
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

    @JsonIgnore
    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
