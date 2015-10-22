package us.vistacore.vxsync.term.hmp;

import com.fasterxml.jackson.databind.ObjectMapper;
//import gov.va.cpe.vpr.web.IHealthCheck;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.sql.*;
import java.util.*;

/**
 * TODO: Add more metadata to the database build part: build date, build by/machine/etc, more metadata from UMLS about source (full name, desc, version, etc)
 * TODO: IS there a way to ensure that the database is not in recovery mode?  That really slows down the startup/shutdown process.
 * @author brian
 */
public class H2TermDataSource extends AbstractTermDataSource implements ITermDataSource//, IHealthCheck
{
	private static ObjectMapper MAPPER = new ObjectMapper();
	private static final String CREATE_TABLE1_SQL = "CREATE TABLE IF NOT EXISTS concepts (urn VARCHAR(64) PRIMARY KEY, json CLOB NOT NULL)";
	private static final String CREATE_TABLE2_SQL = "CREATE TABLE IF NOT EXISTS sources (sab VARCHAR(64) PRIMARY KEY, concept_count INT NOT NULL, term_count INT NOT NULL)";
	private static final String PING_SQL = "SELECT * FROM INFORMATION_SCHEMA.users";
	private Connection conn;
	private PreparedStatement ps_select, ps_save,ps_del,ps_search,ps_list;
	private String jdbcURL;
	private Map<String,Object> sourceMap;

  private static Logger LOGGER = LoggerFactory.getLogger(H2TermDataSource.class);

    /**
	 * Private constructor.  Only used for situations where we want to create a new H2 database.
	 * @param jdbcurl
	 * @throws SQLException
	 */
	public H2TermDataSource(String jdbcurl) throws SQLException, ClassNotFoundException {
        Class.forName("org.h2.Driver");
		this.conn = DriverManager.getConnection(jdbcurl, "sa", "");
		this.jdbcURL = jdbcurl;
		
		// do the tables exist?
		boolean exists = false;
		ResultSet rs = this.conn.getMetaData().getTables(null, null, "concepts", null);
		if (rs.next()) {
			exists = true;
		}
		rs.close();

		// create/initalize the DB if needed
		if (!exists) {
			this.conn.prepareCall(CREATE_TABLE1_SQL).execute();
			this.conn.prepareCall(CREATE_TABLE2_SQL).execute();
//			FullTextLucene4.init(this.conn);
		}
		
		// setup the prepared statements we will use
		ps_select = this.conn.prepareStatement("SELECT json FROM concepts WHERE urn=?");
		ps_save = this.conn.prepareStatement("INSERT INTO concepts VALUES (?, ?)");
		ps_del = this.conn.prepareStatement("DELETE FROM concepts WHERE urn=?");
		ps_list = this.conn.prepareStatement("SELECT urn FROM concepts WHERE urn > ? ORDER BY urn ASC");
		ps_list.setMaxRows(1000);
		ps_search = this.conn.prepareStatement("SELECT urn FROM concepts WHERE urn=?"); // temporary
//		ps_search = this.conn.prepareStatement("SELECT keys[0] as key FROM FTL4_SEARCH_DATA(?,25,0)");
		
		// gather the list of reference terminologies this database file contains 
		PreparedStatement src_ps = null;
		try {
			src_ps = this.conn.prepareStatement("SELECT * FROM sources");
			ResultSetMetaData meta = src_ps.getMetaData();
			rs = src_ps.executeQuery();
			Map<String, Object> sources = new HashMap<String,Object>();
			while (rs.next()) {
				HashMap<String, Object> row = new HashMap<String, Object>();
				for (int i=1; i <= meta.getColumnCount(); i++) {
					row.put(meta.getColumnName(i), rs.getObject(i));
				}
				sources.put(rs.getString("sab"), row);
			}
			this.sourceMap = sources;
		} catch (SQLException ex) {
			System.err.println("Error reading sources");
			ex.printStackTrace();
		} finally {
			if (src_ps != null) src_ps.close();
		}
	}
	
	public void save(Map<String, Object> data) {
		try {
			ps_del.setString(1,  (String) data.get("urn"));
			ps_del.execute();
			ps_save.setString(1, (String) data.get("urn"));
			Clob jsondata = this.conn.createClob();
			jsondata.setString(1, MAPPER.writeValueAsString(data));
			ps_save.setClob(2, jsondata);
			ps_save.execute();
		} catch (Exception ex) {
			throw new RuntimeException(ex);
		}
	}
	
	public Connection getConnection() {
		return this.conn;
	}
	
