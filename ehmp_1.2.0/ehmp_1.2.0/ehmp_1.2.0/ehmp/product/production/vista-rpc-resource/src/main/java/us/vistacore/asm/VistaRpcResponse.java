package us.vistacore.asm;

import java.util.HashMap;
import java.util.Map;

public class VistaRpcResponse {

    private Map<String, String> properties;

    private Exception exception;

    public VistaRpcResponse() {
        properties = new HashMap<String, String>();
    }

    public VistaRpcResponse(Exception e) {
        exception = e;
    }

    public void set(String key, String value) {
        properties.put(key, value);
    }

    public String get(String key) {
        return properties.get(key);
    }

    public Exception getException() {
        return exception;
    }

    @Override
    public String toString() {
        StringBuffer buff = new StringBuffer();
        for (String key : properties.keySet()) {
            buff.append(key);
            buff.append(" : ");
            buff.append(properties.get(key));
            buff.append(", ");
        }
        buff.deleteCharAt(buff.length() - 1);
        buff.deleteCharAt(buff.length() - 1);
        return buff.toString();
    }

}
