package gov.va.hmp.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.UidUtils;
import gov.va.hmp.healthtime.HealthTimePrinterSet;
import gov.va.hmp.healthtime.HealthTimePrinterSetHolder;
import gov.va.hmp.healthtime.MSCUIDateTimePrinterSet;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUser;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class HmpUser extends VistaUser implements HmpUserDetails, HealthTimePrinterSetHolder {
    private static final long serialVersionUID = 7686743956371867170L;

    private int timeoutSeconds;
    private int timeoutCountdownSeconds;

    private OrderingRole orderingRole = OrderingRole.NONE;

    private Set<VistaSecurityKey> securityKeys = new HashSet<VistaSecurityKey>();
    private Set<VistaUserClassAuthority> userClasses = new HashSet<VistaUserClassAuthority>();

    private Set<TeamPosition> teamPositions;

    private HealthTimePrinterSet healthTimePrinterSet = new MSCUIDateTimePrinterSet();

    public HmpUser(RpcHost host,
                   String vistaId,
                   String primaryStationNumber,
                   String division,
                   String duz,
                   String credentials,
                   String displayName,
                   boolean enabled,
                   boolean accountNonExpired,
                   boolean credentialsNonExpired,
                   boolean accountNonLocked,
                   int timeoutSeconds,
                   int timeoutCountdownSeconds,
                   Collection<GrantedAuthority> authorities,
                   Collection<TeamPosition> teamPositions) {
        super(host, vistaId, primaryStationNumber, division, duz, credentials, displayName, enabled, accountNonExpired,
                credentialsNonExpired, accountNonLocked, authorities);

        this.timeoutSeconds = timeoutSeconds;
        this.timeoutCountdownSeconds = timeoutCountdownSeconds;
        this.teamPositions = Collections.unmodifiableSet(new HashSet<TeamPosition>(teamPositions));

        for (GrantedAuthority authority : authorities) {
            if (authority instanceof OrderingRole) {
                this.orderingRole = (OrderingRole) authority;
            }
            if (authority instanceof VistaSecurityKey) {
                securityKeys.add((VistaSecurityKey) authority);
            }
            if (authority instanceof VistaUserClassAuthority) {
                userClasses.add((VistaUserClassAuthority) authority);
            }
        }
    }

    @Override
    public String getUid() {
        return UidUtils.getUserUid(getVistaId(), getDUZ());
    }

    @Override
    public int getTimeoutSeconds() {
        return timeoutSeconds;
    }

    @Override
    public int getTimeoutCountdownSeconds() {
        return timeoutCountdownSeconds;
    }

    @Override
    public OrderingRole getOrderingRole() {
        return orderingRole;
    }

    @Override
    public boolean hasAuthority(String authority) {
        boolean hasAuthority = false;
        for (GrantedAuthority grantedAuthority : authorities) {
            hasAuthority = grantedAuthority.getAuthority().equals(authority);
            if (hasAuthority) break;
        }
        return hasAuthority;
    }

    @Override
    public boolean hasVistaKey(String key) {
        if (key.startsWith(VistaSecurityKey.VISTA_KEY_PREFIX)) {
            key = key.substring(VistaSecurityKey.VISTA_KEY_PREFIX.length());
            key = key.replace('_', ' ');
        }
        for (VistaSecurityKey k : securityKeys) {
            if (k.getKey().equalsIgnoreCase(key)) return true;
        }
        return false;
    }

    @Override
    public boolean hasVistaUserClass(String userClass) {
        if (userClass.startsWith(VistaUserClassAuthority.VISTA_USER_CLASS_PREFIX)) {
            userClass = userClass.substring(VistaUserClassAuthority.VISTA_USER_CLASS_PREFIX.length());
            userClass = userClass.replace('_', ' ');
        }
        for (VistaUserClassAuthority authority : userClasses) {
            if (authority.getUserClass().equalsIgnoreCase(userClass)) return true;
        }
        return false;
    }

    @Override
    public Set<VistaSecurityKey> getSecurityKeys() {
        return Collections.unmodifiableSet(securityKeys);
    }

    @Override
    public Set<VistaUserClassAuthority> getUserClasses() {
        return Collections.unmodifiableSet(userClasses);
    }

    @Override
    public Set<TeamPosition> getTeamPositions() {
        return teamPositions;
    }

    @JsonIgnore
    public HealthTimePrinterSet getHealthTimePrinterSet() {
        return healthTimePrinterSet;
    }

    public void setHealthTimePrinterSet(HealthTimePrinterSet healthTimePrinterSet) {
        this.healthTimePrinterSet = healthTimePrinterSet;
    }
}
