package gov.va.cpe.vpr.util;

import com.codahale.metrics.Metric;
import com.codahale.metrics.Timer;

import java.io.Closeable;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

/**
 * An extension of Timer that includes total (sum) and last runtime information.  
 * 
 * Additionally supports hierarchical facets via time(String...) 
 */
public class FacetedTimer extends Timer {
	private AtomicLong lastRunAt = new AtomicLong();
	private AtomicLong runSumMS = new AtomicLong();
	private ConcurrentMap<String, FacetedTimer> map = new ConcurrentHashMap<String, FacetedTimer>();
	
    public static class Context implements Closeable {
		private Timer.Context ctx;
		private FacetedTimer[] timers;
    	
        private Context(FacetedTimer[] timers, Timer.Context ctx) {
        	super();
        	this.ctx = ctx;
        	this.timers = timers.clone();
        }

        /**
         * Stops recording the elapsed time, updates the timer and returns the elapsed time in
         * nanoseconds.
         */
        public long stop() {
        	final long elapsed = ctx.stop();
        	for (FacetedTimer timer : timers) {
        		timer.update(elapsed, TimeUnit.NANOSECONDS);
        	}
            return elapsed;
        }

        @Override
        public void close() {
            stop();
        }
    }
    
    public FacetedTimer getFacetTimer(String... facets) {
    	assert facets != null && facets.length >= 1;
    	String facet = facets[0];
    	
    	// create the sub timer if not present
    	if (!map.containsKey(facet)) map.putIfAbsent(facet, new FacetedTimer());

    	FacetedTimer ret = map.get(facet);
    	if (facets.length > 1) {
    		return ret.getFacetTimer(Arrays.copyOfRange(facets, 1, facets.length));
    	}
    	return ret;
    }
    
	@Override
	public void update(long duration, TimeUnit unit) {
		update(duration, unit, (String[]) null);
	}
	
	public void update(long duration, TimeUnit unit, String... facet) {
		super.update(duration, unit);
		lastRunAt.set(System.currentTimeMillis());
		runSumMS.addAndGet(unit.toMillis(duration));
		if (facet != null) {
			getFacetTimer(facet).update(duration, unit);
		}
	}
	
	/** Returns the sum total of the time this frame has run */
	public long getRuntimeSum() {
		return runSumMS.get();
	}
	
	/** Returns the last time this frame was run, or zero for never */
	public long getRuntimeLast() {
		return lastRunAt.get();
	}
	
	/**
	 * @param facet
	 * @return
	 */
    public Context time(String... facets) {
    	Timer.Context ctx = time();
    	FacetedTimer[] timers = new FacetedTimer[facets.length];
    	for (int i=0; i < timers.length; i++) {
    		timers[i] = getFacetTimer(Arrays.copyOf(facets, i+1));
    	}
    	return new Context(timers, ctx);
    }
    
	public Map<String, Metric> getMetrics() {
		Map<String, Metric> ret = new HashMap<String, Metric>();
		ret.putAll(map);
		return ret;
	}
}
