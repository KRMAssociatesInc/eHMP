package gov.va.cpe.vpr.sync.util;

import com.codahale.metrics.ConsoleReporter;
import com.codahale.metrics.MetricFilter;
import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.node.ArrayNode;

import gov.va.cpe.vpr.PidUtils;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.dao.IVprSyncStatusDao;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.pom.POMObjectMapper;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.SyncStatus.VistaAccountSyncStatus;
import gov.va.cpe.vpr.sync.util.MsgSrcDest.*;
import gov.va.cpe.vpr.sync.vista.IVistaVprDataExtractEventStreamDAO;
import gov.va.cpe.vpr.termeng.H2TermDataSource;
import gov.va.cpe.vpr.termeng.TermEng;
import gov.va.cpe.vpr.util.FacetedTimer;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.metrics.MetricRegistryHolder;
import gov.va.hmp.util.LoggingUtil;
import gov.va.hmp.util.NullChecker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.net.InetAddress;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * TODO: build unit tests off this as well
 * TODO: add operational data as well 
 * TODO: measure bytes/sec
 * TODO: does not use SyncService* so not may not be completely representative
 * 
 * @author brian
 */
public class SyncUtils {
    private static Logger LOGGER = LoggerFactory.getLogger(SyncUtils.class);
	private static POMObjectMapper MAPPER = new POMObjectMapper();
	private static ObjectWriter WRITER = MAPPER.writer().withDefaultPrettyPrinter();
	public static MetricRegistry METRICS = MetricRegistryHolder.getMetricRegistry();
	
	private static final String FACET_PID = "PID";
	private static final String FACET_DOMAIN = "DOMAIN";
	private static String[] facets =  new String[] { FACET_DOMAIN }; // default group by domain only

	private FacetedTimer overallWrite = METRICS.register(MetricRegistry.name(getClass(), "write"), new FacetedTimer());
	private FacetedTimer overallRead = METRICS.register(MetricRegistry.name(getClass(), "read"), new FacetedTimer());
	private FacetedTimer prettyTimer = null;
	private FacetedTimer pomTimer = null;
	private MsgSrcDest src;
	private MsgSrcDest dest;
	private Map<String, Object> options;
	private Map<String, JSONSchemaGenerator> schemas = new HashMap<>();
	private List<String> domains;
	private List<String> pids;
	private Date startAt = null;
	private boolean pretty = false;
	private boolean pom = false;
	private boolean schema;
	private HashSet<Object> excludeUids, includeUids;
	
	public SyncUtils(MsgSrcDest src, MsgSrcDest dest, Map<String, Object> options, List<String> domains, List<String> pids) {
		this.src = src;
		this.dest = dest;
		this.options = options;
		this.pids = new ArrayList<String>(pids);
		this.domains = new ArrayList<String>(domains);
		
		// default options
		this.pretty = options.containsKey("pretty") && options.get("pretty") == Boolean.TRUE;
		this.pom = options.containsKey("pom") && options.get("pom") == Boolean.TRUE;
		this.schema = options.containsKey("schema") && options.get("schema") == Boolean.TRUE;
		if (pretty) prettyTimer = METRICS.register(MetricRegistry.name(getClass(), "pretty"), new FacetedTimer());
		if (pom) pomTimer = METRICS.register(MetricRegistry.name(getClass(), "pom"), new FacetedTimer());
		
		// parse include/exclude UID list
		if (options.containsKey("exclude")) {
			this.excludeUids = new HashSet<>(); 
			String[] uids = options.get("exclude").toString().split(",");
			this.excludeUids.addAll(Arrays.asList(uids));
		}
		if (options.containsKey("include")) {
			this.includeUids = new HashSet<>(); 
			String[] uids = options.get("include").toString().split(",");
			this.includeUids.addAll(Arrays.asList(uids));
		}
		
		// if termeng was specified, try to set it up
		if (options.containsKey("termeng")) {
			String[] urls = options.get("termeng").toString().split(",");
			List<H2TermDataSource> dsns = new ArrayList<>();
			
			// Initialize 1+ H2TermDataSources
			for (String jdbc : urls) {
				try {
					dsns.add(new H2TermDataSource(jdbc));
				} catch (ClassNotFoundException | SQLException e) {
					throw new IllegalArgumentException("Unable to initalize TermEng JDBC: " + jdbc, e);
				}
			}
			
			// create the default TermEng instance
			TermEng.createInstance(dsns.toArray(new H2TermDataSource[dsns.size()]));
		}
		
		// resolve domains list
		for (int i=0; i < this.domains.size(); i++) {
			String domain = this.domains.get(i);
			if (domain.equalsIgnoreCase("all")) {
				this.domains.remove(i--);
				this.domains.add("patient"); // patient is always first
				this.domains.addAll(UidUtils.getAllPatientDataDomains());
			} else if (domain.startsWith("-")) {
				this.domains.remove(i--);
				this.domains.remove(domain.substring(1));
			}
		}

		// Initialize facet hierarchy (if present)
		String[] facets = options.containsKey("facets") ? ((String) options.get("facets")).split(",") : null;
		if (facets != null) {
			List<String> ret = new ArrayList<String>();
			for (int i=0; i < facets.length; i++) {
				if (facets[i].equalsIgnoreCase(FACET_DOMAIN)) {
					ret.add(FACET_DOMAIN);
				} else if (facets[i].equalsIgnoreCase(FACET_PID)) {
					ret.add(FACET_PID);
				}
			}
			SyncUtils.facets = ret.toArray(new String[ret.size()]);
		}
	}
	
	private int getOption(String key, int defaultVal) {
		if (options.containsKey(key)) {
			return Integer.parseInt((String) options.get(key));
		}
		return defaultVal;
	}
	
