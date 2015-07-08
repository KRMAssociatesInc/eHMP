package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import gov.va.cpe.vpr.pom.AbstractPatientObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * A one-to-one extension of the Patient domain object; Handle miscellaneous fields like comments, current location, etc.
 * @author vhaislchandj
 *
 */
public class Auxiliary extends AbstractPatientObject {
	
	public Auxiliary() {
		super(null);
	}
	
	@JsonCreator
	public Auxiliary(Map<String, Object> vals) {
		super(vals);
	}
	
	/**
	 * Temp hack going from S34 to S35 and beyond; Simple comments will make this vomit.
	 */
	public void setData(Map<String, Object> vals) {
		if(vals!=null) {
			if(vals.get("comments") instanceof String) {
				ArrayList<Map<String, Object>> nval = new ArrayList<Map<String, Object>>();
				Map<String, Object> val = new HashMap<String, Object>();
				val.put("comment", vals.get("comments"));
				val.put("author", "<unknown>");
				nval.add(val);
				vals.put("comments",nval);
			}
			if(vals.get("domainAux")!=null) {
				for(String key: ((Map<String, Object>)vals.get("domainAux")).keySet()) {
					Object obj = ((Map<String, Object>)vals.get("domainAux")).get(key);
					if(obj instanceof Map) {
						Object comments = ((Map)obj).get("comments");
						if(comments instanceof String) {
							ArrayList<Map<String, Object>> nval = new ArrayList<Map<String, Object>>();
							Map<String, Object> val = new HashMap<String, Object>();
							val.put("comment", comments);
							val.put("author", "<unknown>");
							nval.add(val);
							((Map)obj).put("comments",nval);
						}
					}
				}
			}
		}
		
		super.setData(vals);
	}

	ArrayList<Map<String, Object>> comments;
//	String comments;
	String diagnosis;
	PointOfCare location;
	Map<String, Map<String, Object>> domainAux;
	Map<String, String> domainComments;
	Map<String, Map<String, Object>> goals;
	
	public Map<String, Map<String, Object>> getGoals() {
		return goals;
	}
	
	public void setGoal(String goal, Map<String, Object> data) {
		if (!goals.containsKey(goal)) {
			// new goal
			goals.put(goal, new HashMap<String, Object>());
		}
		if (data == null) {
			// clear goal
			goals.remove(goal);
		} else {
			// update goal
			goals.get(goal).putAll(data);
		}
	}

	public Map<String, Map<String, Object>> getDomainAux() {
		if(domainAux==null) {domainAux = new HashMap<>();}
        return domainAux;
	}

	public ArrayList<Map<String, Object>> getComments() {
		return comments;
	}
	
	public PointOfCare getLocation() {
		return location;
	}
	
	public void setCommentAt(int idx, String cmt, String uzar) throws Exception {
		Map<String, Object> comment = new HashMap<String, Object>();
		comment.put("comment",cmt);
		comment.put("author",uzar);
		if(comments!=null && comments.get(idx)!=null) {
			comments.set(idx, comment);
		} else {
			throw new Exception("Comments index "+idx+" does not exist.");
		}
	}
	
	public void addComment(String cmt, String uzar) {
		if(comments==null) {
			comments = new ArrayList<Map<String, Object>>();
		}
		Map<String, Object> comment = new HashMap<String, Object>();
		comment.put("comment",cmt);
		comment.put("author",uzar);
		comments.add(comment);
	}
	
	public void setCurrentCommentAt(int idx, String cmt, String uzar, String uid) {
		Map<String, Object> comment = new HashMap<String, Object>();
		comment.put("comment",cmt);
		comment.put("author",uzar);
		Map<String, Object> stuff = getDomainAux().get(uid);
		if(stuff==null) {
			return;
		}
		Object currComments = stuff.get("comments");
		if(currComments == null || !(currComments instanceof ArrayList)) {
			return;
		}
		Map<String, Object> oldComment = ((ArrayList<Map<String, Object>>)currComments).get(idx);
		if(oldComment!=null) {
			((ArrayList<Map<String, Object>>)currComments).set(idx, comment);
		}
	}
	
	public void addCurrentComment(String cmt, String uzar, String uid) {
		Map<String, Object> comment = new HashMap<String, Object>();
		comment.put("comment",cmt);
		comment.put("author",uzar);
		Map<String, Object> stuff = getDomainAux().get(uid);
		if(stuff==null) {
			stuff = new HashMap<String, Object>();
			getDomainAux().put(uid, stuff);
		}
		Object currComments = stuff.get("comments");
		if(currComments == null || !(currComments instanceof ArrayList)) {
			currComments = new ArrayList<Map<String, Object>>();
			stuff.put("comments", currComments);
		}
		((ArrayList<Map<String, Object>>)currComments).add(comment);
	}
}
