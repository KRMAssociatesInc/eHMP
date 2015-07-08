package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.Map;

public class ProcedureProvider extends AbstractPOMObject {
    public ProcedureProvider(Map<String, Object> vals) {
        super(vals);

        setData("uid", vals.get("providerUid"));
    }

    public ProcedureProvider() {
        super(null);
    }

    private String providerName;
    private String providerDisplayName;

    public String getProviderName() {
        return providerName;
    }

    public String getProviderDisplayName() {
        if (providerDisplayName == null) {
            providerDisplayName = VistaStringUtils.nameCase(getProviderName());
        }
        return providerDisplayName;
    }
}
