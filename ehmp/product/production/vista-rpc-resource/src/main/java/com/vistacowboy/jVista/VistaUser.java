package com.vistacowboy.jVista;

/**
 * Created with IntelliJ IDEA.
 * User: Joe
 * Date: 11/27/12
 * Time: 9:04 AM
 */

public class VistaUser
{
    private String access_code;
    private String verify_code;
    private String context;
    private String duz;

    public String login(VistaConnection cxn, String access_code, String verify_code) throws VistaException
    {
        return login(cxn, access_code, verify_code, null);
    }

    public String login(VistaConnection cxn, String access_code, String verify_code, String context) throws VistaException
    {
        String rpc = VistaRpc.prepare("XUS SIGNON SETUP", null);
        String response = cxn.exec(rpc);
        if (response.isEmpty())
        {
            throw new VistaException("Unable to setup login: empty response");
        }

        RpcParameter param = new RpcParameter(RpcParameter.ENCRYPTED, access_code + ';' + verify_code);
        rpc = VistaRpc.prepare("XUS AV CODE", new RpcParameter[]{param});
        response = cxn.exec(rpc);
        if (response.isEmpty())
        {
            throw new VistaException("No response to login request");
        }

        String greeting = load(response);
        this.access_code = access_code;
        this.verify_code = verify_code;

        if (!context.isEmpty())
        {
            setContext(cxn, context);
        }

        return greeting;
    }

    public void setContext(VistaConnection cxn, String context) throws VistaException
    {
        RpcParameter param = new RpcParameter(RpcParameter.ENCRYPTED, context);
        String rpc = VistaRpc.prepare("XWB CREATE CONTEXT", new RpcParameter[]{param});
        String response = cxn.exec(rpc);
        if (response.equals("1"))
        {
            this.context = context;
        }
        else
        {
            throw new VistaException(String.format("Authorization error: %s", response));
        }
    }

    private String load(String response) throws VistaException
    {
        String[] parts = response.split("\r\n");
        if (parts[0].equals("0"))
        {
            throw new VistaException(parts[3]);
        }
        this.duz = parts[0];
        if (parts.length > 7)
        {
            return parts[7];
        }
        return "OK";
    }

    public String getAccess_code()
    {
        return access_code;
    }

    public String getVerify_code()
    {
        return verify_code;
    }

    public String getContext()
    {
        return context;
    }

    public String getDuz()
    {
        return duz;
    }
}
