package gov.va.hmp.auth;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.UserInterfaceRpcConstants;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.healthtime.format.FileManDateTimeFormat;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcRequest;
import gov.va.hmp.vista.rpc.conn.ConnectionUserDetails;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails;
import gov.va.hmp.vista.springframework.security.userdetails.rpc.RpcTemplateUserDetailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.util.StringUtils;

import java.util.*;

/**
 * TODOC: Provide summary documentation of class RpcTemplateUserDetailService
 */
public class HmpUserDetailsService extends RpcTemplateUserDetailService implements EnvironmentAware {

    private static final Logger LOGGER = LoggerFactory.getLogger(HmpUserDetailsService.class);

    private boolean enforceHmpVersionMatch = true;
    private Environment environment;

    public void setEnforceHmpVersionMatch(boolean enforceHmpVersionMatch) {
        this.enforceHmpVersionMatch = enforceHmpVersionMatch;
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;

        if (environment.acceptsProfiles(HmpProperties.DEVELOPMENT_PROFILE)) {
            LOGGER.info("Disabling HMP version match whilst in development mode");
            setEnforceHmpVersionMatch(false);
        }
    }

    protected VistaUserDetails createVistaUserDetails(RpcHost host, String vistaId, String division, ConnectionUserDetails userDetails) {
        Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER")); // default spring security convention

        JsonNode json = fetchUserInfo(host, userDetails);

        if (enforceHmpVersionMatch) {
            validateHmpVersion(json, host, vistaId, division);
        } else {
            LOGGER.warn("HMP version match was not enforced");
        }

        addOrderingRoleAuthority(authorities, json);
        addVistaKeyAuthorities(authorities, json);
        addVistaUserClassAuthorities(authorities, json, vistaId, userDetails.getDUZ());
        Set<TeamPosition> teamPositions = getTeamPositions(json);

        HmpUser u = new HmpUser(host,
                vistaId,
                userDetails.getPrimaryStationNumber(),
                division,
                userDetails.getDUZ(),
                userDetails.getCredentials(),
                userDetails.getName(),
                true,
                true,
                true,
                true,
                json.get("timeout").asInt(),
                json.get("timeoutCounter").asInt(),
                authorities,
                teamPositions);
        u.setDivisionName(userDetails.getDivisionNames().get(division));
        u.setTitle(userDetails.getTitle());
        u.setServiceSection(userDetails.getServiceSection());
        u.setLanguage(userDetails.getLanguage());
        u.setDTime(userDetails.getDTime());
        u.setVPID(userDetails.getVPID());
        u.getAttributes().put("cprsPath", json.path("cprsPath").textValue());
        u.getAttributes().put("productionAccount", json.path("productionAccount").booleanValue());
        return u;
    }

    private void validateHmpVersion(JsonNode json, RpcHost host, String vistaId, String division) {
        String webHmpVersion = environment.getProperty(HmpProperties.VERSION);
        String vistaHmpVersion = json.get("hmpVersion").asText();
        if (!webHmpVersion.equalsIgnoreCase(vistaHmpVersion)) {
            HmpVersionMismatchException e = new HmpVersionMismatchException(webHmpVersion, vistaHmpVersion, host, vistaId, division);
            throw new AuthenticationServiceException(e.getMessage(), e);
        }
    }

    private void addOrderingRoleAuthority(Set<GrantedAuthority> authorities, JsonNode json) {
        authorities.add(OrderingRole.fromInt(json.get("orderingRole").asInt()));
    }

    private Set<TeamPosition> getTeamPositions(JsonNode json) {
        Set<TeamPosition> teamPositions = new HashSet<TeamPosition>();
        JsonNode positionsNode = json.get("vistaPositions");
        for (JsonNode positionNode : positionsNode) {
            TeamPosition teamPosition = new TeamPosition(positionNode.get("position").asText(),
                    positionNode.get("teamName").asText(),
                    positionNode.get("teamPhone").asText(),
                    FileManDateTimeFormat.parse(positionNode.get("effectiveDate").asText()),
                    FileManDateTimeFormat.parse(positionNode.get("inactiveDate").asText())
            );
            if (StringUtils.hasText(teamPosition.getPosition())) {
                teamPositions.add(teamPosition);
            }
        }
        return teamPositions;
    }

    private void addVistaUserClassAuthorities(Set<GrantedAuthority> authorities, JsonNode json, String vistaId, String localId) {
        JsonNode userClasses = json.get("vistaUserClass");
        if (userClasses != null) {
            for (JsonNode userClassNode : userClasses) {
                VistaUserClassAuthority userClass = new VistaUserClassAuthority(
                        userClassNode.get("uid").asText(),
                        userClassNode.get("role").asText(),
                        FileManDateTimeFormat.parse(userClassNode.path("effectiveDate").asText()),
                        FileManDateTimeFormat.parse(userClassNode.path("expirationDate").asText()));

                authorities.add(userClass);
            }
        } else {
            LOGGER.warn("No user classes found in VistA for: " + UidUtils.getUserUid(vistaId, localId));
        }
    }

    private void addVistaKeyAuthorities(Set<GrantedAuthority> authorities, JsonNode json) {
        JsonNode vistaKeysNode = json.get("vistaKeys");
        if (vistaKeysNode == null) return;
        Iterator<String> vistaKeys = vistaKeysNode.fieldNames();
        if (vistaKeys == null) return;
        while (vistaKeys.hasNext()) {
            String key = vistaKeys.next();
            authorities.add(new VistaSecurityKey(key));
        }
    }

    private JsonNode fetchUserInfo(RpcHost host, ConnectionUserDetails userDetails) {
        Map rpcParams = new HashMap();
        rpcParams.put("command", "getUserInfo");
        rpcParams.put("userId", userDetails.getDUZ());
        RpcRequest rpcRequest = new RpcRequest(host, userDetails.getCredentials(), UserInterfaceRpcConstants.VPR_UI_CONTEXT, UserInterfaceRpcConstants.FRONT_CONTROLLER_RPC, rpcParams);
        return getRpcTemplate().executeForJson(rpcRequest);
    }
}
