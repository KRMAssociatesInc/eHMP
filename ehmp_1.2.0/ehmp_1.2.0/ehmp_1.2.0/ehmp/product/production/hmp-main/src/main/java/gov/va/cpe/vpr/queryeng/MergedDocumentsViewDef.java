package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Procedure;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.query.ScreenedJDSQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.MergedDocumentsViewDef")
@Scope("prototype")
public class MergedDocumentsViewDef extends ViewDef {

	public MergedDocumentsViewDef() {
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.SortParam("dateTime", false));
        declareParam(new ViewParam.ViewInfoParam(this, "Texts"));
		this.domainClasses.add("Document");
		this.domainClasses.add("Encounter");

    	String displayCols = "summary,dateTime,kind,authorDisplayName,facilityName";
    	String requireCols = "summary,dateTime,kind,authorDisplayName,facilityName";
    	String hideCols = "uid,selfLink,domainClass";
    	String sortCols = "summary,dateTime,facilityName"; // Author sort does not work because it is called different things in different files that both contribute to this notesview JDS template.
    	String groupCols = "summary,kind,authorDisplayName,facilityName";
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

        QueryDef querydef = new QueryDef("docs-view");
    	querydef.fields().exclude("text","content");
    	querydef.fields().alias("typeName","localTitle");
        querydef.fields().alias("referenceDateTime","dateTime");
        querydef.fields().alias("providerDisplayName","authorDisplayName");
      	querydef.where("kind").in("?:filter.kinds");
        querydef.linkIf("document-parent;child-document", null, false, true);
        querydef.linkIf("procedure-result", null, true, true);

        Query q1 = addQuery(new ScreenedJDSQuery("uid", querydef) {

            @Override
            protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
                if (row.containsKey("providers")) {
                    List<Map<String, Object>> providers = (List<Map<String, Object>>) row.get("providers");
                    if (providers.isEmpty()) {
                        row.put("authorDisplayName", "None");
                    } else if (providers.size() > 1) {
                        row.put("authorDisplayName", "Multiple (" + providers.size() + ")");
                    } else {
                        row.put("authorDisplayName", providers.get(0).get("providerDisplayName"));
                    }
                } else if(row.get("clinicians") == null || row.get("clinicians") instanceof List && ((List)row.get("clinicians")).size()==0) {
                	row.put("authorDisplayName", "None");
                }
                return row;
            }
        });

		addColumns(q1, "uid", "summary", "kind", "authorDisplayName", "facilityName", "domainClass");
	}
}
