package gov.va.hmp.hub;

import org.junit.Before;
import org.junit.Test;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class VistaAccountTests {

    VistaAccount account;

    @Before
    public void setUp() throws InvalidKeyException, UnsupportedEncodingException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, InvalidAlgorithmParameterException {
        account = new VistaAccount();
		account.setDivision("999");
		account.setName("FOO");
		account.setHost("example.org");
    }

    @Test
    public void testConstruct() throws InvalidKeyException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, InvalidAlgorithmParameterException, IOException {
        assertEquals("999", account.getDivision());
        assertEquals("FOO", account.getName());
        assertEquals("example.org", account.getHost());
        assertEquals(VistaAccount.DEFAULT_PORT, account.getPort());
        assertFalse(account.isProduction());
    }
}
