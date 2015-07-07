package gov.va.cpe.vpr;

/**
 * Class to represent an association for a single site and pid for that site.
 *
 * @Author Les Westberg
 */
public class SiteAndPid {
    private String site = null;
    private String pid = null;

    public String getSite() {
        return site;
    }
    public void setSite(String site) {
        this.site = site;
    }
    public String getPid() {
        return pid;
    }
    public void setPid(String pid) {
        this.pid = pid;
    }
}
