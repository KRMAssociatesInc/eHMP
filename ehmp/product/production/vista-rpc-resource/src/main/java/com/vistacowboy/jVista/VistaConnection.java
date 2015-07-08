package com.vistacowboy.jVista;

import org.apache.commons.lang3.ArrayUtils;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.UnknownHostException;

/**
 * Created with IntelliJ IDEA.
 * User: Joe
 * Date: 11/26/12
 * Time: 10:35 AM
 */

public class VistaConnection
{
    public static final String EOT = "\u0004";

    String host;
    int port;
    boolean isConnected = false;
    Socket socket;
    DataOutputStream socket_out;
    DataInputStream socket_in;

    public VistaConnection(String host, int port)
    {
        this.host = host;
        this.port = port;
        isConnected = false;
    }

    public void connect() throws VistaException {
        try
        {
            InetAddress addr = InetAddress.getLocalHost();
            String my_hostname = addr.getHostName();
            String my_ip = addr.getHostAddress();
            socket = new Socket();
            socket.connect(new InetSocketAddress(host , port));
            socket_out = new DataOutputStream(socket.getOutputStream());
            socket_in = new DataInputStream(socket.getInputStream());
            RpcParameter[] params = {
                    new RpcParameter(RpcParameter.LITERAL, my_ip),
                    new RpcParameter(RpcParameter.LITERAL, my_hostname)
            };
            String rpc = VistaRpc.prepare("HELLO", params);
            String response = exec(rpc);
            if (!response.equals("accept"))
            {
                socket.close();
                throw new VistaException("Connection not accepted");
            }
            isConnected = true;
        }
        catch (UnknownHostException e)
        {
            throw new VistaException(String.format("Unknown host: %s", e.getMessage()));
        }
        catch (IOException e)
        {
            throw new VistaException(String.format("Refused connection: %s", e.getMessage()));
        }
    }

    public String exec(String rpc) throws VistaException
    {
        send(rpc);
        return recv();
    }

    private void send(String rpc) throws VistaException
    {
        byte[] bytes = rpc.getBytes();
        try
        {
            socket_out.write(bytes, 0, bytes.length);
        }
        catch (IOException e)
        {
            throw new VistaException(e.getMessage());
        }
    }

    private String recv() throws VistaException
    {
        String response;

        final byte EOT_BYTE = 4;

        // Header first...
        byte[] buf = readBuf();
        boolean done = ArrayUtils.contains(buf, EOT_BYTE);

        // SECURITY error?
        if (buf[0] != 0)
        {
            response = new String(buf, 1, buf[0]);
            throw new VistaException(String.format("VistA SECURITY error: %s", response));
        }

        // APPLICATION error?
        if (buf[1] != 0)
        {
            response = new String(buf, 2, buf.length - 2) ;
            throw new VistaException(String.format("VistA APPLICATION error: %s", response));
        }

        // Here's the response so far...
        response = new String(buf, 2, buf.length - 2);

        // More?
        while (!done)
        {
            buf = readBuf();
            response += new String(ArrayUtils.subarray(buf,0,buf.length));
            done = ArrayUtils.contains(buf, EOT_BYTE);
        }
        response = response.substring(0, response.length()-1);

        if (response.startsWith("M  ERROR"))
        {
            throw new VistaException(response);
        }

        return response;
    }

    private byte[] readBuf() throws VistaException {
        final int BUF_SIZE = 256;
        byte[] buf = new byte[BUF_SIZE];
        int bytes_read;

        try
        {
            bytes_read = socket_in.read(buf);
        }
        catch (IOException e)
        {
            throw new VistaException(String.format("Error receiving: %s", e.getMessage()));
        }
        if (bytes_read == 0)
        {
            throw new VistaException("Error receiving: no response");
        }

        if (bytes_read < BUF_SIZE)
        {
            buf = ArrayUtils.subarray(buf,0,bytes_read);
        }
        return buf;
    }

    public String disconnect() throws VistaException
    {
        if (isConnected)
        {
            String rpc = VistaRpc.prepare("BYE", null);
            String response = exec(rpc);
            try
            {
                socket_out.close();
                socket_in.close();
                socket.close();
            }
            catch (IOException e)
            {
                throw new VistaException(e.getMessage());
            }
            isConnected = false;
            return response;
        }
        return "Socket was not connected";
    }

    public String getHost()
    {
        return host;
    }

    public int getPort()
    {
        return port;
    }

    public boolean getIsConnected()
    {
        return isConnected;
    }
}
