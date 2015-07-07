package gov.va.cpe.vpr.web;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.Diagnosis;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UserInterfaceRpcConstants;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.util.VistaStringUtils;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import java.util.Map;

@RequestMapping(value = {"/diagnosis/**", "/vpr/diagnosis/**"})
@Controller
public class DiagnosisController {

    private RpcOperations rpcTemplate;
    private IPatientDAO patientDao;
    private UserContext userContext;
    private IGenericPatientObjectDAO genericJdsDAO;

    @Autowired
    public void setRpcTemplate(RpcOperations rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
    }

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setGenericJdsDAO(IGenericPatientObjectDAO genericJdsDAO) {
        this.genericJdsDAO = genericJdsDAO;
    }

    @RequestMapping(value = "/submitDiagnosis", method = RequestMethod.POST)
    public ModelAndView postAddTask(@RequestParam(required = false) String pid, @RequestParam(required = false) String uid, @RequestParam(value = "value", required = false) String newvalue, HttpServletRequest request) {
        Map temp = new LinkedHashMap();
        temp.put("pid", pid);
        temp.put("uid", uid);
        temp.put("diagnosis", newvalue);
        temp.put("ownerName", userContext.getCurrentUser().getDisplayName());
        temp.put("ownerCode", userContext.getCurrentUser().getUid());
        temp.put("assignToName", userContext.getCurrentUser().getDisplayName());
        temp.put("assignToCode", userContext.getCurrentUser().getUid());
        temp.put("facilityCode", userContext.getCurrentUser().getDivision());
        temp.put("facilityName", userContext.getCurrentUser().getDivisionName());

        String rpcResult = "";

        PatientDemographics pt = patientDao.findByPid(pid);
        if (pt != null) {
            String dfn = pt.getLocalPatientIdForSystem(userContext.getCurrentUser().getVistaId());

            if (StringUtils.hasText(dfn)) {
                String json = POMUtils.toJSON(temp);
                Object value = VistaStringUtils.splitLargeStringIfNecessary(json);
//				System.out.println(value)
                rpcResult = rpcTemplate.executeForString(UserInterfaceRpcConstants.VPR_PUT_PATIENT_DATA_URI, dfn, "diagnosis", value);
//				System.out.println(rpcResult)
                JsonNode result = POMUtils.parseJSONtoNode(rpcResult);
                if (result.path("success").asBoolean()) {
                    JsonNode dataNode = result.path("data");
                    uid = dataNode.path("uid").textValue();
                    String vistaSysId = userContext.getCurrentUser().getVistaId();
                    //Patient pt = patientDao.findByLocalID(vistaSysId, patientId)
                    temp.put("pid", pt.getPid());
//                    temp["uid"] = uid
                    Diagnosis diagnosis = new Diagnosis();
                    diagnosis.setData(temp);
                    genericJdsDAO.save(diagnosis);
                }

            }

        } else {
            throw new PatientNotFoundException(pid);
        }

        return ModelAndViewFactory.stringModelAndView(rpcResult, "application/json");
    }
}
