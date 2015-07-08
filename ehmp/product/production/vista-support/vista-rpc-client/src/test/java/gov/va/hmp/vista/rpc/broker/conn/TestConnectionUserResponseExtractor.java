package gov.va.hmp.vista.rpc.broker.conn;

import gov.va.hmp.vista.rpc.RpcResponse;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class TestConnectionUserResponseExtractor {

    @Test
    public void extractConnectionUserDetails() {
        ConnectionUserResponseExtractor e = new ConnectionUserResponseExtractor();

        ConnectionUser user = e.extractData(new RpcResponse("20012\r\nVEHU,TEN\r\nTen Vehu\r\n21787^SLC-FO EDIS DEV^960D\r\nScholar Extraordinaire\r\nMEDICINE\r\n\r\n5400\r\n\r\n"));
        assertEquals("20012", user.getDUZ());
        assertEquals("VEHU,TEN", user.getName());
        assertEquals("Ten Vehu", user.getStandardName());
        assertEquals("960", user.getPrimaryStationNumber());
        assertEquals("960D", user.getDivision());
        assertEquals("Scholar Extraordinaire", user.getTitle());
        assertEquals("MEDICINE", user.getServiceSection());
        assertEquals("", user.getLanguage());
        assertEquals("5400", user.getDTime());
        assertEquals("SLC-FO EDIS DEV", user.getDivisionNames().get(user.getDivision()));

        // this properties set by BrokerConnection
        assertNull(user.getCredentials());
    }
}
