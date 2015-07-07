package gov.va.cpe.vpr;

import gov.va.hmp.ptselect.PatientSelect;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertThat;

public class DomainNameUtilsTests {

    @Test
    public void testGetDomainsForClass() throws Exception {
        // patient data
        assertThat(DomainNameUtils.getDomainsForClass(Allergy.class), hasItems("allergy"));
        assertThat(DomainNameUtils.getDomainsForClass(Document.class), hasItems("document"));
        assertThat(DomainNameUtils.getDomainsForClass(Encounter.class), hasItems("encounter"));
        assertThat(DomainNameUtils.getDomainsForClass(HealthFactor.class), hasItems("factor"));
        assertThat(DomainNameUtils.getDomainsForClass(Immunization.class), hasItems("immunization"));
        assertThat(DomainNameUtils.getDomainsForClass(Medication.class), hasItems("med"));
        assertThat(DomainNameUtils.getDomainsForClass(Order.class), hasItems("order"));
        assertThat(DomainNameUtils.getDomainsForClass(Observation.class), hasItems("observation"));
        assertThat(DomainNameUtils.getDomainsForClass(Problem.class), hasItems("problem"));
        assertThat(DomainNameUtils.getDomainsForClass(Procedure.class), hasItems("procedure", "consult"));
        assertThat(DomainNameUtils.getDomainsForClass(Result.class), hasItems("result"));
        assertThat(DomainNameUtils.getDomainsForClass(VitalSign.class), hasItems("vital"));
        assertThat(DomainNameUtils.getDomainsForClass(Task.class), hasItems("task"));

        // operational data
        assertThat(DomainNameUtils.getDomainsForClass(PatientSelect.class), hasItems("pt-select"));
    }

    @Test
    public void testGetClassForDomain() throws Exception {
        assertSame(Allergy.class, DomainNameUtils.getClassForDomain("allergy"));
        assertSame(Document.class, DomainNameUtils.getClassForDomain("document"));
        assertSame(Encounter.class, DomainNameUtils.getClassForDomain("encounter"));
        assertSame(HealthFactor.class, DomainNameUtils.getClassForDomain("factor"));
        assertSame(Immunization.class, DomainNameUtils.getClassForDomain("immunization"));
        assertSame(Medication.class, DomainNameUtils.getClassForDomain("med"));
        assertSame(Order.class, DomainNameUtils.getClassForDomain("order"));
        assertSame(Observation.class, DomainNameUtils.getClassForDomain("observation"));
        assertSame(Problem.class, DomainNameUtils.getClassForDomain("problem"));
        assertSame(Procedure.class, DomainNameUtils.getClassForDomain("procedure"));
        assertSame(Procedure.class, DomainNameUtils.getClassForDomain("consult"));
        assertSame(Result.class, DomainNameUtils.getClassForDomain("result"));
        assertSame(VitalSign.class, DomainNameUtils.getClassForDomain("vital"));
        assertSame(Task.class, DomainNameUtils.getClassForDomain("task"));

        // operational data
        assertSame(PatientSelect.class, DomainNameUtils.getClassForDomain("pt-select"));
    }
}
