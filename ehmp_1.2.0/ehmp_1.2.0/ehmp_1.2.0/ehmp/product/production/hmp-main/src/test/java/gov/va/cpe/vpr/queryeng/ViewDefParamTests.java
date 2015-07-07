package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.queryeng.ViewParam.DateRangeParam;
import gov.va.hmp.healthtime.PointInTime;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import static org.junit.Assert.*;

public class ViewDefParamTests {
	
	private FrameJob vdr;
	private TestViewDef vd;
	
	public static class EmptyTestViewDef extends ViewDef {
		public EmptyTestViewDef() {
		}
	}

	private static class TestViewDef extends ViewDef {
		public TestViewDef() {
			declareParam(new ViewParam.ViewInfoParam(this, "Test View Def", null));
    		declareParam("param.1", "1");
    		declareParam("param.2", "two");
		}
		
		@Override
		public void declareParam(ViewParam param) {
			// TODO Auto-generated method stub
			super.declareParam(param);
		}
	}

	@Before
    public void setUp() throws Exception {
		vd = new TestViewDef();
    	vdr = new FrameJob();
    }
	
	@Test
	public void testDefaultGetAppInfo() {
		// if no ViewParam is declared, should return:
		ViewDef vd = new EmptyTestViewDef();
		Map<String,Object> info = vd.getAppInfo();
		
		assertEquals("gov.va.cpe.viewdef", info.get("type"));
		assertEquals("gov.va.cpe.vpr.queryeng.ViewDefParamTests$EmptyTestViewDef", info.get("name"));
		assertEquals("gov.va.cpe.vpr.queryeng.ViewDefParamTests$EmptyTestViewDef", info.get("code"));
	}

	@Test
	public void testGetAppInfo() {
		// If ViewParam is declared, then there should be more info
		ViewDef vd = new TestViewDef();
		Map<String,Object> info = vd.getAppInfo();
		
		assertEquals("gov.va.cpe.viewdef", info.get("type"));
		assertEquals("Test View Def", info.get("name"));
		assertEquals("gov.va.cpe.vpr.queryeng.ViewDefParamTests$TestViewDef", info.get("code"));
	}
	
	@Test
	@Ignore
	public void testDeclareParams() {
		// declared params should be there.
		assertEquals("1", vdr.getParamStr("param.1"));
		assertEquals("two", vdr.getParamStr("param.2"));

		// undeclared ones should not.
		assertNull(vdr.getParamStr("param.3"));

		// and they should also exit in the returned map
		assertTrue(vdr.getParams().containsKey("param.1"));
		assertTrue(vdr.getParams().containsKey("param.2"));
		assertFalse(vdr.getParams().containsKey("param.3"));

		// case sensitive (for now)
		assertFalse(vdr.getParams().containsKey("PaRaM.1"));
	}

	@Test
	@Ignore
	public void testGetParamInt() {
		// numeric params should convert to ints
		assertEquals(1, vdr.getParamInt("param.1"));

		// non-numeric params should return -1
		assertEquals(-1, vdr.getParamInt("param.2"));

		// non-existent params should return -1
		assertEquals(-1, vdr.getParamInt("param.3"));
	}

	@Test
	public void testGetParamString() {
		// non-existent params should return null
		assertNull(vdr.getParamStr("foo.bar"));

		// non-string values should return the .toString() notation
		vdr.setParam("param.1", new Integer(10));
		assertEquals("10", vdr.getParamStr("param.1"));
	}

	@Test
	@Ignore
	public void testSetParams() {
		// override a default param, should return the new value
		assertEquals("two", vdr.getParamStr("param.2"));
		vdr.setParam("param.2", "XYZ");
		assertEquals("XYZ", vdr.getParamStr("param.2"));
	}

	@Test
	public void testPrefixParams() {
    	HashMap<String, Object> m = new HashMap<String, Object>();
    	m.put("1", "1");
    	m.put("2", "2");

    	// setting params from the above map with a prefix
    	vdr.setParams("param.", m);
    	assertEquals(1, vdr.getParamInt("param.1"));
    	assertEquals(2, vdr.getParamInt("param.2"));
	}

