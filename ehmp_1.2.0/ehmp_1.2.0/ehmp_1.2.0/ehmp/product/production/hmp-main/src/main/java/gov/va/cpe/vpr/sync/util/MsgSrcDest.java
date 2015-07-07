package gov.va.cpe.vpr.sync.util;

import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.dao.solr.DomainObjectToSolrInputDocument;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.pom.jds.JdsTemplate;
import gov.va.cpe.vpr.util.FacetedTimer;
import gov.va.hmp.vista.rpc.RpcTemplate;
import gov.va.hmp.vista.rpc.broker.conn.BrokerConnectionFactory;
import gov.va.hmp.vista.rpc.pool.DefaultConnectionManager;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

import javax.jms.Connection;
import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.MapMessage;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.pool.PooledConnectionFactory;
import org.apache.commons.io.IOUtils;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.common.SolrInputDocument;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * TODO: Add a SOLRSrcDest class (write only)
 * @author brian
 *
 */
public abstract class MsgSrcDest {
	protected Map<String, Object> options;
	protected int limit;

	public MsgSrcDest(Map<String, Object> options) {
		this.options = (options!=null) ? options : new HashMap<String, Object>();
		this.limit = getOption("limit", 10000);
	}
	
	protected boolean getOption(String key, boolean defaultVal) {
		Object val = options.get(key);
		if (val == null) return defaultVal;
		if (val instanceof Boolean) {
			return (Boolean) val;
		}
		return Boolean.parseBoolean(val.toString());
	}
	
	protected int getOption(String key, int defaultVal) {
		Object val = options.get(key);
		if (val == null) return defaultVal;
		if (val instanceof Integer) {
			return (Integer) val;
		}
		return Integer.parseInt(val.toString());
	}
	
	protected String getOption(String key, String defaultVal) {
		Object val = options.get(key);
		if (val == null) return defaultVal;
		if (val instanceof String) {
			return val.toString();
		}
		return val.toString();
	}
	
	/** Source only: fetch a list of all the PIDs in the system, throw an UnsupportedOperation exception */
	public List<String> getAllPIDs() throws UnsupportedOperationException {
		throw new UnsupportedOperationException("Fetching all PIDs is not supported by this source");
	}

	public abstract IteratorWithCount<String> read(String pid, String domain);
	public abstract void write(String pid, String domain, String msg);
	public void close() throws IOException {
		// noting by default
	}
	
	public static class IteratorWithCount<T> implements Iterator<T> {
		private Iterator<T> itr;
		private int count;

		public IteratorWithCount(Collection<T> col) {
			this.itr = col.iterator();
			this.count = col.size();
		}
		
		public int getCount() {
			return count;
		}

		@Override
		public boolean hasNext() {
			return itr.hasNext();
		}

		@Override
		public T next() {
			return itr.next();
		}

		@Override
		public void remove() {
			itr.remove();
		}
	}
	
	/** Warning: not threadsafe (temporarily)
	 * TODO: Switch to threadlocal?
	 */
	public static class JSONDirMsgSrc extends MsgSrcDest {
		private static FilenameFilter FILTER_JSON = new FilenameFilter(){
			@Override
			public boolean accept(File dir, String name) {
				return (name.endsWith(".json"));
			}
		};
		
		private static FilenameFilter FILTER_SMILE = new FilenameFilter(){
			@Override
			public boolean accept(File dir, String name) {
				return (name.endsWith(".smile"));
			}
		};

		private File baseDir;
		private AtomicInteger seq = new AtomicInteger();
		private boolean jsonSingleFile = false;
		private boolean writeSmile = false;
		private File openFile = null;
		private JsonGenerator gen = null;
		private OutputStreamWriter writer = null;
		private String fileHeader = "", fileFooter = "", recSeperator = "";

		public JSONDirMsgSrc(String dir, Map<String, Object> options) {
			super(options);
			this.baseDir = new File(dir);
			this.jsonSingleFile = getOption("jsonsinglefile", false);
			this.writeSmile = getOption("smileformat", false);
			if (this.jsonSingleFile) {
				fileHeader = "{\"data\": {\"pid\":\"%s\", \"domain\":\"%s\", \"items\":[\n";
				fileFooter = "\n]}}";
				recSeperator = ",\n";
			}
		}

		public static boolean isRecognized(String url) {
			File dir = new File(url);
			return dir.isDirectory();
		}
		
