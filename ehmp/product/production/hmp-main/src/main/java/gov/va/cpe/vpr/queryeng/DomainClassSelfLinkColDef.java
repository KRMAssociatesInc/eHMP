package gov.va.cpe.vpr.queryeng;

public class DomainClassSelfLinkColDef extends ColDef {

    private Class domainClass;

    public DomainClassSelfLinkColDef(String key, Class domainClass) {
        super(key, null);
        this.domainClass = domainClass;
    }
}