	@Test
	@Ignore
	public void testDefaultParams() {
		// the base class declares the following default params
		assertEquals(1, vd.getParamDefs(ViewParam.ColumnsParam.class).size());
		assertEquals(1, vd.getParamDefs(ViewParam.ViewInfoParam.class).size());
		assertEquals(1, vd.getParamDefs(ViewParam.PaginationParam.class).size());
		
		// which have the following default values
		assertEquals(0, vdr.getParamInt("row.start"));
		assertEquals(25, vdr.getParamInt("row.count"));
		assertEquals(1000, vdr.getParamInt("row.limit"));
		assertNotNull(vdr.getParamStr("col.display"));
		assertNotNull(vdr.getParamStr("col.require"));
		assertNotNull(vdr.getParamStr("col.suppress"));
		assertNotNull(vdr.getParamStr("col.sortable"));
		assertNotNull(vdr.getParamStr("col.groupable"));
		assertNotNull(vdr.getParamStr("col.list"));
		assertNotNull(vdr.getParamStr("view.class"));
		assertNotNull(vdr.getParamStr("view.name"));
		
		// initally, the renderer returns the same values as the viewdef declares
		Map<String, Object> defaults = vd.getParamDefaultVals();
		assertEquals(vdr.getParamInt("row.start"), defaults.get("row.start"));
		assertEquals(vdr.getParamInt("row.count"), defaults.get("row.count"));
		assertEquals(vdr.getParamInt("row.limit"), defaults.get("row.limit"));
		assertEquals(vdr.getParamStr("col.display"), defaults.get("col.display"));
		assertEquals(vdr.getParamStr("col.require"), defaults.get("col.require"));
		assertEquals(vdr.getParamStr("col.suppress"), defaults.get("col.suppress"));
		assertEquals(vdr.getParamStr("col.sortable"), defaults.get("col.sortable"));
		assertEquals(vdr.getParamStr("col.groupable"), defaults.get("col.groupable"));
		assertEquals(vdr.getParamStr("col.list"), defaults.get("col.list"));
		assertEquals(vdr.getParamStr("view.class"), defaults.get("view.class"));
		assertEquals(vdr.getParamStr("view.name"), defaults.get("view.name"));
		
		// but then we can set some values in the renderer
		vdr.setParam("row.start", 1);
		vdr.setParam("row.count", 2);
		
		// and then the renderer should return the values we just set
		assertEquals(1, vdr.getParamInt("row.start"));
		assertEquals(2, vdr.getParamInt("row.count"));
		
		// but the default viewdef vals should still filter though
		assertEquals(1000, vdr.getParamInt("row.limit"));
	}
	
	@Test
	public void testSingletonViewParams() {
		// some ViewParams should only have one instance registered in a view.
		ViewParam info1 = new ViewParam.ViewInfoParam(vd);
		ViewParam info2 = new ViewParam.ViewInfoParam(vd);
		
		// these ViewParams implement their equals() method to return true iif the clases are the same.
		assertTrue(info1.equals(info2));
		
		// if you attempt to add another one, then it should replace the prior one.
		vd.declareParam(info2);
		Set<ViewParam> views = vd.getParamDefs(ViewParam.ViewInfoParam.class);
		assertEquals(1, views.size());
		assertSame(info2, views.iterator().next());
		
		// there are a couple others (usually the default ViewParams) that are like this
		assertEquals(new ViewParam.ColumnsParam(vd), new ViewParam.ColumnsParam(vd));
		assertEquals(new ViewParam.PaginationParam(), new ViewParam.PaginationParam());
	}

	@Test
	public void testSubMaps() {
		HashMap<String,Object> m = new HashMap<String, Object>();
		HashMap<String,Object> m2 = new HashMap<String, Object>();
		m2.put("1", "abc");
		m.put("param", m2);

		// maps containing submaps are traversed and stored in a dot notation (grails compatibility)
		vdr.setParams(m);
		assertEquals("abc", vdr.getParamStr("param.1"));
	}
	