		// read/scan methods ------------------------------------------------------
		
		@Override
		public List<String> getAllPIDs() throws UnsupportedOperationException {
			ArrayList<String> ret = new ArrayList<>();
			// loop through each subdir, make sure it matches the hash;dfn format
			for (String subdir : baseDir.list()) {
				File dir = new File(baseDir, subdir);
				if (dir.exists() && dir.isDirectory() && dir.getName().contains(";")) {
					ret.add(subdir);
				}
			}
			return ret;
		}
		
		@Override
		public IteratorWithCount<String> read(String pid, String domain) {
			List<String> ret = new ArrayList<String>();
			
			// get the single file or individual files for this pid/domain
			File[] files = getFiles(pid, domain);
			
			// loop through them all
			for (File file : files) {
				if (!file.exists() || !file.canRead()) continue;
				try {
					ret.addAll(parseFileMsgs(file, domain));
				} catch (IOException ex) {
					System.err.println("Unable to read/parse file: " + file);
					ex.printStackTrace();
				}
			}
			return new IteratorWithCount<String>(ret);
		}

		/** 
		 * return the appropriate file set for this pid/domain combo
		 * 
		 * First to match:
		 * 1) {pid}/{domain}.smile
		 * 2) {pid}/{domain}.json
		 * 3) {pid}/{domain}/*.smile
		 * 4) {pid}/{domain}/*.json
		 * @return Returns a single file or an array or relevant files.  Empty array if no relevant files found.
		 */
		private File[] getFiles(String pid, String domain) {
			File base = new File(baseDir, pid);
			
			// check for single .smile file
			File f1 = new File(base, domain + ".smile");
			File f2 = new File(base, domain + ".json");
			File f3 = new File(base, domain);
			if (!f1.isDirectory() && f1.exists()) return new File[] {f1};
			if (!f2.isDirectory() && f2.exists()) return new File[] {f2};
			
			// check for multiple files
			if (f3.isDirectory() && f3.exists()) {
				File[] ret = f3.listFiles(FILTER_SMILE);
				if (ret.length > 0) return ret;
				ret = f3.listFiles(FILTER_JSON);
				if (ret.length > 0) return ret;
			}
			
			return new File[0];
		}

		private static List<String> parseFileMsgs(File file, String domain) throws IOException {
			ArrayList<String> ret = new ArrayList<>();
			
			// parse prefix/suffix
			Integer val = null;
			String suffix = file.getName(), prefix = file.getName();
			suffix = suffix.substring(suffix.indexOf('.'));
			prefix = prefix.substring(0, prefix.lastIndexOf('.'));
			try {
				val = Integer.parseInt(prefix);
			} catch (NumberFormatException ex) {
				// Ignore, not a number
			}
			
			// .smile files get parsed
			if (suffix.equalsIgnoreCase(".smile")) {
				try (FileInputStream fis = new FileInputStream(file)) {
					JsonNode node = POMUtils.parseSMILEtoNode(fis);
					if (val != null) {
						// single result, add to results
						ret.add(POMUtils.toJSON(node));
					} else {
						// multiple results, add each one to results
						if (node != null) node = node.path("data").path("items");
						for (JsonNode child : node) {
							ret.add(POMUtils.toJSON(child));
						}
					}
				}
			} else if (suffix.equalsIgnoreCase(".json")) {
				// evaluate .json file
				try (FileReader reader = new FileReader(file)) {
					if (val != null) {
						ret.add(IOUtils.toString(reader));
					} else {
						// otherwise parse the file, return individual records
						JsonNode node = POMUtils.parseJSONtoNode(reader);
						if (node != null) node = node.path("data").path("items");
						for (JsonNode child : node) {
							ret.add(POMUtils.toJSON(child));
						}
					}
				}
			}
			
			return ret;
		}

		
		
		// write methods -----------------------------------------------------------

		@Override
		public synchronized void write(String pid, String domain, String msg) {
			File file = getWriteFile(pid, domain);
			
			try {
				// open a new file writer if necessary, or write a separator record
				if (openFile == null || !openFile.equals(file)) {
					close();
					openWriteFile(file, pid, domain);
				} else if (!this.writeSmile) {
					writer.write(this.recSeperator);
				}
				
				// write the actual message
				if (this.writeSmile) {
					gen.writeTree(POMUtils.parseJSONtoNode(msg));
				} else {
					writer.write(msg);
				}
				
			} catch (IOException ex) {
				System.err.println("Error writing file: " + file);
				ex.printStackTrace();
			}
		}
		
