package gov.va.cpe.test.junit4.runners;

import gov.va.hmp.vista.rpc.RpcRequest;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Inherited
public @interface ImportTestSession {
    String connectionUri();

    int rpcTimeout() default RpcRequest.DEFAULT_TIMEOUT;
}
