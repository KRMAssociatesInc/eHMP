package gov.va.hmp.ptselect;

import gov.va.cpe.vpr.web.BadRequestException;
import gov.va.hmp.jsonc.JsonCCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class PatientSelectController {

    private IPatientSelectService patientSelectService;

    @Autowired
    public void setPatientSelectService(IPatientSelectService patientSelectService) {
        this.patientSelectService = patientSelectService;
    }

    @RequestMapping(value = "/patientselect/v{apiVersion}/wards", method = GET)
    public ModelAndView fetchWardList(@PathVariable String apiVersion,
                                      @RequestParam(required = false) String query,
                                      Pageable pageRequest,
                                      HttpServletRequest request) {
        Page<Map<String, Object>> wards = patientSelectService.searchWards(query, pageRequest);
        return createJsonC(request, wards);
    }

    @RequestMapping(value = "/patientselect/v{apiVersion}/clinics", method = GET)
    public ModelAndView fetchClinicList(@PathVariable String apiVersion,
                                        @RequestParam(required = false) String query,
                                        Pageable pageRequest,
                                        HttpServletRequest request) {
        Page<Map<String, Object>> clinics = patientSelectService.searchClinics(query, pageRequest);
        return createJsonC(request, clinics);
    }

    @RequestMapping(value = "/patientselect/v{apiVersion}/specialties", method = GET)
    public ModelAndView fetchSpecialtyList(@PathVariable String apiVersion,
                                           @RequestParam(required = false) String query,
                                           Pageable pageRequest,
                                           HttpServletRequest request) {
        Page<Map<String, Object>> patients = patientSelectService.searchSpecialties(query, pageRequest);
        return createJsonC(request, patients);
    }

    @RequestMapping(value = "/patientselect/v{apiVersion}/providers", method = GET)
    public ModelAndView fetchProviderList(@PathVariable String apiVersion,
                                          @RequestParam(required = false) String query,
                                          Pageable pageRequest,
                                          HttpServletRequest request) {
        Page<Map<String, Object>> providers = patientSelectService.searchProviders(query, pageRequest);
        return createJsonC(request, providers);
    }

    @RequestMapping(value = "/patientselect/v{apiVersion}/patients", method = GET)
    public ModelAndView searchPatients(@PathVariable String apiVersion,
                                       @RequestParam(required = false) String query,
                                       Pageable pageable,
                                       HttpServletRequest request) {
        try {
            Page<PatientSelect> patients = patientSelectService.searchPatients(query, pageable);
            screenSensitivePatients(patients);
            return contentNegotiatingModelAndView(JsonCCollection.create(request, patients));
        } catch (IllegalArgumentException e) {
           throw new BadRequestException(e.getMessage());
        }
    }

    @RequestMapping(value = "/patientselect/v{apiVersion}/patients", method = GET, params = "ward")
    public ModelAndView searchPatientsInWard(@PathVariable String apiVersion,
                                             @RequestParam(required = false) String query,
                                             @RequestParam("ward") String wardUid,
                                             Pageable pageable,
                                             HttpServletRequest request) {
        PatientSelectsAndMetadata list = patientSelectService.searchPatientsInWard(query, wardUid, pageable);
        screenSensitivePatients(list.getPatients());
        return createJsonC(request, list);
    }

    @RequestMapping(value = "/patientselect/v{apiVersion}/patients", method = GET, params = "clinic")
    public ModelAndView searchPatientsInClinic(@PathVariable String apiVersion,
                                               @RequestParam(required = false) String query,
                                               @RequestParam("clinic") String clinicUid,
                                               @RequestParam("dateRange") String dateRangeExpression,
                                               Pageable pageable,
                                               HttpServletRequest request) {
        PatientSelectsAndMetadata list = patientSelectService.searchPatientsInClinic(query, clinicUid, dateRangeExpression, pageable);
        screenSensitivePatients(list.getPatients());
        return createJsonC(request, list);
    }

    @RequestMapping(value = "/patientselect/v{apiVersion}/patients", method = GET, params = "specialty")
    public ModelAndView searchPatientsInSpecialty(@PathVariable String apiVersion,
                                                  @RequestParam(required = false) String query,
                                                  @RequestParam("specialty") String specialtyId,
                                                  Pageable pageable,
                                                  HttpServletRequest request) {
        PatientSelectsAndMetadata list = patientSelectService.searchPatientsInSpecialty(query, specialtyId, pageable);
        screenSensitivePatients(list.getPatients());
        return createJsonC(request, list);
    }

    @RequestMapping(value = "/patientselect/v{apiVersion}/patients", method = GET, params = "provider")
    public ModelAndView searchPatientsByProvider(@PathVariable String apiVersion,
                                                 @RequestParam(required = false) String query,
                                                 @RequestParam("provider") String providerId,
                                                 Pageable pageable,
                                                 HttpServletRequest request) {
        PatientSelectsAndMetadata list = patientSelectService.searchPatientsByProvider(query, providerId, pageable);
        screenSensitivePatients(list.getPatients());
        return createJsonC(request, list);
    }

    @RequestMapping(value = "/patientselect/v{apiVersion}/patients", method = GET, params = "cprs-default-list")
    public ModelAndView searchPatientsInCPRSDefaultList(@PathVariable String apiVersion,
                                                 @RequestParam(required = false) String query,
                                                 @RequestParam("cprs-default-list") String userId,
                                                 Pageable pageable,
                                                 HttpServletRequest request) {
        // TODO: use current user id, reject others with BadRequest exception
        PatientSelectsAndMetadata list = patientSelectService.searchPatientsInCPRSDefaultList(query, userId, pageable);
        screenSensitivePatients(list.getPatients());
        return createJsonC(request, list);
    }

    private ModelAndView createJsonC(HttpServletRequest request, List<Map<String, Object>> items) {
        return contentNegotiatingModelAndView(JsonCCollection.create(request, items));
    }

    private <T> ModelAndView createJsonC(HttpServletRequest request, Page<T> items) {
        return contentNegotiatingModelAndView(JsonCCollection.create(request, items));
    }

    private ModelAndView createJsonC(HttpServletRequest request, PatientSelectsAndMetadata list) {
        JsonCCollection<PatientSelect> jsonc = JsonCCollection.create(request, list.getPatients());
        jsonc.put("defaultPatientListSourceName", list.getDefaultPatientListSourceName());
        jsonc.put("defaultPatientListSourceType", list.getDefaultPatientListSourceType());
        jsonc.put("defaultPatientListSourceSort", list.getDefaultPatientListSourceSort());
        return contentNegotiatingModelAndView(jsonc);
    }

    private void screenSensitivePatients(Page<PatientSelect> patients) {
        for (PatientSelect pt : patients.getContent()) {
            if (pt.isSensitive() != null && pt.isSensitive()) {
                pt.setData("ssn", null);
                pt.setData("birthDate", null);
                pt.setData("deceased", null);
                pt.setData("last4", null);
                pt.setData("last5", null);
                pt.setData("genderCode", null);
                pt.setData("genderName", null);
            }
        }
    }
}
