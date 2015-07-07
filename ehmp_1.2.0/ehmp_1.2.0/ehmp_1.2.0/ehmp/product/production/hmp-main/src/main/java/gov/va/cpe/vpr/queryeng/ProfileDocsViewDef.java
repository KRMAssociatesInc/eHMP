package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.ProfileDocsViewDef")
@Scope("prototype")
public class ProfileDocsViewDef extends ViewDef {

    private static String ALLERGY_TYPE = "a";
    private static String ALLERGY_TYPE_STRING_REP = "Allergy / Adverse Reaction";

    public ProfileDocsViewDef() {
        this.domainClasses.add(PatientDemographics.class.getSimpleName());
        this.domainClasses.add(Document.class.getSimpleName());
        this.domainClasses.add(Allergy.class.getSimpleName());

        declareParam(new ViewParam.ViewInfoParam(this, "Profile Documents"));
        declareParam(new ViewParam.PatientIDParam());


        QueryDef querydef = new QueryDef();
        querydef.fields().alias("typeName", "localTitle").alias("referenceDateTime", "dateTime");

        Query q1 = new JDSQuery("uid", querydef, "/vpr/{pid}/index/cwad") {
            protected Map<String, Object> mapRow(RenderTask renderer, Map<String, Object> row) {
                Map<String, Object> ret = super.mapRow(renderer, row);

                String kind = null;
                if (ret.containsKey("name") && !ret.containsKey("kind")) {
                    kind = (String) ret.get("name");
                } else {
                    kind = (String) ret.get("kind");
                }

                String findProfileDocType = renderer.getParamStr("profile_doc_type");
                if (StringUtils.hasText(findProfileDocType) && findProfileDocType.equalsIgnoreCase(ProfileDocsViewDef.ALLERGY_TYPE)) {
                    if (!kind.equalsIgnoreCase(ProfileDocsViewDef.ALLERGY_TYPE_STRING_REP)) {
                        return null;
                    } else {
                        // if ( ret.containsKey("products") && ret.containsKey("reactions") )
//                        {
                            ret.put("products", ProfileDocsViewDef.this.buildStrFromAllergyData(ret.get("products")));
                            ret.put("reactions", ProfileDocsViewDef.this.buildStrFromAllergyData(ret.get("reactions")));
//                        }
                    }
                } else {
                    if (kind.equalsIgnoreCase(ProfileDocsViewDef.ALLERGY_TYPE_STRING_REP)) {
                        return null;
                    } else {
                        ret.put("kind", kind);
                        // ret.put("referenceDateTime", .. )
                    }
                }

                return ret;
            }

            @Override
            public void exec(RenderTask task) throws Exception {
                super.exec(task);

                IPatientDAO pdao = task.getResource(IPatientDAO.class);
                PatientDemographics dems = pdao.findByPid(task.getParams().get("pid").toString());
                if (dems != null && dems.getPatientRecordFlag() != null) {
                    int i = 0;
                    for (PatientRecordFlag flag : dems.getPatientRecordFlag()) {
                        HashMap<String, Object> data = new HashMap<String, Object>(flag.getData());
                        data.put("uid", dems.getUid() + ":flag:" + i++);
                        task.add(mapRow(task, data));
                    }
                }
            }
        };

        addQuery(q1);
    }

    protected Object buildStrFromAllergyData(Object values) {
        StringBuilder rslt = new StringBuilder();

        if (values instanceof List && ((List) values).size() > 0) {
            Object product = ((List) values).get(0);
            rslt.append(product instanceof String ? product : product instanceof Map ? ((Map) product).get("name") : "");
            for (int i = 1; i < ((List) values).size(); i++) {
                rslt.append(", ");
                product = ((List) values).get(i);
                rslt.append(product instanceof String ? product : product instanceof Map ? ((Map) product).get("name") : "");
            }
        }

        return rslt.toString();
    }

    protected Object buildSummaryContentFromAllergyData(Object products, Object reactions, Object kind) {
        StringBuilder rslt = new StringBuilder();

        if (products instanceof List && ((List) products).size() > 0) {
            Object product = ((List) products).get(0);
            rslt.append(product instanceof String ? product : product instanceof Map ? ((Map) product).get("name") : "");
            for (int i = 1; i < ((List) products).size(); i++) {
                rslt.append(", ");
                product = ((List) products).get(i);
                rslt.append(product instanceof String ? product : product instanceof Map ? ((Map) product).get("name") : "");
            }
        }
        rslt.append(" can cause the following: ");
        if (reactions instanceof List && ((List) reactions).size() > 0) {
            Object reaction = ((List) reactions).get(0);
            rslt.append(reaction instanceof String ? reaction : reaction instanceof Map ? ((Map) reaction).get("name") : "");
            for (int i = 1; i < ((List) reactions).size(); i++) {
                reaction = ((List) reactions).get(i);
                rslt.append(", ");
                rslt.append(reaction instanceof String ? reaction : reaction instanceof Map ? ((Map) reaction).get("name") : "");
            }
        }

        return rslt.toString();
    }

    protected Object buildSummaryFromDocumentText(List text) {
        String rslt = "";
        if (text.size() > 0 && text.get(0) instanceof Map) {
            rslt = ((Map) text.get(0)).get("content").toString();
        }
        return rslt;
    }

    /*
     * Quick-and-dirty parsing to brief crisis / advance note critical data to show in list.
     */
    protected Object buildSummaryContentFromFullContent(String content) {
        String rslt = content;
        if (content.contains("STATUS: ")) {
            rslt = content.substring(content.indexOf("STATUS: "));
            rslt = rslt.substring(rslt.indexOf("\r"));
            rslt = rslt.trim();
        }
        return rslt;
    }
}