	@Test
	public void testDateRangeSyntax1() {
		PointInTime today = PointInTime.today(), now = PointInTime.now(), bday = new PointInTime(2012, 10, 30, 12, 0, 0); // 20121030 high noon
		
		// bad formats that should return null
		assertNull(DateRangeParam.parseDateStr(null, bday));
		assertNull(DateRangeParam.parseDateStr("", bday));
		assertNull(DateRangeParam.parseDateStr("asdf", bday));
		assertNull(DateRangeParam.parseDateStr("T_123d", bday));
		assertNull(DateRangeParam.parseDateStr("_123d", bday));
		assertNull(DateRangeParam.parseDateStr("X+123d", bday));
		assertNull(DateRangeParam.parseDateStr("+1ZZZ", bday));
		assertNull(DateRangeParam.parseDateStr("1PDQ", bday));
		assertNull(DateRangeParam.parseDateStr("+1PDQ", bday));
		assertNull(DateRangeParam.parseDateStr("-XYZ", bday));
		assertNull(DateRangeParam.parseDateStr("+XYZ", bday));
		assertNull(DateRangeParam.parseDateStr("XYZ", bday));
		assertNull(DateRangeParam.parseDateStr("200+1Y", bday));
		assertNull(DateRangeParam.parseDateStr("2000000000000000000000000+1Y", bday));
		
		// specify null start date without a starter T, NOW, etc is the same as today
		assertEquals(today.subtractDays(1), DateRangeParam.parseDateStr("-1d", null));
		assertEquals(today.subtractDays(1), DateRangeParam.parseDateStr("T-1d", null));
		assertEquals(today, DateRangeParam.parseDateStr("T", null));
		assertEquals(today, DateRangeParam.parseDateStr("tOdAy", null));
		assertEquals(toD(now), toD(DateRangeParam.parseDateStr("n", null)), 10);
		assertEquals(toD(now), toD(DateRangeParam.parseDateStr("NoW", null)), 10);
		
		
		// basic valid syntax w/ specified start date (+/- 1 day; day is default)
		assertEquals("20121029120000", DateRangeParam.parseDateStr("-1d", bday).toString());
		assertEquals("20121031120000", DateRangeParam.parseDateStr("+1d", bday).toString());
		assertEquals("20121029120000", DateRangeParam.parseDateStr("-1", bday).toString());
		assertEquals("20121031120000", DateRangeParam.parseDateStr("+1", bday).toString());
		assertEquals("20121031120000", DateRangeParam.parseDateStr(" 1d", bday).toString());
		assertEquals("20121031120000", DateRangeParam.parseDateStr(" 1", bday).toString());
		assertEquals("20121031120000", DateRangeParam.parseDateStr("1d", bday).toString());
		assertEquals("20121031120000", DateRangeParam.parseDateStr("1", bday).toString());

		// basic valid syntax w/ today or now as start date (also note that specifiying T or N ignores the starter passed in)
		assertEquals(today.addDays(1).toString(), DateRangeParam.parseDateStr("Today+1d", bday).toString());
		assertEquals(today.subtractDays(1).toString(), DateRangeParam.parseDateStr("T-1d", bday).toString());
		assertEquals(today.addDays(1).toString(), DateRangeParam.parseDateStr("ToDaY+1", bday).toString());
		assertEquals(today.subtractDays(1).toString(), DateRangeParam.parseDateStr("T-1", bday).toString());

		assertEquals(toD(now.addDays(1)), toD(DateRangeParam.parseDateStr("N+1d", bday)), 10);
		assertEquals(toD(now.subtractDays(1)), toD(DateRangeParam.parseDateStr("N-1d", bday)), 10);
		assertEquals(toD(now.addDays(1)), toD(DateRangeParam.parseDateStr("N+1", bday)), 10);
		assertEquals(toD(now.subtractDays(1)),toD( DateRangeParam.parseDateStr("N-1", bday)), 10);
		
		// basic syntax (explicit hl7 date/time)
		assertEquals("2012", DateRangeParam.parseDateStr("2012", null).toString());
		assertEquals("201201", DateRangeParam.parseDateStr("201201", null).toString());
		assertEquals("20120101", DateRangeParam.parseDateStr("20120101", null).toString());
		assertEquals("2012010112", DateRangeParam.parseDateStr("2012010112", null).toString());
		assertEquals("201201011259", DateRangeParam.parseDateStr("201201011259", null).toString());
		assertEquals("20120101125959", DateRangeParam.parseDateStr("20120101125959", null).toString());
		
		// start time can also be explicitly specified as an HL7 date/time format
		assertEquals("2013", DateRangeParam.parseDateStr("2012+1Y", null).toString());
		assertEquals("201305", DateRangeParam.parseDateStr("201205+1Y", null).toString());
		assertEquals("20130524", DateRangeParam.parseDateStr("20120524+1Y", null).toString());
		assertEquals("2013052412", DateRangeParam.parseDateStr("2012052412+1Y", null).toString());
		assertEquals("201305241200", DateRangeParam.parseDateStr("201205241200+1Y", null).toString());
		assertEquals("20130524120000", DateRangeParam.parseDateStr("20120524120000+1Y", null).toString());

		// test valid each unit/periods (case insensitive except for month/minute); default unit is days
		assertEquals("20131030120000", DateRangeParam.parseDateStr("+1YEARS", bday).toString());
		assertEquals("20131030120000", DateRangeParam.parseDateStr("+1y", bday).toString());
		assertEquals("20121130120000", DateRangeParam.parseDateStr("+1MONTHS", bday).toString());
		assertEquals("20121130120000", DateRangeParam.parseDateStr("+1M", bday).toString());
		assertEquals("20121130120000", DateRangeParam.parseDateStr("+1mo", bday).toString());
		assertEquals("20121106120000", DateRangeParam.parseDateStr("+1weeks", bday).toString());
		assertEquals("20121106120000", DateRangeParam.parseDateStr("+1w", bday).toString());
		assertEquals("20121031120000", DateRangeParam.parseDateStr("+1DAYS", bday).toString());
		assertEquals("20121031120000", DateRangeParam.parseDateStr("+1d", bday).toString());
		assertEquals("20121031120000", DateRangeParam.parseDateStr("+1", bday).toString());
		assertEquals("20121030130000", DateRangeParam.parseDateStr("+1HOURS", bday).toString());
		assertEquals("20121030130000", DateRangeParam.parseDateStr("+1h", bday).toString());
		assertEquals("20121030120100", DateRangeParam.parseDateStr("+1MINUTES", bday).toString());
		assertEquals("20121030120100", DateRangeParam.parseDateStr("+1m", bday).toString());
		assertEquals("20121030120100", DateRangeParam.parseDateStr("+1mi", bday).toString());
		assertEquals("20121030120001", DateRangeParam.parseDateStr("+1SECONDS", bday).toString());
		assertEquals("20121030120001", DateRangeParam.parseDateStr("+1s", bday).toString());
	}
	
