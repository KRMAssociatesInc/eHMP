package gov.va.hmp.healthtime.solr.schema;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.apache.lucene.index.IndexableField;
import org.apache.lucene.search.SortField;
import org.apache.solr.common.SolrException;
import org.apache.solr.response.TextResponseWriter;
import org.apache.solr.schema.IndexSchema;
import org.apache.solr.schema.PrimitiveFieldType;
import org.apache.solr.schema.SchemaField;

import java.io.IOException;
import java.util.Map;

/**
 * This FieldType accepts HL7 time stamp (TS) strings.
 * <p/>
 * Format: YYYY[MM[DD[HHMM[SS[.S[S[S[S]]]]]]]][+/-ZZZZ]^<degree of precision>
 *
 * @see gov.va.hmp.healthtime.PointInTime
 */
public class HL7DateField extends PrimitiveFieldType {
    @Override
    protected void init(IndexSchema schema, Map<String, String> args) {
        super.init(schema, args);

        // Tokenizing makes no sense
        restrictProps(TOKENIZED);
    }

    @Override
    public void write(TextResponseWriter writer, String name, IndexableField f) throws IOException {
        writer.writeStr(name, f.stringValue(), false);
    }

    @Override
    public SortField getSortField(SchemaField field, boolean reverse) {
        return getStringSort(field, reverse);
    }

    @Override
    public String toInternal(String val) {
        try {
            HL7DateTimeFormat.parse(val);
        } catch (IllegalArgumentException e) {
            throw new SolrException(SolrException.ErrorCode.BAD_REQUEST, "Invalid HL7 Date String: '" + val + "'");
        }
        return val;
    }

    public String toInternal(PointInTime t) {
        if (t == null) return null;
        return t.toString();
    }

    @Override
    public PointInTime toObject(IndexableField f) {
        return HL7DateTimeFormat.parse(f.stringValue());
    }
}
