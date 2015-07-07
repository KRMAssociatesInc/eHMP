package gov.va.hmp.web.json;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Jackson mix-in to add json serialization annotations to the Spring Security {@link org.springframework.security.core.GrantedAuthority} interface.
 *
 * @see "http://wiki.fasterxml.com/JacksonMixInAnnotations"
 */
public interface GrantedAuthorityJacksonAnnotations {
    @JsonValue
    String getAuthority();
}
