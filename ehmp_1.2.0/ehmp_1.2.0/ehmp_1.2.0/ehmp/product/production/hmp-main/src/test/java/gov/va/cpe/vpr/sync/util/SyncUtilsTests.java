package gov.va.cpe.vpr.sync.util;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import com.codahale.metrics.MetricFilter;

import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.SyncStatus.VistaAccountSyncStatus;
import gov.va.cpe.vpr.sync.util.MsgSrcDest.JDSMsgSrc;
import gov.va.cpe.vpr.sync.util.MsgSrcDest.JSONZIPMsgSrc;
import gov.va.cpe.vpr.sync.util.MsgSrcDest.VistARPCMsgSrc;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.NullChecker;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

public class SyncUtilsTests {
	private static SimpleDateFormat SDF = new SimpleDateFormat("yyyyMMdd.HHmm");
	private Map<String, Object> options = new HashMap<String, Object>();
	private List<String> domains = Arrays.asList("all");
	private List<String> pids = Arrays.asList("100848,100851,100846,100845,100849,100842,100841,100847,100850,8,100844,100852,3,231,229,217,237,253,418,25,205,100843".split(","));
//	private List<String> pids = Arrays.asList("229");
	private String uri = "http://localhost:9080/vpr";
	
	@Test
	@Ignore("This is more of an integration/performance test.  Keep it out of the automated stuff for now.")
	public void pomTest() throws Exception {
		String str = "c:\\temp\\vistadevpts.20130814.zip";
		File file = new File(str);
		if (!file.exists()) fetchAllData(uri, str);
		
		String ext = SDF.format(new Date()) + ".csv";
		options.put("threads", "1");
		options.put("csv", "c:\\temp\\csv\\SyncUtilsTests.pomTest." + ext);
		
		// TODO: How to automate truncating the whole JDS store before and in between?
		
		// test script for determining JDS loading from .zip w/ and w/o domain objects
		JSONZIPMsgSrc src = new JSONZIPMsgSrc(str);
		JDSMsgSrc dest = new JDSMsgSrc(uri);
	
		// run w/o POM domains
		SyncUtils util = new SyncUtils(src, dest, options, domains, pids);
		util.exec();
		util.close();
		SyncUtils.METRICS.removeMatching(MetricFilter.ALL);
		
		// then again with POM domains
		options.put("pom", true);
		src = new JSONZIPMsgSrc(str);
		dest = new JDSMsgSrc(uri);
		util = new SyncUtils(src, dest, options, domains, pids);
		util.exec();
		util.close();
	}
	
	// TODO: Should this just be checked into the .resources directory instead?
	private void fetchAllData(String uri, String file) throws IOException, InterruptedException {
		VistARPCMsgSrc src = new VistARPCMsgSrc(uri, options);
		JSONZIPMsgSrc dest = new JSONZIPMsgSrc(file);
		SyncUtils util = new SyncUtils(src, dest, options, domains, pids);
		util.exec();
	}
	
	//----------------------------------------
	// Start of code to test merge capability 
	//----------------------------------------
	
