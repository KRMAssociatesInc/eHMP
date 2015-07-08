package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.PatientRecordFlag;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer.ExtractFieldTransformer;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer.OverwriteTransformer;
import gov.va.cpe.vpr.queryeng.QueryMapper.UnionQueryMapper;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.HashMap;

/**
 * Demonstrating a couple things:
 * 
 * - reusable QueryTransformer (ExtractFieldTransformer) to clean up messy extraction
 * - No need for UnionQuery, since that is the default behavior of additional queries
 * - 
 * 
 * @author brian
 *
 */
@Component(value = "gov.va.cpe.vpr.queryeng.ProfileDocsViewDef2")
@Scope("prototype")
public class ProfileDocsViewDef2 extends ViewDef {

	public ProfileDocsViewDef2()
	{
    	this.domainClasses.add(PatientDemographics.class.getSimpleName());
    	this.domainClasses.add(Document.class.getSimpleName());
		declareParam(new ViewParam.ViewInfoParam(this, "Profile Documents"));
		declareParam(new ViewParam.PatientIDParam());
		
		// list of fields that are not displayable as columns and a default user column set/order
		String displayCols = "kind,referenceDateTime,summary";
		String requireCols = "kind,referenceDateTime,summary";
		String hideCols = "uid,typeCode";
        
		declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, "", ""));

		// get CWAD documents
    	QueryDef def = new QueryDef("cwad");
    	def.fields().include("uid", "kind", "referenceDateTime", "summary", "documentTypeCode", "text");
    	def.fields().alias("documentTypeCode", "typeCode");
    	def.fields().transform(new ExtractFieldTransformer("text[0].content", "summary", null)); // extracts document text as summary when available
    	def.fields().transform(new OverwriteTransformer("text", null)); // now that we extracted the text, delete the node so it doesn't junk up the results
    	Query q1 = addQuery(new JDSQuery("uid", def));
    	
    	// TODO: extract products/reactions?
    	
    	
    	Query q2 = addQuery(new UnionQueryMapper(new AbstractQuery("uid", null) {
			@Override
			public void exec(RenderTask task) throws Exception {
    			IPatientDAO pdao = task.getResource(IPatientDAO.class);
    			PatientDemographics dems = pdao.findByPid(task.getParamStr("pid"));
    			if(dems!=null && dems.getPatientRecordFlag()!=null) {
    				int i=0;
    				for(PatientRecordFlag flag: dems.getPatientRecordFlag()) {
    					HashMap<String, Object> data = new HashMap<String, Object>();
    					data.put("uid", dems.getUid() + ":flag:" + i++); // generate a temporary uid
    					data.put("kind", flag.getName());
    					data.put("typeCode", "F");
    					data.put("summary", flag.getText());
    					task.add(data);
    				}
    			}
			}
    	}));
        
        // Only show profile documents.
        //querydef.addCriteria(QueryDefCriteria.where("kind").in("Advance Directive", "Crisis Note", "Allergy/Adverse Reaction", "Clinical Warning"));
		addColumns(q1, "uid", "content", "summary", "kind");
        getColumn("summary").setMetaData("text", "Summary").setMetaData("flex", 1);
        getColumn("uid").setMetaData("text", "uid");
        getColumn("kind").setMetaData("text", "Type");
	}
}
