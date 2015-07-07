package gov.va.cpe.pt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.ImmutableMap;
import gov.va.cpe.param.IParamService;
import gov.va.cpe.param.ParamService;
import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.VistaVprDataExtractEventStreamDAO;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static gov.va.cpe.pt.ThreadLocalPatientContext.PATIENT_CONTEXT_USER_PREF_KEY;
import static gov.va.cpe.vpr.UserInterfaceRpcConstants.CONTROLLER_CHAIN_RPC_URI;

@Service
public class VistaPatientContextService implements IVistaPatientContextService {

    public static final String GET_PATIENT_DEMOGRAPHICS_COMMAND = "getPatientInfo";
    public static final String GET_PATIENT_CHECKS_COMMAND = "getPatientChecks";

    private RpcOperations rpcTemplate;
    private IParamService paramService;
    private static final Logger LOG = LoggerFactory.getLogger(VistaVprDataExtractEventStreamDAO.class);

    @Autowired
    public void setRpcTemplate(RpcOperations rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
    }

    @Autowired
    public void setParamService(IParamService paramService) {
        this.paramService = paramService;
    }

    @Override
    public VistaPatientContextInfo fetchVistaPatientContextInfo(String pid, boolean saveCurrentPatientAsUserParam) {
        List<Map> commandList = createCommandList(pid, saveCurrentPatientAsUserParam);

        Map<String, Object> rpcArg = new HashMap<>();
        rpcArg.put("commandList", commandList);

        JsonNode jsonNode = rpcTemplate.executeForJson(CONTROLLER_CHAIN_RPC_URI, rpcArg);

        JsonNode patientInfoNode = jsonNode.get(GET_PATIENT_DEMOGRAPHICS_COMMAND);
        try {
            PatientDemographicsAdditional additionalDemographics = findAdditionPatientDemographics(patientInfoNode);
            PatientDemographics demographics = POMUtils.newInstance(PatientDemographics.class, patientInfoNode);
            PatientChecks checks = POMUtils.newInstance(PatientChecks.class, jsonNode.get(GET_PATIENT_CHECKS_COMMAND));
            // TODO: test for successful param save here?
            return new VistaPatientContextInfo(demographics, additionalDemographics, checks);
        }
        catch(RuntimeException e) {
            LOG.error("Unable to parse patient demographics for pid: "+pid, e);
            return null;
        }
    }
    // well ... if we make PatientDemographicsAdditional inherit from AbstractPomObject, we can make this code go away, right?
    private PatientDemographicsAdditional findAdditionPatientDemographics(JsonNode patNode) {
        JsonNode teamInfoNode = patNode.path("teamInfo");
        TeamInfo teamInfo = POMUtils.newInstance(TeamInfo.class, teamInfoNode);

        return new PatientDemographicsAdditional(patNode.path("admissionUid").asText(),
                                                 patNode.path("roomBed").asText(),
                                                 patNode.path("inpatientLocation").asText(),
                                                 patNode.path("shortInpatientLocation").asText(),
                                                 patNode.path("cwadf").asText(),
                                                 teamInfo);

        // remove nodes for additionalPatientDemographics so that these are not saved into PatientDemographics
        // well I just (7/14/24) commented this out .. well ... anyway .. we will save this info for the patientdemographics event stream ... right?
//        if (patNode instanceof ObjectNode)  {
//            ObjectNode oNd = ((ObjectNode) patNode);
//            oNd.remove("roomBed");
//            oNd.remove("inpatientLocation");
//            oNd.remove("shortInpatientLocation");
//            oNd.remove("cwadf");
//            oNd.remove("teamInfo");
//        }
    }

    private List<Map> createCommandList(String pid,  boolean saveCurrentPatientAsUserParam) {
        String localPatientId = PidUtils.getDfn(pid);
        if (saveCurrentPatientAsUserParam) {
            return Arrays.asList(createPatientDemographicsCommandRpcParams(localPatientId),
                    createPatientChecksCommandRpcParams(localPatientId),
                    createSaveCurrentPatientAsUserParamCommandRpcParams(pid));
        } else {
            return Arrays.asList(createPatientDemographicsCommandRpcParams(localPatientId),
                    createPatientChecksCommandRpcParams(localPatientId));
        }
    }

    private Map createPatientDemographicsCommandRpcParams(String localPatientId) {
        return ImmutableMap.of("command", GET_PATIENT_DEMOGRAPHICS_COMMAND, "patientId", localPatientId);
    }

    private Map createPatientChecksCommandRpcParams(String localPatientId) {
        return ImmutableMap.of("command", GET_PATIENT_CHECKS_COMMAND, "patientId", localPatientId);
    }

    private Map createSaveCurrentPatientAsUserParamCommandRpcParams(String pid) {
        Map<String, Object> userPrefs = paramService.getUserPreferences();
        if (userPrefs == null) { userPrefs = new HashMap<>(); }
        userPrefs.put(PATIENT_CONTEXT_USER_PREF_KEY, (StringUtils.hasText(pid) ? pid : ""));
        String userPrefParamUid = paramService.getUserPreferencesParamUid();
        return ImmutableMap.of("command", ParamService.SAVE_PARAM_BY_UID_COMMAND, "uid", userPrefParamUid, "value", VistaStringUtils.splitLargeStringIfNecessary(POMUtils.toJSON(userPrefs)));
    }
}