		// write methods -----------------------------------------------------------
		
		private File getWriteFile(String pid, String domain) {
			// get/create the base directory
			File dir= new File(baseDir, pid);
			if (!jsonSingleFile) {
				dir = new File(dir, domain);
			}
			if (!dir.exists()) dir.mkdirs();
			
			// get the file
			String name = (jsonSingleFile) ? domain : seq.incrementAndGet() + "";
			return new File(dir, name + ((this.writeSmile) ? ".smile" : ".json"));
		}

		private void openWriteFile(File file, String pid, String domain) throws IOException {
			if (!file.exists()) file.createNewFile();
			FileOutputStream fos = new FileOutputStream(file);
			try {
				
				if (writeSmile) {
				
						gen = POMUtils.SMILE_MAPPER.getFactory().createGenerator(fos);
						gen.setCodec(POMUtils.SMILE_MAPPER.getFactory().getCodec());
						
						// write header info
						gen.writeStartObject();
						gen.writeObjectFieldStart("data");
						gen.writeStringField("pid", pid);
						gen.writeStringField("domain", domain);
						gen.writeArrayFieldStart("items");
					
				} else {
					writer = new FileWriter(file);
					writer.write(String.format(fileHeader, pid, domain));
				}
				openFile = file;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			finally{
				fos.close();
			}
		}
		
		@Override
		public void close() throws IOException {
			
			// write footer stuff
			if (gen != null) {
				gen.writeEndArray();
				gen.writeEndObject();
				gen.writeEndObject();
				gen.close();
				gen = null;
			} 
			
			if (writer != null) {
				writer.write(fileFooter);
				writer.close();
				writer = null;
			}
		}
	}
	
	public static class VistARPCMsgSrc extends MsgSrcDest {
		private DefaultConnectionManager mgr;
		private RpcTemplate tpl;
		private String uriprefix;
		private FacetedTimer timerJSONParse = SyncUtils.METRICS.register(MetricRegistry.name(getClass(), "jsonparse"), new FacetedTimer());
		private FacetedTimer timerRPCReply = SyncUtils.METRICS.register(MetricRegistry.name(getClass(), "rpcreply"), new FacetedTimer());
		private FacetedTimer timerRPCExec = SyncUtils.METRICS.register(MetricRegistry.name(getClass(), "rpcexec"), new FacetedTimer());
		private boolean operational;
		private boolean batch;
		private String id;
		
		public VistARPCMsgSrc(String uri, Map<String, Object> options) {
			super(options);
			this.uriprefix = uri;
			this.operational = getOption("operational", false);
			this.batch = getOption("batch", false);
			this.id = getOption("id", null);
			
			// setup broker connection/factory/pool
			int threads = (options.containsKey("threads")) ? Integer.parseInt(options.get("threads").toString()) : 1;
			mgr = new DefaultConnectionManager(new BrokerConnectionFactory(), threads);
			tpl = new RpcTemplate(mgr);
			tpl.setTimeout(getOption("timeout", 30));
			
			// execute PING to initialize connection
			ping();
		}
		
		public String ping() {
			return tpl.executeForString(uriprefix + "/XWB IM HERE");
		}
		
		public IteratorWithCount<String> read(String pid, String domain) {
			List<String> ret = new ArrayList<String>();
			FacetedTimer.Context ctx = timerRPCExec.time(SyncUtils.getFacetSet(pid, domain));
			String str = null;
			if (operational && batch) {
				str = tpl.executeForString(uriprefix + "/HMP SYNCHRONIZATION CONTEXT/HMP GET OPERATIONAL DATA", buildOperationalRPCRequest(domain));
			} else if (operational) {
				str = tpl.executeForString(uriprefix + "/HMP SYNCHRONIZATION CONTEXT/HMP GET OPERATIONAL DATA", buildOperationalRPCRequest(domain));
			} else {
				str = tpl.executeForString(uriprefix + "/HMP SYNCHRONIZATION CONTEXT/HMP GET PATIENT DATA JSON", buildRPCRequest(pid, domain));
			}
			ctx.stop();
			
			if (batch) {
				
			}
			
			ctx = timerJSONParse.time(SyncUtils.getFacetSet(pid, domain));
			JsonNode resp = POMUtils.parseJSONtoNode(str);
			ctx.stop();
			
//			JsonNode resp = tpl.executeForJson(uriprefix + "/VPR SYNCHRONIZATION CONTEXT/VPR GET PATIENT DATA JSON", buildRPCRequest(pid, domain));
			Double time = resp.path("data").path("time").asDouble();
			
			// convert to milliseconds (returned as 1.x seconds)
			long timeMS = (time != null) ? Math.round(time * 1000) : 0; 
			timerRPCReply.update(timeMS, TimeUnit.MILLISECONDS, SyncUtils.getFacetSet(pid, domain));
			
			JsonNode items = resp.path("data").path("items");
			if (!items.isNull() && items.isArray()) {
				for (int i = 0; i < items.size(); i++) {
					ret.add(POMUtils.toJSON(items.get(i)));
				}
			}
			return new IteratorWithCount<String>(ret);
		}
		
