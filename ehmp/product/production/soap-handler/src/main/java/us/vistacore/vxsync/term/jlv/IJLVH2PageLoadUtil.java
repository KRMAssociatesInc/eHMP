package us.vistacore.vxsync.term.jlv;

import java.io.IOException;
import java.sql.SQLException;

/**
 * This is an interface used for each of the classes that will load one of the JLV mapping files.
 * 
 * @author Les.Westberg
 */
public interface IJLVH2PageLoadUtil {

	/**
	 * This method loads the database table with the information in the mapping file.
	 * @throws IOException 
	 * @throws SQLException 
	 */
	public void loadDatabaseTable() throws IOException, SQLException;

	/**
	 * This method returns the final statistics.
	 * 
	 * @return The final statistics.
	 */
	public String getFinalStatistics();

}
