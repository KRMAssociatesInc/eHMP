package gov.va.cpe.vpr.sync.vista;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.pom.DefaultNamingStrategy;
import gov.va.cpe.vpr.pom.INamingStrategy;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.springframework.beans.factory.annotation.Required;

public class VistaDaoSupport {
    protected RpcOperations rpcTemplate;
    private INamingStrategy namingStrategy = new DefaultNamingStrategy();

    @Required
    public void setRpcTemplate(RpcOperations rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
    }

    public void setNamingStrategy(INamingStrategy namingStrategy) {
        this.namingStrategy = namingStrategy;
    }

    protected String getCollectionName(Class entityType) {
        return namingStrategy.collectionName(entityType);
    }

    protected JsonNode executeForJsonAndSplitLastArg(String rpcUri, Object... args) {
        args[args.length - 1] = VistaStringUtils.splitLargeStringIfNecessary((String) args[args.length - 1]);
        return rpcTemplate.executeForJson(rpcUri, args);
    }
}
