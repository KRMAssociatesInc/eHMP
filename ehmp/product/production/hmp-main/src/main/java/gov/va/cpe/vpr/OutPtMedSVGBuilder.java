package gov.va.cpe.vpr;

import gov.va.cpe.vpr.util.SVGBuilder;
import gov.va.hmp.healthtime.HealthTimePrinterSet;
import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.PointInTime;
import org.joda.time.Period;
import org.joda.time.PeriodType;

import java.util.Locale;

public class OutPtMedSVGBuilder extends SVGBuilder {

    private static final int DAYS_OF_HIGH_IMPORTANCE = 60;
    private static final int DAYS_OF_MEDIUM_IMPORTANCE = 180;
    private static final int MIN_RENDER_SIZE = 5;
    private static final int HEIGHT_FOR_ORDER = 31;
    private static final int HEIGHT_BETWEEN = 2;
    private static final int HEIGHT_FOR_FILL = 40 - HEIGHT_FOR_ORDER - HEIGHT_BETWEEN;
	private int showDays;
	private PointInTime to;
	private PointInTime from;
	
	/**
	 * Generates a SVG background with hour-ticks, day shadows, etc. using a simple geometry
	 */
	public OutPtMedSVGBuilder(PointInTime from, PointInTime to, int showDays, int svgHeight, int svgWidth) {
		super(svgHeight, svgWidth, null);
		this.from = from;
		this.to = to;
		this.showDays = showDays;
	}
	
