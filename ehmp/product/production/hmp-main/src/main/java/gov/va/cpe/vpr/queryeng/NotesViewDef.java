package gov.va.cpe.vpr.queryeng;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component(value = "gov.va.cpe.vpr.queryeng.NotesViewDef")
@Scope("prototype")
public class NotesViewDef extends MergedDocumentsViewDef {
	public NotesViewDef() {
		super();
		declareParam(new ViewParam.ViewInfoParam(this, "Notes"));
		declareParam(new ViewParam.SimpleViewParam("filter.kinds", Arrays.asList("Progress Note", "Consult Report", "Laboratory Report", "Discharge Summary", "Consult", "Unknown", "Advance Directive", "Crisis Note", "Allergy/Adverse Reaction", "Clinical Warning")));
	}
}
