package gov.va.cpe.vpr.queryeng;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component(value = "gov.va.cpe.vpr.queryeng.StudiesViewDef")
@Scope("prototype")
public class StudiesViewDef extends MergedDocumentsViewDef {
	public StudiesViewDef() {
		super();
		declareParam(new ViewParam.ViewInfoParam(this, "Studies"));
		declareParam(new ViewParam.SimpleViewParam("filter.kinds", Arrays.asList("Procedure", "Imaging", "Radiology Report", "Surgery", "Surgery Report")));
	}
}
