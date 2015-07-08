package gov.va.hmp.web.json;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Jackson mix-in to add json serialization annotations to the Spring Security {@link org.springframework.security.core.userdetails.UserDetails} interface.
 *
 * @see "http://wiki.fasterxml.com/JacksonMixInAnnotations"
 */
public interface UserDetailsJacksonAnnotations {
    @JsonIgnore
    String getPassword();
}
