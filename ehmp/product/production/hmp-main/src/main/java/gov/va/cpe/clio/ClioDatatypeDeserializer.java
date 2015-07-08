package gov.va.cpe.clio;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;


/**
 * User: Brian Juergensmeyer
 * Date: 4/24/13
 * Time: 2:41 PM
 * To change this template use File | Settings | File Templates.
 */


public class ClioDatatypeDeserializer extends JsonDeserializer<ClioDatatype> {


    @Override
    public ClioDatatype deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
           //ObjectCodec oc = jsonParser.getCodec();
           //JsonNode node = oc.readTree(jsonParser);
           //int clioDataType = node.get("dataType").asInt(0);
           Integer clioDataTypeType = jsonParser.getIntValue();
           switch (clioDataTypeType) {
               case 0: {
                   return ClioDatatype.QUALIFIER;
               }
               case 1: {
                   return ClioDatatype.COMPLEX;
               }
               case 2: {
                   return ClioDatatype.NUMERIC;
               }
               case 3: {
                   return ClioDatatype.PICKLIST;
               }
               case 4: {
                   return ClioDatatype.BOOLEAN;
               }
               case 5: {
                   return ClioDatatype.STRING;
               }
               case 6: {
                   return ClioDatatype.RANGE;
               }
               default: throw new Error("Unknown Clio data type");
           }
    }
}