	private static final int ORIGINAL_SYNC_STATUS_IDX = 0;
	private static final int NEW_SYNC_STATUS_IDX = 1;
	private static final String UID = "urn:va:syncstatus:111";
	private static final String SUMMARY = "TheSummary";
	private static final String PID = "111";
	private static final int SITE_AAAA_IDX = 0;
	private static final int SITE_BBBB_IDX = 1;
	private static final int SITE_CCCC_IDX = 1;
	private static final String[][] SITES = {{"AAAA", "BBBB"},
	                                         {"AAAA", "CCCC"}};
	private static final String[][] SITE_PATIENT_UID = {{"urn:va:patient:AAAA:1:1", "urn:va:patient:BBBB:2:2"},
	                                                    {"urn:va:patient:AAAA:1:1", "urn:va:patient:CCCC:4:4"}};
    private static final String[][] SITE_DFN = {{"1", "2"},
                                                {"1", "4"}};
    private static final boolean[][] SITE_SYNC_COMPLETE = {{true, true},
                                                           {false, true}};
    private static final PointInTime[] times = setupTimes(8);
    private static final PointInTime[][] SITE_LASTSYNCTIME = { { times[0], times[1] }, { times[2], times[3] } };
    private static final PointInTime[][] SITE_EXPIRESON = { { times[4], times[5] }, { times[6], times[7] } };
    private static final int SITE_AAAA_DOMAIN_SIZE = 5;
    private static final int SITE_BBBB_DOMAIN_SIZE = 2;
    private static final int SITE_CCCC_DOMAIN_SIZE = 2;
    private static final String LAB_DOMAIN = "lab";
    private static final String ALLERGY_DOMAIN = "allergy";
    private static final String APPOINTMENT_DOMAIN = "appointment";
    private static final String IMMUNIZATION_DOMAIN = "immunizaation";
    private static final String MED_DOMAIN = "med";
    private static final String ORDER_DOMAIN = "order";
    private static final String PROBLEM_DOMAIN = "problem";
    private static final String CONSULT_DOMAIN = "consult";
    private static final String FACTOR_DOMAIN = "factor";
    private static final String[][][] SITE_DOMAIN = 
    {   // [0] originalSyncStatus
        {   // AAAA
            {LAB_DOMAIN, ALLERGY_DOMAIN, APPOINTMENT_DOMAIN, IMMUNIZATION_DOMAIN},
            // BBBB
            {MED_DOMAIN, ORDER_DOMAIN}
        },
        // [1] newSyncStatus
        {   // AAAA
            {LAB_DOMAIN, ALLERGY_DOMAIN, APPOINTMENT_DOMAIN, FACTOR_DOMAIN},
            // CCCC
            {PROBLEM_DOMAIN, CONSULT_DOMAIN}
        }
    };
    
    private static final int LAB_HIGH_TOTAL = 10;
    private static final int ALLERGY_LOW_TOTAL = 5;
    private static final int ALLERGY_HIGH_TOTAL = 9;
    private static final int APPOINTMENT_LOW_TOTAL = 3;
    private static final int APPOINTMENT_HIGH_TOTAL = 6;
    private static final int IMMUNIZATION_HIGH_TOTAL = 7;
    private static final int FACTOR_HIGH_TOTAL = 8;
    private static final int MED_HIGH_TOTAL = 1;
    private static final int ORDER_HIGH_TOTAL = 2;
    private static final int PROBLEM_HIGH_TOTAL = 12;
    private static final int CONSULT_HIGH_TOTAL = 13;
    
    private static final int[][][] SITE_DOMAIN_TOTAL = 
    {   // [0] originalSyncStatus
        {   // AAAA
            {LAB_HIGH_TOTAL, ALLERGY_LOW_TOTAL, APPOINTMENT_HIGH_TOTAL, IMMUNIZATION_HIGH_TOTAL},
            // BBBB
            {MED_HIGH_TOTAL, ORDER_HIGH_TOTAL}
        },
        // [1] newSyncStatus
        {   // AAAA
            {LAB_HIGH_TOTAL, ALLERGY_HIGH_TOTAL, APPOINTMENT_LOW_TOTAL, FACTOR_HIGH_TOTAL},
            // CCCC
            {PROBLEM_HIGH_TOTAL, CONSULT_HIGH_TOTAL}
        }
    };
    
