package us.vistacore.vxsync.vler;

import java.util.ArrayList;
import java.util.List;

public class Section  {

    private List<TemplateId> templateIds;
    private Code code;
    private String title;
    private String text;

    public List<TemplateId> getTemplateIds() {

        if (templateIds == null) {
            templateIds = new ArrayList<>();
        }

        return templateIds;
    }


    public Code getCode() {
        return code;
    }

    public void setCode(Code code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}