	/** Run all the pid/domain combos as necessary.  Should only be called once per instance? **/
	public long exec() throws InterruptedException {
		final SyncUtils me = this;
		this.startAt = new Date();
		int threads = Integer.parseInt((String) options.get("threads"));
		ExecutorService exec = (threads > 1) ? Executors.newFixedThreadPool(threads) : null;

		Timer elapsed = METRICS.timer(MetricRegistry.name(SyncUtils.class, "elapsed"));
		Timer.Context ctx = elapsed.time();
		
		// loop through each pid/domain combo and run it (or fork it)
		for (final String pid : pids) {
			for (final String domain : domains) {
				// run sequentially or in parallel
				if (exec != null) {
					exec.execute(new Runnable() {
						@Override
						public void run() {
							me.run(pid, domain);
						}
					});
				} else {
					// run sequentially
					run(pid, domain);
				}
			}
		}
		
		// wait for forked jobs to complete
		if (exec != null) {
			exec.shutdown();
			exec.awaitTermination(1000, TimeUnit.HOURS);
		}
		return TimeUnit.NANOSECONDS.toMillis(ctx.stop());
	}
	
	/** Run single pid/domain combo */
	public void run(String pid, String domain) {
		// per-PID/DOMAIN metrics
		int threads = getOption("threads", 1);
		boolean multithread = (threads > 1);
		// measure/print the read portion
		if (!multithread) LOGGER.debug("Reading PID/Domain: %5s/%-12s... ", pid, domain);
		FacetedTimer.Context ctx = overallRead.time(getFacetSet(pid,domain));
		IteratorWithCount<String> itr = src.read(pid, domain);
		long readNanos = ctx.stop();
		if (!multithread) LOGGER.debug("Done in %5dms.  %5d msgs\n", TimeUnit.NANOSECONDS.toMillis(readNanos), itr.getCount());
		if (multithread) LOGGER.debug("Reading PID/Domain: %5s/%-12s... Done in %5dms\n", pid, domain, TimeUnit.NANOSECONDS.toMillis(readNanos));
		
		// measure/print the write portion
		LOGGER.debug("Writing PID/Domain: %5s/%-12s... ", pid, domain);
		long totNanos = 0;
		int count = 0;
		int limit = getOption("limit", Integer.MAX_VALUE);
		while (itr.hasNext() && count < limit) {
			ctx = overallWrite.time(getFacetSet(pid,domain));
			String msg = itr.next();
			JsonNode msgNode = POMUtils.parseJSONtoNode(msg);
			String uid = msgNode.get("uid").asText();
			
			// skip if its on exclude list, or not on include list
			if (this.excludeUids != null && this.excludeUids.contains(uid)) {
				continue;
			}
			if (this.includeUids != null && !this.excludeUids.contains(uid)) continue;
			
			try {
				// run through the domain objects if requested
				if (this.pom) {
					FacetedTimer.Context pomctx = pomTimer.time(SyncUtils.getFacetSet(pid, domain));
					
					// marshal the JSON into its appropriate POM object
					Class<? extends IPOMObject> clazz = UidUtils.getDomainClassByUid(uid);
					IPOMObject obj = POMUtils.newInstance(clazz, msgNode);
					
					// get new JSON out of the POM object
					Map<String, Object> data = obj.getData(JSONViews.JDBView.class);
					msgNode = POMUtils.convertObjectToNode(data);
					msg = POMUtils.toJSON(msgNode);
					
					pomctx.stop();
				}
				
				// pretty print if requested
				if (this.pretty) {
					FacetedTimer.Context prettyctx = prettyTimer.time(SyncUtils.getFacetSet(pid, domain));
					msg = WRITER.writeValueAsString(msgNode);
					prettyctx.stop();
				}
				
				// calc/compute schema stats
				if (this.schema) {
					// get/initialize the schema stats collector 
					JSONSchemaGenerator gen = schemas.get(domain);
					if (gen == null) schemas.put(domain, gen = new JSONSchemaGenerator(domain));
					
					// analyze
					gen.eval(msgNode);
				}
				
				// write it to the destination
				dest.write(pid, domain, msg);
				count++;
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				long nanos = ctx.stop();
				totNanos += nanos;
			}
		}
		
		// done with this PID/DOMAIN combo
		LOGGER.debug("Done in %5dms.  %5d msgs\n", 
				TimeUnit.NANOSECONDS.toMillis(totNanos), 
				count);
	}
	