    private static final int LAB_HIGH_COUNT = 10;
    private static final int ALLERGY_LOW_COUNT = 5;
    private static final int ALLERGY_HIGH_COUNT = 9;
    private static final int APPOINTMENT_LOW_COUNT = 3;
    private static final int APPOINTMENT_HIGH_COUNT = 6;
    private static final int IMMUNIZATION_HIGH_COUNT = 7;
    private static final int FACTOR_HIGH_COUNT = 8;
    private static final int MED_HIGH_COUNT = 1;
    private static final int ORDER_HIGH_COUNT = 2;
    private static final int PROBLEM_HIGH_COUNT = 12;
    private static final int CONSULT_HIGH_COUNT = 13;
    
	
    private static final int[][][] SITE_DOMAIN_COUNT = 
    {   // [0] originalSyncStatus
        {   // AAAA
            {LAB_HIGH_COUNT, ALLERGY_LOW_COUNT, APPOINTMENT_HIGH_COUNT, IMMUNIZATION_HIGH_COUNT},
            // BBBB
            {MED_HIGH_COUNT, ORDER_HIGH_COUNT}
        },
        // [1] newSyncStatus
        {   // AAAA
            {LAB_HIGH_COUNT, ALLERGY_HIGH_COUNT, APPOINTMENT_LOW_COUNT, FACTOR_HIGH_COUNT},
            // CCCC
            {PROBLEM_HIGH_COUNT, CONSULT_HIGH_COUNT}
        }
    };
	
	private SyncStatus originalPtSyncStatus = null;
	private SyncStatus newPtSyncStatus = null;
	private static Map<String, Integer> mapDomainHighTotal = new HashMap<String, Integer>();
	private static Map<String, Integer> mapDomainHighCount = new HashMap<String, Integer>();
	
	@BeforeClass
	public static void setUpClass() {
        // Fill in the expected maps for later comparison
        //-----------------------------------------------
        mapDomainHighTotal.put(LAB_DOMAIN, new Integer(LAB_HIGH_TOTAL));
        mapDomainHighCount.put(LAB_DOMAIN, new Integer(LAB_HIGH_COUNT));
        mapDomainHighTotal.put(ALLERGY_DOMAIN, new Integer(ALLERGY_HIGH_TOTAL));
        mapDomainHighCount.put(ALLERGY_DOMAIN, new Integer(ALLERGY_HIGH_COUNT));
        mapDomainHighTotal.put(APPOINTMENT_DOMAIN, new Integer(APPOINTMENT_HIGH_TOTAL));
        mapDomainHighCount.put(APPOINTMENT_DOMAIN, new Integer(APPOINTMENT_HIGH_COUNT));
        mapDomainHighTotal.put(IMMUNIZATION_DOMAIN, new Integer(IMMUNIZATION_HIGH_TOTAL));
        mapDomainHighCount.put(IMMUNIZATION_DOMAIN, new Integer(IMMUNIZATION_HIGH_COUNT));
        mapDomainHighTotal.put(MED_DOMAIN, new Integer(MED_HIGH_TOTAL));
        mapDomainHighCount.put(MED_DOMAIN, new Integer(MED_HIGH_COUNT));
        mapDomainHighTotal.put(ORDER_DOMAIN, new Integer(ORDER_HIGH_TOTAL));
        mapDomainHighCount.put(ORDER_DOMAIN, new Integer(ORDER_HIGH_COUNT));
        mapDomainHighTotal.put(FACTOR_DOMAIN, new Integer(FACTOR_HIGH_TOTAL));
        mapDomainHighCount.put(FACTOR_DOMAIN, new Integer(FACTOR_HIGH_COUNT));
        mapDomainHighTotal.put(PROBLEM_DOMAIN, new Integer(PROBLEM_HIGH_TOTAL));
        mapDomainHighCount.put(PROBLEM_DOMAIN, new Integer(PROBLEM_HIGH_COUNT));
        mapDomainHighTotal.put(CONSULT_DOMAIN, new Integer(CONSULT_HIGH_TOTAL));
        mapDomainHighCount.put(CONSULT_DOMAIN, new Integer(CONSULT_HIGH_COUNT));
	}
	
