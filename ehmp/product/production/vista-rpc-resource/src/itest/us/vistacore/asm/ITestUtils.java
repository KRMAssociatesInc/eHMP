package us.vistacore.asm;

public class ITestUtils {
    

    public static String getPanoramHost()
    {
        String val = System.getProperty("VISTA_PANORAMA_IP");
        return (val == null) ? "10.2.2.101" : val;
    }
    
    public static String getKodakHost()
    {
        String val = System.getProperty("VISTA_KODAK_IP");
        return (val == null) ? "10.2.2.102" : val;
    }
    
    

}
