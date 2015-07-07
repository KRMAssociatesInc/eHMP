package gov.va.cpe.vpr.util;

import gov.va.hmp.healthtime.PointInTime;

import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.joda.time.Days;

import java.io.File;
import java.io.FileReader;
import java.io.StringWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Basic tool for building SVG graphics. Ultimately probably redundant with
 * something like Batik, but more simple for now, helps as a learning curve if you
 * are new to SVG.
 * 
 * Closer to an HTML builder or a small DSL than a full SVG API.
 * 
 * TODO: How to have more than one template file? 
 * TODO: investigate having a separate geometry object, so we can swap in different coordinate space calculations (ie if we do 'hotspots', etc.) 
 * -- The thinking is, it would translate user values (pointintime,yVals, etc) into pixels 
 * -- and all of the SVGElem objects would only deal with raw pixel values 
 * -- TODO: first use case? Med graphs need to ignore the bottom 5px when calculating y position...
 * 
 * @author brian
 */
public class SVGBuilder {
	protected int width;
	protected int height;
	private ArrayList<SVGElem<?>> elements = new ArrayList<SVGElem<?>>();
	private String id;
	
	protected SVGGeometry geometry;

	public SVGBuilder(PointInTime from, PointInTime to, int showDays,
			int height, int width, float yMin, float yMax) {
		this.geometry = new DefaultGeomoetry(from, to, showDays, height, width, yMin, yMax);
		this.height = height;
		this.width = width;
	}
	
	public SVGBuilder(int height, int width, SVGGeometry geometry) {		
		this.geometry = geometry;
		this.height = height;
		this.width = width;
	}

	// chaining methods -------------------------------------------------------

	public SVGBuilder setID(String id) {
		this.id = id;
		return this;
	}

	// getters ----------------------------------------------------------------
	public String getID() {
		return id;
	}
	
	public SVGGeometry getGeometry() {
		return geometry;
	}

	public String getViewBoxStart() {
		return (getCanvasWidth() - width) + " 0 " + (width) + " " + height;
	}

	public int getCanvasHeight() {
		return this.height;
	}

	public int getCanvasWidth() {
		return geometry.getCanvasWidth();
	}

	public String getContent() {
		StringBuilder sb = new StringBuilder();
		for (SVGElem<?> e : elements) {
			sb.append(e.toString());
		}

		return sb.toString();
	}

	public <T extends SVGElem<?>> T add(T elem) {
		this.elements.add(elem);
		return elem;
	}
	
	public <T extends SVGElem<?>> void addAll(Collection<T> elems) {
		this.elements.addAll(elems);
	}

	// grouping/misc functions ----------------------------------------

	public SVGComment comment(String comment) {
		return add(new SVGComment(comment));
	}

	public SVGGroup group(String name) {
		return add(this.new SVGGroup(name));
	}

	// draw functions -----------------------------------------------------

	public void drawYearLines() {
		this.comment("year lines and anchored text");
		PointInTime year = new PointInTime(geometry.getFrom().getYear(), 1, 1);
		while (year.before(geometry.getTo())) {
			PointInTime nextYear = new PointInTime(year.getYear() + 1, 1, 1);
			this.text(year.addDays(7), 7, "" + year.getYear(),
					"text-anchor: start; font-size: 6pt;");
			this.verticalLine(year, 0, this.getCanvasHeight())
				.attr("style", "stroke: black; stroke-width: .5px;");
			year = nextYear;
		}
	}

	public void hotspot(PointInTime x1, PointInTime x2, String title, String url) {
		int width = calcWidth(x1, x2);
		SVGGroup a = group("a");
		a.add(rect(
				calcX(x1),
				width,
				0,
				getCanvasHeight(),
				title,
				"fill: red; fill-opacity:.25; cursor: url('/images/icons/magnifying_glass_16x16.png'),crosshair;",
				null));
		a.attr("xlink:href", url);
	}

	/** 
	 * TODO: Does not use the current geometry for the y calulation 
	 * Use line() instead. 
	 **/
	@Deprecated
	public SVGPath verticalLine(PointInTime x, int yStart, int height) {
		SVGPath path = new SVGPath();
		path.addCmd("M " + calcX(x) + "," + yStart + " v " + height);
		return add(path);
	}
	
	public SVGPath line(PointInTime x1, PointInTime x2, int y1, int y2) {
		SVGPath path = new SVGPath();
		path.addCmd("M " + calcX(x1) + "," + calcY(y1) + " L " + calcX(x2) + "," + calcY(y2));
		return add(path);
	}

	/** Note, does not use geometry class for y calculation */
	@Deprecated
	public SVGText text(PointInTime x, int yVal, String text, String style) {
		SVGText txt = new SVGText(text);
		txt.attr("x", calcX(x));
		txt.attr("y", yVal);
		txt.attr("style", style);
		return add(txt);
	}
	