    private static final PointInTime[] setupTimes(int size) {
        PointInTime[] times = new PointInTime[size];
        for (int i = 0; i < times.length; i++) {
            times[i] = PointInTime.now();
            try {
                Thread.sleep(1);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return times;
    }

	/**
	 * This method is run before every test.
	 * 
	 * @throws Exception
	 */
    @Before
    public void setUp() throws Exception {
        originalPtSyncStatus = createPtSyncStatus(ORIGINAL_SYNC_STATUS_IDX);
        newPtSyncStatus = createPtSyncStatus(NEW_SYNC_STATUS_IDX);
    }
    
    /**
     * This method creates a patient sync status from the data at the given index.
     * 
     * @param idx The index of the constants to use for creating the sync status.
     * @return The sync status that was created.
     */
    public SyncStatus createPtSyncStatus(int idx) {
        SyncStatus responseSyncStatus = new SyncStatus();
        
        responseSyncStatus.setData("uid", UID);
        responseSyncStatus.setData("summary", SUMMARY);
        responseSyncStatus.setData("pid", PID);
        
        Map<String, VistaAccountSyncStatus> mapSiteSyncStatus = new HashMap<String, SyncStatus.VistaAccountSyncStatus>();
        for (int i = 0; i < SITES[idx].length; i++) {
            VistaAccountSyncStatus siteSyncStatus = new VistaAccountSyncStatus();
            siteSyncStatus.setPatientUid(SITE_PATIENT_UID[idx][i]);
            siteSyncStatus.setDfn(SITE_DFN[idx][i]);
            siteSyncStatus.setSyncComplete(SITE_SYNC_COMPLETE[idx][i]);
            siteSyncStatus.setLastSyncTime(SITE_LASTSYNCTIME[idx][i]);
            siteSyncStatus.setExpiresOn(SITE_EXPIRESON[idx][i]);
            
            Map<String, Map<String, Integer>> mapDomainExpectedTotals = new HashMap<String, Map<String,Integer>>();
            for (int j = 0; j < SITE_DOMAIN[idx][i].length; j++) {
                Map<String, Integer> mapSingleDomainTotals = new HashMap<String, Integer>();
                mapSingleDomainTotals.put("total", new Integer(SITE_DOMAIN_TOTAL[idx][i][j]));
                mapSingleDomainTotals.put("count", new Integer(SITE_DOMAIN_COUNT[idx][i][j]));
                mapDomainExpectedTotals.put(SITE_DOMAIN[idx][i][j], mapSingleDomainTotals);
            }
            siteSyncStatus.setDomainExpectedTotals(mapDomainExpectedTotals);
            
            mapSiteSyncStatus.put(SITES[idx][i], siteSyncStatus);
        }
        responseSyncStatus.setData("syncStatusByVistaSystemId", mapSiteSyncStatus);
        
        return responseSyncStatus;
    }
    
    /**
     * This verified that all the domains in the array are present in the map.
     * 
     * @param domains The list of domains.
     * @param mapDomainExpectedTotals The map of domain expected totals
     */
    private void verifyDomainsPresent(String[] domains, Map<String, Map<String, Integer>> mapDomainExpectedTotals) {
        for (String domain : domains) {
            assertTrue("Map should have contained this domain.", mapDomainExpectedTotals.containsKey(domain));
        }
    }
    
    /**
     * This verifies that the totals and counts are correct for the given domain.
     * 
     * @param domainKey The domain that represents this map. 
     * @param mapDomainTotals The map containing the totals.
     */
    private void verifyDomainContents(String domainKey, Map<String, Integer> mapDomainTotals) {
        Integer expectedTotal = mapDomainHighTotal.get(domainKey);
        assertNotNull(expectedTotal);
        Integer expectedCount = mapDomainHighCount.get(domainKey);
        assertNotNull(expectedCount);
        
        assertTrue("The domain totals for " + domainKey + " should not have been nullish.", NullChecker.isNotNullish(mapDomainTotals));
        Integer actualTotal = mapDomainTotals.get("total");
        assertNotNull(actualTotal);
        Integer actualCount = mapDomainTotals.get("count");
        assertNotNull(actualCount);
        
        assertEquals("The domain total for " + domainKey + " was not correct.", 0, expectedTotal.compareTo(actualTotal));
        assertEquals("The domain count for " + domainKey + " was not correct.", 0, expectedCount.compareTo(actualCount));
    }

    /**
     * This verifies that the sync status was merged correctly.
     * 
     * @param mergedSyncStatus The sync status to be checked.
     */
    private void verifyMergedSyncStatus(SyncStatus mergedSyncStatus) {
        assertNotNull("The result should not have been null.", mergedSyncStatus);
        
        assertEquals("The uid was incorrect.", UID, mergedSyncStatus.getUid());
        assertEquals("The summary was incorrect.", SUMMARY, mergedSyncStatus.getSummary());
        assertEquals("The pid was incorrect.", PID, mergedSyncStatus.getPid());
        
        assertTrue("SyncStatusByVistaSystemId map should not have been nullish.", NullChecker.isNotNullish(mergedSyncStatus.getSyncStatusByVistaSystemId()));
        assertEquals("SyncStatusByVistaSystemId map contained the wrong number of elements.", 3, mergedSyncStatus.getSyncStatusByVistaSystemId().size());

        // Verify that site "AAAA" was correctly merged between the original and new sets -
        // This is the most complex one because it has results that have to be merged.
        //--------------------------------------------------------------------------------
        VistaAccountSyncStatus siteSyncStatus = mergedSyncStatus.getVistaAccountSyncStatusForSystemId("AAAA");
        assertNotNull("siteSyncStatus (AAAA) should not have been null", siteSyncStatus);
        assertEquals("site (AAAA) - patientUid was incorrect.", SITE_PATIENT_UID[ORIGINAL_SYNC_STATUS_IDX][SITE_AAAA_IDX], siteSyncStatus.getPatientUid());
        assertEquals("site (AAAA) - dfn was incorrect.", SITE_DFN[ORIGINAL_SYNC_STATUS_IDX][SITE_AAAA_IDX], siteSyncStatus.getDfn());
        assertEquals("site (AAAA) - syncComplete was incorrect.", true, siteSyncStatus.isSyncComplete());
        assertEquals("site (AAAA) - lastSyncTime was incorrect.", SITE_LASTSYNCTIME[NEW_SYNC_STATUS_IDX][SITE_AAAA_IDX], siteSyncStatus.getLastSyncTime());
        assertEquals("site (AAAA) - expiresOn was incorrect.", SITE_EXPIRESON[NEW_SYNC_STATUS_IDX][SITE_AAAA_IDX], siteSyncStatus.getExpiresOn());
        assertNotNull("site (AAAA) - domainExpectedTotals should not have been null.", siteSyncStatus.getDomainExpectedTotals());
        assertEquals("site (AAAA) - contained the wrong number of elements.", SITE_AAAA_DOMAIN_SIZE, siteSyncStatus.getDomainExpectedTotals().size());
        verifyDomainsPresent(SITE_DOMAIN[ORIGINAL_SYNC_STATUS_IDX][SITE_AAAA_IDX], siteSyncStatus.getDomainExpectedTotals());
        verifyDomainsPresent(SITE_DOMAIN[NEW_SYNC_STATUS_IDX][SITE_AAAA_IDX], siteSyncStatus.getDomainExpectedTotals());
        Set<String> setDomainKeys = siteSyncStatus.getDomainExpectedTotals().keySet();
        for (String domainKey : setDomainKeys) {
            verifyDomainContents(domainKey, siteSyncStatus.getDomainExpectedTotals().get(domainKey));
        }
        
        // Verify Site BBBB
        //------------------
        siteSyncStatus = mergedSyncStatus.getVistaAccountSyncStatusForSystemId("BBBB");
        assertNotNull("siteSyncStatus (BBBB) should not have been null", siteSyncStatus);
        assertEquals("site (BBBB) - patientUid was incorrect.", SITE_PATIENT_UID[ORIGINAL_SYNC_STATUS_IDX][SITE_BBBB_IDX], siteSyncStatus.getPatientUid());
        assertEquals("site (BBBB) - dfn was incorrect.", SITE_DFN[ORIGINAL_SYNC_STATUS_IDX][SITE_BBBB_IDX], siteSyncStatus.getDfn());
        assertEquals("site (BBBB) - syncComplete was incorrect.", true, siteSyncStatus.isSyncComplete());
        assertEquals("site (BBBB) - lastSyncTime was incorrect.", SITE_LASTSYNCTIME[ORIGINAL_SYNC_STATUS_IDX][SITE_BBBB_IDX], siteSyncStatus.getLastSyncTime());
        assertEquals("site (BBBB) - expiresOn was incorrect.", SITE_EXPIRESON[ORIGINAL_SYNC_STATUS_IDX][SITE_BBBB_IDX], siteSyncStatus.getExpiresOn());
        assertNotNull("site (BBBB) - domainExpectedTotals should not have been null.", siteSyncStatus.getDomainExpectedTotals());
        assertEquals("site (BBBB) - contained the wrong number of elements.", SITE_BBBB_DOMAIN_SIZE, siteSyncStatus.getDomainExpectedTotals().size());
        verifyDomainsPresent(SITE_DOMAIN[ORIGINAL_SYNC_STATUS_IDX][SITE_BBBB_IDX], siteSyncStatus.getDomainExpectedTotals());
        setDomainKeys = siteSyncStatus.getDomainExpectedTotals().keySet();
        for (String domainKey : setDomainKeys) {
            verifyDomainContents(domainKey, siteSyncStatus.getDomainExpectedTotals().get(domainKey));
        }
        
        // Verify Site CCCC
        //------------------
        siteSyncStatus = mergedSyncStatus.getVistaAccountSyncStatusForSystemId("CCCC");
        assertNotNull("siteSyncStatus (CCCC) should not have been null", siteSyncStatus);
        assertEquals("site (CCCC) - patientUid was incorrect.", SITE_PATIENT_UID[NEW_SYNC_STATUS_IDX][SITE_CCCC_IDX], siteSyncStatus.getPatientUid());
        assertEquals("site (CCCC) - dfn was incorrect.", SITE_DFN[NEW_SYNC_STATUS_IDX][SITE_CCCC_IDX], siteSyncStatus.getDfn());
        assertEquals("site (CCCC) - syncComplete was incorrect.", true, siteSyncStatus.isSyncComplete());
        assertEquals("site (CCCC) - lastSyncTime was incorrect.", SITE_LASTSYNCTIME[NEW_SYNC_STATUS_IDX][SITE_CCCC_IDX], siteSyncStatus.getLastSyncTime());
        assertEquals("site (CCCC) - expiresOn was incorrect.", SITE_EXPIRESON[NEW_SYNC_STATUS_IDX][SITE_CCCC_IDX], siteSyncStatus.getExpiresOn());
        assertNotNull("site (CCCC) - domainExpectedTotals should not have been null.", siteSyncStatus.getDomainExpectedTotals());
        assertEquals("site (CCCC) - contained the wrong number of elements.", SITE_CCCC_DOMAIN_SIZE, siteSyncStatus.getDomainExpectedTotals().size());
        verifyDomainsPresent(SITE_DOMAIN[NEW_SYNC_STATUS_IDX][SITE_CCCC_IDX], siteSyncStatus.getDomainExpectedTotals());
        setDomainKeys = siteSyncStatus.getDomainExpectedTotals().keySet();
        for (String domainKey : setDomainKeys) {
            verifyDomainContents(domainKey, siteSyncStatus.getDomainExpectedTotals().get(domainKey));
        }
    }

    @Test
    public void testMergePatientSyncStatus() {
        System.out.println("running testMergePatientSyncStatus...");
        
        SyncStatus mergedSyncStatus = SyncUtils.mergePatientSyncStatus(originalPtSyncStatus, newPtSyncStatus, null);
        verifyMergedSyncStatus(mergedSyncStatus);
    }
}