	@Test
	public void testDateRangeSyntax2() {
		PointInTime now = PointInTime.now(), today = PointInTime.today();
		
		// by default the start date is today (no time), end date is now (with time)
		Map<String, Object> map = DateRangeParam.parseDate("range", "T-0");
		assertEquals(8, map.get("range.startHL7").toString().length());
		assertEquals(18, map.get("range.endHL7").toString().length());
		assertEquals(today.toString(), map.get("range.startHL7"));
		assertEquals(toD(now), toD(map.get("range.endHL7")), 10);
		
		// aliases for today (has no time)
		assertEquals(8, today.toString().length());
		assertEquals(today.toString(), DateRangeParam.parseDate("range", "T").get("range.startHL7"));
		assertEquals(today.toString(), DateRangeParam.parseDate("range", "t").get("range.startHL7"));
		assertEquals(today.toString(), DateRangeParam.parseDate("range", "today").get("range.startHL7"));
		assertEquals(today.toString(), DateRangeParam.parseDate("range", "ToDaY").get("range.startHL7"));
		
		// aliases for now (has time)
		assertEquals(18, now.toString().length());
		assertEquals(toD(now), toD(DateRangeParam.parseDate("range", "now").get("range.startHL7")), 10);
		
		// a range can be specified as two time syntaxes sperated by ".." or ":"
		map = DateRangeParam.parseDate("range", "-1Y:+1Y");
		assertEquals(toD(today.subtractYears(1)), toD(map.get("range.startHL7")), 10);
		assertEquals(toD(now.addYears(1)), toD(map.get("range.endHL7")), 10);
		map = DateRangeParam.parseDate("range", "-1Y..+1Y");
		assertEquals(toD(today.subtractYears(1)), toD(map.get("range.startHL7")), 10);
		assertEquals(toD(now.addYears(1)), toD(map.get("range.endHL7")), 10);
		
		// a range specified as just two explicit HL7 date/time strings
		map = DateRangeParam.parseDate("range", "2001..2010");
		assertEquals("2001", map.get("range.startHL7"));
		assertEquals("2010", map.get("range.endHL7"));
		map = DateRangeParam.parseDate("range", "2001:2001060101");
		assertEquals("2001", map.get("range.startHL7"));
		assertEquals("2001060101", map.get("range.endHL7"));
		
		// can also be range to today/now
		map = DateRangeParam.parseDate("range", "2001..Today");
		assertEquals("2001", map.get("range.startHL7"));
		assertEquals(today.toString(), map.get("range.endHL7"));
		map = DateRangeParam.parseDate("range", "today..now");
		assertEquals(today.toString(), map.get("range.startHL7"));
		assertEquals(toD(now), toD(map.get("range.endHL7")), 10);
	}
	
	@Test
	public void testDateRangeSyntaxOLD() {
		PointInTime today = PointInTime.today();
		// these formats are old, probably will be gone soon.
		assertEquals(today.subtractDays(7).toString(), DateRangeParam.parseDate("range", "One Week").get("range.startHL7"));
		assertEquals(today.subtractMonths(1).toString(), DateRangeParam.parseDate("range", "One Month").get("range.startHL7"));
		assertEquals(today.subtractYears(1).toString(), DateRangeParam.parseDate("range", "One Year").get("range.startHL7"));
		assertEquals(today.subtractYears(2).toString(), DateRangeParam.parseDate("range", "2 Years").get("range.startHL7"));
		assertEquals(today.subtractYears(3).toString(), DateRangeParam.parseDate("range", "3 Years").get("range.startHL7"));
	}
	
	/*
	 * This is a convenience function for turning HL7 date/time stamps into a floating point (double)
	 * since a full date/time has milliseconds, comparing them with assertEquals is tricky
	 * by converting the HL7 date/time format into a floating point double value they are much easier
	 * to compare by using JUnits delta value.
	 */
	public static Double toD(Object obj) {
		if (obj != null) {
			return Double.parseDouble(obj.toString());
		}
		return 0.0;
	}
	
}
