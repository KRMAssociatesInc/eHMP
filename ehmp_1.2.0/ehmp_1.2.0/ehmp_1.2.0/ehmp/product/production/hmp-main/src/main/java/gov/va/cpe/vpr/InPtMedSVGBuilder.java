package gov.va.cpe.vpr;

import gov.va.cpe.vpr.util.SVGBuilder;
import gov.va.hmp.healthtime.HealthTimePrinterSet;
import gov.va.hmp.healthtime.PointInTime;

import org.joda.time.Hours;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Ideas/things to try/do:
 * TODO: onmousemove hint with ruler/line?  Shows the day/hour at index
 * TODO:  Different colors for HELD/etc?
 * TODO: If multiple doses fall in the same hour, need to change the display
 * TODO: Multiple meds per administration, display does not account for them very well.
 * TODO: By default far right is NOW+4H, should we have a red line that indicates now?
 * TODO: Maybe MedsPanel could have a periodic task that updates all dates (4m ago -> 5m ago), could move the red line indicating now
 * 
 * @author brian
 *
 */
public class InPtMedSVGBuilder extends SVGBuilder {
	private PointInTime to, from;
	private int showHours;
	private int svgHeight;
	private int svgWidth;

	/**
	 * Generates a SVG background with hour-ticks, day shadows, etc. using a simple geometry
	 */
	public InPtMedSVGBuilder(PointInTime from, PointInTime to, int svgHeight, int svgWidth) {
		super(svgHeight, svgWidth, new InpatientGeometry(from, to, 24, svgHeight, svgWidth, true));
		this.to = to;
		this.from = from;
		this.showHours = ((InpatientGeometry) getGeometry()).getShowHours();
		this.svgHeight = svgHeight;
		this.svgWidth = svgWidth;
		
		// Initialize the drawing...
		drawBackground();
	}
	
	/**
	 * Responsible for drawing the background of the canvas based on from/to height/width etc.
	 * Draws tick marks, hour indicators, day boundaries, etc. 
	 */
	protected void drawBackground() {
		PointInTime dayEnd = to;
		PointInTime dayStart = new PointInTime(to.getYear(), to.getMonth(), to.getDate());
		String fill = "#EFEFEF";
		List<SVGText> buff = new ArrayList<>();
		
		// first draw the rects per day, alternating colors, buffer the textual day indicators to get the top z-order
		comment("rectangles for day boundaries, altering between white and grey");
		while (dayEnd.after(from)) {
			rect(dayStart, dayEnd, 0, svgHeight)
				.attr("style", "stroke: black; stroke-width: .5px; fill: " + fill);
			
			// 2 small date indicators at midnight
			PointInTime yday = dayStart.subtractDays(1);
			if (dayStart.after(from)) {
				buff.add(new SVGText(yday.getMonth() + "/" + yday.getDate())
					.attr("x", calcX(dayStart))
					.attr("y", calcY(svgHeight - 10))
					.attr("dx", -5)
					.attr("style", "text-anchor: end; font-size: 8pt; font-weight: bold;"));
				buff.add(new SVGText(dayStart.getMonth() + "/" + dayStart.getDate())
					.attr("x", calcX(dayStart))
					.attr("y", calcY(svgHeight - 10))
					.attr("dx", 5)
					.attr("style", "text-anchor: start; font-size: 8pt; font-weight: bold;"));
			}
			
			// alter colors, dont draw before the from date
			dayStart = yday;
			dayEnd = yday.toPointInTimeAtMidnight();
			if (dayStart.promote().getLow().before(from)) dayStart = from; 			
			fill = (fill.startsWith("#EFEFEF")) ? "#FFFFFF;" : "#EFEFEF;";
		}
		addAll(buff);
		
		/*
		 * Draw hourly tick marks based on how many days are in perspective, 
		 * also increase the height of the tick marks proportionally
		 * at the top put a corresponding digit identifier
		 * 
		 * start at the next even hour and work backwards
		 */
		comment("hour-based tick marks");
		
		PointInTime pit = toHourPrecision(to);
		if (pit.getHour() % 2 == 1) pit = pit.addHours(1);
		dayStart = new PointInTime(to.getYear(), to.getMonth(), to.getDate());
		int inc = Math.round(showHours / 24);
		while (pit.after(from)) {
			int hour = pit.getHour();
			if (hour != 0) {
				int height = 3;
				if (hour == 6 || hour == 12 || hour == 18) {
					height = (hour == 12) ? 10 : 5; // line height 
					
					// corresponding top identifier (ie 8pm, 4am, etc)
					String ampm = (hour >= 12) ? "pm" : "am";
					text(pit, svgHeight - 10, ((hour > 12) ? hour-12 : hour) + ampm)
						.attr("style", "text-anchor: middle; font-size: 6pt;");
				}
				
				// create a line with a title element for hover hints
				line(pit, pit, 0, height*inc)
					.attr("style", "stroke: black; stroke-width: .5px;")
					.addChild(new SVGElem<>("title").setBody(pit.toString()));

			}
			pit = pit.subtractHours(inc);
		}
	}
	
