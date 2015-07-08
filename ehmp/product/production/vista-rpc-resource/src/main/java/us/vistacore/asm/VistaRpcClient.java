package us.vistacore.asm;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.vistacowboy.jVista.RpcParameter;
import com.vistacowboy.jVista.VistaException;
import com.vistacowboy.jVista.VistaRpc;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.LinkedHashMap;

public class VistaRpcClient {

    private static Logger logger = LoggerFactory.getLogger(VistaRpcClient.class);

    private String vistaHost;
    private int vistaPort;

    private String accessCode;
    private String verifyCode;

    private String context = "HMP UI CONTEXT";
    private static final String RPC_VPR = "HMPCRPC RPC";
    private static final String RPC_USERINFO = "ORWU USERINFO";
    private static final String RPC_COMMAND_PATIENT_CHECKS = "getPatientChecks";
    private static final String RPC_COMMAND_PATIENT_ACCESS = "logPatientAccess";

    private static final int CPRS_COR_TAB_INDEX = 21;
    private static final int CPRS_RPT_TAB_INDEX = 22;
    private static final int USER_SITE_ID_INDEX = 23;

    public static final String CPRS_COR_TAB_ATTR = "cprsCorTabs";
    public static final String CPRS_RPT_TAB_ATTR = "cprsRptTabs";
    public static final String USER_SITE_ID_ATTR = "userSiteId";

    public VistaRpcClient(String vistaHost, int vistaPort, String accessCode, String verifyCode, String context) {
        this.vistaPort = vistaPort;
        this.vistaHost = vistaHost;
        this.accessCode = accessCode;
        this.verifyCode = verifyCode;
        this.context = context;
    }

    public VistaRpcClient(String vistaHost, int vistaPort, String accessCode, String verifyCode) {
        this.vistaPort = vistaPort;
        this.vistaHost = vistaHost;
        this.accessCode = accessCode;
        this.verifyCode = verifyCode;
    }

    public VistaRpcResponse getPatientAttributes(String patientId) {

        LinkedHashMap<String, String> params = new LinkedHashMap<String, String>();

        params.put("\"command\"", RPC_COMMAND_PATIENT_CHECKS);
        params.put("\"patientId\"", patientId);

        try {

            RpcParameter param = new RpcParameter(RpcParameter.LIST, params);
            String preparedRpc = VistaRpc.prepare(RPC_VPR, new RpcParameter[] { param });

            String dataJsonString = "";

            logger.info(preparedRpc);

            dataJsonString = new VistaRpcCommand(preparedRpc, vistaHost, vistaPort, accessCode, verifyCode, context).execute();

            logger.info(dataJsonString);

            VistaRpcResponse response = new VistaRpcResponse();

            JsonObject dataJson = new JsonParser().parse(dataJsonString).getAsJsonObject();

            if (!dataJson.has("sensitive")) {

                response.set("sensitive", "false");

            } else {

                JsonObject sensitivityJson = dataJson.getAsJsonObject("sensitive");
                response.set("sensitive", "true");
                response.set("dfn", sensitivityJson.get("dfn").getAsString());
                response.set("logAccess", sensitivityJson.get("logAccess").getAsString());
                response.set("mayAccess", sensitivityJson.get("mayAccess").getAsString());
                response.set("text", sensitivityJson.get("text").getAsString());

            }
            return response;

        } catch (VistaException e) {
            logger.warn("Error getting patient attributes from VistA", e);
            return new VistaRpcResponse(e);
        }
    }

    public VistaRpcResponse getUserAttributes() {

        try {

            String preparedRpc = VistaRpc.prepare(RPC_USERINFO, null);

            String rpcResponse = "";

            logger.info(preparedRpc);

            rpcResponse = new VistaRpcCommand(preparedRpc, vistaHost, vistaPort, accessCode, verifyCode, context).execute();

            logger.info(rpcResponse);

            VistaRpcResponse response = new VistaRpcResponse();

            response.set(CPRS_COR_TAB_ATTR, "false");
            response.set(CPRS_RPT_TAB_ATTR, "false");
            response.set(USER_SITE_ID_ATTR, "");

            if (rpcResponse != null) {
                String[] rpcResponseArray = rpcResponse.split("\\^");
                if (rpcResponseArray.length > CPRS_COR_TAB_INDEX && rpcResponseArray.length > CPRS_RPT_TAB_INDEX && rpcResponseArray.length > USER_SITE_ID_INDEX) {
                    response.set(CPRS_COR_TAB_ATTR, rpcResponseArray[CPRS_COR_TAB_INDEX].equals("1") ? "true" : "false");
                    response.set(CPRS_RPT_TAB_ATTR, rpcResponseArray[CPRS_RPT_TAB_INDEX].equals("1") ? "true" : "false");
                    response.set(USER_SITE_ID_ATTR, rpcResponseArray[USER_SITE_ID_INDEX]);
                }
            }
            return response;

        } catch (VistaException e) {
            logger.warn("Error getting user attributes from VistA", e);
            return new VistaRpcResponse(e);
        }
    }

    public VistaRpcResponse logPatientAccess(String patientId) {

        LinkedHashMap<String, String> params = new LinkedHashMap<String, String>();

        params.put("\"command\"", RPC_COMMAND_PATIENT_ACCESS);
        params.put("\"patientId\"", patientId);

        try {

            RpcParameter param = new RpcParameter(RpcParameter.LIST, params);
            String preparedRpc = VistaRpc.prepare(RPC_VPR, new RpcParameter[] { param });

            String dataJsonString = "";

            logger.info(preparedRpc);

            dataJsonString = new VistaRpcCommand(preparedRpc, vistaHost, vistaPort, accessCode, verifyCode, context).execute();

            logger.info(dataJsonString);

            VistaRpcResponse response = new VistaRpcResponse();

            JsonObject dataJson = new JsonParser().parse(dataJsonString).getAsJsonObject();
            response.set("result", dataJson.get("result").getAsString());
            return response;

        } catch (VistaException e) {
            logger.warn("Error logging patient access with VistA", e);
            return new VistaRpcResponse(e);
        }
    }
}
