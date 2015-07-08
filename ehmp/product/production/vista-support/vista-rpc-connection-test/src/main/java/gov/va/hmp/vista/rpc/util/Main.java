package gov.va.hmp.vista.rpc.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcResponse;
import gov.va.hmp.vista.rpc.RpcTemplate;
import gov.va.hmp.vista.rpc.conn.SystemInfo;
import gov.va.hmp.vista.util.RpcUriUtils;
import joptsimple.OptionException;
import joptsimple.OptionParser;
import joptsimple.OptionSet;
import joptsimple.OptionSpec;
import org.springframework.dao.DataAccessException;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

import static gov.va.hmp.vista.util.RpcUriUtils.VISTA_RPC_BROKER_SCHEME;

public class Main {
    public static void main(String[] args) throws Exception {
        OptionParser parser = new OptionParser();
        OptionSpec<String> pathToVistaAccountsFile = parser.acceptsAll(Arrays.asList("f","F","file"), "File").withRequiredArg().ofType(String.class);
        OptionSpec<String> hmpServerId = parser.acceptsAll(Arrays.asList("m","M","hmpServerId"), "HMPServerId").withRequiredArg().ofType(String.class);
        OptionSpec < String > server = parser.acceptsAll(Arrays.asList("s", "S", "server", "host"), "Server").withRequiredArg().ofType(String.class);
        OptionSpec<Integer> port = parser.acceptsAll(Arrays.asList("p", "P", "port"), "Port").withOptionalArg().ofType(Integer.class).defaultsTo(RpcUriUtils.DEFAULT_PORT);
//        OptionSpec<String> accessCode = parser.acceptsAll(Arrays.asList("a", "access"), "Access Code").withRequiredArg().ofType(String.class);
//        OptionSpec<String> verifyCode = parser.acceptsAll(Arrays.asList("v", "verify"), "Verify Code").withRequiredArg().ofType(String.class);
        OptionSpec<String> rpcContext = parser.acceptsAll(Arrays.asList("c", "context"), "RPC Context").withRequiredArg().ofType(String.class).defaultsTo("VPR SYNCHRONIZATION CONTEXT");
        OptionSpec<String> rpcName = parser.acceptsAll(Arrays.asList("r", "rpc"), "RPC Name").withRequiredArg().ofType(String.class).defaultsTo("VPR DATA VERSION");
        OptionSpec help = parser.acceptsAll(Arrays.asList("h", "?", "help"), "Show Help").forHelp();

        try {
            OptionSet options = parser.parse(args);
            if(options.has(pathToVistaAccountsFile)) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode vaNode = mapper.readTree(new FileInputStream(options.valueOf(pathToVistaAccountsFile)));
                ArrayNode accountsNode = (ArrayNode) vaNode.path("data").path("items");
                for(JsonNode acct: accountsNode) {
                    VistaAccount vacnt = new VistaAccount(acct, options.valueOf(hmpServerId));
                    testConnection(vacnt, options.valueOf(rpcContext),options.valueOf(rpcName));
                }
            } else if (options.has(help)) {
                parser.printHelpOn(System.out);
            } else if (options.has(server)) {
                BufferedReader bread = new BufferedReader(new InputStreamReader(System.in));
                System.out.print("Access Code: ");
                String accessCode = bread.readLine();
                System.out.print("Verify Code: ");
                String verifyCode = bread.readLine();
                UriComponents uri = UriComponentsBuilder.newInstance()
                        .scheme(VISTA_RPC_BROKER_SCHEME)
                        .userInfo(accessCode + ";" + verifyCode)
                        .host(options.valueOf(server))
                        .port(options.valueOf(port))
                        .pathSegment(options.valueOf(rpcContext), options.valueOf(rpcName)).build();

                RpcTemplate t = new RpcTemplate();
                try {
                    RpcResponse r = t.execute(uri.toUriString());

                    System.out.println("CONNECTION SUCCESSFUL: elapsed millis=" + r.getElapsedMillis());
                } catch (DataAccessException e) {
                    System.out.println("CONNECTION FAILURE: " + e.getCause().getMessage());
                } finally {
                    t.destroy();
                }
            } else {
                RpcHost host = new RpcHost(options.valueOf(server), options.valueOf(port));

                RpcTemplate t = new RpcTemplate();
                try {
                    SystemInfo info = t.fetchSystemInfo(host);

                    System.out.println("CONNECTION SUCCESSFUL: intro message below");
                    System.out.println(info.getIntroText());
                } catch (DataAccessException e) {
                    System.out.println("CONNECTION FAILURE: " + e.getCause().getMessage());
                } finally {
                    t.destroy();
                }
            }
        } catch (OptionException e) {
            System.out.println(e.getMessage());
            parser.printHelpOn(System.out);
        }
    }

    private static void testConnection(VistaAccount vac, String rpcContext, String rpcName) throws Exception {
        System.out.println("Testing account: "+vac.name);
        UriComponents uri = UriComponentsBuilder.newInstance()
                .scheme(VISTA_RPC_BROKER_SCHEME)
                .userInfo(vac.accessCode + ";" + vac.verifyCode)
                .host(vac.host)
                .port(vac.port)
                .pathSegment(rpcContext, rpcName).build();

        RpcTemplate t = new RpcTemplate();
        try {
            RpcResponse r = t.execute(uri.toUriString());

            System.out.println("CONNECTION SUCCESSFUL: elapsed millis=" + r.getElapsedMillis());
        } catch (DataAccessException e) {
            System.out.println("CONNECTION FAILURE: " + e.getCause().getMessage());
        } finally {
            t.destroy();
        }
    }

    private static class VistaAccount {
        private String vistaId;
        private String name;
        private String host;
        private Integer port;
        private String accessCode;
        private String verifyCode;

        private VistaAccount(String vistaId, String name, String host, Integer port, String credentials, Boolean credsEncrypted, String hmpServerId) {
            this.vistaId = vistaId;
            this.name = name;
            this.host = host;
            this.port = port;
            if(credsEncrypted) {
                HmpEncryption enc = HmpEncryption.getInstance(hmpServerId, this.vistaId);
                try {
                    credentials = enc.decrypt(credentials, hmpServerId, vistaId);
                } catch (Exception e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
            }
            accessCode = credentials.split(";")[0];
            verifyCode = credentials.split(";")[1];
        }
        private VistaAccount(JsonNode node, String hmpServerId) {
            this.vistaId = node.path("vistaId").textValue();
            this.name = node.path("name").textValue();
            this.host = node.path("host").textValue();
            this.port = node.path("port").intValue();
            String credentials = node.path("vprUserCredentials").textValue();
            Boolean encrypted = node.path("encrypted").booleanValue();
            if(encrypted) {
                HmpEncryption enc = HmpEncryption.getInstance(hmpServerId, this.vistaId);
                try {
                    credentials = enc.decrypt(credentials, hmpServerId, vistaId);
                } catch (Exception e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
            }
            accessCode = credentials.split(";")[0];
            verifyCode = credentials.split(";")[1];
        }
    }

    private static class HmpEncryption {

        private boolean cinit = false;
        private Cipher cipher;
        private Cipher decipher;
        private Cipher encipher;

        public String decrypt(String str, String hmpServerId, String vistaSystemId) throws BadPaddingException, IllegalBlockSizeException, NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException {
            if(!cinit) {
                cinit(hmpServerId, vistaSystemId);
            }
            byte[] encryptedBytes = Base64.decode(str);
            String decrypted = new String(decipher.doFinal(encryptedBytes));
            return decrypted;
        }

        public String encrypt(String str, String hmpServerId, String vistaSystemId) throws BadPaddingException, IllegalBlockSizeException, NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException {
            if(!cinit) {
                cinit(hmpServerId,vistaSystemId);
            }
            String encrypted = new String(Base64.encode(encipher.doFinal(str.getBytes())));
            return encrypted;
        }

        private byte[] salt;
        private SecretKeySpec dodgeball;
        private synchronized void cinit(String hmpServerId, String vistaSystemId) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException {
            if(dodgeball==null || salt==null) {
                MessageDigest digest = MessageDigest.getInstance("SHA");
                String svr = hmpServerId;
                byte[] sbites = svr.getBytes();
                digest.update(sbites);
                dodgeball = new SecretKeySpec(digest.digest(), 0, 16, "AES");
                salt = vistaSystemId.getBytes();
            }
            decipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            decipher.init(Cipher.DECRYPT_MODE, dodgeball);
            encipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            encipher.init(Cipher.ENCRYPT_MODE, dodgeball);
            cinit = true;
        }

        public static HmpEncryption getInstance(String hmpServerId, String vistaSystemId) {
            HmpEncryption venc = new HmpEncryption();
            MessageDigest digest = null;
            try {
                digest = MessageDigest.getInstance("SHA");
                byte[] pbites = hmpServerId.getBytes();
                digest.update(pbites);
                venc.dodgeball = new SecretKeySpec(digest.digest(), 0, 16, "AES");
                venc.salt = vistaSystemId.getBytes();
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }

            return venc;
        }
    }
}
