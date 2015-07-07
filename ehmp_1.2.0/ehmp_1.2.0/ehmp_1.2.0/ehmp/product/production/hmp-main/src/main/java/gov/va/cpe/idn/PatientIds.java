package gov.va.cpe.idn;

import java.util.HashMap;
import java.util.Map;

/**
 * Patient Identifier container bean.
 */
public class PatientIds
{
    /**
     * Patient identifier.  (It may be an ICN or a Site;DFN)
     */
    private String pid;

    /**
     * Patient data file number (aka IEN).
     */
    private String dfn;

    /**
     * Patient Integration Control Number.
     */
    private String icn;

    /**
     * Patient object universal identifier
     */
    private String uid;

    /**
     * Patient Electronic Data Interchange Personal Identifier
     */
    private String edipi;

    /**
     * Constructs PatientIds from Builder values.
     * @param builder PatientIds Builder.
     */
    public PatientIds(Builder builder)
    {
        this.pid = builder.pid;
        this.dfn = builder.dfn;
        this.icn = builder.icn;
        this.uid = builder.uid;
        this.edipi = builder.edipi;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getDfn() {
        return dfn;
    }

    public void setDfn(String dfn) {
        this.dfn = dfn;
    }

    public String getIcn() {
        return icn;
    }

    public void setIcn(String icn) {
        this.icn = icn;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getEdipi() {
        return edipi;
    }

    public void setEdipi(String edipi) {
        this.edipi = edipi;
    }

    @Override
    public String toString()
    {
        return String.format("pid: %s | dfn: %s | icn: %s | uid: %s | edipi: %s", pid, dfn, icn, uid, edipi);
    }

    /**
     * Returns a map representation of tbe object, even for fields which are {@code null}
     * @return a Map with entries for each field of the PatientIds object
     */
    public Map toMap() {
        Map map = new HashMap<String, String>();
        map.put("pid", this.pid);
        map.put("dfn", this.dfn);
        map.put("icn", this.icn);
        map.put("uid", this.uid);
        map.put("edipi", this.edipi);
        return map;
    }

    /**
     * Builds a PatientIds object from a Map
     * @param map Map with entries matching field names
     * @return a PatientIds object populated with the values from the map entries
     */
    public static PatientIds fromMap(Map<String, String> map) {
        return new Builder()
                .edipi(map.get("edipi"))
                .pid(map.get("pid"))
                .dfn(map.get("dfn"))
                .icn(map.get("icn"))
                .uid(map.get("uid"))
                .build();
    }

    /**
     * PatientIds inner static Builder class
     */
    public static class Builder
    {
        /**
         * Patient identifier. (It may be an ICN or a Site;DFN)
         */
        private String pid;

        /**
         * Patient data file number (aka IEN).
         */
        private String dfn;

        /**
         * Patient Integration Control Number.
         */
        private String icn;

        /**
         * Patient object universal identifier
         */
        private String uid;

        /**
         * Patient Electronic Data Interchange Personal Identifier
         */
        private String edipi;

        public Builder pid(String pid) {
            this.pid = pid;
            return this;
        }

        public Builder dfn(String dfn) {
            this.dfn = dfn;
            return this;
        }

        public Builder icn(String icn) {
            this.icn = icn;
            return this;
        }

        public Builder uid(String uid) {
            this.uid = uid;
            return this;
        }

        public Builder edipi(String edipi) {
            this.edipi = edipi;
            return this;
        }

        public PatientIds build() {
            return new PatientIds(this);
        }
    }
}
