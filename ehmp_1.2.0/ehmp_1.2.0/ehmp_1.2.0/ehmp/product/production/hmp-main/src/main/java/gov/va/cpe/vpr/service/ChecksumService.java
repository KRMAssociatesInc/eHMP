package gov.va.cpe.vpr.service;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.checksum.DeferredPatientChecksum;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.pom.jds.JdsOperations;
import gov.va.cpe.vpr.pom.jds.JdsTemplate;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.RpcRequest;
import gov.va.hmp.vista.rpc.RpcResponse;
import gov.va.hmp.vista.util.RpcUriUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ChecksumService implements IChecksumService {
    private IPatientDAO patientDao;
    protected RpcOperations synchronizationRpcTemplate;
    protected UserContext userContext;
    protected IVistaAccountDao accountDao;
    private JdsOperations jdsTemplate;
    private Map<String, List<DeferredPatientChecksum>> tasks = new HashMap<String, List<DeferredPatientChecksum>>();
    private ExecutorService exec = Executors.newFixedThreadPool(10, new ThreadFactory() {
        public Thread newThread(Runnable runnable) {
            Thread thread = new Thread(runnable, "checksum-" + threadNumber.getAndIncrement());
            thread.setDaemon(true);
            return thread;
        }

        public final AtomicInteger getThreadNumber() {
            return threadNumber;
        }

        private final AtomicInteger threadNumber = new AtomicInteger(1);
    });

    @Autowired
    public void setJdsTemplate(JdsOperations jdsTemplate) {
        this.jdsTemplate = jdsTemplate;
    }

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    @Autowired
    public void setSynchronizationRpcTemplate(RpcOperations synchronizationRpcTemplate) {
        this.synchronizationRpcTemplate = synchronizationRpcTemplate;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setAccountDao(IVistaAccountDao accountDao) {
        this.accountDao = accountDao;
    }

    public JsonNode getVistaChecksum(String dfn, String vistaId, String server) {
        Map params = new LinkedHashMap();
        params.put("patientId", dfn);
        params.put("system", server);
        params.put("queued", true);
//        System.out.println(params)
        String uri = RpcUriUtils.VISTA_RPC_BROKER_SCHEME + "://" + vistaId + "/HMP SYNCHRONIZATION CONTEXT/HMP GET CHECKSUM";
        RpcRequest request = new RpcRequest(uri, params);
//        request.setTimeout(300);
        RpcResponse response = null;
        while (response == null || (response.length() < 1)) {
            response = synchronizationRpcTemplate.execute(request);
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                // NOOP
            }
        }

        JsonNode jdsResult = POMUtils.parseJSONtoNode(response.toString());
//        String file ='/Users/anthonypuleo/TEMP/vista.rtf'
//        updateFile(jdsResult, file)
        return jdsResult;
    }

    public JsonNode getJdsChecksum(String pid, String vistaId) {
        JsonNode jdsResult = jdsTemplate.getForJsonNode("/vpr/" + pid + "/checksum/" + vistaId);
//        String file ='/Users/anthonypuleo/TEMP/jds.rtf'
//        updateFile(jdsResult, file)
        return jdsResult;
    }

    public void checkPatientData(String pid, String vistaId, String server, String requestId) {
        DeferredPatientChecksum check = new DeferredPatientChecksum(pid, vistaId, server);
        check.accountDao = accountDao;
        check.synchronizationRpcTemplate = synchronizationRpcTemplate;
        check.genericPatientObjectDao = patientDao;
        check.jdsTemplate = ((JdsTemplate) (jdsTemplate));
        check.userContext = userContext;
        List<DeferredPatientChecksum> dpc = tasks.get(requestId);
        if (dpc == null) {
            dpc = new ArrayList<DeferredPatientChecksum>();
            tasks.put(requestId, dpc);
        }

        dpc.add(check);
        exec.submit(check);

    }

    public Map<String, Object> fuPatientData(String request) {
        List<DeferredPatientChecksum> result = new ArrayList<DeferredPatientChecksum>();
        Map<String, Object> data = new HashMap<String, Object>();
        result = tasks.get(request);
//        System.out.println(result)
        if (result != null && !result.isEmpty()) {
//      		if(tasks.containsKey(request)) {
            DeferredPatientChecksum tsk = result.get(0);
            if (tsk.finish && !tsk.pushed) {
                data = tsk.jsonResults;
                data.put("pending", false);
            } else if (tsk.e != null) {
                data.put("errorMsg", true);
                data.put("errorMsg", tsk.e.getMessage());
                data.put("pending", false);
            } else {
                data.put("pending", true);
            }
        }

        return data;
    }
}
