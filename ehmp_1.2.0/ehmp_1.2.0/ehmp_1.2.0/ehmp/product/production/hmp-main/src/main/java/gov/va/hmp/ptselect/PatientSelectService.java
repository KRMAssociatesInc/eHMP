package gov.va.hmp.ptselect;

import gov.va.cpe.odc.Location;
import gov.va.cpe.odc.Person;
import gov.va.cpe.vpr.NotFoundException;
import gov.va.cpe.vpr.UserInterfaceRpcConstants;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.ptselect.dao.IPatientSelectDAO;
import gov.va.hmp.vista.rpc.RpcOperations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.regex.Pattern;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.CONTROLLER_RPC_URI;

/**
 * Implementation of IPatientSelectService built on {@link gov.va.cpe.roster.IRosterService}.
 */
@Service
public class PatientSelectService implements IPatientSelectService, EnvironmentAware {

    public static final String DUMMY_ROSTER_NAME = "PatientSelectDummyRoster";
    public static final String PT_SEARCH_MATCH_FIELD = "name";

    public static final String GET_WARD_PATIENTS_COMMAND = "getWardList";
    public static final String GET_CLINIC_PATIENTS_COMMAND = "getClinicList";
    public static final String GET_CPRS_DEFAULT_LIST_PATIENTS_COMMAND = "getDefaultPatientList";

    private static final Pattern LAST_4_PATTERN = Pattern.compile("\\d{1,4}");    // 1-4 digits
    private static final Pattern LAST_5_PATTERN = Pattern.compile("\\D\\d{1,4}"); // non-digit followed by 1-4 digits
    private static final Pattern SSN_PATTERN = Pattern.compile("(\\d{5,9}|\\d{3}\\-\\d{2}\\-\\d{4})P?");       // 5-9 digits, or dash form, optional P at end
    public static final String TODAY_DATE_RANGE_EXPRESSION = "T..T";

    private RpcOperations rpcTemplate;
    private IPatientSelectDAO patientSelectDAO;
    private IGenericPOMObjectDAO pomObjectDAO;
    private Environment environment;

    private final Map<FilterType, String> filterTypeToFetchRpcUri = new HashMap<FilterType, String>();
    private final PieceLineMapper firstPieceLineMapper = new PieceLineMapper(1);
    private final VistaPatientSelectRpcResponseExtractor vistaPtSelectExtractor = new VistaPatientSelectRpcResponseExtractor();

