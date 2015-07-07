package us.vistacore.vxsync;

import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import us.vistacore.vxsync.hdr.HdrSoapHandler;
import us.vistacore.vxsync.config.VxSoapConfiguration;
import us.vistacore.vxsync.dod.*;
import us.vistacore.vxsync.mvi.MviRestEndpoint;
import us.vistacore.vxsync.vler.VlerSoapHandler;
import us.vistacore.vxsync.term.TerminologyService;


public class VxSoapHandler extends Application<VxSoapConfiguration> {
    public static void main(String[] args) throws Exception {
        new VxSoapHandler().run(args);
    }

    @Override
    public void initialize(Bootstrap<VxSoapConfiguration> bootstrap) {
    }

    @Override
    public void run(VxSoapConfiguration configuration, Environment environment) {
        final String template = configuration.getTemplate();
        final String defaultName = configuration.getDefaultName();

        environment.jersey().register(new JMeadowsSoapHandler(template, defaultName));
        environment.jersey().register(new VlerSoapHandler(template, defaultName));
        environment.jersey().register(new HdrSoapHandler(template, defaultName));
        environment.jersey().register(new MviRestEndpoint(template, defaultName));
        environment.jersey().register(new TerminologyService(template, defaultName));

        /*
        // Only activate services that are enabled
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getHdr() == true) {
            environment.jersey().register(new VxHdrResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getVler() == true) {
            environment.jersey().register(new VxVlerResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getPgd() == true) {
            environment.jersey().register(new VxPgdResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getAllergy() == true) {
            environment.jersey().register(new VxDodAllergyResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getAppointment() == true) {
            environment.jersey().register(new VxDodAppointmentResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getConsultnote() == true) {
            environment.jersey().register(new VxDodConsultNoteResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getDemographics() == true) {
            environment.jersey().register(new VxDodDemographicsResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getEncounter() == true) {
            environment.jersey().register(new VxDodEncounterResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getImmunization() == true) {
            environment.jersey().register(new VxDodImmunizationResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getLab() == true) {
            environment.jersey().register(new VxDodLabResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getMedication() == true) {
            environment.jersey().register(new VxDodMedicationResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getNote() == true) {
            environment.jersey().register(new VxDodNoteResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getOrder() == true) {
            environment.jersey().register(new VxDodOrderResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getPatient() == true) {
            environment.jersey().register(new VxDodPatientResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getProblem() == true) {
            environment.jersey().register(new VxDodProblemResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getRadiology() == true) {
            environment.jersey().register(new VxDodRadiologyResource(template, defaultName));
        }
        if (configuration.getServicesEnabled().getAllFlag() == true || configuration.getServicesEnabled().getDod().getVital() == true) {
            environment.jersey().register(new VxDodVitalResource(template, defaultName));
        }
        */

        environment.healthChecks().register("sample-healthcheck", new TemplateHealthCheck(template));
    }

}
