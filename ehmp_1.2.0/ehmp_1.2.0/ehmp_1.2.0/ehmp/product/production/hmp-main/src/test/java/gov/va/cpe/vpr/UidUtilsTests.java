package gov.va.cpe.vpr;

import gov.va.cpe.odc.Location;
import gov.va.cpe.odc.Person;
import gov.va.cpe.order.*;
import gov.va.cpe.roster.Roster;
import gov.va.cpe.tabs.ChartTab;
import gov.va.cpe.tabs.UserTabPrefs;
import gov.va.cpe.team.Category;
import gov.va.cpe.team.Team;
import gov.va.cpe.team.TeamPosition;
import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;
import gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDefConfigTemplate;
import gov.va.cpe.vpr.sync.vista.Foo;
import gov.va.hmp.app.Page;
import gov.va.hmp.ptselect.PatientSelect;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;

public class UidUtilsTests {
    @Test
    public void testGetDomainClassByUid() {
        // patient data
        assertSame(UidUtils.getDomainClassByUid("urn:va:allergy:9F06:229:354"), Allergy.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:consult:9F06:229:354"), Procedure.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:document:9F06:229:354"), Document.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:visit:9F06:229:354"), Encounter.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:appointment:9F06:229:354"), Encounter.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:factor:9F06:229:354"), HealthFactor.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:immunization:9F06:229:354"), Immunization.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:med:6273:229:orderID9527"), Medication.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:med:6273:229:354"), Medication.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:obs:9F06:229:354"), Observation.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:order:9F06:229:354"), Order.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:ORDER:9F06:229:354"), Order.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:patient:9F06:229"), PatientDemographics.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:patient:9F06:229:229"), PatientDemographics.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:problem:9F06:229:354"), Problem.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:procedure:9F06:229:354"), Procedure.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:image:9F06:229:354"), Procedure.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:lab:6273:229:CH;6889297.92;2"), Result.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:vital:6273:229:32536"), VitalSign.class);

        // operational data
        assertSame(UidUtils.getDomainClassByUid("urn:va:pt-select:9F06:12345"), PatientSelect.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:user:9F06:12345"), Person.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:location:9F06:12345"), Location.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:viewdefdefcoldefconfigtemplate:9F06:12345"), ViewDefDefColDefConfigTemplate.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:category:9F06:12345"), Category.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:teamposition:9F06:12345"), TeamPosition.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:team:9F06:12345"), Team.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:pointofcare:9F06:12345"), PointOfCare.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:personphoto:9F06:12345"), PersonPhoto.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:orderable:9F06:12345"), Orderable.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:route:9F06:12345"), Route.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:schedule:9F06:12345"), Schedule.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:qo:9F06:12345"), QuickOrder.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:viewdefdef:9F06:12345"), ViewDefDef.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:page:9F06:12345"), Page.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:displayGroup:9F06:12345"), OrderDisplayGroup.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:charttab:9F06:12345"), ChartTab.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:usertabprefs:9F06:12345"), UserTabPrefs.class);
        assertSame(UidUtils.getDomainClassByUid("urn:va:roster:9F06:12345"), Roster.class);
    }

    @Test
    public void testGetDomainClass() {
        // patient data
        assertSame(UidUtils.getDomainClass("allergy"), Allergy.class);
        assertSame(UidUtils.getDomainClass("consult"), Procedure.class);
        assertSame(UidUtils.getDomainClass("document"), Document.class);
        assertSame(UidUtils.getDomainClass("visit"), Encounter.class);
        assertSame(UidUtils.getDomainClass("appointment"), Encounter.class);
        assertSame(UidUtils.getDomainClass("factor"), HealthFactor.class);
        assertSame(UidUtils.getDomainClass("immunization"), Immunization.class);
        assertSame(UidUtils.getDomainClass("med"), Medication.class);
        assertSame(UidUtils.getDomainClass("med"), Medication.class);
        assertSame(UidUtils.getDomainClass("obs"), Observation.class);
        assertSame(UidUtils.getDomainClass("order"), Order.class);
        assertSame(UidUtils.getDomainClass("patient"), PatientDemographics.class);
        assertSame(UidUtils.getDomainClass("problem"), Problem.class);
        assertSame(UidUtils.getDomainClass("procedure"), Procedure.class);
        assertSame(UidUtils.getDomainClass("image"), Procedure.class);
        assertSame(UidUtils.getDomainClass("lab"), Result.class);
        assertSame(UidUtils.getDomainClass("vital"), VitalSign.class);

        // operational data
        assertSame(UidUtils.getDomainClass("user"), Person.class);
        assertSame(UidUtils.getDomainClass("location"), Location.class);
        assertSame(UidUtils.getDomainClass("viewdefdefcoldefconfigtemplate"), ViewDefDefColDefConfigTemplate.class);
        assertSame(UidUtils.getDomainClass("category"), Category.class);
        assertSame(UidUtils.getDomainClass("teamposition"), TeamPosition.class);
        assertSame(UidUtils.getDomainClass("team"), Team.class);
        assertSame(UidUtils.getDomainClass("pointofcare"), PointOfCare.class);
        assertSame(UidUtils.getDomainClass("personphoto"), PersonPhoto.class);
        assertSame(UidUtils.getDomainClass("orderable"), Orderable.class);
        assertSame(UidUtils.getDomainClass("route"), Route.class);
        assertSame(UidUtils.getDomainClass("schedule"), Schedule.class);
        assertSame(UidUtils.getDomainClass("qo"), QuickOrder.class);
        assertSame(UidUtils.getDomainClass("viewdefdef"), ViewDefDef.class);
        assertSame(UidUtils.getDomainClass("page"), Page.class);
        assertSame(UidUtils.getDomainClass("displaygroup"), OrderDisplayGroup.class);
        assertSame(UidUtils.getDomainClass("charttab"), ChartTab.class);
        assertSame(UidUtils.getDomainClass("usertabprefs"), UserTabPrefs.class);
        assertSame(UidUtils.getDomainClass("roster"), Roster.class);
    }

    @Test
    public void testGetDomainName() {
        // patient data
        assertThat(UidUtils.getDomainName(Allergy.class), is("allergy"));
        assertThat(UidUtils.getDomainName(Document.class), is("document"));
        assertThat(UidUtils.getDomainName(HealthFactor.class), is("factor"));
        assertThat(UidUtils.getDomainName(Immunization.class), is("immunization"));
        assertThat(UidUtils.getDomainName(Medication.class), is("med"));
        assertThat(UidUtils.getDomainName(Observation.class), is("obs"));
        assertThat(UidUtils.getDomainName(Order.class), is("order"));
        assertThat(UidUtils.getDomainName(PatientDemographics.class), is("patient"));
        assertThat(UidUtils.getDomainName(Problem.class), is("problem"));
        assertThat(UidUtils.getDomainName(Result.class), is("lab"));
        assertThat(UidUtils.getDomainName(VitalSign.class), is("vital"));

        // operational data
        assertThat(UidUtils.getDomainName(PatientSelect.class), is("pt-select"));
        assertThat(UidUtils.getDomainName(Person.class), is("user"));
        assertThat(UidUtils.getDomainName(Location.class), is("location"));
        assertThat(UidUtils.getDomainName(ViewDefDefColDefConfigTemplate.class), is("viewdefdefcoldefconfigtemplate"));
        assertThat(UidUtils.getDomainName(Category.class), is("category"));
        assertThat(UidUtils.getDomainName(TeamPosition.class), is("teamposition"));
        assertThat(UidUtils.getDomainName(Team.class), is("team"));
        assertThat(UidUtils.getDomainName(PointOfCare.class), is("pointofcare"));
        assertThat(UidUtils.getDomainName(PersonPhoto.class), is("personphoto"));
        assertThat(UidUtils.getDomainName(Orderable.class), is("orderable"));
        assertThat(UidUtils.getDomainName(Route.class), is("route"));
        assertThat(UidUtils.getDomainName(Schedule.class), is("schedule"));
        assertThat(UidUtils.getDomainName(QuickOrder.class), is("qo"));
        assertThat(UidUtils.getDomainName(ViewDefDef.class), is("viewdefdef"));
        assertThat(UidUtils.getDomainName(Page.class), is("page"));
        assertThat(UidUtils.getDomainName(OrderDisplayGroup.class), is("displaygroup"));
        assertThat(UidUtils.getDomainName(ChartTab.class), is("charttab"));
        assertThat(UidUtils.getDomainName(UserTabPrefs.class), is("usertabprefs"));
        assertThat(UidUtils.getDomainName(Roster.class), is("roster"));

        // other classes
        assertThat(UidUtils.getDomainName(Foo.class), is("foo"));
    }

    @Test
    public void testGetDomainNameMultipleMappings() {
        try {
            UidUtils.getDomainName(Encounter.class);
            fail("expected " + IllegalArgumentException.class.getName());
        } catch (IllegalArgumentException e) {
            // NOOP
        }
        try {
            UidUtils.getDomainName(Procedure.class);
            fail("expected " + IllegalArgumentException.class.getName());
        } catch (IllegalArgumentException e) {
            // NOOP
        }
    }

    @Test
    public void testGetPatientDataUid() {
        assertThat(UidUtils.getAllergyUid("9F06", "229", "354"), is("urn:va:allergy:9F06:229:354"));
        assertThat(UidUtils.getAppointmentUid("9F06", "229", "354"), is("urn:va:appointment:9F06:229:354"));
        assertThat(UidUtils.getConsultUid("9F06", "229", "354"), is("urn:va:consult:9F06:229:354"));
        assertThat(UidUtils.getDocumentUid("9F06", "229", "354"), is("urn:va:document:9F06:229:354"));
        assertThat(UidUtils.getHealthFactorUid("9F06", "229", "354"), is("urn:va:factor:9F06:229:354"));
        assertThat(UidUtils.getImmunizationUid("9F06", "229", "354"), is("urn:va:immunization:9F06:229:354"));
        assertThat(UidUtils.getMedicationUid("9F06", "229", "354"), is("urn:va:med:9F06:229:354"));
        assertThat(UidUtils.getOrderUid("9F06", "229", "354"), is("urn:va:order:9F06:229:354"));
        assertThat(UidUtils.getPatientUid("9F06", "229"), is("urn:va:patient:9F06:229:229"));
        assertThat(UidUtils.getPatientSelectUid("9F06", "229"), is("urn:va:pt-select:9F06:229:229"));
        assertThat(UidUtils.getProblemUid("9F06", "229", "354"), is("urn:va:problem:9F06:229:354"));
        assertThat(UidUtils.getProcedureUid("9F06", "229", "354"), is("urn:va:procedure:9F06:229:354"));
        assertThat(UidUtils.getRadiologyUid("9F06", "229", "354"), is("urn:va:image:9F06:229:354"));
        assertThat(UidUtils.getResultUid("9F06", "229", "CH;6889297.92;2"), is("urn:va:lab:9F06:229:CH;6889297.92;2"));
        assertThat(UidUtils.getResultOrganizerUid("9F06", "229", "354"), is("urn:va:lab:9F06:229:354"));
        assertThat(UidUtils.getVisitUid("9F06", "229", "354"), is("urn:va:visit:9F06:229:354"));
        assertThat(UidUtils.getVitalSignUid("9F06", "229", "354"), is("urn:va:vital:9F06:229:354"));
    }

    @Test
    public void testGetOperationalDataUid() {
        assertThat(UidUtils.getUserUid("9F06", "12345"), is("urn:va:user:9F06:12345"));
    }

    @Test
    public void testGetCollectionNameFromUid() {
        assertThat(UidUtils.getCollectionNameFromUid("urn:va:patient:9F06:229:229"), is("patient"));
        assertThat(UidUtils.getCollectionNameFromUid("urn:va:factor:9F06:229:354"), is("factor"));
        assertThat(UidUtils.getCollectionNameFromUid("urn:va:order:9F06:229:354"), is("order"));
        assertThat(UidUtils.getCollectionNameFromUid(null), is(nullValue()));
        assertThat(UidUtils.getCollectionNameFromUid(""), is(nullValue()));
    }

    @Test
    public void testGetVistaIdFromPatientUid() {
        assertThat(UidUtils.getSystemIdFromPatientUid("urn:va:patient:9F06:229"), equalTo("9F06"));
    }

    @Test
    public void testGetLocalPatientIdFromPatientUid() {
        assertThat(UidUtils.getLocalPatientIdFromPatientUid("urn:va:patient:9F06:229"), equalTo("229"));
    }

}
