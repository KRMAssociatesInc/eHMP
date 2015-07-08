package gov.va.cpe.checksum;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.pom.jds.JdsTemplate;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.RpcRequest;
import gov.va.hmp.vista.rpc.RpcResponse;

import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;

import static gov.va.hmp.vista.util.RpcUriUtils.VISTA_RPC_BROKER_SCHEME;

/**
 * Created with IntelliJ IDEA.
 * User: anthonypuleo
 * Date: 8/1/13
 * Time: 3:10 PM
 * To change this template use File | Settings | File Templates.
 */
public class DeferredPatientChecksum implements Callable<Map<String, Object>> {


    public JdsTemplate jdsTemplate;


    public IPatientDAO genericPatientObjectDao;


    public RpcOperations synchronizationRpcTemplate;


    public UserContext userContext;


    public IVistaAccountDao accountDao;

    public String pid;
    public String vistaId;
    public String server;
    public Boolean finish = false;
    public HashMap<String, Object> jsonResults = new HashMap<String, Object>();
    public Boolean started;
    public Throwable e;
    public Future future;
    public Boolean pushed = false;

    public DeferredPatientChecksum(String pid, String vistaId, String server) {
        HashMap<String, Object> task = new HashMap<String, Object>();
        this.pid = pid;
        this.vistaId = vistaId;
        this.server = server;


    }


    HashMap<String, Object> compareJsonNodes(JsonNode source, JsonNode compare, String pid) {
        HashMap<String, Object> result = new HashMap<String, Object>();

        ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
        if (source.equals(compare)) {
            return result;
        }

        Iterator<String> fields = source.fieldNames();
        while (fields.hasNext()) {
            String field = fields.next();
//        for (String field : source.fieldNames()) {
            if (field == "patient") continue;
            JsonNode sourceDomain = source.path(field);
            JsonNode compareDomain = compare.path(field);
            if (sourceDomain.path("crc") != compareDomain.path("crc")) {
                JsonNode sourceUid = sourceDomain.path("uids");
                JsonNode compareUid = compareDomain.path("uids");
                for (int i = 0; i < sourceUid.size(); i++) {
                    JsonNode node = sourceUid.path(i);
                    Iterator<String> it = node.fieldNames();
                    while (it.hasNext()) {
                        String uid = it.next();
//                    for (String uid : node.fieldNames()) {
                        JsonNode path = compareUid.findPath(uid);
                        HashMap<String, String> reason = new HashMap<String, String>();
                        if ((path == null) || (path.isMissingNode())) {
                            reason.put("uid", uid);
                            reason.put("reason", "Uid not found in Jds Extract");
                            list.add(reason);
                        } else if (!node.path(uid).equals(path)) {
                            reason.put("uid", uid);
                            reason.put("reason", "Checksums do not match");
                            list.add(reason);
                        }
                    }
                    }
                for (int i = 0; i < compareUid.size(); i++) {
                    JsonNode node = compareUid.path(i);
                    Iterator<String> nodes = node.fieldNames();
                    while (nodes.hasNext()) {
//                    for (String uid : node.fieldNames()) {
                        String uid = nodes.next();
                        if (uid.equals("urn:va:F484:100847:order:37524")) {
                            System.out.println(uid);
                        }
                        JsonNode path = sourceUid.findPath(uid);
                        if ((path == null) || (path.isMissingNode())) {
                            HashMap<String, String> reason = new HashMap<String, String>();
                            reason.put("uid", uid);
                            reason.put("reason", "Uid not found in VistA Extract");
                            list.add(reason);
                        }
                    }

                }
            }
        }
        if (list.size() > 0) {
            result.put("pid", pid);
            result.put("uids", list);
        }
        return result;
    }

    JsonNode getVistaChecksum(String dfn, String vistaId, String server) {
        HashMap<String, Object> params = new HashMap<String, Object>();
        params.put("patientId", dfn);
        params.put("system", server);
        params.put("queued", true);
//        System.out.println(params);
        String uri = VISTA_RPC_BROKER_SCHEME + "://" + vistaId + "/HMP SYNCHRONIZATION CONTEXT/HMP GET CHECKSUM";
        RpcRequest request = new RpcRequest(uri, params);
//        request.setTimeout(300);
        RpcResponse response = null;
        while (response == null || (response.length() < 1)) {
            response = synchronizationRpcTemplate.execute(request);
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
            }
        }
        JsonNode jdsResult = POMUtils.parseJSONtoNode(response.toString());
//        String file ='/Users/anthonypuleo/TEMP/vista.rtf'
//        updateFile(jdsResult, file)
        return jdsResult;
    }

    JsonNode getJdsChecksum(String pid, String vistaId) {
        JsonNode jdsResult = jdsTemplate.getForJsonNode("/vpr/" + pid + "/checksum/" + vistaId);
//        String file ='/Users/anthonypuleo/TEMP/jds.rtf'
//        updateFile(jdsResult, file)
        return jdsResult;
    }

//    HashMap<String, Object> checkPatientData(String pid, String vistaId) {
//        HashMap<String, Object> result = new HashMap<String, Object>();
//        List<VistaAccount> vistaAccounts = accountDao.findAllByVistaId(vistaId);
//        List<PatientDemographics> patients = genericPatientObjectDao.findAllCrossPatientByIndex(PatientDemographics.class, "pt-loaded");
//        for (int i = 0; i < patients.size(); i++) {
//            PatientDemographics patient = patients.get(i);
//            if (patient.getPid() != pid) continue;
//            String dfn = patient.getLocalPatientIdForSystem(vistaId);
//            JsonNode vistaNode = getVistaChecksum(dfn, vistaAccounts.get(0).getVistaId(), server);
//            JsonNode jdsNode = getJdsChecksum(pid, vistaAccounts.get(0).getVistaId());
//            result = compareJsonNodes(vistaNode, jdsNode, pid);
//            return result;
//        }
//    }


    @Override
    public Map<String, Object> call() throws Exception {
        HashMap<String, Object> result = new HashMap<String, Object>();
        this.finish = false;
        this.started = true;
        try {
            List<VistaAccount> vistaAccounts = accountDao.findAllByVistaId(vistaId);
            PatientDemographics patient = genericPatientObjectDao.findByPid(pid);
            String dfn = patient.getLocalPatientIdForSystem(vistaId);
            JsonNode vistaNode = getVistaChecksum(dfn, vistaAccounts.get(0).getVistaId(), server);
            JsonNode jdsNode = getJdsChecksum(pid, vistaAccounts.get(0).getVistaId());
            result = compareJsonNodes(vistaNode, jdsNode, pid);
            this.jsonResults.put("pid", pid);
            this.jsonResults.put("vistaId", vistaId);
            this.jsonResults.put("vista", vistaNode);
            this.jsonResults.put("jds", jdsNode);
            this.jsonResults.put("result", result);
            if (result.containsKey("pid")) this.jsonResults.put("same", false);
            else this.jsonResults.put("same", true);
            this.finish = true;
        } catch (Exception e) {
            e.printStackTrace();
            this.e = e;
//            this.finish = true;
        }

        return this.jsonResults;  //To change body of implemented methods use File | Settings | File Templates.
    }
}
