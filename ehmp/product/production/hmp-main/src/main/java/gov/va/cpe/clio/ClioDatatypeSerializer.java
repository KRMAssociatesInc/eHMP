package gov.va.cpe.clio;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

/**
 * User: brian
 * Date: 4/24/13
 * Time: 11:34 AM
 * To change this template use File | Settings | File Templates.
 */

public class ClioDatatypeSerializer extends JsonSerializer<ClioDatatype> {

    @Override
    public void serialize(ClioDatatype value, JsonGenerator generator,
              SerializerProvider provider) throws IOException,
              JsonProcessingException {

      generator.writeNumber(value.getdataType());
    }
}
