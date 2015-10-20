package us.vistacore.vxsync.utility;

import junit.framework.TestCase;

import javax.xml.datatype.XMLGregorianCalendar;

public class UtilsTest extends TestCase {

    public void testStringToXMLGregorianCalendar() throws Exception {
        XMLGregorianCalendar xmlGregorianCalendar = Utils.stringToXMLGregorianCalendar("20110502114150");
        assertEquals(5, xmlGregorianCalendar.getMonth());
        assertEquals(2, xmlGregorianCalendar.getDay());
        assertEquals(11, xmlGregorianCalendar.getHour());
        assertEquals(41, xmlGregorianCalendar.getMinute());
        assertEquals(50, xmlGregorianCalendar.getSecond());
    }
    
}
