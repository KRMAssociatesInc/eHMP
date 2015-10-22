package us.vistacore.vxsync.term.hmp;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

/**
 * The intent of this class is to read/parse a flat file containing mapping data.  Its not a full
 * blown CSV parser yet because it doesn't account for quotes.
 *
 * This is only capable of serving one mapping table.  If you have more than one mapping table
 * use multiple instances of this.
 *
 * TODO: There can be multiple mappings (primary and secondary), these are not being dealt with yet.
 *
 * Created by IntelliJ IDEA.
 * User: VHAISLBRAYB
 * Date: 6/10/11
 * Time: 10:26 AM
 */
public class FileTermDataSource extends AbstractTermDataSource implements ITermDataSource {

    private File fPath;
    private Properties fMapSetInfo;
    private HashMap<String, String> fMappings;

    public FileTermDataSource(File path, String name, String SourceCodeSystemID, String TargetCodeSystemID, int SourceConceptFieldIdx,
                              int TargetConceptFieldIdx, int StartRow, String delimiterRegex) throws IOException, URISyntaxException {
        fPath = path;

        Properties props = new Properties();
        props.setProperty("start.row", StartRow + "");
        props.setProperty("field.delimiter.pattern", delimiterRegex);
        props.setProperty("field.source.idx", SourceConceptFieldIdx + "");
        props.setProperty("field.target.idx", TargetConceptFieldIdx + "");
        props.setProperty("table.size", "N/A");

        // TODO: Should we let this lazy load?
        init();
    }
    
    @Override
    public void close() throws IOException {
    	// NOOP
    }

    private void init() throws IOException {
        if (fMappings != null) {
           return;
        }

        int rowNum = 1;
        int startRow = Integer.parseInt(fMapSetInfo.getProperty("start.row"));
        int targetFieldIdx = Integer.parseInt(fMapSetInfo.getProperty("field.target.idx"));
        int sourceFieldIdx = Integer.parseInt(fMapSetInfo.getProperty("field.source.idx"));
        String delimiter = fMapSetInfo.getProperty("field.delimiter.pattern");

        HashMap<String,String> map = new HashMap<String,String>();
        BufferedReader br = new BufferedReader(new FileReader(fPath));
        try {
        String line = br.readLine();
        while (line != null) {
            if (rowNum++ < startRow) {
                line = br.readLine();
                continue;
            }
            String[] tokens = line.split(delimiter);

            // bounds checking
            String srcCode = sourceFieldIdx <= tokens.length ? tokens[sourceFieldIdx-1] : null;
            String targetCode = targetFieldIdx <= tokens.length ? tokens[targetFieldIdx-1] : null;

            if (srcCode != null && targetCode != null && srcCode.length() > 0 && targetCode.length() > 0) {
                // TODO: Here is where we need to store multiple mappings potentially,
                // currently we are just blindly replacing any existing mapping with a new one.
                map.put(srcCode, targetCode);
            }

            line = br.readLine();
        }
        } finally {
        	br.close();
        }

        fMappings = map;
    }

    public int getMappingCount() {
        return fMappings.size();
    }

	@Override
	public Set<String> getCodeSystemList() {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public Map<String, Object> getCodeSystemMap() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, Object> getConceptData(String urn) {
		// TODO Auto-generated method stub
		return null;
	}
}
