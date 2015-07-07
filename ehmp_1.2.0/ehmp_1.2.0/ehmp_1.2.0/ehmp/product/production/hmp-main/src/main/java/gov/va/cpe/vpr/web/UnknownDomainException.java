package gov.va.cpe.vpr.web;

public class UnknownDomainException extends BadRequestException {
    private String domain;

    public UnknownDomainException(final String domain) {
        super("Unknown domain '" + domain + "'".toString());
        this.domain = domain;
    }

    public String getDomain() {
        return domain;
    }
}
