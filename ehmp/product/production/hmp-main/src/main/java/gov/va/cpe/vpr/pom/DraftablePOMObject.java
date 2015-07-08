package gov.va.cpe.vpr.pom;

import java.util.Map;

public abstract class DraftablePOMObject extends AbstractPOMObject {

	public DraftablePOMObject(Map<String, Object> vals) {
		super(vals);
	}
	
	public abstract Map<String, Object> getDraft(); 

}
