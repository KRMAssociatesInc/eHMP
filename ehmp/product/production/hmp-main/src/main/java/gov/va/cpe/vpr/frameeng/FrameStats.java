package gov.va.cpe.vpr.frameeng;

import com.codahale.metrics.Timer;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * A small enhancement to the timer to track some extra frame stuff
 * 
 * @author brian
 */
public class FrameStats extends Timer {
	private AtomicInteger errorCount = new AtomicInteger();
	private AtomicLong errorLastAt = new AtomicLong();
	private Exception errorLast;
	private AtomicLong lastRunAt = new AtomicLong();
	private AtomicLong runSumMS = new AtomicLong();
	
	public void error(Exception ex) {
		errorLast = ex;
		errorCount.incrementAndGet();
		errorLastAt.set(System.currentTimeMillis());
	}
	
	@Override
	public void update(long duration, TimeUnit unit) {
		super.update(duration, unit);
		lastRunAt.set(System.currentTimeMillis());
		runSumMS.addAndGet(unit.toMillis(duration));
	}
	
	/** Returns the sum total of the time this frame has run */
	public long getRuntimeSum() {
		return runSumMS.get();
	}
	
	/** Returns the last time this frame was run, or zero for never */
	public long getLastRuntimeAt() {
		return lastRunAt.get();
	}
	
	/** Returns the last time this frame encountered an error, or zero for never */
	public long getLastErrorAt() {
		return errorLastAt.get();
	}
	
	/** Returns the last exception encountered by this frame, or null for none */
	public Exception getLastError() {
		return errorLast;
	}
	
	/** Returns the number of errors encountered by this frame, defaults to zero */
	public int getErrorCount() {
		return errorCount.get();
	}
	
	public void reset() {
		/** TODO: Not possible yet...
		ERROR_COUNT =  new AtomicInteger();
		LAST_ERROR = new AtomicLong();
		LAST_RUN = new AtomicLong();
		RUNTIME_SUM_MS = new AtomicLong();
		LAST_ERROR_MSG = null;
		*/
	}
}