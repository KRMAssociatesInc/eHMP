package gov.va.cpe.vpr.util;

import static org.junit.Assert.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.junit.Test;
import org.junit.Ignore;

import com.codahale.metrics.Metric;
import com.codahale.metrics.Timer;

public class FacetTimerTests {
	
	@Test
	@Ignore("Intermittently failing unit test")
	public void test() throws InterruptedException {
		FacetedTimer timer = new FacetedTimer();
		
		// test start conditions
		assertEquals(0, timer.getRuntimeSum());
		assertEquals(0, timer.getRuntimeLast());
		
		// run the timer 10x10x, each time should be 10ms, totalling 100ms at the end.
		for (int i=0; i < 10; i++) {
			for (int j=0; j < 10; j++) {
				FacetedTimer.Context ctx = timer.time("" + i);
				Thread.sleep(10);
				ctx.stop();
			}
		}
		assertEquals(timer.getRuntimeLast(), System.currentTimeMillis(), 5);
		assertEquals(100, timer.getCount());
		assertEquals(1000, timer.getRuntimeSum(), 100);
		
		// verify Facets each ran 10x
		Map<String, Metric> map = timer.getMetrics();
		for (int i=0; i < 10; i++) {
			String key = "" + i;
			assertTrue(map.containsKey(key));
			assertTrue(map.get(key) instanceof Timer);
			Timer t = (Timer) map.get(key);
			assertEquals(10, t.getCount());
		}
	}

	@Test
	@Ignore("Intermittently failing unit test")
	public void testFacetHierarchy() throws InterruptedException {
		List<String> patients = Arrays.asList("1", "2","3");
		List<String> domains = Arrays.asList("med", "lab", "doc");
		FacetedTimer timer = new FacetedTimer();
		
		// loop through each patient/domain combo
		for (String pid : patients) {
			for (String domain : domains) {
				FacetedTimer.Context ctx = timer.time(pid, domain);
				Thread.sleep(10);
				ctx.stop();
			}
		}
		
		// overall counts 3x3=9 runs for 90ms
		assertEquals(9, timer.getCount());
		assertEquals(90, timer.getRuntimeSum(), 10);
		
		// overall for each patient 3 runs for 30ms
		Map<String, Metric> map = timer.getMetrics();
		for (String pid : patients) {
			assertTrue(map.containsKey(pid));
			FacetedTimer pidtimer = (FacetedTimer) map.get(pid);
			assertEquals(3, pidtimer.getCount());
			assertEquals(30, pidtimer.getRuntimeSum(), 5);
			
			// each pid/domain ran once, for 10ms
			Map<String, Metric> pidmap = pidtimer.getMetrics();
			for (String domain : domains) {
				assertTrue(pidmap.containsKey(domain));
				FacetedTimer domaintimer = (FacetedTimer) pidmap.get(domain);
				assertEquals(1, domaintimer.getCount());
				assertEquals(10, domaintimer.getRuntimeSum(), 2);
			}
		}
	}
}
