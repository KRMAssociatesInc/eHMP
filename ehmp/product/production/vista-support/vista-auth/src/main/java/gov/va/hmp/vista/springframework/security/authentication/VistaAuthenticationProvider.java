package gov.va.hmp.vista.springframework.security.authentication;

import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetailsService;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceAware;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.dao.DataAccessException;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.SpringSecurityMessageSource;
import org.springframework.security.core.userdetails.UserCache;
import org.springframework.security.core.userdetails.cache.NullUserCache;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;


public class VistaAuthenticationProvider implements AuthenticationProvider, MessageSourceAware, InitializingBean {

    protected MessageSourceAccessor messages = SpringSecurityMessageSource.getAccessor();

    private UserCache userCache = new NullUserCache();

    private VistaUserDetailsService userDetailsService;

    public void afterPropertiesSet() throws Exception {
        Assert.notNull(this.userCache, "A user cache must be set");
        Assert.notNull(this.messages, "A message source must be set");
        Assert.notNull(this.userDetailsService, "A VistaUserDetailsService must be set");
    }

    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Assert.isInstanceOf(VistaAuthenticationToken.class, authentication,
                messages.getMessage("VistaAuthenticationProvider.onlySupports",
                        "Only VistaAuthenticationToken is supported"));

        VistaAuthenticationToken auth = (VistaAuthenticationToken) authentication;

        String username = auth.getName();

        boolean cacheWasUsed = true;
        VistaUserDetails user = (VistaUserDetails) this.userCache.getUserFromCache(username);

        if (user == null) {
            cacheWasUsed = false;
            user = retrieveUser(auth);
            Assert.notNull(user, "retrieveUser returned null - a violation of the interface contract");
        }

        if (!user.isAccountNonLocked()) {
            throw new LockedException(messages.getMessage("VistaAuthenticationProvider.locked",
                    "User account is locked"));
        }

        if (!user.isEnabled()) {
            throw new DisabledException(messages.getMessage("VistaAuthenticationProvider.disabled",
                    "User is disabled"));
        }

        if (!user.isAccountNonExpired()) {
            throw new AccountExpiredException(messages.getMessage("VistaAuthenticationProvider.expired", "User account has expired"));
        }

        // This check must come here, as we don't want to tell users
        // about account status unless they presented the correct credentials
        try {
            additionalAuthenticationChecks(user, auth);
        } catch (AuthenticationException exception) {
            if (cacheWasUsed) {
                // There was a problem, so try again after checking
                // we're using latest data (ie not from the cache)
                cacheWasUsed = false;
                user = retrieveUser(auth);
                additionalAuthenticationChecks(user, auth);
            } else {
                throw exception;
            }
        }

        if (!user.isCredentialsNonExpired()) {
            throw new CredentialsExpiredException(messages.getMessage(
                    "VistaAuthenticationProvider.credentialsExpired", "User credentials have expired"));
        }

        if (!cacheWasUsed) {
            this.userCache.putUserInCache(user);
        }

        return createSuccessAuthentication(user, auth);
    }

    protected void additionalAuthenticationChecks(VistaUserDetails userDetails,
                                                  VistaAuthenticationToken authentication) throws AuthenticationException {
//		Object salt = null;
//
//		if (this.saltSource != null) {
//			salt = this.saltSource.getSalt(userDetails);
//		}
//
        if (authentication.getCredentials() == null) {
            throw new BadCredentialsException(messages.getMessage(
                    "VistaAuthenticationProvider.badCredentials", "Bad credentials"));
        }
//
//		String presentedPassword = authentication.getCredentials() == null ? "" : authentication.getCredentials()
//				.toString();
//
//		if (!passwordEncoder.isPasswordValid(userDetails.getPassword(), presentedPassword, salt)) {
//			throw new BadCredentialsException(messages.getMessage(
//					"VistaAuthenticationProvider.badCredentials", "Bad credentials"),
//					includeDetailsObject ? userDetails : null);
//		}
    }

    protected Authentication createSuccessAuthentication(VistaUserDetails user, VistaAuthenticationToken authentication) {
        return new VistaAuthenticationToken(user, user.getCredentials(), authentication.getRemoteAddress(), authentication.getRemoteHostName(), user.getAuthorities());
    }

    public void setMessageSource(MessageSource messageSource) {
        this.messages = new MessageSourceAccessor(messageSource);
    }

    public void setUserCache(UserCache userCache) {
        this.userCache = userCache;
    }

    public boolean supports(Class authentication) {
        return VistaAuthenticationToken.class.isAssignableFrom(authentication);
    }

    public VistaUserDetailsService getUserDetailsService() {
        return userDetailsService;
    }

    protected final VistaUserDetails retrieveUser(VistaAuthenticationToken authentication)
            throws AuthenticationException {
        VistaUserDetails loadedUser = null;

        try {
            if (StringUtils.hasText(authentication.getAccessCode()) || StringUtils.hasText(authentication.getVerifyCode())) {
                loadedUser = this.getUserDetailsService().login(authentication.getVistaId(),
                        authentication.getDivision(),
                        authentication.getAccessCode(),
                        authentication.getVerifyCode(),
                        authentication.getNewVerifyCode(),
                        authentication.getConfirmVerifyCode(),
                        authentication.getRemoteAddress(),
                        authentication.getRemoteHostName());
            }
            if (loadedUser == null && StringUtils.hasText(authentication.getAppHandle())) {
                loadedUser = this.getUserDetailsService().login(authentication.getVistaId(), authentication.getDivision(), authentication.getAppHandle(), authentication.getRemoteAddress(), authentication.getRemoteHostName());
            }
        } catch (DataAccessException repositoryProblem) {
            throw new AuthenticationServiceException(repositoryProblem.getMessage(), repositoryProblem);
        }

        if (loadedUser == null) {
            throw new AuthenticationServiceException(
                    "VistaUserDetailsService returned null, which is an interface contract violation; it should either return an authenticated " + VistaUserDetails.class.getSimpleName() + " instance or throw an " + AuthenticationException.class.getSimpleName());
        }
        return loadedUser;
    }

    @Required
    public void setUserDetailsService(VistaUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    public UserCache getUserCache() {
        return userCache;
    }
}