	public void close() throws IOException {
		src.close();
		dest.close();
		
		// write to STDOUT or a file?
		Writer writer = new PrintWriter(System.out);
		File csv = null;
		
		
		try {
			if (options.containsKey("csv")) {
				csv = new File((String) options.get("csv"));
				writer = new FileWriter(csv, true);
			}
			
			// write the runtime info
			if (csv != null) {
				writer.write("\nStart Time:," + startAt);
				writer.write("\nEnd Time:," + new Date());
				writer.write("\nHost:," + InetAddress.getLocalHost().getHostName());
				writer.write("\nsrc:,"+src);
				writer.write("\ndest:,"+dest);
				writer.write("\npids:,"+pids);
				writer.write("\ndomains:,"+domains);
				writer.write("\noptions:,"+options);
				writer.write("\n");
				
				// write report contents
				new CSVReporter(METRICS, csv, TimeUnit.SECONDS,
						TimeUnit.MILLISECONDS, MetricFilter.ALL).report();
			}
			
			// dump schema stats (if requested)
			if (this.schema) {
				if (csv != null) JSONSchemaGenerator.writeCSVHeader(writer);
				for (String domain : schemas.keySet()) {
					if (csv != null) {
						schemas.get(domain).writeCSVReport(writer);
					} else {
						schemas.get(domain).printReport(writer);
					}
				}
			}
			
			// dump to STDOUT if requested
			if (options.containsKey("verbose")) {
				ConsoleReporter.forRegistry(METRICS)
						.convertRatesTo(TimeUnit.SECONDS)
						.convertDurationsTo(TimeUnit.MILLISECONDS).build().report();
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally{
		writer.close();
		}
	}
	
	/** 
	 * A CLI Interface for running SyncUtils
	 * 
	 * Launch via maven with:
	 * mvn exec:java -Dexec.mainClass=gov.va.cpe.vpr.sync.SyncUtils -Dexec.args="foo bar baz"
	 * @throws Exception 
	 **/
	public static void main(String[] args) throws Exception {
		String src = null;
		String dest = null;
		List<String> pids = new ArrayList<String>();
		List<String> domains = new ArrayList<String>();
		
		// defaults
		Map<String, Object> options = new HashMap<String, Object>();
		options.put("threads", "1");
		
		// parse args
		for (int i=0; i < args.length; i++) {
			String arg = args[i].toLowerCase();
			String next = (i < args.length-1) ? args[i+1].toLowerCase() : null;
			if (arg.equals("-src") && next != null) {
				src = next;
				i++;
			} else if (arg.equals("-dest") && next != null) {
				dest = next;
				i++;
			} else if (arg.equals("-pids") && next != null) {
				pids = Arrays.asList(next.toUpperCase().split(","));
				if (next.equals("0") || next.equals("all")) {
					pids = Arrays.asList("0");
				}
				i++;
			} else if (arg.equals("-domains") && next != null) {
				domains.addAll(Arrays.asList(next.split(",")));
				i++;
			} else if (arg.startsWith("-")) {
				Object val = true; // default to true
				// if the next argument is not another option, treat it as the value
				if (next != null && !next.startsWith("-")) {
					val = args[i+1]; // don't lowercase this
					i++;
				}
				options.put(arg.substring(1), val);
			}
		}
		
		// validate src and dest
		MsgSrcDest msgsrc, msgdest;
		if (src == null || dest == null || pids.isEmpty() || domains.isEmpty()) {
			showHelp();
			return;
		}
		
		// Which MSG source class to use?
		if (JSONDirMsgSrc.isRecognized(src)) {
			msgsrc = new JSONDirMsgSrc(src, options);
		} else if (JSONZIPMsgSrc.isRecognized(src)) {
			msgsrc = new JSONZIPMsgSrc(src);
		} else if (VistARPCMsgSrc.isRecognized(src)) {
			msgsrc = new VistARPCMsgSrc(src, options);
		} else if (JDSMsgSrc.isRecognized(src)) {
			msgsrc = new JDSMsgSrc(src);
		} else if (JMSMsgSrc.isRecognized(src)) {
			msgsrc = new JMSMsgSrc(src, options);
		} else if (SystemStreamMsgSrc.isRecognized(src)) {
			msgsrc = new SystemStreamMsgSrc();
		} else if (NullMsgSrc.isRecognized(src)) {
			msgsrc = new NullMsgSrc();
		} else if (SolrMsgSrc.isRecognized(src)) {
			msgsrc = new SolrMsgSrc(src, options);
		} else if (ESSrcDest.isRecognized(src)) {
			msgsrc = new ESSrcDest(src, options);
		} else {
			System.err.println("Unrecognized/Invalid -src value: " + src);
			return;
		}
		
		// Which MSG dest class to use?
		if (JSONDirMsgSrc.isRecognized(dest)) {
			msgdest = new JSONDirMsgSrc(dest, options);
		} else if (JSONZIPMsgSrc.isRecognized(dest)) {
			msgdest = new JSONZIPMsgSrc(dest);			
		} else if (VistARPCMsgSrc.isRecognized(dest)) {
			msgdest = new VistARPCMsgSrc(dest, options);
		} else if (JDSMsgSrc.isRecognized(dest)) {
			msgdest = new JDSMsgSrc(dest);
		} else if (JMSMsgSrc.isRecognized(dest)) {
			msgdest = new JMSMsgSrc(dest, options);
		} else if (SystemStreamMsgSrc.isRecognized(dest)) {
			msgdest = new SystemStreamMsgSrc();
		} else if (NullMsgSrc.isRecognized(dest)) {
			msgdest = new NullMsgSrc();
		} else if (SolrMsgSrc.isRecognized(dest)) {
			msgdest = new SolrMsgSrc(dest, options);
		} else if (ESSrcDest.isRecognized(dest)) {
			msgdest = new ESSrcDest(dest, options);
		} else {
			System.err.println("Unrecognized/Invalid -dest value: " + dest);
			return;
		}
		
		// expand the PID list?
		if (pids.size() == 1 && pids.get(0).equals("0")) {
			pids = msgsrc.getAllPIDs();
		}
		
		// create the object
		LOGGER.debug("Src: " + src + " " + msgsrc);
		LOGGER.debug("Dest: " + dest + " " + msgdest);
		LOGGER.debug("PIDs: " + pids);
		LOGGER.debug("Domains (" + domains.size() + "): " + domains);
		LOGGER.debug("OPTIONS: " + options);
		final SyncUtils utils = new SyncUtils(msgsrc, msgdest, options, domains, pids);

		// run all the pids/domains
		long elapsedMS = utils.exec();
		
		// cleanup/close
		LOGGER.debug("Done.  Cleaning up.");
		LOGGER.debug("Total Time/Msgs/Rate: %6dms/%6d/%5.2f per sec\n", elapsedMS,
				utils.overallWrite.getCount(), utils.overallWrite.getMeanRate());
		utils.close();
	}
	
	public static String[] getFacetSet(String pid, String domain) {
		String[] ret = new String[SyncUtils.facets.length]; 
		for (int i=0; i < ret.length; i++) {
			if (SyncUtils.facets[i] == FACET_PID) ret[i] = pid;
			else if (SyncUtils.facets[i] == FACET_DOMAIN) ret[i] = domain;
			else throw new IllegalArgumentException("Unknown facet: " + ret[i]);
		}
		return ret;
	}
	
	private static void showHelp() {
		System.err.println("Usage: SyncUtils -src <json dir|zip file|rpc url|jms url|STDIN|NULL> -dest <json dir|zip file|jds url|jms url|jds url|STDOUT|NULL> -pids <pid list> -domains <domain list> <options>");
		System.err.println("WHERE: ");
		
		System.err.println("\t");
		System.err.println("\t -pids = list of patient ids (0 for all if supported)");
		System.err.println("\t -domains = list of data domains ('all' for all)");
		System.err.println("\t");
		
		System.err.println("\t -src and -dest options include:");
		System.err.println("\t <json dir> = file directory where to read/write .json files");
		System.err.println("\t <zip file> = .zip file to read/write all the .json files to/from");
		System.err.println("\t <rpc url> = the base RPCTemplateURL to read from (VistA instance)");
		System.err.println("\t\t -batch use batch mode (only valid if -operational is specified)");
		System.err.println("\t\t -limit <int> limit to this many items, default is 999999");
		System.err.println("\t\t -operational Fetch operational domains instead of patient data domains");
		System.err.println("\t <jds url> = the base URL of the JDS instance");
		System.err.println("\t <jms url> = the JMS Broker connection url to read/write from");
		System.err.println("\t\t -destName <name> Name of JMS Broker (defaults to 'hmp-tmp')");
		System.err.println("\t <pid list> = a comma seperated list of patient ids to read");
		System.err.println("\t <domain list> = a comma seperated list of domains");
		System.err.println("\t <STDIN|STDOUT> = read from STDIN and/or write to STDOUT");
		System.err.println("\t <NULL> = read an empty list and/or write to /dev/null");
		System.err.println("\t");
		
		System.err.println("Options: ");
		System.err.println("\t -schema Compute/Generate JSON document stats");
		System.err.println("\t -pretty Pretty print the JSON");
		System.err.println("\t -verbose Show detailed metrics");
		System.err.println("\t -pom Run messages through POM classes");
		System.err.println("\t -csv <file> Dump detailed metrics to specified CSV file");
		System.err.println("\t -include <uid>[,<uid>] include these UID's (defaults to all)");
		System.err.println("\t -exclude <uid>[,<uid>] exclude these UID's (defaults to none)");
		System.err.println("\t -termeng <jdbc url>[,<jdbc url>] Setup the terminology engine (should also specify -pom)");
		System.err.println("\t -threads <num> number of parallel threads to execute (defaults to 1)");
		
		System.err.println("Examples:");
		System.err.println("\t <rpc url> = vrpcb://[{division}:][{accessCode};{verifyCode}@]{host}[:port]");
		System.err.println("\t <rpc url> = vrpcb://500:vpruser1;verifycode1&@localhost:29060");
		System.err.println("\t <jds url> = http://localhost:9080/vpr");
		System.err.println("\t <jds url> = http://localhost:9080/data");
		System.err.println("\t <jms url> = vm://hmp-test?broker.persistent=true");
		System.err.println("\t <jdbc url> = jdbc:h2:{data.dir}/termdb-1.UMLS2013AA.20140225-drugdb/termdb;ACCESS_MODE_DATA=r");
		System.err.println("\t");
	}

    public static void resolveSyncStatusDifferences(List<SyncStatus> jdsStatii, ArrayNode vistaStatii, IVprSyncStatusDao dao, IVistaVprDataExtractEventStreamDAO svc, String vistaId) {
        LOGGER.debug("resolveSyncStatusDifferences: Entering method: " + vistaId);
        LOGGER.debug("resolveSyncStatusDifferences: JSON attribute from VistA message: syncStatii: " + vistaStatii.asText());
        LOGGER.debug("resolveSyncStatusDifferences: vistaId: " + vistaId);
        
        HashMap<String, Integer> jdsRes = new HashMap<>();
        HashMap<String, Integer> vistaRes = new HashMap<>();
        TreeSet<String> resubscribeDfns = new TreeSet<>();
        TreeSet<String> deleteSyncStatiiForDfns = new TreeSet<>();
        TreeSet<String> setToFalseSyncStatiiForDfns = new TreeSet<>();
        HashMap<String, SyncStatus> syncStatiiByDfn = new HashMap<>();
        
        LOGGER.debug("resolveSyncStatusDifferences: jdsStatii.size:" + jdsStatii.size());
        int i = 0;
        for(SyncStatus stat: jdsStatii) {
            LOGGER.debug(LoggingUtil.outputSyncStatus("SyncStatus[" + i + "]:", stat));
            
            SyncStatus.VistaAccountSyncStatus vstat = stat.getVistaAccountSyncStatusForSystemId(vistaId);
            if(vstat!=null && StringUtils.hasText(vstat.getDfn())) {
                jdsRes.put(vstat.getDfn(), Integer.valueOf(vstat.isSyncReceivedAllChunks()?2:1));
                LOGGER.debug("resolveSyncStatusDifferences: Entry placed in jdsRes map.  Key(dfn): " + vstat.getDfn() + "; value: " + (vstat.isSyncReceivedAllChunks()?2:1) + 
                          "; isSyncReceiveAllChunks: " + vstat.isSyncReceivedAllChunks());
                syncStatiiByDfn.put(vstat.getDfn(), stat);
                LOGGER.debug("resolveSyncStatusDifferences: SyncStatus entry placed in syncStatiiByDfn map.  Key(dfn): " + vstat.getDfn());
            }
            else {
                LOGGER.debug("resolveSyncStatusDifferences: This site's sync status did NOT contain a DFN - no entries placed in the maps for this one.");
            }
            i++;
        }

        i = 0;
        LOGGER.debug("resolveSyncStatusDifferences: vistaStatii.size:" + vistaStatii.size());
        for(JsonNode stat: vistaStatii) {
            String dfn = stat.get("pid").asText();
            vistaRes.put(dfn, stat.get("status").asInt());
            LOGGER.debug("resolveSyncStatusDifferences: Entry placed in vistaRes map.  Key(dfn): " + dfn + "; value(status): " + stat.get("status"));
            i++;
        }
        
        LOGGER.debug("resolveSyncStatusDifferences: For each entry in the vistaRes map - make sure there is an entry in the jdsRes map.");
        for(String vkey: vistaRes.keySet()) {
            LOGGER.debug("resolveSyncStatusDifferences: Checking jdsRes map for key: " + vkey);
            if(!jdsRes.containsKey(vkey)) {
                LOGGER.debug("resolveSyncStatusDifferences: jdsRes map did not contain key: " + vkey + ".  Checking vista status value.");
                if(vistaRes.get(vkey)==2) {
                    LOGGER.debug("resolveSyncStatusDifferences: vistaRes map for key(dfn): " + vkey + " contained status value: 2.  Resubscribing patient now." );
                    LOGGER.debug("Vista 2; JDS Nan");
                    resubscribeDfns.add(vkey);
                }
            }
        }
        
        LOGGER.debug("resolveSyncStatusDifferences: For each entry in the jdsRes map - make sure there is an entry in the vistaRes map.");
        for(String jkey: jdsRes.keySet()) {
            Integer jstat = jdsRes.get(jkey);
            LOGGER.debug("resolveSyncStatusDifferences: Working with jdsRes map key(dfn): " + jkey + "; value: " + jstat + ".  Checking to see if this dfn is in vistaRes map.");
            if(!vistaRes.containsKey(jkey)) {
                LOGGER.debug("resolveSyncStatusDifferences: vistaRes map did NOT contain key(dfn): " + jkey + ".  Placing this item in the deleteSyncStatiiForDfns tree and resubscribing the patient.");
                // Reset syncStatus object and resubscribe patient.
                LOGGER.debug("Vista Nan; JDS 1or2");
                deleteSyncStatiiForDfns.add(jkey);
                resubscribeDfns.add(jkey);
            } else {
                Integer vistaStat = vistaRes.get(jkey);
                LOGGER.debug("resolveSyncStatusDifferences: vistaRes map contained key(dfn): " + jkey + "; Value:" + vistaStat + ".  Comparing vistaStat and jstat now.");
                switch(vistaStat) {
                    case 0:
                        switch(jstat) {
                            case 1:
                                LOGGER.debug("resolveSyncStatusDifferences: vistaStat:0 (Not complete); jstat:1 (Not Complete).  This is OK.");
                                // This condition is OK.
                                break;
                            case 2:
                                // Reset syncstat and resubscribe.
                                LOGGER.debug("resolveSyncStatusDifferences: vistaStat:0 (Not complete); jstat:2 (Complete).  They are NOT the same.  Placing this item in the deleteSyncStatiiForDfns tree and resubscribing the patient.");
                                LOGGER.debug("Vista 0; JDS 2");
                                deleteSyncStatiiForDfns.add(jkey);
                                resubscribeDfns.add(jkey);
                                break;
                            default:
                                LOGGER.debug("resolveSyncStatusDifferences: vistaStat:" + vistaStat + "; jstat:" + jstat + ".  We should never be here.");
                                // should never get here
                                //throw new Exception("Bad SyncStatus value '"+jstat+"' when resolving with VISTA status '"+vistaStat+"' for pid: "+jkey);
                        }
                        break;
                    case 1:
                        switch(jstat) {
                            case 1:
                                // This condition is OK.
                                LOGGER.debug("resolveSyncStatusDifferences: vistaStat:1 (Not complete); jstat:1 (Not Complete).  This is OK.");
                                break;
                            case 2:
                                // Modify syncStat to syncReceiveAllChunks = false
                                LOGGER.debug("resolveSyncStatusDifferences: vistaStat:1 (Not complete); jstat:2 (Complete).  They are NOT the same.  Placing this item in the setToFalseSyncStatiiForDfns tree.");
                                LOGGER.debug("Vista 1; JDS 2");
                                // VA S64 MERGE NOTE: For some reason they have commented out the following line.
                                //                    Not sure why.
//                                setToFalseSyncStatiiForDfns.add(jkey);
                                break;
                            default:
                                LOGGER.debug("resolveSyncStatusDifferences: vistaStat:" + vistaStat + "; jstat:" + jstat + ".  We should never be here.");
                                // should never get here
                                //throw new Exception("Bad SyncStatus value '"+jstat+"' when resolving with VISTA status '"+vistaStat+"' for pid: "+jkey);
                        }
                        break;
                    case 2:
                        switch(jstat) {
                            case 1:
                                // Reset syncstat and resubscribe.
                                LOGGER.debug("resolveSyncStatusDifferences: vistaStat:2 (Complete); jstat:1 (Not Complete).  They are NOT the same.  Placing this item in the deleteSyncStatiiForDfns tree and resubscribing the patient.");
                                LOGGER.debug("Vista 2; JDS 1");
                                deleteSyncStatiiForDfns.add(jkey);
                                resubscribeDfns.add(jkey);
                                break;
                            case 2:
                                // This condition is OK.
                                LOGGER.debug("resolveSyncStatusDifferences: vistaStat:2 (Complete); jstat:2 (Complete).  This is OK.");
                                break;
                            default:
                                LOGGER.debug("resolveSyncStatusDifferences: vistaStat:" + vistaStat + "; jstat:" + jstat + ".  We should never be here.");
                                // should never get here
                                //throw new Exception("Bad SyncStatus value '"+jstat+"' when resolving with VISTA status '"+vistaStat+"' for pid: "+jkey);
                        }
                        break;
                    default:
                        // should never get here
                }
            }
        }

        // Need vistaID.
        LOGGER.debug("resolveSyncStatusDifferences: Processing entries in the deleteSyncStatiiForDfns tree.  Size: " + deleteSyncStatiiForDfns.size());
        for(String dfn: deleteSyncStatiiForDfns) {
            SyncStatus syncStatus = syncStatiiByDfn.get(dfn);
            LOGGER.debug(LoggingUtil.outputSyncStatus("resolveSyncStatusDifferences: resetting  SyncStatus for DFN:" + dfn, syncStatus));
            dao.reset(PidUtils.getPid(vistaId, dfn), vistaId);
        }

        LOGGER.debug("resolveSyncStatusDifferences: Processing entries in the resubscribeDfns tree.  Size: " + resubscribeDfns.size());
        for(String dfn: resubscribeDfns) {
            // Unsubscribe and resubscribe to one site without cascading to other sites
            svc.unsubscribePatient(vistaId, PidUtils.getPid(vistaId, dfn), false,true);
            LOGGER.debug("resolveSyncStatusDifferences: Removed patient subscription for dfn: " + dfn + "; vistaId: " + vistaId);
            svc.subscribePatient(vistaId, PidUtils.getPid(vistaId, dfn), false);
            LOGGER.debug("resolveSyncStatusDifferences: Started patient subscription for dfn: " + dfn + "; vistaId: " + vistaId);
        }

        // TODO: this block is never called as of S64
        LOGGER.debug("resolveSyncStatusDifferences: Processing entries in the setToFalseSyncStatiiForDfns tree.  Size: " + setToFalseSyncStatiiForDfns.size());
        for(String dfn: setToFalseSyncStatiiForDfns) {
            SyncStatus stat = syncStatiiByDfn.get(dfn);
            LOGGER.debug(LoggingUtil.outputSyncStatus("resolveSyncStatusDifferences: Retrieved sync status for dfn: " + dfn, stat));
            stat.getVistaAccountSyncStatusForSystemId(vistaId).setSyncReceivedAllChunks(false);
            dao.saveMergeSyncStatus(stat, null);
            LOGGER.debug(LoggingUtil.outputSyncStatus("resolveSyncStatusDifferences: After updating sync status for dfn: " + dfn + "; vistaId: " + vistaId, stat));
        }
    }

    public static class SyncStatusResolution {
        String pid;
        int status;

        public SyncStatusResolution(String pid, int status) {
            this.pid = pid;
            this.status = status;
        }
    }

    /**
     * This picks the new value of the string if it exists.  If not, it returns the original value.
     * 
     * @param originalValue The original string value.
     * @param newValue The new string value.
     * @return The value that is to be used.
     */
    private static String getStringValue(String originalValue, String newValue) {
        String responseValue = originalValue;

        if (NullChecker.isNotNullish(newValue)) {
            responseValue = newValue;
        } 
        
        return responseValue;
    }
    
    /**
     * This compares two integer values and returns the larger of the two.
     * 
     * @param originalValue The original integer value.
     * @param newValue The new integer value
     * @return The larger of the two values.
     */
    private static Integer getLargerValue(Integer originalValue, Integer newValue) {
        Integer responseValue = null;
        
        if ((originalValue == null) && (newValue != null)) {
            responseValue = newValue;
        }
        else if ((originalValue != null) && (newValue == null)) {
            responseValue = originalValue;
        }
        else if ((originalValue != null) && (newValue != null) && (originalValue.compareTo(newValue) < 0)) {
            responseValue = newValue;
        }
        else if ((originalValue != null) && (newValue != null) && (originalValue.compareTo(newValue) >= 0)) {
            responseValue = originalValue;
        }
        
        return responseValue;
    }

    /**
     * This compares the contents of the two maps.  If either the total or count in the new map is larger than the one in the original
     * then the new map values will be used.
     * 
     * @param originalDomainTotalMap The total information that was in the original sync status.
     * @param newDomainTotalMap The total information in the new sync status.
     * @return The merged value.
     */
    private static Map<String, Integer> mergeSitePatientSyncStatusSingleDomain(Map<String, Integer> originalDomainTotalMap, Map<String, Integer> newDomainTotalMap) {
        Map<String, Integer> responseDomainTotalMap = null;
        
        if ((NullChecker.isNullish(originalDomainTotalMap)) && (NullChecker.isNotNullish(newDomainTotalMap))) {
            responseDomainTotalMap = newDomainTotalMap;
        }
        else if ((NullChecker.isNotNullish(originalDomainTotalMap)) && (NullChecker.isNullish(newDomainTotalMap))) {
            responseDomainTotalMap = originalDomainTotalMap;
        }
        else if ((NullChecker.isNotNullish(originalDomainTotalMap)) && (NullChecker.isNotNullish(newDomainTotalMap))) {
            responseDomainTotalMap = new HashMap<String, Integer>();
            
            Integer totalValue = getLargerValue(originalDomainTotalMap.get("total"), newDomainTotalMap.get("total"));
            if (totalValue != null) {
                responseDomainTotalMap.put("total", totalValue);
            }
            
            Integer countValue = getLargerValue(originalDomainTotalMap.get("count"), newDomainTotalMap.get("count"));
            if (countValue != null) {
                responseDomainTotalMap.put("count", countValue);
            }
        }        
                        
        return responseDomainTotalMap;
    }
    
    
    /**
     * This method merges the domain totals.  Any domains that exist in only one of the maps will be preserved as is.  Any that are in both - the numbers
     * from the new will be used as long as they are larger or equal to the original.
     * 
     * @param originalDomainTotals The original domain totals.
     * @param newDomainTotals The new domain totals.
     * @return The merged domain totals.
     */
    private static Map<String, Map<String, Integer>> mergeSitePatientSyncStatusDomainTotals(Map<String, Map<String, Integer>> originalDomainTotals,
                                                                                            Map<String, Map<String, Integer>> newDomainTotals) {

        Map<String, Map<String, Integer>> responseDomainTotals = null;

        if ((NullChecker.isNullish(originalDomainTotals)) && (NullChecker.isNotNullish(newDomainTotals))) {
            responseDomainTotals = newDomainTotals;
        }
        else if ((NullChecker.isNotNullish(originalDomainTotals)) && (NullChecker.isNullish(newDomainTotals))) {
            responseDomainTotals = originalDomainTotals;
        }
        else if ((NullChecker.isNotNullish(originalDomainTotals)) && (NullChecker.isNotNullish(newDomainTotals))) {
            responseDomainTotals = new HashMap<String, Map<String,Integer>>();
            
            Set<String> setOriginalDomainKey = originalDomainTotals.keySet();
            for (String originalDomainKey : setOriginalDomainKey) {
                if (newDomainTotals.containsKey(originalDomainKey)) {
                    // We have a copy in both places - merge the results.
                    //---------------------------------------------------
                    Map<String, Integer> domainTotals = mergeSitePatientSyncStatusSingleDomain(originalDomainTotals.get(originalDomainKey), newDomainTotals.get(originalDomainKey));
                    if (NullChecker.isNotNullish(domainTotals)) {
                        responseDomainTotals.put(originalDomainKey, domainTotals);
                    }
                }
                else {
                    // It is not in the new one.  Keep the original.
                    //-----------------------------------------------
                    responseDomainTotals.put(originalDomainKey, originalDomainTotals.get(originalDomainKey));
                }
            }
            
            // Now pick up all the new ones that only existed in the newDomainTotals set
            //---------------------------------------------------------------------------
            Set<String> setNewDomainKey = newDomainTotals.keySet();
            for (String newDomainKey : setNewDomainKey) {
                if (!originalDomainTotals.containsKey(newDomainKey)) {
                    responseDomainTotals.put(newDomainKey, newDomainTotals.get(newDomainKey));
                }
            }
        }
        
        return responseDomainTotals;
        
    }
    

    /**
     * This merges the sync status information for the site.  Any missing entries in new will be added.  Any totals/counts in the new that are larger than the original will
     * be updated.  (We assume that in this type of database, that numbers do not go "backwards" or smaller.)
     * 
     * @param site The site associated with these sync status entries
     * @param originalSiteSyncStatus The original site sync status information
     * @param newSiteSyncStatus The new site sync status information.
     * @param overwriteErrorMessage Whether to overwrite the errorMessage attribute value in old site sync status with errorMessage attribute value in new site sync status.
     * @return The merged site sync status information
     */
    private static VistaAccountSyncStatus mergeSitePatientSyncStatus(String site, VistaAccountSyncStatus originalSiteSyncStatus, VistaAccountSyncStatus newSiteSyncStatus, boolean overwriteErrorMessage) {
        VistaAccountSyncStatus responseSiteSyncStatus = null;
        
        if ((originalSiteSyncStatus == null) && (newSiteSyncStatus != null)) {
            responseSiteSyncStatus = newSiteSyncStatus;
        }
        else if ((originalSiteSyncStatus != null) && (newSiteSyncStatus == null)) {
            responseSiteSyncStatus = originalSiteSyncStatus;
        }
        else if ((originalSiteSyncStatus != null) && (newSiteSyncStatus != null)) {
            responseSiteSyncStatus = new VistaAccountSyncStatus();

            String stringValue = getStringValue(originalSiteSyncStatus.getPatientUid(), newSiteSyncStatus.getPatientUid());
            if (stringValue != null) {
                responseSiteSyncStatus.setPatientUid(stringValue);
            }

            stringValue = getStringValue(originalSiteSyncStatus.getDfn(), newSiteSyncStatus.getDfn());
            if (stringValue != null) {
                responseSiteSyncStatus.setDfn(stringValue);
            }
            
            responseSiteSyncStatus.setSyncComplete(originalSiteSyncStatus.isSyncComplete() || newSiteSyncStatus.isSyncComplete());
            responseSiteSyncStatus.setSyncReceivedAllChunks(originalSiteSyncStatus.isSyncReceivedAllChunks() || newSiteSyncStatus.isSyncReceivedAllChunks());
            
            Map<String, Map<String, Integer>> mergedDomainTotals = mergeSitePatientSyncStatusDomainTotals(originalSiteSyncStatus.getDomainExpectedTotals(), 
                                                                                                          newSiteSyncStatus.getDomainExpectedTotals());
            if (NullChecker.isNotNullish(mergedDomainTotals)) {
                responseSiteSyncStatus.setDomainExpectedTotals(mergedDomainTotals);
            }
            
            if ((originalSiteSyncStatus.getExpiresOn() == null) && (newSiteSyncStatus.getExpiresOn() != null)) {
                responseSiteSyncStatus.setExpiresOn(newSiteSyncStatus.getExpiresOn());
            } else if ((originalSiteSyncStatus.getExpiresOn() != null) && (newSiteSyncStatus.getExpiresOn() == null)) {
                responseSiteSyncStatus.setExpiresOn(originalSiteSyncStatus.getExpiresOn());
            } else if ((originalSiteSyncStatus.getExpiresOn() != null) && (newSiteSyncStatus.getExpiresOn() != null)) {
                if (newSiteSyncStatus.getExpiresOn().before(originalSiteSyncStatus.getExpiresOn())) {
                    responseSiteSyncStatus.setExpiresOn(newSiteSyncStatus.getExpiresOn());
                } else {
                    responseSiteSyncStatus.setExpiresOn(originalSiteSyncStatus.getExpiresOn());
                }
            }

            if ((originalSiteSyncStatus.getLastSyncTime() == null) && (newSiteSyncStatus.getLastSyncTime() != null)) {
                responseSiteSyncStatus.setLastSyncTime(newSiteSyncStatus.getLastSyncTime());
            } else if ((originalSiteSyncStatus.getLastSyncTime() != null) && (newSiteSyncStatus.getLastSyncTime() == null)) {
                responseSiteSyncStatus.setLastSyncTime(originalSiteSyncStatus.getLastSyncTime());
            } else if ((originalSiteSyncStatus.getLastSyncTime() != null) && (newSiteSyncStatus.getLastSyncTime() != null)) {
                if (newSiteSyncStatus.getLastSyncTime().after(originalSiteSyncStatus.getLastSyncTime())) {
                    responseSiteSyncStatus.setLastSyncTime(newSiteSyncStatus.getLastSyncTime());
                    responseSiteSyncStatus.setExpiresOn(newSiteSyncStatus.getExpiresOn());
                } else {
                    responseSiteSyncStatus.setLastSyncTime(originalSiteSyncStatus.getLastSyncTime());
                }
            }
            
            if (overwriteErrorMessage){
                responseSiteSyncStatus.setErrorMessage(newSiteSyncStatus.getErrorMessage());
				responseSiteSyncStatus.setSyncComplete(newSiteSyncStatus.isSyncComplete());
			}
            else{
                if (NullChecker.isNotNullish(newSiteSyncStatus.getErrorMessage())){
                    responseSiteSyncStatus.setErrorMessage(newSiteSyncStatus.getErrorMessage());
                }
                else {
                    responseSiteSyncStatus.setErrorMessage(originalSiteSyncStatus.getErrorMessage());
                }
                    
            }
        }
        
        if (responseSiteSyncStatus != null) {
            if (responseSiteSyncStatus.getExpiresOn() != null) {
                responseSiteSyncStatus.setExpired(PointInTime.now().after(responseSiteSyncStatus.getExpiresOn()));
            } else {
                responseSiteSyncStatus.setExpired(false);
            }
        }
        
        return responseSiteSyncStatus;
    }
    
    /**
     * This method takes the contents of the original sync status and the new one for each site and merges the results.
     * 
     * @param originalSiteSyncStatusMap
     * @param newSiteSyncStatusMap
     * @param overwriteErrorMessageForSites List of sites whose old error message should be overwritten with new error message.
     * @return The merged sync status map.
     */
    private static Map<String, VistaAccountSyncStatus> mergeSitePatientSyncStatusMaps(Map<String, VistaAccountSyncStatus> originalSiteSyncStatusMap, 
                                                                                  Map<String, VistaAccountSyncStatus> newSiteSyncStatusMap,
                                                                                  HashSet<String> overwriteErrorMessageForSites) {
        Map<String, VistaAccountSyncStatus> mergedSiteSyncStatusMap = new HashMap<String, SyncStatus.VistaAccountSyncStatus>();
        
        if ((NullChecker.isNullish(originalSiteSyncStatusMap)) &&
            (NullChecker.isNotNullish(newSiteSyncStatusMap))) {
            mergedSiteSyncStatusMap = newSiteSyncStatusMap;
        }
        else if ((NullChecker.isNullish(newSiteSyncStatusMap)) &&
                 (NullChecker.isNotNullish(originalSiteSyncStatusMap))) {
            mergedSiteSyncStatusMap = originalSiteSyncStatusMap;
        }
        else if ((NullChecker.isNotNullish(originalSiteSyncStatusMap)) && 
                 (NullChecker.isNotNullish(newSiteSyncStatusMap))) {
            Set<String> setOriginalSites = originalSiteSyncStatusMap.keySet();
            
            // First lets see if there are any of the original sites that are also in the new site map
            //-----------------------------------------------------------------------------------------
            for (String originalSite : setOriginalSites) {
                if (newSiteSyncStatusMap.containsKey(originalSite)) {
                    // This site is in the old and the new map.  So merge the contents.
                    //------------------------------------------------------------------
                    boolean overwriteErrorMessage = false;
                    if (overwriteErrorMessageForSites != null){
                        overwriteErrorMessage = overwriteErrorMessageForSites.contains(originalSite);
                    }
                    
                    VistaAccountSyncStatus mergedSiteSyncStatus = mergeSitePatientSyncStatus(originalSite, originalSiteSyncStatusMap.get(originalSite), newSiteSyncStatusMap.get(originalSite), overwriteErrorMessage);
                    mergedSiteSyncStatusMap.put(originalSite, mergedSiteSyncStatus);
                }
                else {
                    // Nothing in the new map - so keep the old map item as is.
                    //---------------------------------------------------------
                    mergedSiteSyncStatusMap.put(originalSite, originalSiteSyncStatusMap.get(originalSite));
                }
            }
            
            // Now process any items that are in the new map that are not in the old map.
            //---------------------------------------------------------------------------
            Set<String> setNewSites = newSiteSyncStatusMap.keySet();
            for (String newSite : setNewSites) {
                if (!originalSiteSyncStatusMap.containsKey(newSite)) {
                    mergedSiteSyncStatusMap.put(newSite, newSiteSyncStatusMap.get(newSite));
                }
            }
        }
        
        return mergedSiteSyncStatusMap;
    }

    /**
     * This method takes the original sync status for a patient and merges the contents of the new one into it.
     * It will look at each domain for each site and if either the total or count of the new one is > than the ones
     * in the original it will be updated.  Any new domains or sites in the new sync status will also be added in.
     * 
     * @param originalSyncStatus The sync status before the merge.
     * @param newSyncStatus The new values to be merged into the sync status.
     * @param overwriteErrorMessageForSites List of sites whose old error message should be overwritten with new error message.
     * @return The newly combined sync status.
     */
    public static SyncStatus mergePatientSyncStatus(SyncStatus originalSyncStatus, SyncStatus newSyncStatus, HashSet<String> overwriteErrorMessageForSites) {
        SyncStatus responseSyncStatus = null;
        
        if (originalSyncStatus == null) {
            responseSyncStatus = newSyncStatus;
        }
        else if (newSyncStatus == null) {
            responseSyncStatus = originalSyncStatus;
        }
        else {
            responseSyncStatus = new SyncStatus();
            
            String stringValue = getStringValue(originalSyncStatus.getPid(), newSyncStatus.getPid());
            if (stringValue != null) {
                responseSyncStatus.setData("pid", stringValue);
            }
            
            stringValue = getStringValue(originalSyncStatus.getUid(), newSyncStatus.getUid());
            if (stringValue != null) {
                responseSyncStatus.setData("uid", stringValue);
            }

            stringValue = getStringValue(originalSyncStatus.getSummary(), newSyncStatus.getSummary());
            if (stringValue != null) {
                responseSyncStatus.setData("summary", stringValue);
            }
            
            Map<String, VistaAccountSyncStatus> mergedSiteSyncStatus = mergeSitePatientSyncStatusMaps(originalSyncStatus.getSyncStatusByVistaSystemId(), newSyncStatus.getSyncStatusByVistaSystemId(), overwriteErrorMessageForSites);
            if (NullChecker.isNotNullish(mergedSiteSyncStatus)) {
                responseSyncStatus.setData("syncStatusByVistaSystemId", mergedSiteSyncStatus);
            }
        }
        
        return responseSyncStatus;
    }


    /**
     * This method takes the original sync status for operational data and merges the contents of the new one into it.
     * It will look at each domain for each site and if either the total or count of the new one is > than the ones
     * in the original it will be updated.  Any new domains or sites in the new sync status will also be added in.
     * 
     * @param originalSyncStatus The sync status before the merge.
     * @param newSyncStatus The new values to be merged into the sync status.
     * @return The newly combined sync status.
     */
    public static SyncStatus mergeOperationalSyncStatus(SyncStatus originalSyncStatus, SyncStatus newSyncStatus) {
        SyncStatus responseSyncStatus = null;
        
        // TODO:  Do a merge here...
        responseSyncStatus = newSyncStatus;
        
        return responseSyncStatus;
    }
}