	public void commit() throws SQLException {
		this.conn.commit();
	}
	

	public void close() throws IOException {
        //Commenting out the 'shutdown defrag' operation to speed shutdown up
//        LOGGER.info("Starting 'shutdown defrag' for " + jdbcURL);
//		this.conn.createStatement().execute("shutdown defrag");
//        LOGGER.info("'shutdown defrag' complete for " + jdbcURL);
		try {
			this.conn.close();
		} catch (Exception e) {
            LOGGER.error("Error in close()", e);
			throw new IOException(e);
		}
	}

	public int size() throws SQLException {
		int ret = -1;
		ResultSet rs = this.conn.createStatement().executeQuery("SELECT count(*) FROM concepts");
		if (rs.next()) {
			ret = rs.getInt(1);
		}
		rs.close();
		return ret;
	}
	
	@Override
	public Iterator<String> iterator() {
		return new DBIterator();
	}

	/** Returns a list (of up to 1000) concepts for the given SAB starting at startCode */
	public List<String> fetchConceptList(String startCode) {
		List<String> ret = new ArrayList<String>();
		ResultSet rs = null;
		try {
			ps_list.setString(1, startCode);
			rs = ps_list.executeQuery();
			while (rs.next()) {
				ret.add(rs.getString(1));
			}
			rs.close();
		} catch (SQLException ex) {
			ex.printStackTrace();
		}
		return ret;
	}

	@Override
	public Set<String> getCodeSystemList() {
		if (this.sourceMap == null) return null;
		return this.sourceMap.keySet();
	}
	
	@Override
	public Map<String, Object> getCodeSystemMap() {
		return this.sourceMap;
	}
	
	@Override
	public List<String> search(String text) {
		ResultSet rs = null;
		try {
			List<String> ret = new ArrayList<String>();
			ps_search.setString(1, text);
			rs = ps_search.executeQuery();
			while (rs.next()) {
				ret.add(rs.getString(1));
			}
			return ret;
		} catch (Exception ex) {
			throw new RuntimeException(ex);
		} finally {
			try {
				if (rs != null) rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	
	public synchronized String getConceptJSON(String urn) {
		ResultSet rs = null;
		try {
			ps_select.setString(1, urn);
			rs = ps_select.executeQuery();
		
			if (rs!=null && rs.next()) {
				return rs.getString(1);
			}
			return null;
		} catch (Exception ex) {
			throw new RuntimeException(ex);
		} finally {
			try {
				if (rs != null) rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public synchronized Map<String, Object> getConceptData(String urn) {
		String json = getConceptJSON(urn);
		if (json == null) return null;
		
		Map<String, Object> data = null;
		try {
			data = MAPPER.readValue(json, Map.class);
		} catch (Exception ex) {
			throw new RuntimeException("Unable to parse JSON.", ex);
		}
		
		// Fix list to set issue for: sameas, parents, ancestors
		for (String key : new String[] {"sameas", "parents", "ancestors"}) {
			List<String> list = (List<String>) data.get(key);
			if (list != null) data.put(key, new HashSet<String>(list));
		}
		
		// fix list to set issue for rels.value
		if (data.containsKey("rels")) {
			Map<String,List<String>> rels = (Map<String, List<String>>) data.get("rels");
			Map<String,Set<String>> rels2 = new HashMap<>();
			for (String key : rels.keySet()) {
				rels2.put(key, new HashSet<String>(rels.get(key)));
			}
			data.put("rels", rels2);
		}
		return data;
	}
	
	@Override
	public String toString() {
		return getClass().getName() + ": " + jdbcURL;
	}
	
//    @Override
    public String getHealthCheckName() {
        return jdbcURL;
    }

//    @Override
	public boolean isAlive() {
		try {
			this.conn.prepareCall(PING_SQL).execute();
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
    
    private class DBIterator implements Iterator<String> {
		
		private List<String> chunk;
		private Iterator<String> itr;

		public DBIterator() {
			this.chunk = fetchConceptList("");
			this.itr = chunk.iterator();
		}
		
		@Override
		public boolean hasNext() {
			if (!itr.hasNext() && chunk.size() > 0) {
				// at the end of this chunk, try to get a new one...
				String last = chunk.get(chunk.size()-1);
				this.chunk = fetchConceptList(last);
				this.itr = chunk.iterator();
			}
			return itr.hasNext();
		}

		@Override
		public String next() {
			return itr.next();
		}

		@Override
		public void remove() {
			throw new UnsupportedOperationException();
		}
	}	
}
