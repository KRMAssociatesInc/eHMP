package gov.va.cpe.param;

/**
 * This class models closely with VISTA param file.
 * 
 * @author vhaislbrayb
 * 
 */

public class Param {
	private Long id;
	private Long version;
	String entity;
	String entityId;
	String param;
	String instance;
//	Map<String, String> vals;
    String uid;
    String json;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public String getEntity() {
		return entity;
	}

	public void setEntity(String entity) {
		this.entity = entity;
	}

	public String getEntityId() {
		return entityId;
	}

	public void setEntityId(String entityId) {
		this.entityId = entityId;
	}

	public String getParam() {
		return param;
	}

	public void setParam(String param) {
		this.param = param;
	}

	public String getInstance() {
		return instance;
	}

	public void setInstance(String instance) {
		this.instance = instance;
	}

//	public Map<String, String> getVals() {
//		return vals;
//	}
//
//	public void setVals(Map<String, String> vals) {
//		this.vals = vals;
//	}

    public String getJson() {
        return json;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }
}