	public SVGText text(PointInTime x, float y, String text) {
		SVGText txt = new SVGText(text);
		txt.attr("x", calcX(x));
		txt.attr("y", calcY(y));
		return add(txt);
	}

	/** old rectangle drawing, does not use the geometry class to compute final x/y coordinates */
	@Deprecated
	public SVGRect rect(int x, int width, int y, int height, String title,
			String style, String id) {
		SVGRect rect = new SVGRect();
		rect.attr("id", id);
		rect.attr("class", "bar");
		rect.attr("x", x);
		rect.attr("y", y);
		rect.attr("width", width);
		rect.attr("height", height);
		rect.attr("title", title);
		rect.attr("style", style);
		return add(rect);
	}
	
	/** new-preferred rectangle drawing, uses the geometry class to compute everything */
	public SVGRect rect(PointInTime x1, PointInTime x2, float y1, float y2) {
		
		int y = calcY(y1);
		int height = geometry.calcHeight(y1, y2);
		
		// if height is negative, need to re-orient the rectangle
		// so that x1/y1 is the top-left instead of bottom-left
		if (height < 0) {
			y = calcY(y2);
			height = Math.abs(height);
		}
		
		SVGRect rect = new SVGRect();
		rect.attr("class", "bar");
		rect.attr("x", calcX(x1));
		rect.attr("y", y);
		rect.attr("width", calcWidth(x1, x2));
		rect.attr("height", height);
		return add(rect);
	}


	public SVGPath path(PointInTime startX, float startY) {
		SVGPath path = new SVGPath().moveTo(startX, startY);
		path.attr("stroke", "black");
		path.attr("fill", "none");
		path.attr("stroke-width", 2);
		return add(path);
	}

	public SVGCirc circ(PointInTime x, float yVal, int r) {
		return add(new SVGCirc(calcX(x), calcY(yVal), r));
	}

	// helper functions ---------------------------------------------------

	public int calcX(PointInTime pit) {
		return geometry.calcX(pit);
	}

	public int calcY(float y) {
		return geometry.calcY(y);
//		return height - Math.round((height - 10) * (y / yMax));
	}

	public int calcWidth(PointInTime x1, PointInTime x2) {
		return geometry.calcWidth(x1, x2);
//		return daysBetween(x1, x2) / daysPerPixel;
	}
	
	@Override
	public String toString() {
		VelocityContext ctx = new VelocityContext();
		ctx.put("svg", this);
		ctx.put("dispWidth", width);
		ctx.put("dispHeight", height);
		URL url = SVGBuilder.class.getResource("svg.vm");
		try (FileReader fr = new FileReader(new File(url.toURI())); 
			StringWriter writer = new StringWriter()) {
			Velocity.evaluate(ctx, writer, "svg", fr);
			return writer.toString();
		} catch (Exception ex) {
			throw new RuntimeException(ex);
		}
	}

	public static int daysBetween(PointInTime pit1, PointInTime pit2) {
		return Days.daysBetween(pit1.toLocalDate(), pit2.toLocalDate())
				.getDays();
	}

	public static class SVGElem<T extends SVGElem<?>> {
		private String tag;
		private Map<String, Object> attrs = new HashMap<String, Object>();
		private ArrayList<SVGElem<?>> children;
		private String body;

		public SVGElem(String tag) {
			this.tag = tag;
		}

		public String getTag() {
			return tag;
		}

		public Map<String, Object> getAttrs() {
			return attrs;
		}
		
		public SVGElem<T> setBody(String body) {
			this.body = body;
			return this;
		}
		
		public SVGElem<T> addChild(SVGElem<?> elem) {
			if (children == null) children = new ArrayList<>();
			children.add(elem);
			return this;
		}

		@SuppressWarnings("unchecked")
		public T attr(String key, Object val) {
			attrs.put(key, val);
			return (T) this;
		}

		/**
		 * @param extraAtts
		 *            If specified, extra attribute content
		 * @param body
		 *            If specified, body content, if null, no closing tag
		 * @return
		 */
		protected String toString(String extraAtts, String body) {
			StringBuilder sb = new StringBuilder();
			sb.append("<");
			sb.append(getTag());
			Map<String, Object> attrs = getAttrs();
			for (String key : attrs.keySet()) {
				Object val = attrs.get(key);
				sb.append(" ");
				sb.append(key);
				sb.append("=\"");
				if (val != null) {
					val = val.toString().replace("\"", "\\\"");
				}
				sb.append((val == null) ? "" : val);
				sb.append("\"");
			}

			// any extra generated attributes?
			if (extraAtts != null) {
				sb.append(" ");
				sb.append(extraAtts);
			}

			// if body was specified, append the body and closing tag, else,
			// shortcut close tag
			if (body != null || children != null) {
				sb.append(">");
				
				// if there is a textual body, add it
				if (body != null) sb.append(body);
				
				// if there are child elements, render them
				if (children != null) {
					for (SVGElem<?> e : children) {
						sb.append(e.toString());
					}
				}
				
				sb.append("\n</");
				sb.append(getTag());
				sb.append(">\n");
			} else {
				sb.append("/>\n");
			}

			return sb.toString();
		}
		
