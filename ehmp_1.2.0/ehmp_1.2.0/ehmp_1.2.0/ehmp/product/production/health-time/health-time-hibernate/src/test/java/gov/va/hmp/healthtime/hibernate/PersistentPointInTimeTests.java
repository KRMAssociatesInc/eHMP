package gov.va.hmp.healthtime.hibernate;

import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import java.sql.Types;

import static org.junit.Assert.*;

public class PersistentPointInTimeTests {

    @Test
    public void testHibernatePointInTimeType() throws Exception {
        PersistentPointInTime type = new PersistentPointInTime();

        assertFalse(type.isMutable());
        assertSame(Types.VARCHAR, type.sqlType());
        assertEquals("pointintime", type.getName());
        assertSame(PointInTime.class, type.getReturnedClass());

        PointInTime t = new PointInTime(1975, 7);
        assertEquals("197507", type.toString(t));
        assertEquals(t, type.fromStringValue("197507"));
        assertEquals("197507", type.objectToSQLString(t, null));

        // TODO: test get/set with mock result set (not sure how to do, yet)

    }
}
