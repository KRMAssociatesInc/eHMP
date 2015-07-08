package gov.va.cpe.vpr.sync.util;

import com.codahale.metrics.*;
import gov.va.cpe.vpr.util.FacetedTimer;

import java.io.*;
import java.nio.charset.Charset;
import java.util.Locale;
import java.util.Map;
import java.util.SortedMap;
import java.util.concurrent.TimeUnit;

public class CSVReporter extends ScheduledReporter {
	private static final Charset UTF_8 = Charset.forName("UTF-8");
	
	private Clock clock = Clock.defaultClock();
    private final File file;
    private final Locale locale = Locale.getDefault();
	
    CSVReporter(MetricRegistry registry,
            File file,
            TimeUnit rateUnit,
            TimeUnit durationUnit,
            MetricFilter filter) {
			super(registry, "csv-reporter", filter, rateUnit, durationUnit);
			this.file = file;
	}

	public void report(SortedMap<String, Gauge> gauges,
			SortedMap<String, Counter> counters,
			SortedMap<String, Histogram> histograms,
			SortedMap<String, Meter> meters, SortedMap<String, Timer> timers) {
		final long timestamp = TimeUnit.MILLISECONDS.toSeconds(clock.getTime());
		try {
	        for (Map.Entry<String, Timer> entry : timers.entrySet()) {
	        	reportTimer(timestamp, entry.getKey(), null, entry.getValue());
	        }
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
	
    private void reportTimer(long timestamp, String name, String facet, Timer timer) throws Exception {
        final Snapshot snapshot = timer.getSnapshot();
        
        report(timestamp,
               name,
               "name,facet,count,sum,max,mean,min,stddev,p50,p75,p95,p98,p99,p999,mean_rate,m1_rate,m5_rate,m15_rate,rate_unit,duration_unit",
               "%s,%s,%d,%d,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,calls/%s,%s",
               name,
               facet,
               timer.getCount(),
               (timer instanceof FacetedTimer) ? ((FacetedTimer) timer).getRuntimeSum() : -1,
               convertDuration(snapshot.getMax()),
               convertDuration(snapshot.getMean()),
               convertDuration(snapshot.getMin()),
               convertDuration(snapshot.getStdDev()),
               convertDuration(snapshot.getMedian()),
               convertDuration(snapshot.get75thPercentile()),
               convertDuration(snapshot.get95thPercentile()),
               convertDuration(snapshot.get98thPercentile()),
               convertDuration(snapshot.get99thPercentile()),
               convertDuration(snapshot.get999thPercentile()),
               convertRate(timer.getMeanRate()),
               convertRate(timer.getOneMinuteRate()),
               convertRate(timer.getFiveMinuteRate()),
               convertRate(timer.getFifteenMinuteRate()),
               getRateUnit(),
               getDurationUnit());
        
        if (timer instanceof FacetedTimer) {
        	Map<String, Metric> map = ((FacetedTimer) timer).getMetrics();
        	for (String key : map.keySet()) {
        		Metric metric = map.get(key);
        		if (metric instanceof FacetedTimer) {
        			String tmp = (facet != null) ? facet + "/" : "";
        			reportTimer(timestamp, name, tmp + key, (Timer) metric);
        		}
        	}
        }


    }
	
    private void report(long timestamp, String name, String header, String line, Object... values) throws IOException {
        final boolean fileAlreadyExists = file.exists();
        if (fileAlreadyExists || file.createNewFile()) {
            final PrintWriter out = new PrintWriter(new OutputStreamWriter(new FileOutputStream(file,true), UTF_8));
            try {
                if (!fileAlreadyExists) {
                    out.println("t," + header);
                }
                out.printf(locale, String.format(locale, "%d,%s%n", timestamp, line), values);
            } finally {
                out.close();
            }
        }
    }
	
}