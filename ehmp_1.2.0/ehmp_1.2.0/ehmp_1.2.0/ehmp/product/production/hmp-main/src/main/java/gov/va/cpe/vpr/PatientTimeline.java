package gov.va.cpe.vpr;

import gov.va.cpe.vpr.util.SVGBuilder;
import gov.va.hmp.healthtime.PointInTime;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.joda.time.Months;

public class PatientTimeline extends SVGBuilder {
	
	private Map<PointInTime, Map<String, Integer>> idx = new HashMap<PointInTime, Map<String, Integer>>();
	private Map<PointInTime, AtomicInteger> scores = new HashMap<>();
	private PointInTime start;
	private PointInTime end;
	
	public PatientTimeline(int yearsBack, int height, int width) {
		super(height, width, new TimelineGeometry(PointInTime.today().subtractYears(yearsBack), PointInTime.today(), height, width, yearsBack));
	}
	
	public void addObject(PointInTime dtm, String uid, int score) {
		if (dtm == null || !dtm.isMonthSet()) return; // skip
		
		dtm = new PointInTime(dtm.getYear(), dtm.getMonth(), 1);
		if (start == null || dtm.before(start)) {
			start = dtm;
		}
		if (end == null || dtm.after(end)) {
			end = dtm;
		}
		
		if (!idx.containsKey(dtm)) {
			idx.put(dtm, new HashMap<String, Integer>());
			scores.put(dtm, new AtomicInteger(0));
		}
		idx.get(dtm).put(uid, score);	
		scores.get(dtm).addAndGet(score);
	}

	public String buildSVG() {
		// no SVG to generate if there is no data....
		if (start == null || end == null) return "";
		
		// first sort the list of periods
		List<PointInTime> periods = new ArrayList<>(idx.keySet());
		Collections.sort(periods);
		
		// highlight zone, will be manipulated later by grid scroll
		SVGRect rect = rect(end.subtractMonths(3), PointInTime.today(), 0, getCanvasHeight())
			.attr("style", "fill: #A7CBFF; fill-opacity: 0.25; stroke-width: 0;")
			.attr("Xs", getGeometry().getFrom().toString())
			.attr("Xe", getGeometry().getTo().toString())
			.attr("Xw", getGeometry().getCanvasWidth())
			.attr("id", "pt-timeline-highlight");

		// compute previous and next windows and include as special attributes
		PointInTime prevYear = getGeometry().getFrom().subtractYears(1);
		PointInTime nextYear = getGeometry().getTo().addYears(1);
		rect.attr("Xprev", prevYear.toString() + ".." + getGeometry().getTo().subtractYears(1));
		rect.attr("Xnext", getGeometry().getFrom().addYears(1) + ".." + nextYear.toString());
		
		// for each month period
		for (PointInTime periodStart : periods) {
			PointInTime periodEnd = periodStart.addMonths(1);
			
			// sum + title
			int sum = scores.get(periodStart).get();
			long y = 5 + Math.round(Math.log(sum) * 2);
			
			// rectangle to represent the score of the activity that month
			rect(periodStart, periodEnd, 0, y)
				.attr("class", "bar hmp-visit")
				.attr("x-start", periodStart)
				.attr("x-end", periodEnd)
				.attr("x-score", sum);
			
			
			// rectangle for hover area + hint
			rect(periodStart, periodEnd, 0, getCanvasHeight())
				.attr("class", "placeholder")
				.attr("x-start", periodStart.toString())
				.addChild(new SVGElem("title").setBody("Score: " + sum));
			
		}
		
		// now generate the year lines
		setID("svg-timeline").drawYearLines();
		
		return toString();
	}
	
	/**
	 * Geometry where x=0,y=0 is in lower left. Y-scaling is logarithmic, intended to display bars by month
	 * @author brian
	 */
	public static class TimelineGeometry implements SVGGeometry {
		protected int height, width;
		protected PointInTime from, to;
		protected int canvasWidth, pixelsPerMonth;
		private float yMin, yMax, yRange;

		public TimelineGeometry(PointInTime from, PointInTime to, int height, int width, int years) {
			this.height = height;
			this.width = width;
			this.from = from;
			this.to = to;
			this.pixelsPerMonth = Math.max(1, Math.round(width / years / 12));
			this.canvasWidth = Math.round(monthsBetween(this.from, this.to) * this.pixelsPerMonth);
			this.yMin = 0;
			this.yMax = this.height;
			this.yRange = this.yMax - this.yMin;
		}
		
		public static int monthsBetween(PointInTime pit1, PointInTime pit2) {
			return Months.monthsBetween(pit1, pit2).getMonths();
		}
		
		public void setYMinMax(float min, float max) {
			this.yMin = min;
			this.yMax = max;
			this.yRange = yMax - yMin;
		}
		
		/*
		public float getEpochPerPixel() {
			long startMS = this.from.toLocalDateTime().toDateTime().getMillis();
			long endMS = this.to.toLocalDateTime().toDateTime().getMillis();
			long diff = endMS - startMS;
		}
		*/
		
		@Override
		public int calcX(PointInTime pit) {
			return monthsBetween(this.from, pit) * pixelsPerMonth;
		}
		
		@Override
		public int calcY(float y) {
			// normalize the Y value to our Y-range
			float normY = getCanvasHeight() * ((y - yMin) / yRange);
			
			// return the inverted value as the SVG coordinate
			return Math.round(height - normY);
		}

		@Override
		public int calcWidth(PointInTime x1, PointInTime x2) {
			return monthsBetween(x1, x2) * pixelsPerMonth;
		}
		
		@Override
		public int calcHeight(float y1, float y2) {
			return (calcY(y2) - calcY(y1));
		}
		
		@Override
		public int getCanvasHeight() {
			return this.height;
		}

		public int getCanvasWidth() {
			return canvasWidth;
		}
		
		public PointInTime getFrom() {
			return this.from;
		}
		
		public PointInTime getTo() {
			return this.to;
		}
		
	}
}
