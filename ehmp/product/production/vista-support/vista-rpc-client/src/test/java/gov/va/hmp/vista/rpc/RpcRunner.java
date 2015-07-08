package gov.va.hmp.vista.rpc;

import gov.va.hmp.vista.rpc.broker.conn.BrokerConnectionFactory;
import gov.va.hmp.vista.rpc.broker.conn.DirectConnectionManager;
import org.springframework.dao.DataAccessResourceFailureException;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

public class RpcRunner {
    public static void main(String[] args) throws URISyntaxException, IOException {
        RpcTemplate rpcTemplate = null;
        try {
            rpcTemplate = new RpcTemplate();

//        SystemInfo systemInfo = rpcTemplate.fetchSystemInfo(new RpcHost("localhost", 29060));
//        System.out.println(systemInfo.getIntroText());
//        System.out.println(systemInfo.getDomainName());

//        System.out.println(rpcTemplate.executeForString("442", "7372STD", "CGZF+099", "OR CPRS GUI CHART", "ORQQVI VITALS", "229"));

//        System.out.println(rpcTemplate.executeForString("960", "10vehu", "vehu10", null, "XUS GET USER INFO"));

//        System.out.println(rpcTemplate.executeForString("960", "10vehu", "vehu10", null, "XUS DIVISION GET"));

//        String oldVerifyCode = "campcprs64&";
//        String newVerifyCode = "";
//        String confirmVerifyCode = newVerifyCode = "campcprs64$";
//        String foo = Hash.encrypt(oldVerifyCode.toUpperCase()) + VistaStringUtils.U + Hash.encrypt(newVerifyCode.toUpperCase()) + VistaStringUtils.U + Hash.encrypt(confirmVerifyCode.toUpperCase());
//        System.out.println(rpcTemplate.executeForString("vrpcb://64campcprs;" + oldVerifyCode + "@localhost:29060/XUS GET USER INFO"));
//        System.out.println(rpcTemplate.executeForString("vrpcb://64campcprs;" + oldVerifyCode + ";" + newVerifyCode + ";" + confirmVerifyCode + "@localhost:29060/XUS GET USER INFO"));

//        JsonNode json = new ObjectMapper().readTree(RpcRunner.class.getResourceAsStream("example.json"));
            try {
                RpcResponse response = rpcTemplate.execute("vrpcb://10vehu;vehu10@localhost:29060/OR CPRS GUI CHART/ORQQVI VITALS", "229");
                System.out.println(response.toString());
                for (RpcPhase phase : RpcPhase.values()) {
                    System.out.println(phase.toString() + ": " + response.getElapsedMillis(phase));
                }
                System.out.println("TOTAL: " + response.getElapsedMillis());
            } catch (Throwable e) {
                e.printStackTrace();
            }
            System.out.println();
//            try {
//                Map params = new HashMap();
//                params.put("command", "testRPC");
//                params.put("value", "wait");
//                rpcTemplate.setTimeout(5);
//                System.out.println(rpcTemplate.executeForString("vrpcb://10vehu;vehu10@localhost:29060/VPR DEV CONTEXT/VPRTRPC RPC", params));
//            } catch (DataAccessResourceFailureException e) {
//                System.out.println("monkey");
//            }
            try {
                rpcTemplate.setTimeout(30);
                RpcResponse response2 = rpcTemplate.execute("vrpcb://10vehu;vehu10@localhost:29060/OR CPRS GUI CHART/ORQQVI VITALS", "229");
                System.out.println(response2.toString());
                for (RpcPhase phase : RpcPhase.values()) {
                    System.out.println(phase.toString() + ": " + response2.getElapsedMillis(phase));
                }
                System.out.println("TOTAL: " + response2.getElapsedMillis());
            } catch (Throwable e) {
                e.printStackTrace();
            }
            System.out.println();
//        SortedMap<String, String> params = new TreeMap<String, String>();
//        params.put("command", "loadUserProfile");
//        params.put("appName", "foo-bar");
//        params.put("appVersion", "0.1-SNAPSHOT");
//        System.out.println(rpcTemplate.executeForString("960", "10vehu", "vehu10", "EDPF TRACKING SYSTEM", "EDPCTRL RPC", params));
//        System.out.println(rpcTemplate.executeForString("960", "10vehu", "vehu10", "OR CPRS GUI CHART", "ORQQVI VITALS", "229"));
//        System.out.println(rpcTemplate.executeForString("960", "10vehu", "vehu10", "NHIN APPLICATION PROXY", "NHIN GET VISTA DATA", "229", "lab"));

//        System.out.println(rpcTemplate.executeForString("050", "CPUSER$01", "01$CPUSR", "OR CPRS GUI CHART", "ORQQVI VITALS", "3"));
        } finally {
            try {
                rpcTemplate.destroy();
            } catch (Exception e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        }
    }
}
