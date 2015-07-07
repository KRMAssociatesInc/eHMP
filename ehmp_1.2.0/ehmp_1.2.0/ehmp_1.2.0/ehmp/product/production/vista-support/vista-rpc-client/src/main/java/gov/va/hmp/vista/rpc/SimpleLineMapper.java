package gov.va.hmp.vista.rpc;

import org.springframework.dao.TypeMismatchDataAccessException;
import org.springframework.util.NumberUtils;

/**
 * {@link LineMapper} implementation that converts each line into a single
 * result value per line.
 * <p>The type of the result value for each line can be specified. The value
 * will be extracted from the <code>RpcResponse</code> and converted into the specified target type.
 *
 * @see RpcOperations#execute(LineMapper, RpcRequest)
 */
public class SimpleLineMapper<T> implements LineMapper<T> {

    private Class<T> requiredType;

    /**
     * Create a new SimpleLineMapper.
     *
     * @see #setRequiredType
     */
    public SimpleLineMapper() {
    }

    /**
     * Create a new SingleColumnRowMapper.
     *
     * @param requiredType the type that each result object is expected to match
     */
    public SimpleLineMapper(Class<T> requiredType) {
        this.requiredType = requiredType;
    }

    /**
     * Set the type that each result object is expected to match.
     * <p>If not specified, the line value will be exposed as
     * a String as returned by the RPC.
     */
    public void setRequiredType(Class<T> requiredType) {
        this.requiredType = requiredType;
    }

    @Override
    public T mapLine(String line, int lineNum) {
        if (line != null && this.requiredType != null && !this.requiredType.isInstance(line)) {
            // Extracted value does not match already: try to convert it.
            try {
                return (T) convertValueToRequiredType(line, this.requiredType);
            } catch (IllegalArgumentException ex) {
                throw new TypeMismatchDataAccessException(
                        "Type mismatch affecting line number " + lineNum + "': " + ex.getMessage());
            }
        }
        return (T) line;
    }

    /**
     * Convert the given line value to the specified required type.
     * Only called if the extracted line value does not match already.
     * <p>If the required type is String, the value will simply get stringified
     * via <code>toString()</code>. In case of a Boolean, the value will be converted into a
     * Boolean using String parsing.  In case of a Number, the value will be
     * converted into a Number, either through number conversion or through
     * String parsing (depending on the value type).
     *
     * @param value        the column value as extracted from <code>getColumnValue()</code>
     *                     (never <code>null</code>)
     * @param requiredType the type that each result object is expected to match
     *                     (never <code>null</code>)
     * @return the converted value
     */
    @SuppressWarnings("unchecked")
    protected Object convertValueToRequiredType(Object value, Class requiredType) {
        if (String.class.equals(requiredType)) {
            return value.toString();
        } else if (Number.class.isAssignableFrom(requiredType)) {
            if (value instanceof Number) {
                // Convert original Number to target Number class.
                return NumberUtils.convertNumberToTargetClass(((Number) value), requiredType);
            } else {
                // Convert stringified value to target Number class.
                return NumberUtils.parseNumber(value.toString(), requiredType);
            }
        } else if (Boolean.class.isAssignableFrom(requiredType)) {
            return Boolean.valueOf(value.toString());
        } else {
            throw new IllegalArgumentException(
                    "Value [" + value + "] is of type [" + value.getClass().getName() +
                            "] and cannot be converted to required type [" + requiredType.getName() + "]");
        }
    }
}
