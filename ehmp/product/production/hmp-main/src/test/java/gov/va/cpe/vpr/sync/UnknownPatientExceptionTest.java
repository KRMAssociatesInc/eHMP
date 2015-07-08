package gov.va.cpe.vpr.sync;

import org.junit.Assert;
import org.junit.Test;

public class UnknownPatientExceptionTest {
    @Test
    public void testException() throws Exception {
        UnknownPatientException exc = new UnknownPatientException("222", "777");
        Assert.assertEquals("Patient with localPatientId '777' from system '222' is currently unknown to the VPR. This is likely due to old subscriptions notifying this VPR about new data for patient's that are no longer in it.", exc.getMessage());
    }

}
