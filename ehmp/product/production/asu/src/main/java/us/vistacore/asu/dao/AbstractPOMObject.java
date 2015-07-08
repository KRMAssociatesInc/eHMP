package us.vistacore.asu.dao;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.util.TokenBuffer;

import java.io.IOException;
import java.io.ObjectStreamException;
import java.io.Serializable;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Base class for all Patient objects in the patient object model.  All domain objects 
 * share these properties/features:
 * 
 * - common set of base fields: uid, pid, kind, summary
 * - basic record metadata: created, updated
 * - generic supplemental properties mechanism: punt strategy for data elements that don't conform to anything.
 * - no setters: more appropriate for health care, all initial data passed into constructor or via setData(Map)
 * - JPA + JSON serialization: designed to work for both relational and document oriented storage. 
 * - generic tag/flag mechanism that is indexed
 * 
 * See Patient for an example of a concrete class
 */
public abstract class AbstractPOMObject implements IPOMObject, Serializable {
	// static initialization/configuration of a Jackson mapper for all POM Objects to use
	protected static TypeReference<Map<String,Object>> MAP_TYPEREF = new TypeReference<Map<String,Object>>() {};

	protected static POMObjectMapper MAPPER = new POMObjectMapper();

	// internal fields for tracking object state/changes
	protected Map<String,Object> fPropMap = new HashMap<String,Object>();
	
	// record metadata/utils
	protected boolean modified = false;
	protected Date rec_created_dtm;
	protected Date rec_updated_dtm;
	protected ObjectReader jacksonReader; // reader to update this object specifically
	protected ObjectWriter jacksonWriter; // not used yet, but probably needed
	
	// common base data elements
	protected String uid;
	protected String summary;

	// constructors ------------------------
    public AbstractPOMObject() {
        this(null);
    }

	@JsonCreator
	public AbstractPOMObject(Map<String, Object> vals) {
		// setup a Jackson reader that will update this object
		jacksonReader = MAPPER.readerForUpdating(this);
		//jacksonWriter = MAPPER.writerWithType(this.getClass());
		
		// Initialize the data
		setData(vals);
	}
		
	// data marshaling --------------------

	/*
	 * Unrecognized fields are set this way.  This should not be public, all data setting 
	 * is done via setData()
	 */
	protected void setProperty(Map<String, Object> map) {
		// TODO: Mark these fields as modified (just like setData() calls)?
		fPropMap.putAll(map);
		modified = true;
	}
	
	@JsonAnySetter
	protected void setProperty(String key, Object val) {
		fPropMap.put(key, val);
		modified = true;
		rec_updated_dtm = new Date();
	}

	@JsonIgnore
	public Map<String, Object> getData() {
		return getData(JSONViews.class);
	}
	
	@JsonIgnore
	public Map<String, Object> getData(Class<? extends JSONViews> view) {
		//TODO: Cache this result?
		return convert(this, MAP_TYPEREF, view);
	}
	
	@JsonIgnore
	public void setData(Map<String, Object> data) {
		if (data == null) return;
		try {
			jacksonReader.readValue(MAPPER.valueToTree(data));
			modified = true;
			rec_updated_dtm = new Date();
		} catch (IOException ex) {
			// this can't really happen since we are not using the IO-based readValue()/writeValue()
			throw new RuntimeException(ex);
		}
	}

	@JsonIgnore
	public void setData(String key, Object val) {
		HashMap<String, Object> m = new HashMap<String, Object>();
		m.put(key, val);
		setData(m);
	}
	
	public String toJSON() {
		return toJSON(JSONViews.class);
	}
	
	public String toJSON(Class<? extends JSONViews> view) {
		try {
			return MAPPER.writerWithView(view).writeValueAsString(this);
		} catch (IOException ex) {
			// this should not be able to happen since we are writing to strings not files
			throw new RuntimeException(ex);
		}
	}
	
	// global getters ------------------------
	
	/**
	 * All domain objects have universal identifiers (URN syntax)
	 */
	@JsonProperty("uid")
	public String getUid() {
		return uid;
	}
	
	/**
	 * All domain objects have a summary string (often the same thing as toString())
	 */
	@JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.SolrView.class}) // not for event calculation
	public String getSummary() {
		if (summary == null) {
			return toString();
		}
		return summary;
	}

    @Override
    public String toString() {
        return getClass().getSimpleName() + "{" +
                "uid='" + uid + '\'' +
                '}';
    }

    @JsonAnyGetter
	public Map<String, Object> getProperties() {
		return Collections.unmodifiableMap(fPropMap);
	}
	
	public Object getProperty(String key) {
		return getProperties().get(key);
	}
	
	@JsonIgnore // Ignore for now
	public Date getRecUpdated() {
		return rec_updated_dtm;
	}
	
	@JsonIgnore // Ignore for now
	public Date getRecCreated() {
		return rec_created_dtm;
	}
	
    // serialization handling  ------------------------
    private void writeObject(java.io.ObjectOutputStream out) throws IOException {
        out.writeUTF(this.toJSON());
    }
    private void readObject(java.io.ObjectInputStream in) throws IOException, ClassNotFoundException {
        final Map<String, Object> data = parseJSONtoMap(in.readUTF());
        if (data != null) setData(data);
    }
    private void readObjectNoData() throws ObjectStreamException {
        // NOOP
    }

	public static final Map<String, Object> parseJSONtoMap(String jsonString) {
		try {
			return MAPPER.readValue(jsonString, MAP_TYPEREF);
		} catch (IOException e) {
			// not using file IO here so this shouldn't happen ever
			throw new RuntimeException(e);
		}
	}


	// static helpers  ------------------------
	
	// copied from ObjectMapper.convertValue(), slight mod to handle views as well
	@SuppressWarnings("unchecked")
	protected static <T> T convert(Object fromValue, TypeReference<T> toValueType, Class<?> view) {
		// sanity check for null first:
		if (fromValue == null)
			return null;
		/*
		 * Then use TokenBuffer, which is a JsonGenerator: (see [JACKSON-175])
		 */
		TokenBuffer buf = new TokenBuffer(MAPPER);
		try {
			MAPPER.writerWithView(view).writeValue(buf, fromValue);
			// and provide as with a JsonParser for contents as well!
			JsonParser jp = buf.asParser();
			Object result = MAPPER.readValue(jp, toValueType);
			jp.close();
			return (T) result;
		} catch (IOException e) { // should not occur, no real i/o...
			throw new IllegalArgumentException(e.getMessage(), e);
		}
	}}
