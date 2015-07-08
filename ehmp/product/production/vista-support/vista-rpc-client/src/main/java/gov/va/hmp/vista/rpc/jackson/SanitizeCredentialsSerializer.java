package gov.va.hmp.vista.rpc.jackson;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdScalarSerializer;
import gov.va.hmp.vista.rpc.conn.AccessVerifyConnectionSpec;
import gov.va.hmp.vista.rpc.conn.ConnectionSpec;
import gov.va.hmp.vista.rpc.conn.ConnectionSpecFactory;
import org.springframework.util.DigestUtils;

import java.io.IOException;

public class SanitizeCredentialsSerializer extends StdScalarSerializer<String> {

    public SanitizeCredentialsSerializer() {
        super(String.class);
    }

    /**
     * For Strings, both null and Empty String qualify for emptiness.
     */
    @Override
    public boolean isEmpty(String value) {
        return (value == null) || (value.length() == 0);
    }

    @Override
    public void serialize(String value, JsonGenerator jgen, SerializerProvider provider)
            throws IOException, JsonGenerationException {
        ConnectionSpec auth = ConnectionSpecFactory.create(value);
        if (auth instanceof AccessVerifyConnectionSpec) {
            jgen.writeString(DigestUtils.md5DigestAsHex(((AccessVerifyConnectionSpec) auth).getCredentials().getBytes("UTF-8")));
        } else {
            jgen.writeString(auth.toString());
        }
    }
}