		protected Map<String, Object> buildOperationalRPCRequest(String domain) {
	        Map<String, Object> req = new LinkedHashMap<String, Object>();
	        req.put("domain", domain);
	        req.put("limit", this.limit);
	        req.put("start", "");
	        if (this.id != null) {
	        	req.put("id", this.id);
	        }
	        return req;
		}
		
		protected Map<String, Object> buildRPCRequest(String pid, String domain) {
	        Map<String, Object> req = new LinkedHashMap<String, Object>();
	        req.put("patientId", pid);
	        req.put("domain", domain);
	        req.put("limit", this.limit);
	        req.put("text", "1"); // (includeBody ? "1" : "0"));
	        return req;
		}
		
		public static boolean isRecognized(String url) {
			try {
				URI uri = new URI(url);
				return uri.getScheme() != null && 
						uri.getScheme().equals("vrpcb") && 
						uri.getHost() != null &&
						uri.getAuthority() != null;
			} catch (URISyntaxException e) {
				return false;
			}
		}

		@Override
		public void write(String pid, String domain, String msg) {
			throw new UnsupportedOperationException("Can't write msgs to VistA");
		}
	}
	
	public static class JDSMsgSrc extends MsgSrcDest {
		private JdsTemplate tpl = new JdsTemplate();
		private RestTemplate tpl2 = new RestTemplate();
		private URL baseURL;
		private Timer timerJSONParse = SyncUtils.METRICS.timer(MetricRegistry.name(getClass(), "parse"));
				
		public JDSMsgSrc(String url) throws Exception {
			super(null);
			this.baseURL = new URL(url);
			tpl.setJdsUrl(url);
			tpl.setRestTemplate(tpl2);
			
			// ping JDS to open the HTTP connection
			String pingURL = StringUtils.applyRelativePath(baseURL.toString(), "/ping");
			tpl2.getForObject(pingURL, String.class);
		}
		
		@Override
		public List<String> getAllPIDs() throws UnsupportedOperationException {
			ArrayList<String> ret = new ArrayList<>();
			String str = tpl.getForString("/all/index/pid/pid");
			JsonNode resp = POMUtils.parseJSONtoNode(str);
			
			JsonNode items = resp.path("data").path("items");
			if (items != null && items.isArray()) {
				for (int i=0; i < items.size(); i++) {
					ret.add(items.get(i).asText());
				}
			}
			return ret;
		}

		@Override
		public IteratorWithCount<String> read(String pid, String domain) {
			if (pid == null || pid.equals("0")) throw new UnsupportedOperationException("Must specify a PID");
			List<String> ret = new ArrayList<String>();
			
			// is this operational or VPR data?
			String url = "/" + pid + "/find/" + domain;
			if (this.baseURL.getPath().endsWith("/data")) {
				url = "/find/" + domain + "?filter=eq(pid,\"" + pid + "\")";
			}
			String str = tpl.getForString(url);
			Timer.Context ctx = timerJSONParse.time();
			JsonNode resp = POMUtils.parseJSONtoNode(str);
			ctx.stop();
			
			JsonNode items = resp.path("data").path("items");
			if (!items.isNull() && items.isArray()) {
				for (int i = 0; i < items.size(); i++) {
					ret.add(POMUtils.toJSON(items.get(i)));
				}
			}
			return new IteratorWithCount<String>(ret);
		}

		@Override
		public void write(String pid, String domain, String msg) {
			// TODO: Big issue: this is not really representative of HMP since we are
			// saving the JSON directly to JDS, not through the Domain object.

			// post everything to /vpr for now (TODO: Handle operational data)
			tpl2.postForLocation(baseURL.toString(), msg);
		}
		