		@Override
		public String toString() {
			return toString(null, this.body);

			/*

			String ret = "<" + this.tag;
			for (String key : attrs.keySet()) {
				Object val = attrs.get(key);
				ret += " " + key + "=\"" + ((val == null) ? "" : val) + "\"";
			}
			return ret + "/>\n";
			*/
		}
	}

	public class SVGRect extends SVGElem<SVGRect> {
		public SVGRect() {
			super("rect");
		}
	}

	public class SVGPath extends SVGElem<SVGPath> {
		private StringBuilder sb = new StringBuilder();

		public SVGPath() {
			super("path");
		}

		public SVGPath moveTo(PointInTime x, float y) {
			sb.append("M " + calcX(x) + "," + calcY(y) + " ");
			return this;
		}

		public SVGPath lineTo(PointInTime x, float y) {
			sb.append("L " + calcX(x) + " " + calcY(y) + " ");
			return this;
		}
		
		/** add your own misc point like "q x1,y1 x,y" */
		public SVGPath addCmd(String str) {
			sb.append(str + " ");
			return this;
		}

		@Override
		public String toString() {
			return toString("d=\"" + sb + "\"", null);
		}
	}

	public static class SVGCirc extends SVGElem<SVGCirc> {
		public SVGCirc(int cx, int cy, int r) {
			super("circle");
			attr("cx", cx);
			attr("cy", cy);
			attr("r", r);
			attr("fill", "black");
		}
	}
	
	public static class SVGText extends SVGElem<SVGText> {
		private String text;
		public SVGText(String text) {
			super("text");
			this.text = text;
		}
		
		@Override
		public String toString() {
			return toString(null, this.text);
		}
	}
	
	public static class SVGComment extends SVGElem<SVGComment> {
		private String comment;
		public SVGComment(String comment) {
			super(null);
			this.comment = comment;
		}
		
		@Override
		public String toString() {
			return "<!-- " + this.comment + " -->";
		}
	}

	public class SVGGroup extends SVGElem<SVGGroup> {
		private ArrayList<SVGElem<?>> gelements = new ArrayList<SVGElem<?>>();

		public SVGGroup(String tag) {
			super(tag);
		}

		public <T extends SVGElem<?>> T add(T elem) {
			if (elements.remove(elem)) {
				this.gelements.add(elem);
			} else {
				System.out.println("ERROR??");
			}
			return elem;
		}
		
		@Override
		public String toString() {
			StringBuilder sb = new StringBuilder();
			for (SVGElem<?> el : gelements) {
				sb.append("\n  ");
				sb.append(el.toString());
			}
			return toString(null, sb.toString());
		}
	}
	
	public interface SVGGeometry {
		public int calcX(PointInTime pit);
		public int calcY(float y);
		public int calcWidth(PointInTime x1, PointInTime x2);
		public int calcHeight(float y1, float y2);
		public int getCanvasHeight();
		public int getCanvasWidth();
		public PointInTime getFrom();
		public PointInTime getTo();
	}
	
	/** The default geometry implementation.  Used for the outpatient meds graphing */
	public static class DefaultGeomoetry implements SVGGeometry {
		private int height, width, showDays, daysPerPixel;
		private float yMin, yMax;
		private PointInTime from, to;
		private int canvasWidth;

		public DefaultGeomoetry(PointInTime from, PointInTime to, int showDays,
				int height, int width, float yMin, float yMax) {
			this.height = height;
			this.width = width;
			this.from = from;
			this.to = to;
			this.yMin = yMin;
			this.yMax = yMax;
			this.showDays = showDays;
			this.daysPerPixel = Math.round(showDays / width);
			if (this.daysPerPixel <= 0) {
				this.daysPerPixel = 1;
			}
			this.canvasWidth = Math.round(daysBetween(this.from, this.to) / daysPerPixel);
		}
		
		public int getDaysPerPixel() {
			return daysPerPixel;
		}
		
		public int calcX(PointInTime pit) {
			return Math.round(daysBetween(this.from, pit) / daysPerPixel);
		}
		
		public int calcY(float y) {
			return height - Math.round((height - 0) * (y / yMax));
		}

		public int calcWidth(PointInTime x1, PointInTime x2) {
			return daysBetween(x1, x2) / daysPerPixel;
		}
		
		public int calcHeight(float y1, float y2) {
			return Math.round(y2 - y1);
		}
		
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
