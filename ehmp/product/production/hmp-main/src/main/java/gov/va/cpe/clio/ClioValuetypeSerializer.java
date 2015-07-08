package gov.va.cpe.clio;


import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

/**
 * User: Brian Juergensmeyer
=======
/**
 * Created with IntelliJ IDEA.
 * User: brian
>>>>>>> Terminology
 * Date: 4/25/13
 * Time: 3:52 PM
 * To change this template use File | Settings | File Templates.
 */


public class ClioValuetypeSerializer extends JsonSerializer<ClioValuetype> {

    @Override
    public void serialize(ClioValuetype value, JsonGenerator generator,
              SerializerProvider provider) throws IOException,
              JsonProcessingException {

      generator.writeNumber(value.getvalueType());
    }
}