		public static boolean isRecognized(String str) {
			try {
				URL url = new URL(str);
				return url.getProtocol().equals("http") && 
					   url.getHost().equals("localhost") && 
					   (url.getPath().startsWith("/vpr") || url.getPath().startsWith("/data"));
			} catch (MalformedURLException ex) {
				return false;
			}
		}
	}
	
	public static class JSONZIPMsgSrc extends MsgSrcDest {
		private ZipFile zip;
		private AtomicInteger seq = new AtomicInteger();
		private File zipfile;
		private ZipOutputStream zos;
		private Map<String,Map<String, List<ZipEntry>>> allEntries;

		public JSONZIPMsgSrc(String file) throws IOException {
			this(new File(file));
		}
		
		public JSONZIPMsgSrc(File file) throws IOException {
			super(null);
			this.zipfile = file;
			// Initialize/scan the zip file
			initZip();
		}
		
		@Override
		public List<String> getAllPIDs() throws UnsupportedOperationException {
			return new ArrayList<String>(allEntries.keySet());
		}
		
		/** pre-scans and indexes the zip file so we don't have to read it on every read() call */
		private void initZip() throws ZipException, IOException {
			// clear/reset data
			zip = new ZipFile(zipfile);
			allEntries =  new HashMap<>();
			
			// loop through each entry and index it
			Enumeration<? extends ZipEntry> entries = zip.entries();
			while (entries.hasMoreElements()) {
				ZipEntry entry = entries.nextElement();
				if (entry.isDirectory()) continue;
				String[] parts = (entry.getName().indexOf('/') > 0) ? entry.getName().split("/") : entry.getName().split("\\\\");

				// determine pid + domain for each entry
				String domain = null, pid = null;
				if (parts.length == 3) {
					// 3 parts: pid\domain\1.json
					pid = parts[0];
					domain = parts[1];
				} else if (parts.length == 2 && parts[1].endsWith(".json")) {
					// 2 parts: pid\domain.json
					pid = parts[0];
					domain = parts[1].substring(0, parts[1].indexOf(".json"));
				}
				
				// index the entry
				if (pid == null || domain == null) continue;
				Map<String,List<ZipEntry>> submap = allEntries.get(pid);
				if (submap == null) allEntries.put(pid, submap = new HashMap<String, List<ZipEntry>>());
				List<ZipEntry> list = submap.get(domain);
				if (list == null) submap.put(domain, list = new ArrayList<ZipEntry>());
				list.add(entry);
			}
		}
		
		@Override
		public IteratorWithCount<String> read(String pid, String domain) {

			// does this pid/domain combo exist?
			Map<String, List<ZipEntry>> submap = allEntries.get(pid);
			if (submap == null || !submap.containsKey(domain)) return new IteratorWithCount<String>(Collections.EMPTY_SET);
			List<String> ret = new ArrayList<String>();
			
			// read each ZipEntry
			for (ZipEntry entry : submap.get(domain)) {
				String name = entry.getName();
				try {
					// if its a multi-record .json file (named domain.json) then parse and split it
					String fileStr = readEntry(zip.getInputStream(entry));
					if (name.endsWith(domain + ".json")) {
						JsonNode node = POMUtils.parseJSONtoNode(fileStr);
						for (JsonNode n : node.path("data").path("items")) {
							ret.add(POMUtils.toJSON(n));
						}
					} else {
						// otherwise just add it
						ret.add(fileStr);
					}
				} catch (IOException ex) {
					System.err.println("Error reading zip entry: " + entry);
					ex.printStackTrace();
				}
			}
			
			return new IteratorWithCount<String>(ret);
		}
		
		private static String readEntry(InputStream is) throws IOException {
			StringBuilder sb = new StringBuilder();
			BufferedReader br = new BufferedReader(new InputStreamReader(is));
			String line = br.readLine();
			while (line != null) {
				sb.append(line);
				line = br.readLine();
			}
			br.close();
			return sb.toString();
		}

