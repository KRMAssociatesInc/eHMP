package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component(value = "gov.va.cpe.vpr.queryeng.NotesUnfilteredViewDef")
@Scope("prototype")
public class NotesUnfilteredView extends ViewDef {

    public NotesUnfilteredView() {

        declareParam(new ViewParam.PatientIDParam());
        declareParam(new ViewParam.SortParam("dateTime", false));
        this.domainClasses.add("Document");
        this.domainClasses.add("Encounter");

        String displayCols = "summary,dateTime,kind,authorDisplayName,facilityName";
        String requireCols = "summary,dateTime,kind,authorDisplayName,facilityName";
        String hideCols = "uid,selfLink,domainClass";
        String sortCols = "summary,dateTime,facilityName"; // Author sort does not work because it is called different things in different files that both contribute to this notesview JDS template.
        String groupCols = "summary,kind,authorDisplayName,facilityName";
        declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

        QueryDef querydef = new QueryDef("parent-documents");
        querydef.fields().exclude("text","content");
        querydef.fields().alias("typeName","localTitle").alias("referenceDateTime", "dateTime");
        querydef.linkIf("document-parent;child-document", null, false, true);

        Query q1 = addQuery(new JDSQuery("uid", querydef));

        addColumns(q1, "uid", "summary", "kind", "authorDisplayName", "facilityName", "domainClass");

        addColumn(new ColDef.HealthTimeColDef(q1, "dateTime")).setMetaData("text", "Date/Time");
        getColumn("summary").setMetaData("text", "Title").setMetaData("flex", 1);
        getColumn("uid").setMetaData("text", "uid");
        getColumn("kind").setMetaData("text", "Type");
        getColumn("authorDisplayName").setMetaData("text", "Author");
        getColumn("facilityName").setMetaData("text", "Facility");
//        getColumn("status").setMetaData("text", "Status");
//        getColumn("service").setMetaData("text", "Service");
        addColumn(new ColDef.UidClassSelfLinkColDef("selfLink"));
    }
}
