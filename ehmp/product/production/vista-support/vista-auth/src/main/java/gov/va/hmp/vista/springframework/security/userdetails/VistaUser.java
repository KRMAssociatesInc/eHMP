package gov.va.hmp.vista.springframework.security.userdetails;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.util.RpcUriUtils;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.Assert;

import java.util.*;

/**
 * Default implementation of {@link VistaUserDetails}.
 */
public class VistaUser implements VistaUserDetails {

    protected RpcHost host;
    protected String vistaId;
    protected String primaryStationNumber;
    protected String division;
    protected String duz;
    protected String credentials;
    protected String name;
    protected String displayName;
    protected String divisionName;
    protected String displayDivisionName;
    protected String title;
    protected String displayTitle;
    protected String serviceSection;
    protected String displayServiceSection;
    protected String language;
    protected String dTime;
    protected String vpid;
    protected Map<String, Object> attributes = new HashMap<String, Object>();
    protected List<GrantedAuthority> authorities;
    protected boolean accountNonExpired;
    protected boolean accountNonLocked;
    protected boolean credentialsNonExpired;
    protected boolean enabled;

    public VistaUser(RpcHost host, String vistaId, String primaryStationNumber, String division, String duz, String credentials, String name, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<GrantedAuthority> authorities) {
        this.host = host;
        this.vistaId = vistaId;
        this.primaryStationNumber = primaryStationNumber;
        this.division = division;
        this.duz = duz;
        this.credentials = credentials;
        this.name = name;
        this.displayName = VistaStringUtils.nameCase(this.name);
        this.enabled = enabled;
        this.accountNonExpired = accountNonExpired;
        this.credentialsNonExpired = credentialsNonExpired;
        this.accountNonLocked = accountNonLocked;
        this.authorities = Collections.unmodifiableList(sortAuthorities(authorities));
    }

    private static List<GrantedAuthority> sortAuthorities(Collection<GrantedAuthority> authorities) {
        Assert.notNull(authorities, "Cannot pass a null GrantedAuthority array");
        // Ensure array iteration order is predictable (as per UserDetails.getAuthorities() contract and SEC-xxx)
        SortedSet<GrantedAuthority> sorter = new TreeSet<GrantedAuthority>(createGrantedAuthorityComparator());

        for (GrantedAuthority grantedAuthority : authorities) {
            Assert.notNull(grantedAuthority, "GrantedAuthority list cannot contain any null elements");
            sorter.add(grantedAuthority);
        }

        List<GrantedAuthority> sortedAuthorities = new ArrayList<GrantedAuthority>(sorter.size());
        sortedAuthorities.addAll(sorter);

        return sortedAuthorities;
    }

    private static Comparator<GrantedAuthority> createGrantedAuthorityComparator() {
        return new Comparator<GrantedAuthority>() {
            public int compare(GrantedAuthority o1, GrantedAuthority o2) {
                if (o1 == null && o2 == null) return 0;
                if (o1 == null && o2 != null) return -1;
                if (o1 != null && o2 == null) return 1;
                if (o1.getAuthority() == null && o2.getAuthority() == null) return 0;
                if (o1.getAuthority() == null && o2.getAuthority() != null) return -1;
                if (o1.getAuthority() != null && o2.getAuthority() == null) return 1;
                return o1.getAuthority().compareTo(o2.getAuthority());
            }
        };
    }

    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return getCredentials();
    }

    @Override
    public String getUsername() {
        return getDUZ() + "@" + getDivision();
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public RpcHost getHost() {
        return host;
    }

    @Override
    public String getVistaId() {
        return vistaId;
    }

    @Override
    public String getDUZ() {
        return duz;
    }

    @Override
    public String getCredentials() {
        return credentials;
    }

    @Override
    public String getPrimaryStationNumber() {
        return primaryStationNumber;
    }

    @Override
    public String getDivision() {
        return division;
    }

    @Override
    public String getDivisionName() {
        return divisionName;
    }

    @Override
    public String getDisplayDivisionName() {
        return displayDivisionName;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public String getDisplayTitle() {
        return displayTitle;
    }

    @Override
    public String getServiceSection() {
        return serviceSection;
    }

    @Override
    public String getDisplayServiceSection() {
        return displayServiceSection;
    }

    @Override
    public String getLanguage() {
        return language;
    }

    @Override
    public String getDTime() {
        return dTime;
    }

    @Override
    public String getVPID() {
        return vpid;
    }

    public void setDivisionName(String divisionName) {
        this.divisionName = divisionName;
        this.displayDivisionName = VistaStringUtils.nameCase(divisionName);
    }

    public void setTitle(String title) {
        this.title = title;
        this.displayTitle = VistaStringUtils.nameCase(title);
    }

    public void setServiceSection(String serviceSection) {
        this.serviceSection = serviceSection;
        this.displayServiceSection = VistaStringUtils.nameCase(serviceSection);
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setDTime(String dTime) {
        this.dTime = dTime;
    }

    public void setVPID(String vpid) {
        this.vpid = vpid;
    }

    public int hashCode() {
        int code = 9792;

        if (this.getAuthorities() != null) {
            for (int i = 0; i < this.getAuthorities().size(); i++) {
                code = code * (authorities.get(i).hashCode() % 7);
            }
        }

        if (this.getPassword() != null) {
            code = code * (this.getPassword().hashCode() % 7);
        }

        if (this.getUsername() != null) {
            code = code * (this.getUsername().hashCode() % 7);
        }

        if (this.isAccountNonExpired()) {
            code = code * -2;
        }

        if (this.isAccountNonLocked()) {
            code = code * -3;
        }

        if (this.isCredentialsNonExpired()) {
            code = code * -5;
        }

        if (this.isEnabled()) {
            code = code * -7;
        }

        return code;
    }

    public boolean equals(Object rhs) {
        if (!(rhs instanceof VistaUser) || (rhs == null)) {
            return false;
        }

        VistaUser user = (VistaUser) rhs;

        // We rely on constructor to guarantee any User has non-null and >0
        // authorities
        if (!authorities.equals(user.authorities)) {
            return false;
        }

        // We rely on constructor to guarantee non-null username and password
        return (this.getPassword().equals(user.getPassword()) && this.getUsername().equals(user.getUsername())
                && (this.isAccountNonExpired() == user.isAccountNonExpired())
                && (this.isAccountNonLocked() == user.isAccountNonLocked())
                && (this.isCredentialsNonExpired() == user.isCredentialsNonExpired())
                && (this.isEnabled() == user.isEnabled()));
    }

    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public String toString() {
        StringBuffer sb = new StringBuffer();
        sb.append(super.toString()).append(": ");
        sb.append("DUZ: ").append(getDUZ()).append("; ");
        sb.append("StationNumber: ").append(getDivision()).append("; ");
        sb.append("Name: ").append(getName()).append("; ");
        sb.append("Access: [PROTECTED]; ");
        sb.append("Verify: [PROTECTED]; ");
        sb.append("Enabled: ").append(this.enabled).append("; ");
        sb.append("AccountNonExpired: ").append(this.accountNonExpired).append("; ");
        sb.append("CredentialsNonExpired: ").append(this.credentialsNonExpired).append("; ");
        sb.append("AccountNonLocked: ").append(this.accountNonLocked).append("; ");

        if (this.getAuthorities() != null) {
            sb.append("Granted Authorities: ");

            for (int i = 0; i < authorities.size(); i++) {
                if (i > 0) {
                    sb.append(", ");
                }

                sb.append(authorities.get(i));
            }
        } else {
            sb.append("Not granted any authorities");
        }

        return sb.toString();
    }
}