		@Override
		public void write(String pid, String domain, String msg) {
			String name = pid + "\\" + domain + "\\" + seq.incrementAndGet() + ".json";
			ZipEntry entry = new ZipEntry(name);
			
			try {
				if (zos == null) {
					zos = new ZipOutputStream(new FileOutputStream(zipfile));
					zos.setLevel(7);
				}
				
				zos.putNextEntry(entry);
				
				zos.write(msg.getBytes());
				
				zos.closeEntry();
			} catch (IOException ex) {
				System.err.println("Error writing .zip entry: " + entry.getName());
				ex.printStackTrace();
			}
		}
		
		@Override
		public void close() throws IOException {
			if (zip != null) zip.close();
			if (zos != null) zos.close();
		}
		
		
		public static boolean isRecognized(String str) {
			File f = new File(str);
			return !f.isDirectory() && f.getName().endsWith(".zip");
		}
	}
	
	public static class JMSMsgSrc extends MsgSrcDest {
		private ActiveMQConnectionFactory fact;
		private Connection conn;
		private Session sess;
		private Destination dest;
		private MessageProducer producer;
		private PooledConnectionFactory pool;
		
		public JMSMsgSrc(String url, Map<String, Object> options) throws JMSException {
			super(options);
			String destName = getOption("destName", "hmp-tmp");
			
			// create/configure factory + pool
			fact = new ActiveMQConnectionFactory(url);
			fact.setUseAsyncSend(true);
			pool = new org.apache.activemq.pool.PooledConnectionFactory(fact);
			pool.setMaxConnections(10);
			pool.setIdleTimeout(0);
			
			// create/configure connection + session
			conn = pool.createConnection();
			conn.start();
			sess = conn.createSession(false, Session.AUTO_ACKNOWLEDGE);
			
			// create/configure destination + producer
			dest = sess.createQueue(destName);
			producer = sess.createProducer(dest);
		}


		@Override
		public IteratorWithCount<String> read(String pid, String domain) {
			
			List<String> ret = new ArrayList<String>();
			String selector = "";
			if (pid != null && !pid.equals("0")) {
				selector += "pid='" + pid + "' ";
			}
			if (domain != null) {
				if (!selector.isEmpty()) selector += "AND";
				selector += "domain='" + domain + "'";
			}
			
			/** Weird stuff was happening here.  
			 * reciveNoWait() was missing stuff, probably due to prefetch buffers being empty.
			 * Even with receive(10) it may miss some items (looks like prefetch buffer might take longer to fill)   
			 */
			try {
				MessageConsumer consumer = sess.createConsumer(dest, selector.isEmpty() ? null : selector);
				Message msg = consumer.receive(10);
				while (msg != null) {
					if (msg instanceof MapMessage) {
						MapMessage mapmsg = (MapMessage) msg;
						ret.add(mapmsg.getString("body"));
					} else if (msg instanceof TextMessage) {
						TextMessage txtmsg = (TextMessage) msg;
						ret.add(txtmsg.getText());
					}
					
					msg = consumer.receive(10);
				}
				consumer.close();
			} catch (JMSException ex) {
				System.err.println("Error consuming JMS Messages:");
				ex.printStackTrace();
			}
			
			return new IteratorWithCount<String>(ret);
		}

		@Override
		public void write(String pid, String domain, String msg) {
			try {
				Message jmsmsg = sess.createTextMessage(msg);
				jmsmsg.setStringProperty("pid", pid);
				jmsmsg.setStringProperty("domain", domain);
				
				producer.send(jmsmsg);
			} catch (JMSException ex) {
				System.err.println("Error trying to send JMS Message:");
				ex.printStackTrace();
			}
		}
		
		@Override
		public void close() throws IOException {
			try {
				conn.close();
			} catch (JMSException e) {
				throw new IOException(e);
			}
		}
		
		public static boolean isRecognized(String url) {
			try {
				URI uri = new URI(url);
				return uri.getScheme() != null && uri.getScheme().equals("vm"); 
			} catch (URISyntaxException e) {
				return false;
			}
		}
	}
	
	public static class SystemStreamMsgSrc extends MsgSrcDest {
		public static char EOF = Character.valueOf((char) 04);
		public static char SUB = Character.valueOf((char) 04); // ctrl-z
		
		public SystemStreamMsgSrc() {
			super(null);
		}
		
