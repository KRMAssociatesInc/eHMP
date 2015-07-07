package gov.va.cpe.vpr.sync.vista.json;

import gov.va.cpe.vpr.Order;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.sync.vista.MockVistaDataChunks;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.healthtime.PointInTime;
import org.hamcrest.CoreMatchers;
import org.junit.Assert;
import org.junit.Test;

import java.io.InputStream;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

public class OrderImporterTest extends AbstractImporterTest {
    @Test
    public void testOrder() throws Exception {
        VistaDataChunk fragment = MockVistaDataChunks.createFromJson(getOrderResourceAsStream(), mockPatient, "order");
        Order o = (Order) importer.convert(fragment);
        assertNotNull(o);
        assertThat(o.getPid(), CoreMatchers.is(CoreMatchers.equalTo(MOCK_PID)));
        assertEquals(o.getUid(), UidUtils.getOrderUid("66374", "229", "33939"));
        assertEquals(o.getLocalId(), "33939");
        assertEquals(o.getDisplayGroup(), "RAD");
        assertEquals(o.getEntered(), new PointInTime(2011, 7, 20, 8, 56));
        assertEquals(o.getStart(), new PointInTime(2011, 3, 10));
        assertEquals(o.getStop(), new PointInTime(2011, 7, 20, 9, 26));
        assertEquals("urn:va:order-status:comp", o.getStatusCode());
        assertEquals("COMPLETE", o.getStatusName());
    }

    public static InputStream getOrderResourceAsStream() {
        return OrderImporterTest.class.getResourceAsStream("order.json");
    }
}
