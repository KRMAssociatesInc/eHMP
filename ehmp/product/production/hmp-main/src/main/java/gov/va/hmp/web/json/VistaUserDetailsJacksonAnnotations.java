package gov.va.hmp.web.json;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Jackson mix-in to add json serialization annotations to the {@link gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails} interface.
 *
 * @see "http://wiki.fasterxml.com/JacksonMixInAnnotations"
 */
public interface VistaUserDetailsJacksonAnnotations extends UserDetailsJacksonAnnotations {
    @JsonIgnore
    String getCredentials();
    @JsonIgnore
    String getAccessCode();
    @JsonIgnore
    String getVerifyCode();
}
