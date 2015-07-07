package com.vistacowboy.jVista;

/**
 * Created with IntelliJ IDEA.
 * User: Joe
 * Date: 11/26/12
 * Time: 8:51 AM
 */

public class VistaRpc
{
    private static final String PREFIX = "[XWB]";
    private static final int COUNT_WIDTH = 3;
    private static final String RPC_VERSION = "1.108";

    public static String prepare(String rpcName, RpcParameter[] params) throws VistaException {
        if (rpcName.equals("HELLO"))
            return prepareConnectRpc(params);
        if (rpcName.equals("BYE"))
            return prepareDisconnectRpc();
        return prepareStandardRpc(rpcName, params);
    }

    private static String prepareStandardRpc(String rpcName, RpcParameter[] params) throws VistaException {
        return String.format("%s11302%s%s%s%s",
                PREFIX,
                VistaUtils.prependCount(RPC_VERSION),
                VistaUtils.prependCount(rpcName),
                prepareParamString(params),
                VistaConnection.EOT);
    }

    private static String prepareParamString(RpcParameter[] params) throws VistaException
    {
        String param_str = "5";
        if (params != null)
        {
            for (RpcParameter param : params)
            {
                switch (param.getType())
                {
                    case RpcParameter.LITERAL:
                        param_str += String.format("%s%sf", '0', VistaUtils.strPack(param.getValue(), COUNT_WIDTH));
                        break;
                    case RpcParameter.REFERENCE:
                        param_str += String.format("%s%sf", '1', VistaUtils.strPack(param.getValue(), COUNT_WIDTH));
                        break;
                    case RpcParameter.LIST:
                        param_str += String.format("%s%s", '2', param.paramList2String());
                        break;
                    default:
                        throw new VistaException("Invalid param type");
                }
            }
        }
        if (param_str.equals("5"))
        {
            param_str += "4f";
        }
        return param_str;
    }

    private static String prepareConnectRpc(RpcParameter[] params)
    {
        return String.format("[XWB]10304\nTCPConnect50%sf0%sf0%sf%s",
                VistaUtils.strPack(params[0].getValue(), COUNT_WIDTH),
                VistaUtils.strPack("0", COUNT_WIDTH),
                VistaUtils.strPack(params[1].getValue(), COUNT_WIDTH),
                VistaConnection.EOT);
    }

    private static String prepareDisconnectRpc()
    {
        return String.format("[XWB]10304\u0005#BYE#%s", VistaConnection.EOT);
    }

}
