package gov.va.hmp.access.asu;

import gov.va.cpe.vpr.Document;
import gov.va.cpe.vpr.pom.jds.JdsGenericDAO;
import gov.va.hmp.access.AuthorizationDecision;
import gov.va.hmp.access.Decision;
import gov.va.hmp.access.Status;
import gov.va.hmp.policy.*;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.apache.commons.lang.StringUtils;
import org.junit.AfterClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(Parameterized.class)
public class AsuITCase {

    private static AsuPolicyDecisionPoint PDP;

    static {
        try {
            VistaITCaseSupport.init();
//            VistaITCaseSupport.init("localhost", 29060, "11vehu", "vehu11");
//            VistaITCaseSupport.init("localhost", 29060, "sblaz23", "wapc&plet3");
            JdsITCaseSupport.init();

            JdsGenericDAO jdsGenericDAO = new JdsGenericDAO();
            jdsGenericDAO.setJdsTemplate(JdsITCaseSupport.getJdsTemplate());
            jdsGenericDAO.afterPropertiesSet();

            PDP = new AsuPolicyDecisionPoint();
            PDP.setDao(jdsGenericDAO);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Parameterized.Parameters(name="{index},{0},{1}")
    public static Iterable<Object[]> data() {
        PDP.refresh(); // load the document definition and action hierarchies

        List<Object[]> testCaseParams = new ArrayList<>();
        DocumentAction action = DocumentAction.VIEW;
//        for (DocumentAction action : DocumentAction.values()) {
        List<Document> documents = JdsITCaseSupport.getJdsTemplate().getForList(Document.class, "/vpr/all/index/document-all");
        for (Document d : documents) {
            if (!StringUtils.isNumeric(d.getLocalId())) continue; // skip documents from packages other than TIU

//                if ("urn:va:document:F484:25:4581".equalsIgnoreCase(d.getUid()))
//              if ("urn:va:document:F484:217:4583".equalsIgnoreCase(d.getUid()))     // completed employee health note by avivauser,twentynine
//              if ("urn:va:document:F484:25:4582".equalsIgnoreCase(d.getUid()))    // unsigned by avivauser,thirtythree
//            if ("urn:va:document:F484:100847:4457".equalsIgnoreCase(d.getUid()))
//            if ("urn:va:document:F484:100847:4512".equalsIgnoreCase(d.getUid()))
//            if ("urn:va:document:F484:25:4581".equalsIgnoreCase(d.getUid()))
//                if ("urn:va:document:F484:8:4587".equalsIgnoreCase(d.getUid()))
                if ("urn:va:document:F484:100845:4099".equalsIgnoreCase(d.getUid()))
//            if ("urn:va:document:F484:100846:4271".equalsIgnoreCase(d.getUid()))  // retracted one
            testCaseParams.add(new Object[]{action, d});
        }
//        }
        return testCaseParams;
    }

    private DocumentAction action;
    private Document document;

    public AsuITCase(DocumentAction action, Document document) {
        this.action = action;
        this.document = document;
    }

    @Test
    public void testAsuAuthorize() throws Exception {
        AuthorizationDecision vistaDecision = evaluateInVista();
        AuthorizationDecision policyEngDecision = evaluateWithPolicyEngine();

        assertThat("Rule Evaluation Mismatch\nASU - "+ vistaDecision.getDecision() + ":" + vistaDecision.getStatus().getMessage()+"\npolicyEng - " + policyEngDecision.getDecision() + ":" + policyEngDecision.getStatus().getMessage(), policyEngDecision.getDecision(), is(vistaDecision.getDecision()));
    }

    private AuthorizationDecision evaluateWithPolicyEngine() {
        AsuDecisionRequest request = new AsuDecisionRequest(VistaITCaseSupport.getUser(), action, document);
        AuthorizationDecision decision = PDP.evaluate(request);
        return decision;
    }

    private AuthorizationDecision evaluateInVista() {
        String docIen = document.getLocalId();
        if (!StringUtils.isNumeric(docIen)) throw new IllegalArgumentException();
        String canDo = VistaITCaseSupport.getRpcTemplate().executeForString("/OR CPRS GUI CHART/TIU AUTHORIZATION", docIen, action);
        if (canDo.contains(VistaStringUtils.U)) {
            return new AuthorizationDecision("VistA ASU", Decision.DENY, Status.Code.OK, VistaStringUtils.piece(canDo, 2), null);
        } else if (canDo.equalsIgnoreCase("1")) {
            return new AuthorizationDecision("VistA ASU", Decision.PERMIT);
        } else {
            return new AuthorizationDecision("VistA ASU", Decision.INDETERMINATE);
        }
    }

    @AfterClass
    public static void after() throws Exception {
        VistaITCaseSupport.destroy();
        JdsITCaseSupport.destroy();
    }

}
