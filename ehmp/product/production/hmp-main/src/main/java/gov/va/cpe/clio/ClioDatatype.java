package gov.va.cpe.clio;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * User: Brian Juergensmeyer
 * Date: 4/24/13
 * Time: 11:09 AM
 */

@JsonSerialize(using=ClioDatatypeSerializer.class)
@JsonDeserialize(using=ClioDatatypeDeserializer.class)

public enum ClioDatatype {
    QUALIFIER(0),
    COMPLEX(1),
    NUMERIC(2),
    PICKLIST(3),
    BOOLEAN(4),
    STRING(5),
    RANGE(6);

    private Integer dataType;

    public Integer getdataType() {
      return dataType;
    }

    ClioDatatype(Integer dataType) {
        this.dataType = dataType;
    }
}
