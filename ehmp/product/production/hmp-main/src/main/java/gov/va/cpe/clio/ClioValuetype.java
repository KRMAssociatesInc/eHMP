package gov.va.cpe.clio;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * User: Brian Juergensmeyer
=======
/**
 * Created with IntelliJ IDEA.
 * User: brian
>>>>>>> Terminology
 * Date: 4/25/13
 * Time: 3:23 PM
 * To change this template use File | Settings | File Templates.
 */

@JsonSerialize(using=ClioValuetypeSerializer.class)
@JsonDeserialize(using=ClioValuetypeDeserializer.class)

public enum ClioValuetype {
    UNSPECIFIED(0),
    TEMPERATURE(1),
    LENGTH(2),
    VOLUME(3),
    RATE(4),
    TIME(5),
    MASS(6),
    SCALE(7);

    private Integer valueType;

    public Integer getvalueType() {
      return valueType;
    }

    ClioValuetype(Integer valueType) {
        this.valueType = valueType;
    }
}