	/** 
	 * draws the actual dose admin history on the pre-layed out canvas
	 * Changes the geometry to one based on the min/max dose levels
	 * 
	 * TODO: Multiple doses in same hour need different indicator
	 * */
	public InPtMedSVGBuilder drawTherapy(DrugTherapy t, HealthTimePrinterSet dateTimePrinterSet) {
		
		// determine min/max dose for period and update the geometry 
		Float[] range = t.calcDoseRange();
		Float mindose=range[2], maxdose=range[3];
		
		// if no min/max can be computed? then min/max == 1
		if (mindose == null || maxdose == null) {
			mindose = maxdose = 1.0f;
		}
		
		// also ensure that min/max are not identical, if so make min/max the middle
		if (mindose.equals(maxdose)) {
			maxdose += (maxdose/2);
			mindose -= (mindose/2);
		} else {
			// ensure that there is 25% padding, so mindose isn't 0 height
			maxdose += (maxdose*.25f);
			mindose -= (mindose*.25f);
		}
		((InpatientGeometry) this.geometry).setYMinMax(mindose, maxdose);
		
		comment("dose administrations");
		for (MedicationAdministration dose : t.getAllAdmins()) {
			
			PointInTime doseHour = dose.getDateTime();
			doseHour = toHourPrecision(doseHour);
			// if we are past our start range, quit
			if (doseHour.before(from)) break;
			
			// skip graphing doses that are not actually administered
			if (!dose.isGiven()) continue;

			// draw the rectangle representing the dose size
			// if dose val does not exist, draw a large shaded box
			String style = "";
			Number doseVal = dose.getMed().getDoseVal();
			if (doseVal == null) {
				doseVal = maxdose/2;
				style += "fill: url(#slashes);";
			}
			
			// generate the display string/hover hint
			// TODO: this needs a lot of work/cleanup/testing....
			String doseFmt = "";
			String name = "";
			for (MedicationAdministrationMed medAdminMed : dose.getMedications()) {
				name = medAdminMed.getName();
				doseFmt += String.format("%s %s", medAdminMed.getAmount(), medAdminMed.getUnits());
			}
			String disp = String.format("Medication: %s\nStatus: %s\nUnits Given: %s \nGiven By: %s \nDate: %s \n",
                    name, dose.getStatus(), doseFmt, dose.getAdministeredByName(),
                    dateTimePrinterSet.dateTime().print(dose.getDateTime(), Locale.getDefault()));
			
			// draw the dose rectangle
			rect(doseHour, doseHour, mindose, doseVal.floatValue())
				.attr("style", style)
				.addChild(new SVGElem<>("title").setBody(disp));
			
			// then draw the visual indicator of status (given, withheld, etc.)
			/* removed for now per discussion
			text(doseHour, doseVal.floatValue(), dose.getStatus().substring(0, 1))
				.attr("dx", 5)
				.attr("class", "badge")
				.attr("style", "writing-mode: tb; glyph-orientation-vertical: 0; font-size: 6pt;");
			*/
		}
		
		
		// graph the next scheduled admin as a hollow placeholder bar
		/* TODO: This is not ready to show until we can get this data from BCMA
		PointInTime next = t.getPrimary().calcNextScheduledAdminFrom(this.to);
		Number doseVal = t.getPrimary().getDoseVal();
		if (next != null && doseVal != null) {
			// convert to only have hour precision
			next = toHourPrecision(next);
			rect(next, next, mindose, doseVal.floatValue())
				.attr("style", "fill: none; stroke-dasharray: 3px;")
				.addChild(new SVGElem<>("title").setBody("Next Scheduled Admin: " + DrugTherapy.formatDateTime(next)));
			
		}
		*/
		
		return this;
	}
	
	private static PointInTime toHourPrecision(PointInTime pit) {
		return new PointInTime(pit.getYear(), pit.getMonth(), pit.getDate(), pit.getHour());
	}
	
	/**
	 * Defines a geometry with x=0,y=0 at the lower left corner, intended for hour-ish resolution with NO y-scaling.
	 * 
	 * <p>{@link #calcWidth(PointInTime, PointInTime)} returns the maximum difference when given imprecise times</p>
	 * 
	 * <p>{@link #calcX(PointInTime)} can be set to return upper or lower bounded results for imprecise times</p>
	 * 
	 * @author brian
	 */
	public static class InpatientGeometry implements SVGGeometry {
		protected int height, width, showHours;
		protected PointInTime from, to;
		protected int canvasWidth, pixelsPerHour;
		private boolean lowerBounded;
		private float yMin, yMax, yRange;

		public InpatientGeometry(PointInTime from, PointInTime to, int showHours,
				int height, int width, boolean lowerBounded) {
			this.height = height;
			this.width = width;
			this.from = from;
			this.to = to;
			this.lowerBounded = lowerBounded;
			this.showHours = showHours;
			this.pixelsPerHour = Math.max(1, Math.round(width / showHours));
			this.canvasWidth = Math.round(hoursBetween(this.from, this.to) * this.pixelsPerHour);
			this.yMin = 0;
			this.yMax = this.height;
			this.yRange = this.yMax - this.yMin;
		}
		
		/* for the purposes of this geometry, we want to compute the max possible hour difference for imprecise dates/time */
		public static int hoursBetween(PointInTime pit1, PointInTime pit2) {
			return Hours.hoursBetween(pit1.promote().getLow(), pit2.promote().getHigh()).getHours();
		}
		
		private PointInTime getBounded(PointInTime pit) {
			if (lowerBounded) {
				return pit.promote().getLow();
			}
			return pit.promote().getHigh();
		}
		
		public void setYMinMax(float min, float max) {
			this.yMin = min;
			this.yMax = max;
			this.yRange = yMax - yMin;
		}
		
		@Override
		public int calcX(PointInTime pit) {
//			if (pit.before(from) || pit.after(to)) throw new IllegalArgumentException("Outside from-to canvas range.");
			return hoursBetween(this.from, getBounded(pit)) * pixelsPerHour;
		}
		
		public int getPixelsPerHour() {
			return pixelsPerHour;
		}
		
		public int getShowHours() {
			return showHours;
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
			return hoursBetween(x1, x2) * pixelsPerHour;
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
