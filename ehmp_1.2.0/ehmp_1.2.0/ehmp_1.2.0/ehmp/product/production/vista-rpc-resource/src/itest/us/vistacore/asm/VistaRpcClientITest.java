package us.vistacore.asm;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import us.vistacore.asm.ITestUtils;
import us.vistacore.asm.VistaRpcClient;
import us.vistacore.asm.VistaRpcResponse;

public class VistaRpcClientITest {
    
    private VistaRpcClient client;
    
    private String vistaHost = ITestUtils.getPanoramHost();
    private int vistaPort = 9210;

    private String accessCode = "lu1234";
    private String verifyCode = "lu1234!!";
    private String context = "XUPROGMODE"; 
    
    private String sensitivePatient = "20";
    private String insensitivePatient = "100615";
    
    @Before
    public void before()
    {
        client = new VistaRpcClient(vistaHost, vistaPort, accessCode, verifyCode, context); 
    }

    @Test
    public void getPatientAttributesTest()
    {
        VistaRpcResponse res = client.getPatientAttributes(sensitivePatient);
        
        Assert.assertTrue(res.get("sensitive").compareTo("true")==0);
        Assert.assertNotNull(res.get("dfn"));
        Assert.assertNotNull(res.get("logAccess"));
        Assert.assertNotNull(res.get("text"));
        Assert.assertNotNull(res.get("mayAccess"));
        
        res = client.getPatientAttributes(insensitivePatient);
        
        Assert.assertTrue(res.get("sensitive").compareTo("false")==0);
        Assert.assertNull(res.get("dfn"));
        Assert.assertNull(res.get("logAccess"));
        Assert.assertNull(res.get("text"));
        Assert.assertNull(res.get("mayAccess"));
    }
    
    @Test
    public void getUserAttributesTest()
    {
        VistaRpcResponse res = client.getUserAttributes();
        
        Assert.assertNotNull(res.get("cprsCorTabs"));
        Assert.assertNotNull(res.get("cprsRptTabs"));
    }
 
    @Test
    public void logPatientAccessTest()
    {
        VistaRpcResponse res = client.logPatientAccess(sensitivePatient);
        
        Assert.assertNotNull(res.get("result"));
    }
}
