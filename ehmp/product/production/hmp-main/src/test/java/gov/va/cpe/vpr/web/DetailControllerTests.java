package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.Allergy;
import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.frameeng.FrameRunner;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.access.AuthorizationDecision;
import gov.va.hmp.access.Decision;
import gov.va.hmp.access.IPolicyDecisionPoint;
import gov.va.hmp.access.Status;
import gov.va.hmp.access.asu.DocumentAction;
import gov.va.hmp.access.asu.DocumentAsuDecisionRequest;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.jsonc.JsonCError;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.web.servlet.view.ContentNegotiatingViewResolver;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.apache.solr.client.solrj.SolrServerException;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.context.ApplicationContext;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.util.ClassUtils;
import org.springframework.web.servlet.ModelAndView;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class DetailControllerTests {

    private DetailController c;
    private MockHttpServletRequest mockRequest;
    private IGenericPatientObjectDAO mockPatientRelatedDao;
    private ApplicationContext mockApplicationContext;
    private FrameRunner mockFrameRunner;
    private HmpUserDetails mockUser;
    private UserContext mockUserContext;
    private IPolicyDecisionPoint mockPDP;

    @Before
    public void setUp() throws Exception {
        mockRequest = new MockHttpServletRequest();
        mockPatientRelatedDao = mock(IGenericPatientObjectDAO.class);
        mockApplicationContext = mock(ApplicationContext.class);
        mockFrameRunner = mock(FrameRunner.class);
        mockUserContext = mock(UserContext.class);
        mockUser = mock(HmpUserDetails.class);
        mockPDP = mock(IPolicyDecisionPoint.class);

        when(mockUserContext.getCurrentUser()).thenReturn(mockUser);

        c = new DetailController();
        c.setPatientRelatedDao(mockPatientRelatedDao);
        c.setApplicationContext(mockApplicationContext);
        c.setFrameRunner(mockFrameRunner);
        c.setUserContext(mockUserContext);
        c.setPolicyDecisionPoint(mockPDP);
    }

    @Test
    public void testRenderDetailDefaultFormat() throws Exception {
        String uid = "urn:va:allergy:ABCD:229:23";
        Allergy mockAllergy = new Allergy();
        mockAllergy.setData("pid", "229");
        mockAllergy.setData("uid", uid);
        when(mockPatientRelatedDao.findByUidWithTemplate(eq(Allergy.class), eq(uid), anyString())).thenReturn(mockAllergy);
        mockRequest.setRequestURI("/detail/" + uid);

        ModelAndView mav = c.renderDetail(mockRequest, null, null);

        assertThat(mav.getViewName(), is("/patientDomain/" + ClassUtils.getShortNameAsProperty(Allergy.class)));
        assertThat((Allergy) mav.getModel().get("item"), is(sameInstance(mockAllergy)));
        assertThat((ApplicationContext) mav.getModel().get("ctx"), sameInstance(mockApplicationContext));
        assertThat((FrameRunner) mav.getModel().get("runner"), sameInstance(mockFrameRunner));
    }

    @Test
    public void testRenderDetailJSONFormat() throws Exception {
        String uid = "urn:va:allergy:ABCD:229:23";
        Allergy mockAllergy = new Allergy();
        mockAllergy.setData("pid", "229");
        mockAllergy.setData("uid", uid);
        when(mockPatientRelatedDao.findByUidWithTemplate(eq(Allergy.class), eq(uid), anyString())).thenReturn(mockAllergy);
        mockRequest.setRequestURI("/detail/" + uid);

        ModelAndView mav = c.renderDetail(mockRequest, null, "json");

        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));

        JsonCResponse<Allergy> jsonc = (JsonCResponse<Allergy>) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonc.data, is(sameInstance(mockAllergy)));
    }

    @Test(expected = BadRequestException.class)
    public void testRenderDetailForUnknownDomainClass() throws Exception {
        String uid = "urn:va:foo:ABCD:23";
        mockRequest.setRequestURI("/detail/" + uid);

        c.renderDetail(mockRequest, null, null);
    }

    @Test(expected = BadRequestException.class)
    public void testRenderDetailForUnknownDomainClassJSONFormat() throws Exception {
        String uid = "urn:va:foo:ABCD:23";
        mockRequest.setRequestURI("/detail/" + uid);

        c.renderDetail(mockRequest, null, "json");
    }

    @Test(expected = UidNotFoundException.class)
    public void testRenderDetailForUnknownUid() throws Exception {
        String uid = "urn:va:allergy:ABCD:229:23";
        when(mockPatientRelatedDao.findByUidWithTemplate(eq(Allergy.class), eq(uid), anyString())).thenReturn(null);
        mockRequest.setRequestURI("/detail/" + uid);

        c.renderDetail(mockRequest, null, null);
    }

    @Test(expected = UidNotFoundException.class)
    public void testRenderDetailForUnknownUidJSONFormat() throws Exception {
        String uid = "urn:va:allergy:ABCD:229:23";
        when(mockPatientRelatedDao.findByUidWithTemplate(eq(Allergy.class), eq(uid), anyString())).thenReturn(null);
        mockRequest.setRequestURI("/detail/" + uid);

        c.renderDetail(mockRequest, null, "json");
    }

    @Test
    public void testRenderDetailNoUid() throws Exception {
        mockRequest.setRequestURI("/detail/whoops");

        ModelAndView mav = c.renderDetail(mockRequest, null, null);
        assertThat(mav.getViewName(), is("/exception/detailNotFound"));
    }

    @Test(expected = BadRequestException.class)
    public void testRenderDetailNoUidJSONFormat() throws Exception {
        mockRequest.setRequestURI("/detail/whoops");

        c.renderDetail(mockRequest, null, "json");
    }

    @Test
    public void testRenderMedTabDetail() throws Exception {
        String medUid = UidUtils.getMedicationUid("F484", "229", "23");

        Map<String, Object> dose = new HashMap<>();
        dose.put("uid", medUid);
        dose.put("dose", "30MG");
        dose.put("vaStatus", "foo");
        dose.put("overallStart", "foo");
        dose.put("overallStop", "foo");

        mockRequest.setParameter("history", POMUtils.toJSON(Collections.singletonList(dose)));

        Medication mockMedication = new Medication();
        mockMedication.setData("uid", medUid);
        mockMedication.setData("pid", "229");
        when(mockPatientRelatedDao.findByUID(Medication.class, medUid)).thenReturn(mockMedication);

        ModelAndView mav = c.renderMedTabDetail(mockRequest, null);

        assertThat(mav.getViewName(), is("/patientDomain/medicationhistory"));
        List<Medication> items = (List<Medication>) mav.getModel().get("items");
        assertThat(items, hasItem(mockMedication));
    }

    @Test
    public void testRenderMedTabDetailNoUid() throws Exception {
        Map<String, Object> dose = new HashMap<>();
        dose.put("foo", "bar");
        dose.put("bar", "baz");
        dose.put("baz", "spaz");

        mockRequest.setParameter("history", POMUtils.toJSON(Collections.singletonList(dose)));

        ModelAndView mav = c.renderMedTabDetail(mockRequest, null);

        assertThat(mav.getViewName(), is("/exception/detailNotFound"));
    }

    @Test
    public void testRenderDocumentDetailViewDeniedDefaultFormat() throws SolrServerException {
        String uid = UidUtils.getDocumentUid("ABCD", "229", "23");
        Document mockDocument = new Document();
        mockDocument.setData("uid", uid);
        when(mockPatientRelatedDao.findByUidWithTemplate(eq(Document.class), eq(uid), anyString())).thenReturn(mockDocument);

        mockRequest.setRequestURI("/detail/" + uid);

        AuthorizationDecision mockDecision = new AuthorizationDecision(null, Decision.DENY, Status.Code.OK, "foo bar", "baz spaz");
        when(mockPDP.evaluate(any(DocumentAsuDecisionRequest.class))).thenReturn(mockDecision);

        ModelAndView mav = c.renderDetail(mockRequest, null, null);
        assertThat(mav.getViewName(), is("/patientDomain/documentViewDenied"));
        assertThat((Decision) mav.getModel().get("decision"), is(mockDecision.getDecision()));
        assertThat((Status) mav.getModel().get("status"), is(mockDecision.getStatus()));

        ArgumentCaptor<DocumentAsuDecisionRequest> authRequestArg = ArgumentCaptor.forClass(DocumentAsuDecisionRequest.class);
        verify(mockPDP).evaluate(authRequestArg.capture());
        assertThat(authRequestArg.getValue().getSubject(), is(mockUser));
        assertThat(authRequestArg.getValue().getAction(), is(DocumentAction.VIEW));
        assertThat((Document) authRequestArg.getValue().getResource(), is(mockDocument));
    }

    @Test
    public void testRenderDocumentDetailViewDeniedJSONFormat() throws SolrServerException {
        String uid = UidUtils.getDocumentUid("ABCD", "229", "23");
        Document mockDocument = new Document();
        mockDocument.setData("uid", uid);
        when(mockPatientRelatedDao.findByUidWithTemplate(eq(Document.class), eq(uid), anyString())).thenReturn(mockDocument);

        mockRequest.setRequestURI("/detail/" + uid);

        AuthorizationDecision mockDecision = new AuthorizationDecision(null, Decision.DENY, Status.Code.OK, "foo bar", "baz spaz");
        when(mockPDP.evaluate(any(DocumentAsuDecisionRequest.class))).thenReturn(mockDecision);

        ModelAndView mav = c.renderDetail(mockRequest, null, "json");
        assertThat(mav.getViewName(), is(ContentNegotiatingViewResolver.DEFAULT_VIEW_NAME));

        JsonCError jsonCError = (JsonCError) mav.getModel().get(ModelAndViewFactory.DEFAULT_MODEL_KEY);
        assertThat(jsonCError.getCode(), is("401"));
        assertThat(jsonCError.getMessage(), is(mockDecision.getStatus().getMessage()));

        ArgumentCaptor<DocumentAsuDecisionRequest> authRequestArg = ArgumentCaptor.forClass(DocumentAsuDecisionRequest.class);
        verify(mockPDP).evaluate(authRequestArg.capture());
        assertThat(authRequestArg.getValue().getSubject(), is(mockUser));
        assertThat(authRequestArg.getValue().getAction(), is(DocumentAction.VIEW));
        assertThat((Document) authRequestArg.getValue().getResource(), is(mockDocument));
    }
}
