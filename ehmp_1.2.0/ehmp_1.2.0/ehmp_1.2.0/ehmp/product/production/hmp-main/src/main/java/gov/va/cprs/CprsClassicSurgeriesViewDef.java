package gov.va.cprs;

import gov.va.cpe.vpr.DocumentClinician;
import gov.va.cpe.vpr.queryeng.ColDef;
import gov.va.cpe.vpr.queryeng.Query;
import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewParam;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer;
import gov.va.cpe.vpr.queryeng.query.ScreenedJDSQuery;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component(value = "gov.va.cprs.CprsClassicSurgeriesViewDef")
@Scope("prototype")
public class CprsClassicSurgeriesViewDef extends ViewDef {
	public CprsClassicSurgeriesViewDef() {
		
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.SortParam("dateTime", false));

    	QueryDef querydef = new QueryDef("procedure");
    	querydef.fields().alias("typeName","localTitle").alias("referenceDateTime","dateTime");
//    	querydef.fields().alias("clinicians", "author").alias("providers", "author");
    	querydef.fields().transform(new QueryDefTransformer.QueryFieldTransformer("author") {
			@Override
			public Object transform(Object value) {
				Set<String> authors = parseAuthors(value);
				if (authors.isEmpty()) {
					return "--None--";
				} else if (authors.size() > 1) {
					return "--Multiple (" + authors.size() + ")--";
				} else {
					return authors.iterator().next();
				}
			}
		});
    	querydef.where("category").is("SR");
        Query q1 = addQuery(new ScreenedJDSQuery("uid", querydef));
    		
		addColumns(q1, "uid", "summary", "kind", "authorDisplayName", "facilityName","domainClass");
        addColumn(new ColDef.UidClassSelfLinkColDef("selfLink"));
	}

	
	/**
	 * Custom field transformer to get the author information from the document
	 * in a couple different ways.
	 */
    // TODO: DRY this out with the other pasted copies of this
	private static Set<String> parseAuthors(Object value) {
		Set<String> authors = new HashSet<String>();
		if (value instanceof Collection && !((Collection<?>) value).isEmpty()) {
			for (Object obj : ((Collection<?>) value)) {
				if (obj instanceof Map) {
					Map<String,Object> map = (Map<String,Object>) obj;
					if (map.containsKey("providerDisplayName")) {
						// provider specified
						authors.add(map.get("providerDisplayName").toString());
					} else if (map.containsKey("role") && map.containsKey("displayName")) {
						// clinican specified
						String role = map.get("role").toString();
						if (DocumentClinician.Role.AUTHOR_DICTATOR.getAbbreviation().equalsIgnoreCase(role)) {
							authors.add(map.get("displayName").toString());
						}
					}
				}
			}
		}
		return authors;
	}
}
