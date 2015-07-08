package gov.va.cpe.vpr.pom;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.DrugTherapyTest;
import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.sync.util.MsgSrcDest;
import gov.va.cpe.vpr.sync.util.MsgSrcDest.IteratorWithCount;
import gov.va.cpe.vpr.sync.util.MsgSrcDest.JSONZIPMsgSrc;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Test;

import com.codahale.metrics.Timer;
import com.codahale.metrics.Timer.Context;

import static org.junit.Assert.*;
import static gov.va.cpe.vpr.pom.POMUtils.*;

public class POMUtilsTests {
	
	private static HashMap newMap(Object key, Object val) {
		HashMap m = new HashMap();
		m.put(key, val);
		return m;
	}

	
	@Test
	public void testMapPath() {
		// create a map with simple values
		HashMap map = new HashMap();
		map.put("a", 1);
		map.put("b", 2);
		map.put("c", 3);
		
		// add a simple sub-map
		map.put("x", new HashMap(map));
		
		// add complex values: list of maps with same key
		ArrayList<Map> al = new ArrayList<Map>();
		al.add(new HashMap(map));
		al.add(new HashMap(map));
		al.add(new HashMap(map));
		map.put("y", al);
		
		// add complex values: list of maps with different keys 
		al = new ArrayList<Map>();
		al.add(newMap("a", "x"));
		al.add(newMap("b", "y"));
		al.add(newMap("c", "z"));
		map.put("z", al);
		
		// test expected null results..
		assertNull(getMapPath(map, "blablabla"));
		assertNull(getMapPath(map, null));
		assertNull(getMapPath(null, "a"));
		
		// test simple values, should behave just like normal get()
		assertEquals(1, getMapPath(map, "a"));
		assertEquals(2, getMapPath(map, "b"));
		assertEquals(3, getMapPath(map, "c"));
		assertTrue(getMapPath(map, "x") instanceof Map);
		assertTrue(getMapPath(map, "y") instanceof List);
		assertTrue(getMapPath(map, "z") instanceof List);
		
		// test dot notation
		assertEquals(1, getMapPath(map, "x.a"));
		assertEquals(2, getMapPath(map, "x.b"));
		assertEquals(3, getMapPath(map, "x.c"));
		assertNull(getMapPath(map, "x.x"));
		assertNull(getMapPath(map, "zzz.abc")); // TODO: Is this the correct behavior or not?

		// test gather '[]' syntax: y has identical sub-maps, z does not
		Object o = getMapPath(map, "y[].a");
		assertTrue(o instanceof List);
		List l = (List) o;
		assertEquals(3, l.size());
		assertEquals(1, l.get(0));
		assertEquals(1, l.get(1));
		assertEquals(1, l.get(2));
		
		o = getMapPath(map, "z[].a");
		assertTrue(o instanceof List);
		l = (List) o;
		assertEquals(1, l.size());
		assertEquals("x", l.get(0));
		
		// test error conditions
		try {
			// TODO: error condition: z[] -> requires subkey
			getMapPath(map, "z[]");
			fail("Expected Exception");
		} catch (Exception ex) {
			// expected
		}
		
		try {
			// TODO: error condition x.y where y is a list?
			getMapPath(map, "y.a");
			fail("Expected Exception");
		} catch (Exception ex) {
			// expected
		}

		try {
			// TODO: error conditions x[].nonarray
			getMapPath(map, "x[].a");
			fail("Expected Exception");
		} catch (Exception ex) {
			// expected
		}

	}
	
	/** Simple test to see how fast smile vs json is for parsing */
	@Test
	public void testSMILEvsJSONPerformance() throws IOException, URISyntaxException {
		List<String> docs = new ArrayList<>();
		
		// how long to parse JSON
		File file = new File(DrugTherapyTest.class.getResource("avivapatient.six.20140304.zip").toURI());
		Class<? extends IPatientObject> clazz = Document.class;
		MsgSrcDest src = new JSONZIPMsgSrc(file);
		IteratorWithCount<String> itr = src.read("5000000346","document");
		while (itr.hasNext()) {
			docs.add(itr.next());
		}

		// do a warmup decode
		POMUtils.newInstance(clazz, docs.get(0));
		
		List<byte[]> smile = new ArrayList<>();
		Timer timer = new Timer();
		long length = 0;
		for (String json : docs) {
			Context ctx = timer.time();
			IPatientObject obj = POMUtils.newInstance(clazz, json);
			ctx.stop();
			length += json.getBytes().length;
			smile.add(POMUtils.toSMILE(obj, JSONViews.JDBView.class));
		}
		
		double avg = length / timer.getCount();
		System.out.printf("JSON Parse: %s,  %s/s %sns/doc %s bites/doc\n", timer.getCount(), timer.getMeanRate(), timer.getSnapshot().getMean(), avg);
		
		// do a warmup decode
		POMUtils.newInstance(clazz, smile.get(0));
		
		length = 0;
		timer = new Timer();
		for (byte[] bites : smile) {
			Context ctx = timer.time();
			POMUtils.newInstance(clazz, bites);
			ctx.stop();
			length += bites.length;
		}
		
		avg = length / timer.getCount();
		System.out.printf("SMILE Parse: %s,  %s/s %sns/doc %s bites/doc\n", timer.getCount(), timer.getMeanRate(), timer.getSnapshot().getMean(), avg);
	}
}
