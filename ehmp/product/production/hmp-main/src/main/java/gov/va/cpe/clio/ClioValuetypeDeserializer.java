package gov.va.cpe.clio;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

/**
 * User: Brian Juergensmeyer
=======
/**
 * Created with IntelliJ IDEA.
 * User: brian
>>>>>>> Terminology
 * Date: 4/25/13
 * Time: 3:55 PM
 * To change this template use File | Settings | File Templates.
 */

public class ClioValuetypeDeserializer  extends JsonDeserializer<ClioValuetype> {


    @Override
    public ClioValuetype deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
           //ObjectCodec oc = jsonParser.getCodec();
           //JsonNode node = oc.readTree(jsonParser);
           //int clioDataType = node.get("dataType").asInt(0);
//    		String sval = jsonParser.getCurrentToken().asString();
//    		System.out.println(sval);
    		JsonToken t = jsonParser.getCurrentToken();
    		if(t!=null && t.isNumeric()) {
    	           Integer ClioValuetypeType = jsonParser.getIntValue();
    	           switch (ClioValuetypeType) {
    	               case 0: {
    	                   return ClioValuetype.UNSPECIFIED;
    	               }
    	               case 1: {
    	                   return ClioValuetype.TEMPERATURE;
    	               }
    	               case 2: {
    	                   return ClioValuetype.LENGTH;
    	               }
    	               case 3: {
    	                   return ClioValuetype.VOLUME;
    	               }
    	               case 4: {
    	                   return ClioValuetype.RATE;
    	               }
    	               case 5: {
    	                   return ClioValuetype.TIME;
    	               }
    	               case 6: {
    	                   return ClioValuetype.MASS;
    	               }
    	               case 7: {
    	                   return ClioValuetype.SCALE;
    	               }
    	               default: throw new Error("Unknown Clio data type");
    	           }
    		}
    		else
    		{
    			return ClioValuetype.UNSPECIFIED;
    		}
    }
}