	public OutPtMedSVGBuilder drawTherapy(DrugTherapy dt, HealthTimePrinterSet dateTimePrinters) {
		Medication primary = dt.getPrimary();
		if (!primary.isOutPatient()) return null; // only can handle outpatient meds for now
		if (primary.isSupply() || primary.isIMO()) return null; // dont graph supplies or IMO meds

		Float[] range = dt.calcDoseRange();
		float minddd = 0, maxddd = 100; // default for no daily dose (like BID, PRN, etc.)
		if (range[0] != null && range[1] != null) {
			maxddd = range[1];
			minddd = range[0];
		} else if (range[2] != null && range[3] != null) {
			maxddd = range[3];
			minddd = range[2];
		}
		
		this.geometry = new DefaultGeomoetry(from, to, showDays, this.height, this.width, minddd, maxddd);

        // first loop through and show orders
		this.comment("orders");
		String orderStr = "<table class='hmp-labeled-values'><tr><td>Dose</td><td>%s</td></tr><tr><td>Status</td><td><span style='color: %s'>%s</span></td></tr></table><pre>%s</pre>";

		String prevHint = null;
		String prevTitle = null;
		Medication prevMed = null;
		IntervalOfTime prevInterval = null;
        for (Medication med : dt.getMeds()) {

//            if (!MedStatus.statusOf(med).memberOfInterest()) continue;    // skip if med is not in status of interest
        	
        	// detect if there is overlap with the previous med
        	int overlapDays = 0;
        	IntervalOfTime overlapInterval = null;
        	IntervalOfTime interval = new IntervalOfTime(med.getOverallStart(), med.getOverallStop(), true);
        	if (prevMed != null && prevInterval != null && prevMed.isBetween(med.getOverallStart(), med.getOverallStop())) {
        		overlapInterval = interval.intersection(prevInterval);
        		Period overlapPeriod = overlapInterval.toPeriod(PeriodType.days());
        		overlapDays = overlapPeriod.getDays();
        	}
    		prevInterval = interval;
    		prevMed = med;
    		
    		// get dose value (total daily if available)
			String doseStr = med.getDoseString();
			Number dd = med.getDailyDose();
			if (dd == null) {
				dd = med.getDoseVal();
			} else {
                if (!Medication.SEE_DETAIL.equalsIgnoreCase(doseStr)) {
				    doseStr += " (" + dd + " " + med.getUnits() + " ";
				    doseStr += (med.isPRN() ? "Max daily " : "Total daily");
				    doseStr += ")";
                }
			}

			// figure out color/styling for each order
			String color = "";
			String style = "";
			if (dd == null) {
				// could not get an exact dose, just show a bar indicating an order
				dd = maxddd;
				style += " fill: url(#slashes); ";
			}

			// different colors for different order status'
			if (med.isActive() || med.isPending() || med.getVaStatus().equals("SUSPEND") || med.getVaStatus().equals("HOLD")) {
				color = "#468847"; // Bootstrap $successText
			} else if (med.isExpired()) {
				color = "#c09853"; // Bootstrap $warningText
			} else if (med.isDiscontinued()) {
                color = "#b94a48"; // Bootstrap $errorText
            } else { // Pending, Suspend, Hold
                color = "#0000FF";
            }


			if (color != null) {
				style += " stroke: " + color + "; fill: " + color + "; ";
			}

            // first draw a rectangle for overall start/stop
			String id = "svg-order-" + med.getUid();
			String startDTM = dateTimePrinters.date().print(med.getOverallStart(), Locale.getDefault());
			String stopDTM = dateTimePrinters.date().print(med.getOverallStop(), Locale.getDefault());
			String hint = String.format(orderStr, doseStr, color, med.getVaStatus(), med.getSummary());
			String title = "<span class='text-muted'>Start/Stop</span>&nbsp;" + startDTM + "&nbsp;-&nbsp;" + stopDTM;
			
			int width = Math.max(MIN_RENDER_SIZE, this.calcWidth(med.getOverallStart(), med.getOverallStop()));
            int y = this.calcY(dd.floatValue());
            int height = Math.max(MIN_RENDER_SIZE, this.getCanvasHeight() - y);
            height -= (HEIGHT_FOR_FILL + HEIGHT_BETWEEN);
            if (height < MIN_RENDER_SIZE) {
                height = MIN_RENDER_SIZE;
                y =  y + height > HEIGHT_FOR_ORDER ? HEIGHT_FOR_ORDER-MIN_RENDER_SIZE :  y + height;
            }
			this.rect(this.calcX(med.getOverallStart()), width, y, height, null, style, id)
				.attr("data-target", "med-listing-" + med.getUid())
				.attr("data-qtip", hint)
				.attr("data-qwidth", 600)
				.attr("data-qtitle", title)
				.attr("class", "order-bar");
			
			// if there are overlaps, show a masking bar and then a gradient fill box
			if (overlapDays > 7 && overlapInterval != null) {
				rect(overlapInterval.getLow(), overlapInterval.getHigh(), 3, this.height-5)
					.attr("y", 0)
					.attr("class", "masking-bar");
				rect(overlapInterval.getLow(), overlapInterval.getHigh(), 3, this.height-5)
					.attr("y", 0)
					.attr("class", "multi-order-bar")
					.attr("data-qtip", prevTitle + prevHint + title + hint)
					.attr("data-qwidth", 600)
					.attr("data-qtitle", "Multiple Order Overlap");
			}
			
			prevTitle = title;
			prevHint = hint;
        }

		// then loop through and show fills
		this.comment("fills");
		String dispenseStr = "On: %s <br>Dispensed: %sd supply";

        for (Medication med : dt.getMeds()) {

//            if (!MedStatus.statusOf(med).memberOfInterest()) continue;    // skip if med is not in status of interest

            String id = "med-listing-" + med.getUid();
			PointInTime prev = med.getOverallStart();
            boolean firstFill = true;
            String prevFillStr = "";
			for (MedicationFill fill : med.getFills()) {
				PointInTime dtm = (fill.getReleaseDate() == null) ? fill.getDispenseDate() : fill.getReleaseDate();
				if (dtm == null) continue;

				// draw a rect for a gap (if any)
				if (prev != null) {
					int gap = daysBetween(prev, dtm);
                    //LOGGER.debug("\t\t gap = " + gap + ", " + " (" + formatDate(prev) + " ~ " + formatDate(dtm) + ")");
					if (gap >= 3) {
//						this.rect(prev, dd.floatValue(), gap, "gap: " + gap + "d", "stroke-width: 0; fill: url(#gap); fill-opacity: 0.5;");
						int x1 = this.calcX(prev);
						int x2 = this.calcX(dtm);
						this.rect(x1, x2-x1, this.getCanvasHeight() - HEIGHT_FOR_FILL, HEIGHT_FOR_FILL, null, "fill: white; stroke: white;", null)
                              .attr("data-target", id)
                              .attr("data-qtip", "gap: " + gap + "d")
                              .attr("data-qwidth", 360);
					}
				}

				// draw a rect for the fill
                String fillDTM = dateTimePrinters.date().print(dtm, Locale.getDefault());
				String title = String.format(dispenseStr, fillDTM, fill.getDaysSupplyDispensed());
                PointInTime fillEndTm = dtm.addDays(fill.getDaysSupplyDispensed());
//				this.rect(fill.getReleaseDate(), dd.floatValue(), fill.getDaysSupplyDispensed(), title, "fill-opacity: .75");
                int fillHeight =  HEIGHT_FOR_FILL;
                int y = this.getCanvasHeight()- HEIGHT_FOR_FILL;
                String fillColor = " stroke: grey; fill: grey; ";
                int x1 = this.calcX(dtm);
                int x2 = this.calcX(fillEndTm);
                this.rect(x1,  Math.max(MIN_RENDER_SIZE, x2-x1), y, fillHeight, null, fillColor, "svg-fill-" + fill.getUid())
                      .attr("data-target", id)
                      .attr("data-qtip", title)
                      .attr("data-qwidth", 360);

                // draw overlap if exists
                if (!firstFill && prev != null && dtm.before(prev.subtractDays(1))) {   // before return true when comparing two same days ...
                    // calculate which comes first, end of last fill or end of cur fill
                    int overlapDays = daysBetween(dtm, fillEndTm.after(prev) ? prev : fillEndTm);
                    int x3 =  Math.min(this.calcX(prev), x2);
                    fillColor = " stroke: black; fill: black; ";
                    this.rect(x1, Math.max(MIN_RENDER_SIZE, x3-x1), y, fillHeight, null, fillColor, null)
                          .attr("data-target", id)
                          .attr("data-qtip", "Overlap: " + overlapDays + " days<br><pre>" + prevFillStr + "</pre><pre>" + title + "</pre>")
                          .attr("data-qwidth", 360);
                }

                prev = fill.getFillDepleatedDate();
                firstFill = false;
                prevFillStr = title;
            }
        }

        this.drawYearLines();
		return this;
	}
	
}
