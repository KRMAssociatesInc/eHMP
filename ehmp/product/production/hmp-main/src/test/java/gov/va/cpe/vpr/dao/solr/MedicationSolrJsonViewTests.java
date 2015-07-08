package gov.va.cpe.vpr.dao.solr;

import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import gov.va.cpe.vpr.JdsCode;
import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.MedicationIndication;
import gov.va.cpe.vpr.MedicationOrder;
import gov.va.cpe.vpr.MedicationProduct;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.json.MedicationImporterTest;
import gov.va.cpe.vpr.termeng.ITermDataSource;
import gov.va.cpe.vpr.termeng.TermEng;

import java.util.ArrayList;
import java.util.List;

import org.apache.solr.common.SolrInputDocument;
import org.junit.BeforeClass;

public class MedicationSolrJsonViewTests extends AbstractSolrJsonViewTests {

    @BeforeClass
    public static void setUpEmptyMockTermEng() {
        TermEng.createInstance(new ITermDataSource[]{});
    }

    private static void stubCodes(Medication m) {
      JdsCode jdsCode = new JdsCode();
      jdsCode.setCode("mockCode");
      jdsCode.setDisplay("mockDisplay");
      jdsCode.setSystem("mockSystem");
      List<JdsCode> list = new ArrayList<JdsCode>();
      list.add(jdsCode);
      m.setCodes(list);
    }

    @Override
    public void testSolrView() throws Exception {
        Medication m = POMUtils.newInstance(Medication.class, MedicationImporterTest.getActiveMedicationResourceAsStream());

        //set the codes:
        stubCodes(m);
        SolrInputDocument solrDoc = converter.convert(m);

        assertThat((String) solrDoc.getFieldValue("domain"), is("med"));
        assertThat((String) solrDoc.getFieldValue("pid"), is(m.getPid()));
        assertThat((String) solrDoc.getFieldValue("uid"), is(m.getUid()));
        assertThat((String) solrDoc.getFieldValue("facility_name"), is(m.getFacilityName()));
        assertThat((String) solrDoc.getFieldValue("med_sig"), is(m.getSig()));
        assertThat((String) solrDoc.getFieldValue("med_pt_instruct"), is(m.getPatientInstruction()));

        for (MedicationProduct it : m.getProducts()) {
            assertThat(solrDoc.getFieldValues("med_ingredient_code"), hasItem(it.getIngredientCode()));
            assertThat(solrDoc.getFieldValues("med_ingredient_code_name"), hasItem(it.getIngredientCodeName()));
            assertThat(solrDoc.getFieldValues("med_ingredient_name"), hasItem(it.getIngredientName()));
            assertThat(solrDoc.getFieldValues("med_drug_class_code"), hasItem(it.getDrugClassCode()));
            assertThat(solrDoc.getFieldValues("med_drug_class_name"), hasItem(it.getDrugClassName()));
            assertThat(solrDoc.getFieldValues("med_supplied_code"), hasItem(it.getSuppliedCode()));
            assertThat(solrDoc.getFieldValues("med_supplied_name"), hasItem(it.getSuppliedName()));
        }
        for (MedicationOrder it : m.getOrders()) {
            assertThat(solrDoc.getFieldValues("med_provider"), hasItem(it.getProviderName()));
        }
        // VistA meds tend not to have indications, but they are desired and in the data model
        List<MedicationIndication> indications = m.getIndications();
        if (indications != null) {
            for (MedicationIndication it : indications) {
                assertThat(solrDoc.getFieldValues("med_indication_code"), hasItem(it.getCode()));
                assertThat(solrDoc.getFieldValues("med_indication_narrative"), hasItem(it.getNarrative()));
            }
        }

        // VistA meds tend not to have indications, but they are desired and in the data model
        List<JdsCode> codes = m.getCodes();
        if (codes != null) {
            for (JdsCode it : codes) {
                assertThat(solrDoc.getFieldValues("codes_code"), hasItem(it.getCode()));
                assertThat(solrDoc.getFieldValues("codes_system"), hasItem(it.getSystem()));
                assertThat(solrDoc.getFieldValues("codes_display"), hasItem(it.getDisplay()));
            }
        }

        // excluded by aliasing
        assertExcluded(solrDoc, "sig");
        assertExcluded(solrDoc, "patient_instruction");
        assertExcluded(solrDoc, "indications");
        assertExcluded(solrDoc, "products");
        assertExcluded(solrDoc, "orders");

        // excluded
        assertExcluded(solrDoc, "local_id");
        assertExcluded(solrDoc, "predecessor");
        assertExcluded(solrDoc, "successor");
        assertExcluded(solrDoc, "productFormCode");
        assertExcluded(solrDoc, "productFormName");
        assertExcluded(solrDoc, "stopped");
        assertExcluded(solrDoc, "med_status");
        assertExcluded(solrDoc, "med_status_name");
        assertExcluded(solrDoc, "med_type");
        assertExcluded(solrDoc, "IMO");
        assertExcluded(solrDoc, "dosages");
        assertExcluded(solrDoc, "fills");
    }
}
