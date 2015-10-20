package us.vistacore.asu.rules;

import us.vistacore.asu.dao.JdsCollectionName;
import us.vistacore.asu.dao.AbstractPOMObject;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

@JdsCollectionName("doc-def")
public class DocumentDefinition extends AbstractPOMObject

{

    String abbreviation;
     String name;
     String displayName;
     String statusName;
     String statusUid;
     String typeName;
     String typeUid;
     String classOwner;
     Boolean nationalStandard;
     String parentUid;

    // FIXME: change VistA extract to 'items'
    @JsonProperty("item")
     protected List<Map<String,Object>> items;

    public DocumentDefinition() {
    }

    public DocumentDefinition(Map<String, Object> vals) {
        super(vals);
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public String getName() {
        return name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getStatusName() {
        return statusName;
    }

    public String getStatusUid() {
        return statusUid;
    }

    public String getTypeName() {
        return typeName;
    }

    public String getTypeUid() {
        return typeUid;
    }

    public String getClassOwner() {
        return classOwner;
    }

    public Boolean isNationalStandard() {
        return nationalStandard;
    }

    public String getParentUid() {
        return parentUid;
    }

    public List<Map<String,Object>> getItems() {
        return items;
    }

    @Override
    public String getSummary() {
        return getDisplayName();
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{" +
                "uid='" + getUid() + "'" +
                ", displayName='" + getDisplayName() + "'" +
                "}";
    }
}