    public PatientSelectService() {
        filterTypeToFetchRpcUri.put(FilterType.WARD, UserInterfaceRpcConstants.ORQPT_WARDS_URI);
        filterTypeToFetchRpcUri.put(FilterType.SPECIALTY, UserInterfaceRpcConstants.ORQPT_SPECIALTIES_URI);
        filterTypeToFetchRpcUri.put(FilterType.CLINIC, UserInterfaceRpcConstants.ORWU_CLINLOC_URI);
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @Autowired
    public void setPatientSelectDAO(IPatientSelectDAO patientSelectDAO) {
        this.patientSelectDAO = patientSelectDAO;
    }

    @Autowired
    public void setPOMObjectDAO(IGenericPOMObjectDAO pomObjectDAO) {
        this.pomObjectDAO = pomObjectDAO;
    }

    @Autowired
    public void setRpcTemplate(RpcOperations rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
    }

    @Override
    public Page<Map<String, Object>> searchWards(String query, Pageable pageable) {
        return searchFiltersOfType(FilterType.WARD, query, pageable);
    }

    @Override
    public Page<Map<String, Object>> searchClinics(String query, Pageable pageable) {
        return searchFiltersOfType(FilterType.CLINIC, query, pageable);
    }

    @Override
    public Page<Map<String, Object>> searchSpecialties(String query, Pageable pageable) {
        return searchFiltersOfType(FilterType.SPECIALTY, query, pageable);
    }

    @Override
    public Page<Map<String, Object>> searchProviders(String query, Pageable pageable) {
        return searchFiltersOfType(FilterType.PROVIDER, query, pageable);
    }

    @Override
    public Page<Map<String, Object>> searchFiltersOfType(FilterType filterType, String query, Pageable pageable) {
    	if(query==null) {query="";}
        if (filterType == FilterType.PROVIDER) {
            Page<Person> persons = pomObjectDAO.findAllByIndexAndRange(Person.class, "person", query+"*", pageable);

            List<Map<String, Object>> rslt = new ArrayList<Map<String, Object>>(persons.getSize());
            for (Person p : persons) {
                rslt.add(p.getData(JSONViews.WSView.class));
            }
            return new PageImpl<Map<String, Object>>(rslt, pageable, persons.getTotalElements());
        } else if (filterType == FilterType.CLINIC || filterType == FilterType.WARD) {
            Page<Location> locs = pomObjectDAO.findAllByIndexAndRange(Location.class,
    			(filterType == FilterType.CLINIC?"locations-clinics":"locations-wards"), query+"*", pageable);

            List<Map<String, Object>> rslt = new ArrayList<Map<String, Object>>(locs.getSize());
        	for(Location loc: locs) {
    			rslt.add(loc.getData(JSONViews.WSView.class));
        	}
            return new PageImpl<Map<String, Object>>(rslt, pageable, locs.getTotalElements());
        } else {
            throw new UnsupportedOperationException();
        }
    }

    @Override
    public Page<PatientSelect> searchPatients(String query, Pageable pageable) {
        Assert.hasText(query, "[Assertion failed] - 'query' argument must have text; it must not be null, empty, or blank when searching for patients");

        if (!StringUtils.hasText(query)) {
            return new PageImpl<>(Collections.<PatientSelect>emptyList(), pageable, 0L);
        }

        if (LAST_5_PATTERN.matcher(query).matches()) {
            return patientSelectDAO.findAllByLast5(query, pageable);
        } else if (LAST_4_PATTERN.matcher(query).matches()) {
            return patientSelectDAO.findAllByLast4(query, pageable);
        } else if (SSN_PATTERN.matcher(query).matches()) {
            return patientSelectDAO.findAllBySSN(query, pageable);
        }
        return patientSelectDAO.findAllByName(query, pageable);
    }

    public PatientSelectsAndMetadata searchPatientsInWard(String query, String wardUid, Pageable pageable) {
        return searchPatientsInVistaPatientList(query, FilterType.WARD, wardUid, null, pageable);
    }

    public PatientSelectsAndMetadata searchPatientsInClinic(String query, String clinicUid, String relativeDateRangeExpression, Pageable pageable) {
        return searchPatientsInVistaPatientList(query, FilterType.CLINIC, clinicUid, relativeDateRangeExpression, pageable);
    }

    public PatientSelectsAndMetadata searchPatientsInSpecialty(String query, String specialtyId, Pageable pageable) {
        return searchPatientsInVistaPatientList(query, FilterType.SPECIALTY, specialtyId, null, pageable);
    }

    public PatientSelectsAndMetadata searchPatientsByProvider(String query, String providerId, Pageable pageable) {
        return searchPatientsInVistaPatientList(query, FilterType.PROVIDER, providerId, null, pageable);
    }

    public PatientSelectsAndMetadata searchPatientsInCPRSDefaultList(String query, String userUid, Pageable pageable) {
        return searchPatientsInVistaPatientList(query, FilterType.CPRS_DEFAULT, userUid, null, pageable);
    }

    private PatientSelectsAndMetadata searchPatientsInVistaPatientList(String query, FilterType filterType, String filterUid, String relativeDateRangeExpression, Pageable pageable) {
        Assert.notNull(filterType, "[Assertion failed] - 'filterType' argument must not be null when searching patients via a filter");
        Assert.hasText(filterUid, "[Assertion failed] - 'filterId' argument must have text; it must not be null, empty, or blank when searching patients via a filter");

        VistaPatientSelectsAndMetadata vistaPtSelects = null;
        if (filterType == FilterType.CLINIC) {
            Location clinic = pomObjectDAO.findByUID(Location.class, filterUid);
            if (clinic == null) throw new NotFoundException("Clinic '" + filterUid + "' not found.");

            if (!StringUtils.hasText(relativeDateRangeExpression)) {
                relativeDateRangeExpression = TODAY_DATE_RANGE_EXPRESSION;
            }
            String[] dateRange = relativeDateRangeExpression.split("\\.\\.");

            Map rpcArg = createClinicPatientsRpcCommand(clinic.getLocalId(), dateRange[0], dateRange[1]);
            vistaPtSelects = rpcTemplate.execute(vistaPtSelectExtractor, CONTROLLER_RPC_URI, rpcArg);
        } else if (filterType == FilterType.CPRS_DEFAULT) {
            Map rpcArg = createCprsDefaultPatientsRpcCommand();
            vistaPtSelects = rpcTemplate.execute(vistaPtSelectExtractor, CONTROLLER_RPC_URI, rpcArg);
        } else if (filterType == FilterType.WARD){
            Location ward = pomObjectDAO.findByUID(Location.class, filterUid);
            if (ward == null) throw new NotFoundException("Ward '" + filterUid + "' not found.");

            Map rpcArg = createWardPatientsRpcCommand(ward.getRefId());
            vistaPtSelects = rpcTemplate.execute(vistaPtSelectExtractor, CONTROLLER_RPC_URI, rpcArg);
        } else {
            throw new IllegalArgumentException("'filterType' is currently unsupported " + filterType);
        }

        Set<String> pids = new HashSet<>(vistaPtSelects.getPatients().size());
        for (VistaPatientSelect ptSelect : vistaPtSelects.getPatients()) {
            pids.add(ptSelect.getPid());
        }

        List<PatientSelect> patients = patientSelectDAO.findAllPids(new ArrayList(pids));
        patients = filterByQuery(patients, query);
        Map<String, PatientSelect> ptSelectsByPid = nest(patients);
        patients = merge(ptSelectsByPid, vistaPtSelects.getPatients());
        return new PatientSelectsAndMetadata(vistaPtSelects.getDefaultPatientListSourceName(),
                vistaPtSelects.getDefaultPatientListSourceType(),
                vistaPtSelects.getDefaultPatientListSourceSort(),
                new PageImpl<PatientSelect>(patients, pageable, patients.size()));
    }

    private List<PatientSelect> merge(Map<String, PatientSelect> ptSelectsByPid, List<VistaPatientSelect> vistaPtSelects) {
        List<PatientSelect> patients = new ArrayList<>(vistaPtSelects.size());
        for (VistaPatientSelect vistaSelect : vistaPtSelects) {
            PatientSelect ptSelect = ptSelectsByPid.get(vistaSelect.getPid());
            if (ptSelect == null) continue;
            Map<String,Object> data = ptSelect.getData();
            if (StringUtils.hasText(vistaSelect.getSourceDisplayName())) {
                data.put("sourceDisplayName", vistaSelect.getSourceDisplayName());
            }
            if (StringUtils.hasText(vistaSelect.getSourceDisplayName())) {
                data.put("sourceName", vistaSelect.getSourceName());
            }
            if (StringUtils.hasText(vistaSelect.getSourceDisplayName())) {
                data.put("sourceShortName", vistaSelect.getSourceShortName());
            }
            if (StringUtils.hasText(vistaSelect.getSourceDisplayName())) {
                data.put("sourceUid", vistaSelect.getSourceUid());
            }
            if (StringUtils.hasText(vistaSelect.getPatientType())) {
                data.put("patientType", vistaSelect.getPatientType());
            }
            if (StringUtils.hasText(vistaSelect.getRoomBed())) {
                data.put("roomBed", vistaSelect.getRoomBed());
            }
            if (vistaSelect.getAppointment() != null) {
                data.put("appointment", vistaSelect.getAppointment());
            }
            if (vistaSelect.getAppointmentUid() != null) {
                data.put("appointmentUid", vistaSelect.getAppointmentUid());
            }
            if (vistaSelect.getAdmissionUid() != null) {
                data.put("admissionUid", vistaSelect.getAdmissionUid());
            }
            if (vistaSelect.getLocationShortName() != null) {
                data.put("locationShortName", vistaSelect.getLocationShortName());
            }
            patients.add(new PatientSelect(data));
        }
        return patients;
    }

    private Map<String, PatientSelect> nest(List<PatientSelect> patients) {
        Map<String, PatientSelect> ptSelectsByPid = new HashMap<>(patients.size());
        for (PatientSelect ptSelect : patients) {
            ptSelectsByPid.put(ptSelect.getPid(), ptSelect);
        }
        return ptSelectsByPid;
    }

    private Map createCprsDefaultPatientsRpcCommand() {
        Map rpcArg = new HashMap();
        rpcArg.put("command", GET_CPRS_DEFAULT_LIST_PATIENTS_COMMAND);
        rpcArg.put("server", environment.getProperty(HmpProperties.SERVER_ID));
        return rpcArg;
    }

    private Map createWardPatientsRpcCommand(String wardLocalId) {
        Map rpcArg = new HashMap();
        rpcArg.put("command", GET_WARD_PATIENTS_COMMAND);
        rpcArg.put("server", environment.getProperty(HmpProperties.SERVER_ID));
        rpcArg.put("id", wardLocalId);
        return rpcArg;
    }

    private Map createClinicPatientsRpcCommand(String clinicLocalId, String dateRangeStart, String dateRangeEnd) {
        Map rpcArg = new HashMap();
        rpcArg.put("command", GET_CLINIC_PATIENTS_COMMAND);
        rpcArg.put("server", environment.getProperty(HmpProperties.SERVER_ID));
        rpcArg.put("id", clinicLocalId);
        rpcArg.put("start", dateRangeStart);
        rpcArg.put("end", dateRangeEnd);
        return rpcArg;
    }

    private List<PatientSelect> filterByQuery(List<PatientSelect> patients, String query) {
        if (patients.isEmpty()) return Collections.emptyList();

        // don't do any filtering if there is no query string
        if (!StringUtils.hasText(query)) return patients;
        String queryMatch = query.toLowerCase();

        List<PatientSelect> matchingPatients = new ArrayList<PatientSelect>();
        for (PatientSelect pt : patients) {
        	String name = pt.getFullName();
        	if (name != null && name.toLowerCase().contains(queryMatch)) {
                matchingPatients.add(pt);
            }
        }
        return matchingPatients;
    }
}
