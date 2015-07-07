package gov.va.hmp.healthtime.hibernate;

import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.hibernate.Hibernate;
import org.hibernate.HibernateException;
import org.hibernate.dialect.Dialect;
import org.hibernate.type.ImmutableType;
import org.hibernate.type.LiteralType;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * <tt>pointintime</tt>: A type that maps an SQL VARCHAR to a
 * <tt>gov.va.med.vpr.pointintime.PointInTime</tt>
 *
 * @see gov.va.hmp.healthtime.PointInTime
 */
public class PersistentPointInTime extends ImmutableType implements LiteralType {

    public Object get(ResultSet rs, String name) throws HibernateException, SQLException {
        String val = (String) Hibernate.STRING.nullSafeGet(rs, name);
        try {
            return val == null ? null : HL7DateTimeFormat.parse(val.toString());
        } catch (Exception e) {
            throw new HibernateException("Could not resolve point in time: " + val);
        }
    }

    public void set(PreparedStatement st, Object value, int index) throws HibernateException, SQLException {
        String strVal = null;
        if (value != null) {
            PointInTime t = (PointInTime) value;
            strVal = t.toString();
        }
        Hibernate.STRING.nullSafeSet(st, strVal, index);
    }

    public int sqlType() {
        return Hibernate.STRING.sqlType();
    }

    public String toString(Object value) throws HibernateException {
        return ((PointInTime) value).toString();
    }

    public Object fromStringValue(String value) throws HibernateException {
        try {
            return HL7DateTimeFormat.parse(value);
        } catch (Exception e) {
            throw new HibernateException("Could not resolve point in time: " + value, e);
        }
    }

    public Class getReturnedClass() {
        return PointInTime.class;
    }

    public String getName() {
        return "pointintime";
    }

    public String objectToSQLString(Object value, Dialect dialect) throws Exception {
        return toString(value);
    }
}
