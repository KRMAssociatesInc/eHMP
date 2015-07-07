package gov.va.cpe.vpr.web;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyMap;
import static org.mockito.Mockito.when;
import gov.va.cpe.vpr.NotFoundException;
import gov.va.cpe.vpr.Problem;
import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.VitalSign;
import gov.va.cpe.vpr.mapping.ILinkService;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.ws.link.LinkRelation;
import gov.va.hmp.feed.atom.Link;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.hub.dao.json.JsonAssert;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.joda.time.DateTime;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

public class TrendControllerTest {

    private TrendController tc;
    private MockHttpServletRequest mockRequest;
    private ILinkService linkServiceMock;
    private IGenericPatientObjectDAO genericPatientObjectDaoMock;

    @Before
    public void setUp() throws Exception {
        mockRequest = new MockHttpServletRequest();
        linkServiceMock = Mockito.mock(ILinkService.class);
        genericPatientObjectDaoMock = Mockito.mock(IGenericPatientObjectDAO.class);

        tc = new TrendController();
        tc.setGenericPatientObjectDao(genericPatientObjectDaoMock);
        tc.setLinkService(linkServiceMock);
    }

    @Test
    public void testCreateTrendData() throws Exception {
        List<Result> list = new ArrayList();
        Map<String, Object> map = new LinkedHashMap<>(10);
        map.put("pid", "123");
        map.put("facilityName", "SLC-FO HMP DEV");
        map.put("high", 100);
        map.put("low", "Neg.");
        map.put("observed", "20120529180230.000");
        map.put("result", 12.5f);
        map.put("specimen", "URINE");
        map.put("typeName", "URINE GLUCOSE");
        map.put("uid", "urn:va:lab:F484:8:CH;6879469.819787;690");
        map.put("units", "mg/dL");
        map.put("comment", "foo");
        Result result = new Result(map);
        list.add(result);
        List<Map<String,Object>> trendData = tc.createTrendData(list);
        assertEquals(1, trendData.size());
        DateTime t = new DateTime(2012, 5, 29, 18, 2, 30, 0);
        Map<String, Object> map1 = new LinkedHashMap<>(2);
        map1.put("x", t.getMillis());
        map1.put("y", 12.5f);
        map1.put("high", 100);
        map1.put("low", "Neg.");
        map1.put("units", "mg/dL");
        
        assertEquals(1, trendData.size());
        Map<String,Object> ret = trendData.get(0);
        assertEquals(t.getMillis(), ret.get("x"));
        assertEquals(12.5f, ret.get("y"));
        assertEquals("100", ret.get("high"));
        assertEquals("Neg.", ret.get("low"));
        assertEquals("mg/dL", ret.get("units"));
        assertEquals("foo", ret.get("comment"));

    }

    @Test
    public void testCreateTrendData_ResultMissing() throws Exception {
        List list = new ArrayList();
        LinkedHashMap<String, Object> map = new LinkedHashMap<>(10);
        map.put("pid", "123");
        map.put("facilityName", "SLC-FO HMP DEV");
        map.put("high", 100);
        map.put("low", "Neg.");
        map.put("observed", null);
        map.put("result", "Neg.");
        map.put("specimen", "URINE");
        map.put("typeName", "URINE GLUCOSE");
        map.put("uid", "urn:va:lab:F484:8:CH;6879469.819787;690");
        map.put("units", "mg/dL");
        Result result = new Result(map);
        list.add(result);
        List trendData = tc.createTrendData(list);
        assertEquals(0, trendData.size());
    }

    @Test
    public void testCreateTrendData_NoObserved() throws Exception {
        List list = new ArrayList();
        LinkedHashMap<String, Object> map = new LinkedHashMap<>(9);
        map.put("pid", "123");
        map.put("facilityName", "SLC-FO HMP DEV");
        map.put("high", 100);
        map.put("low", "Neg.");
        map.put("result", "12");
        map.put("specimen", "URINE");
        map.put("typeName", "URINE GLUCOSE");
        map.put("uid", "urn:va:lab:F484:8:CH;6879469.819787;690");
        map.put("units", "mg/dL");
        Result result = new Result(map);
        list.add(result);
        List trendData = tc.createTrendData(list);
        assertEquals(0, trendData.size());
    }

    @Test
    public void testCreateTrendData_ObservedIncomplete() throws Exception {
        List list = new ArrayList();
        LinkedHashMap<String, Object> map = new LinkedHashMap<>(10);
        map.put("pid", "123");
        map.put("facilityName", "SLC-FO HMP DEV");
        map.put("observed", 201209);
        map.put("result", "12");
        map.put("high", 100);
        map.put("low", "Neg.");
        map.put("specimen", "URINE");
        map.put("typeName", "URINE GLUCOSE");
        map.put("uid", "urn:va:lab:F484:8:CH;6879469.819787;690");
        map.put("units", "mg/dL");
        Result result = new Result(map);
        list.add(result);
        List trendData = tc.createTrendData(list);
        assertEquals(0, trendData.size());
    }

    @Test
    public void testGetIndex() {
        assertEquals(TrendController.LAB_INDEX, tc.getIndex(new Result()));
        assertEquals(TrendController.VITAL_INDEX, tc.getIndex(new VitalSign()));
        try {
            assertEquals(TrendController.VITAL_INDEX, tc.getIndex(new Problem()));
            Assert.assertFalse(true);//should never get here
        } catch (Exception e) {
            assertEquals("Trend  type is invalid. Valid types: result, vitalSign", e.getMessage());
        }

    }