		@Override
		public IteratorWithCount<String> read(String pid, String domain) {
			List<String> ret = new ArrayList<String>();
			StringBuilder sb = new StringBuilder();
			char[] buff = new char[128];
			
			// parse the input stream, return when its over
			InputStreamReader reader = new InputStreamReader(System.in);
			try {
				boolean cont = true;
				while (cont) {
					int size = reader.read(buff);
					while (size > 0) {
						for (int i=0; i < size; i++) {
							char c = buff[i];
							if (c == EOF) {
								ret.add(sb.toString());
								sb = new StringBuilder();
							} else if (c == SUB) {
								cont = false;
							}
							sb.append(c);
						}
						size = reader.read(buff);
					}
					Thread.sleep(250);
				}
				if (sb.length() > 0) ret.add(sb.toString());
				reader.close();
			} catch (IOException | InterruptedException ex) {
				System.err.println("Error reading from System.in:");
				ex.printStackTrace();
			}
			return new IteratorWithCount<String>(ret);
		}

		@Override
		public void write(String pid, String domain, String msg) {
			System.out.println(msg);
			System.out.print(EOF);
		}
		
		public static boolean isRecognized(String url) {
			return url.equalsIgnoreCase("STDOUT") || url.equalsIgnoreCase("STDIN");
		}
	}
	
	public static class NullMsgSrc extends MsgSrcDest {
		
		public NullMsgSrc() {
			super(null);
		}

		@Override
		public IteratorWithCount<String> read(String pid, String domain) {
			List<String> ret = Collections.emptyList();
			return new IteratorWithCount<String>(ret);
		}

		@Override
		public void write(String pid, String domain, String msg) {
			// NOOP
		}
		
		public static boolean isRecognized(String url) {
			return url.equalsIgnoreCase("NULL");
		}
	}

	/**
	 * This requires the actual server is running in the background.  
	 * 
	 * TODO: I'll work on embedding SOLR later.
	 * @author brian
	 */
	public static class SolrMsgSrc extends MsgSrcDest {
		private HttpSolrServer solr;
		private DomainObjectToSolrInputDocument converter;
		private Timer timerSOLRDocConvert = SyncUtils.METRICS.timer(MetricRegistry.name(getClass(), "solrdocconvert"));

		public SolrMsgSrc(String solrURL, Map<String, Object> options) {
			super(options);
			this.solr = new org.apache.solr.client.solrj.impl.HttpSolrServer(solrURL);
			this.converter = new DomainObjectToSolrInputDocument();
		}
		
		@Override
		public IteratorWithCount<String> read(String pid, String domain) {
			throw new UnsupportedOperationException("Read not implemented for SOLR");
		}

		@Override
		public void write(String pid, String domain, String msg) {
			Timer.Context ctx = this.timerSOLRDocConvert.time();
			JsonNode msgNode = POMUtils.parseJSONtoNode(msg);
			
			// marshal the JSON into its appropriate POM object
			String uid = msgNode.get("uid").asText();
			Class<? extends IPOMObject> clazz = UidUtils.getDomainClassByUid(uid);
			IPOMObject entity = POMUtils.newInstance(clazz, msgNode);
			
			SolrInputDocument doc = converter.convert(entity);
			try {
				solr.add(doc);
			} catch (SolrServerException | IOException e) {
				e.printStackTrace();
			} finally {
				ctx.stop();
			}
		}
		
		public static boolean isRecognized(String url) {
			try {
				URI uri = new URI(url);
				return uri.getScheme() != null && 
						uri.getScheme().startsWith("http") && 
						uri.getHost() != null &&
						uri.getPath().contains("solr");
			} catch (URISyntaxException e) {
				return false;
			}
		}
	}
	
	public static class ESSrcDest extends MsgSrcDest {
		private RestTemplate tpl = new RestTemplate(new HttpComponentsClientHttpRequestFactory());
		private String baseURL;
		private static String urlTpl = "%s";

		public ESSrcDest(String baseURL, Map<String, Object> options) {
			super(options);
			this.baseURL = baseURL.replace("es://", "http://");
		}

		@Override
		public IteratorWithCount<String> read(String pid, String domain) {
			// TODO Auto-generated method stub
			return null;
		}

		@Override
		public void write(String pid, String domain, String msg) {
			String postURL = StringUtils.applyRelativePath(baseURL, String.format(urlTpl, domain));
			tpl.postForLocation(postURL, msg);
		}
		
		public static boolean isRecognized(String url) {
			try {
				URI uri = new URI(url);
				return uri.getScheme() != null && 
						uri.getScheme().startsWith("es") && 
						uri.getHost() != null;
			} catch (URISyntaxException e) {
				return false;
			}
		}
		
	}

}