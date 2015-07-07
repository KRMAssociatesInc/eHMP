package gov.va.hmp.vista.rpc.broker.protocol;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import gov.va.hmp.vista.rpc.jackson.RpcParamSerializer;
import org.springframework.util.ObjectUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * This component defines all the fields that comprise a parameter.
 */
@JsonSerialize(using = RpcParamSerializer.class)
public class RpcParam {

    public static enum Type {
        LITERAL,
        REFERENCE,
        LIST,
        GLOBAL,
        EMPTY,
        STREAM,
        UNDEFINED
    }

    public static RpcParam create(String s) {
        return new RpcParam(s);
    }

    public static RpcParam create(Boolean b) {
        if (Boolean.TRUE.equals(b))
            return new RpcParam("1");
        else
            return new RpcParam("0");
    }

    public static RpcParam create(Map m) {
        return new RpcParam(Mult.create(m));
    }

    public static RpcParam create(List l) {
        return new RpcParam(Mult.create(l));
    }

    public static RpcParam create(String[] l) {
        return create(Arrays.asList(l));
    }

    public static RpcParam create(Integer[] l) {
        return create(Arrays.asList(l));
    }

    public static RpcParam create(Long[] l) {
        return create(Arrays.asList(l));
    }

    public static RpcParam create(Boolean[] l) {
        return create(Arrays.asList(l));
    }

    public static RpcParam create(Float[] l) {
        return create(Arrays.asList(l));
    }

    public static RpcParam create(Double[] l) {
        return create(Arrays.asList(l));
    }

    public static RpcParam create(int[] l) {
        return create(Arrays.asList(ObjectUtils.toObjectArray(l)));
    }

    public static RpcParam create(long[] l) {
        return create(Arrays.asList(ObjectUtils.toObjectArray(l)));
    }

    public static RpcParam create(boolean[] l) {
        return create(Arrays.asList(ObjectUtils.toObjectArray(l)));
    }

    public static RpcParam create(float[] l) {
        return create(Arrays.asList(ObjectUtils.toObjectArray(l)));
    }

    public static RpcParam create(double[] l) {
        return create(Arrays.asList(ObjectUtils.toObjectArray(l)));
    }

    public static RpcParam create(JsonNode jsonNode) {
        return new RpcParam(Mult.create(jsonNode));
    }

    public static RpcParam create(Object o) {
        if (o == null) throw new IllegalArgumentException("VistA RPC parameters cannot be null");

        if (o instanceof String) {
            return create((String) o);
        } else if (o instanceof Boolean) {
            return create((Boolean) o);
        } else if (o instanceof List) {
            return create((List) o);
        } else if (ObjectUtils.isArray(o)) {
            return create(Arrays.asList(ObjectUtils.toObjectArray(o)));
        } else if (o instanceof Map) {
            return create((Map) o);
        } else if (o instanceof JsonNode) {
            return create((JsonNode) o);
        } else if (o instanceof RpcParam) {
            return (RpcParam) o;
        } else {
            return create(o.toString());
        }
    }

    private Mult mult;
    private String value;
    private Type type;

    public RpcParam(String value) {
        this(value, Type.LITERAL);
    }

    public RpcParam(String value, Type type) {
        if (value == null) throw new IllegalArgumentException("VistA RPC parameters cannot be null");
        if (type == Type.LIST || type == Type.GLOBAL) throw new IllegalArgumentException();
        this.value = value;
        this.type = type;
    }

    public RpcParam(Mult mult) {
        this(mult, Type.LIST);
    }

    public RpcParam(Mult mult, Type type) {
        if (mult == null) throw new IllegalArgumentException("VistA RPC parameters cannot be null");
        if (type != Type.LIST && type != Type.GLOBAL) throw new IllegalArgumentException();
        this.type = type;
        this.value = "";
        this.mult = mult;
    }


    public Mult getMult() {
        return mult;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type pType) {
        this.type = pType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RpcParam rpcParam = (RpcParam) o;

        if (type != rpcParam.type) return false;
        if (value != null ? !value.equals(rpcParam.value) : rpcParam.value != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = value != null ? value.hashCode() : 0;
        result = 31 * result + (type != null ? type.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        if (type == Type.LITERAL) return value;
        if (type == Type.LIST || type == Type.GLOBAL) {
            StringBuilder sb = new StringBuilder("{");
            String subscript = mult.getFirst();
            while (!subscript.isEmpty()) {
                sb.append(subscript);
                sb.append(":\"");
                sb.append(mult.get(subscript));
                sb.append("\"");
                if (!subscript.equals(mult.getLast())) {
                    sb.append(",");
                }
                subscript = mult.order(subscript, 1);
            }
            sb.append("}");
            return sb.toString();
        }
        return super.toString();
    }
}