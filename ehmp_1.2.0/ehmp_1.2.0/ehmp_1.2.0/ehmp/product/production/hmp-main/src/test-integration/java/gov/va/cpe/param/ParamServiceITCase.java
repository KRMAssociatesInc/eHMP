package gov.va.cpe.param;

import gov.va.hmp.vista.rpc.RpcTemplate;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.apache.commons.codec.binary.Hex;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.util.FileCopyUtils;

import java.io.*;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class ParamServiceITCase {
	
		// setup an MD5 hashing function
	    static MessageDigest HASHER = null;
	    private static String md5Hash(String str) {
	    	if (HASHER == null) {
	    		try {
					HASHER = MessageDigest.getInstance("MD5");
				} catch (NoSuchAlgorithmException e) {
					e.printStackTrace();
				}
	    	}
	    	HASHER.update(str.getBytes(Charset.forName("UTF8")));
	    	return new String(Hex.encodeHex(HASHER.digest()));
	    }
	    
	    // setup a .json filename filter
	    private static FilenameFilter fileFilter = new FilenameFilter() {
			public boolean accept(File dir, String name) {
				return name.endsWith(".json");
			}
		};
	    
	    private static RpcTemplate tpl = new RpcTemplate();
	    
	    @Test
	    @Ignore // remove to run this
	    public void testABunchOfDocuments() throws IOException, URISyntaxException {
	    	// test all the JSON files in the resources directory
	    	URL url = getClass().getResource("/gov/va/cpe/vpr/sync/vista/json");
	    	File dir = new File(url.toURI());
	    	assertTrue(dir.exists());
	    	assertTrue(dir.isDirectory());
	    	for (File file : dir.listFiles(fileFilter)) {
	    		System.out.println("testing: " + file);
	    		String str = FileCopyUtils.copyToString(new FileReader(file));
	    		if (str != null && str.length() > 0) {
	    			testLargeStrings(str);
	    		}
	    	}
	    }
	    
	    @Test
	    public void testOneDocument() throws FileNotFoundException, IOException, URISyntaxException {
	    	URL url = getClass().getResource("/gov/va/cpe/vpr/sync/vista/json/allergy.json");
	    	File f = new File(url.toURI());
	    	testLargeStrings(FileCopyUtils.copyToString(new FileReader(f)));
	    }
	    
	    public void testLargeStrings(String str) {
	    	// insert the string under a specific URN and record its exact checksum
	    	String uid = "urn:va:param:123foo:1089:foo:bar";
	    	String rpcurl = "vrpcb://10vehu;vehu10@localhost:29060/HMP UI CONTEXT/HMPCRPC RPC";
	    	String md5 = md5Hash(str);

	    	// save the param to VISTA
	    	Map<String, Object> params = new HashMap<String,Object>();
			params.put("command", ParamService.SAVE_PARAM_BY_UID_COMMAND);
			params.put("uid", uid);
			params.put("value", VistaStringUtils.splitLargeStringIfNecessary(str));
			tpl.executeForString(rpcurl, params);
	    	
			// read the string back out
			params = new HashMap<String,Object>();
			params.put("command", ParamService.GET_PARAM_COMMAND);
			params.put("uid", uid);
			String val = tpl.executeForString(rpcurl, params);
			
			// compare the checksums, lengths, strings, etc to ensure what went in came out
			assertEquals(str.length(), val.length());
			assertEquals(md5, md5Hash(val));
			assertEquals(str, val);
	    }
}
