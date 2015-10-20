package us.vistacore.vxsync.config;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

public class ServicesEnabled {

    @JsonProperty("all")
    private Boolean allFlag;

    @JsonProperty("hdr")
    private Boolean hdr;

    @JsonProperty("vler")
    private Boolean vler;

    @JsonProperty("pgd")
    private Boolean pgd;

    @JsonProperty("dod")
    private DodServicesEnabled dod = new DodServicesEnabled();

    public Boolean getAllFlag() {
        return allFlag;
    }

    public void setAllFlag(Boolean allFlag) {
        this.allFlag = allFlag;
    }

    public Boolean getHdr() {
        return hdr;
    }

    public void setHdr(Boolean hdr) {
        this.hdr = hdr;
    }

    public Boolean getVler() {
        return vler;
    }

    public void setVler(Boolean vler) {
        this.vler = vler;
    }

    public Boolean getPgd() {
        return pgd;
    }

    public void setPgd(Boolean pgd) {
        this.pgd = pgd;
    }

    public DodServicesEnabled getDod() {
        return dod;
    }

    public void setDod(DodServicesEnabled dod) {
        this.dod = dod;
    }
}