    @Test
    public void testPitToJsDate() throws Exception {
        DateTime t = new DateTime(2001, 10, 22, 12, 0, 0, 0);
        assertThat(tc.pitToJsDate(new PointInTime(2001, 10, 22)), is(t.getMillis()));
        assertThat(tc.pitToJsDate(new PointInTime(2001, 10)), nullValue());
    }

    @Test
    public void testCreateLink() throws Exception {
        mockRequest.setRequestURI("/vpr/trend/urn:va:lab:F484:8:CH;6879469.819787;690");
        Result result = new Result();
        when(genericPatientObjectDaoMock.findByUID(Result.class, "urn:va:lab:F484:8:CH;6879469.819787;690")).thenReturn(result);
        Link link = new Link();
        link.setRel(LinkRelation.TREND.toString());
        when(linkServiceMock.getLinks(result)).thenReturn(Arrays.asList(link));

        assertNotNull(tc.createLink(mockRequest));
    }

    @Test
    public void testCreateLink_NoMatch() throws Exception {
        mockRequest.setRequestURI("/vpr/trend/urn:va:lab:F484:8:CH;6879469.819787;690");
        Result result = new Result();
        when(genericPatientObjectDaoMock.findByUID(Result.class, "urn:va:lab:F484:8:CH;6879469.819787;690")).thenReturn(result);
        when(linkServiceMock.getLinks(result)).thenReturn(new ArrayList<Link>(Arrays.asList(new Link())));

        try {
            tc.createLink(mockRequest);
            Assert.assertTrue(false);//should never get here
        } catch (NotFoundException nfe) {
            assertEquals("No trend found for item with uid=urn:va:lab:F484:8:CH;6879469.819787;690", nfe.getMessage());
        }
    }

    @Test
    public void testRenderJson() throws Exception {
        mockRequest.setRequestURI("/vpr/trend/urn:va:lab:F484:8:CH;6879469.819787;690");
        Result result = new Result();
        result.setData("pid", "23");
        result.setData("typeName", "GLUCOSE");
        when(genericPatientObjectDaoMock.findByUID(Result.class, "urn:va:lab:F484:8:CH;6879469.819787;690")).thenReturn(result);
        Link link = new Link();
        link.setRel(LinkRelation.TREND.toString());
        when(linkServiceMock.getLinks(result)).thenReturn(Arrays.asList(link));
        Result result1 = new Result();
        result1.setData("pid", "23");
        result1.setData("observed", 20120920);
        result1.setData("result", "12");
        when(genericPatientObjectDaoMock.findAllByQuery(any(Class.class), any(QueryDef.class), anyMap())).thenReturn(Arrays.asList(result1));

        ModelAndView mv = tc.renderJson(mockRequest);
        assertNotNull(mv);
        JsonCCollection<Map<String,Object>> resp = (JsonCCollection<Map<String,Object>>) mv.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertNotNull(resp);
        assertEquals("GLUCOSE", resp.getAdditionalData().get("name"));
        assertEquals("line", resp.getAdditionalData().get("type"));
        DateTime t = new DateTime(2012, 9, 20, 12, 0, 0, 0);
        Map<String, Object> map2 = new LinkedHashMap<>(2);
        map2.put("x", t.getMillis());
        map2.put("y", 12.0f);
        assertThat(resp.getItems().get(0), equalTo(map2));
    }

    @Test
    public void testRenderXml() throws Exception {
        mockRequest.setRequestURI("/vpr/trend/urn:va:lab:F484:8:CH;6879469.819787;690");
        Result result = new Result();
        result.setData("pid", "23");
        result.setData("typeName", "GLUCOSE");
        when(genericPatientObjectDaoMock.findByUID(Result.class, "urn:va:lab:F484:8:CH;6879469.819787;690")).thenReturn(result);
        Link link = new Link();
        link.setRel(LinkRelation.TREND.toString());
        link.setHref("/vpr/trend/urn:va:lab:F484:8:CH;6879469.819787;690");
        when(linkServiceMock.getLinks(result)).thenReturn(Arrays.asList(link));

        String viewName = tc.renderXml(mockRequest);
        assertThat(viewName, is("redirect:/vpr/trend/urn:va:lab:F484:8:CH;6879469.819787;690"));
    }

    @Test
    public void testRenderExtjs() throws Exception {
        mockRequest.setRequestURI("/vpr/trend/urn:va:lab:F484:8:CH;6879469.819787;690");
        Result result = new Result();
        result.setData("pid", "23");
        result.setData("typeName", "GLUCOSE");
        when(genericPatientObjectDaoMock.findByUID(Result.class, "urn:va:lab:F484:8:CH;6879469.819787;690")).thenReturn(result);
        Link link = new Link();
        link.setRel(LinkRelation.TREND.toString());
        link.setHref("/vpr/trend/urn:va:lab:F484:8:CH;6879469.819787;690");
        when(linkServiceMock.getLinks(result)).thenReturn(Arrays.asList(link));

        String responseBody = tc.renderExtJs("extjs", mockRequest);
        JsonAssert.assertJsonEquals("{\"xtype\":\"trendpanel\",\"url\":\"/vpr/trend/urn:va:lab:F484:8:CH;6879469.819787;690?format=extjs\"}", responseBody);
    }
}
