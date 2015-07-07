package gov.va.cpe.vpr;

import static org.junit.Assert.*;
import gov.va.cpe.vpr.InPtMedSVGBuilder.InpatientGeometry;
import gov.va.cpe.vpr.util.SVGBuilder.SVGGeometry;
import gov.va.hmp.healthtime.PointInTime;

import org.joda.time.Hours;
import org.junit.Before;
import org.junit.Test;

public class InPtMedSVGBuilderTest {

	private int svgHeight = 100;
	private int svgWidth = 500;

	@Before
	public void setup() {
	}
	
	@Test
	public void hoursBetwen() {
		// same date, 24 hours range
		PointInTime x = new PointInTime(2000,1,1);
		assertEquals(24, InpatientGeometry.hoursBetween(x, x));
		
		// same hour, 1 hour range
		x = new PointInTime(2000,1,1,12);
		assertEquals(1, InpatientGeometry.hoursBetween(x, x));
		
		// same minute, 0 hour range
		x = new PointInTime(2000,1,1,12,10);
		assertEquals(0, InpatientGeometry.hoursBetween(x, x));
	}
	
	@Test
	public void testXGeometry() {
		
		// 10 day canvas range, 50hr window
		PointInTime from = new PointInTime(2000,1,1,0);
		PointInTime to = new PointInTime(2000,1,10,23);
		
		InpatientGeometry g = new InpatientGeometry(from, to, 50, svgHeight, svgWidth, true);
		
		// 168 hour range
		int hoursBetween = 10*24; 
		assertEquals(hoursBetween, InpatientGeometry.hoursBetween(from, to));
		
		// each hour is 10 pixels
		int pixelsPerHour = svgWidth / 50;
		assertEquals(pixelsPerHour, g.getPixelsPerHour());
		assertEquals(10, g.getPixelsPerHour());
		assertEquals(pixelsPerHour * hoursBetween, g.getCanvasWidth());
		
		// with lower bounded geometry, from should be x=0, max width is 10
		assertEquals(0, g.calcX(from));
		assertEquals(10, g.calcWidth(from, from));
		
		// with lower bounded geometry, "to" should be max canvas (minus width of 10)
		assertEquals(g.getCanvasWidth()-10, g.calcX(to));
		assertEquals(10, g.calcWidth(to, to));
		
		// lower bounded day 6 should be in the middle 
		assertEquals(g.getCanvasWidth()/2, g.calcX(new PointInTime(2000,1,6)));
		// end of day 5 should also be almost in the middle
		assertEquals(g.getCanvasWidth()/2, g.calcX(new PointInTime(2000,1,5,23)), 10);
	}
	
	@Test
	public void testYGeometry() {
		
		// 10 day canvas range, 50hr window
		PointInTime from = new PointInTime(2000,1,1,0);
		PointInTime to = new PointInTime(2000,1,10,23);
		InpatientGeometry g = new InpatientGeometry(from, to, 50, svgHeight, svgWidth, true);
		
		// high should be what was set
		assertEquals(svgHeight, g.getCanvasHeight());
		
		// calc(x) should invert the SVG-natural Y coordinates
		assertEquals(0, g.calcY(svgHeight));
		assertEquals(50, g.calcY(50));
		assertEquals(svgHeight, g.calcY(0));
		
		// height
		assertEquals(-50, g.calcHeight(0, 50));
		assertEquals(50, g.calcHeight(50, 0));
	}
	
	@Test
	public void testNormalizedYGeometry() {
		// 10 day canvas range, 50hr window
		PointInTime from = new PointInTime(2000,1,1,0);
		PointInTime to = new PointInTime(2000,1,10,23);
		InpatientGeometry g = new InpatientGeometry(from, to, 50, svgHeight, svgWidth, true);
		g.setYMinMax(100, 200);
		
		// 100 should be the bottom, 200 the top
		assertEquals(svgHeight, g.calcY(100));
		assertEquals(0, g.calcY(200));
		
		// 150 should be in the middle
		assertEquals(50, g.calcY(150));
		
		assertEquals(-svgHeight, g.calcHeight(100, 200));
		assertEquals(svgHeight, g.calcHeight(200, 100));
		
		// test large values (larger than actual canvas size)
		g.setYMinMax(250.0f, 750.0f);
		
		// 250 should be bottom, 750 should be top, 500 should be the exact middle
		assertEquals(svgHeight/2, g.calcY(500.0f));
		assertEquals(svgHeight, g.calcY(250.0f));
		assertEquals(0, g.calcY(750.0f));
		
		// when the height is negative, the SVGBuilder logic should flip the Y1,Y2 coordinates
		int height = g.calcHeight(250.0f, 500.0f);
		assertEquals(-50, height);
		int y = g.calcY(500.0f);
		height = Math.abs(height);
		assertEquals(svgHeight/2,  y);
		assertEquals(50, height);
		
	}
	
	

}
