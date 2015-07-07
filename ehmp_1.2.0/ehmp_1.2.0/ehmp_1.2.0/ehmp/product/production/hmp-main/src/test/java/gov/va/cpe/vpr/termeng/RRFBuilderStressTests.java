package gov.va.cpe.vpr.termeng;


import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.h2.mvstore.MVMap;
import org.h2.mvstore.MVStore;
import org.junit.Ignore;
import org.junit.Test;

public class RRFBuilderStressTests {
	
	private static final int AUI2URN_COUNT=4_000_000;
	private static final int URN_COUNT=100_000;
	private static final int REL_COUNT=15_000_000;
	private static final int BLOCK_SIZE = 25_000;
	
	@Test
	@Ignore
	public void testVeryLargeMap() {
		int limit = 1_000_000;
		// TODO: Create a map, add one key to it, up to 80K keys, seralizing each time.
		File file = new File(System.getProperty("java.io.tmpdir"), "/tmp.cache");
		file.delete(); // ensure an empty file
		MVStore mvstore = new MVStore.Builder().autoCommitDisabled().fileName(file.getAbsolutePath()).open();
		MVMap<String, Map<String,String>> mvmap = mvstore.openMap("bigmap");
		mvmap.put("foo", new HashMap<String,String>());
		for (int i=0; i < limit; i++) {
			Map<String,String> m = mvmap.get("foo");
			m.put(getAUI(i), "RO|may_treat");
			mvmap.put("foo", m);
			if (i % BLOCK_SIZE==0) {
				System.out.println(i +"/" + limit);
				mvstore.commit();
			}
		}
		mvstore.commit();
	}
	
	/** taking a stab at replicating my MVStore issues as a long-running unit test */
	@Test
	@Ignore
	public void testRRFBuilder() {
		File file = new File(System.getProperty("java.io.tmpdir"), "/tmp.cache");
		file.delete(); // ensure an empty file
		MVStore mvstore = new MVStore.Builder().autoCommitDisabled()
				.fileName(file.getAbsolutePath()).cacheSize(100).open();
		
		// first generate AUI to URN map to simulate MRCONSO.RRF data
		// by mapping n sequential AUI's to random urn's.
		MVMap<String,String> aui2urn = mvstore.openMap("aui2urn");
		for (int i=0; i < AUI2URN_COUNT; i++) {
			aui2urn.put(getAUI(i), getRandomURN());
			if (i % BLOCK_SIZE == 0) {
				System.out.printf("aui2urn's generated: %s/%s\n", i, AUI2URN_COUNT);
				mvstore.commit();
			}
		}
		mvstore.commit();
		
		// simulate relationship records from MRREL.RRF
		MVMap<String, Map<String,String>> mrrels = mvstore.openMap("mrrel");
		for (int i=0; i < AUI2URN_COUNT; i++) {
			// for each AUI, generate i random mappings
			for (int j=0; j < i; j++) {
				Map<String,String> rec = buildRec(getAUI(i));
				String urn1 = aui2urn.get(rec.get("aui1"));
				String urn2 = aui2urn.get(rec.get("aui2"));
				Map<String,String> rels = mrrels.get(urn1);
				if (rels == null) rels = new HashMap<>();
				rels.put(urn2, rec.get("rel") + ":" + rec.get("rela"));
				mrrels.put(urn1, rels);
			}
			if (i % BLOCK_SIZE == 0) {
				System.out.printf("mrrels's generated: %s/%s\n", i, REL_COUNT);
				mvstore.commit();
			}
		}
		mvstore.commit();
	}
	
	/** Generates a random aui-to-aui relationship record */
	private static final Map<String,String> buildRec(String aui) {
		Map<String,String> rec = new HashMap<>();
		rec.put("aui1", aui);
		rec.put("aui2", getRandomAUI());
		rec.put("rel", "foo");
		rec.put("rela", "bar");
		return rec;
	}
	
	private static final String getAUI(long id) {
		return String.format("A%07d", id);
	}
	
	private static final String getRandomAUI() {
		return getAUI(Math.round(Math.random()*AUI2URN_COUNT));
	}
	
	private static final String getRandomURN() {
		return String.format("urn:foo:%07d", Math.round(Math.random()*URN_COUNT));
	}
}
