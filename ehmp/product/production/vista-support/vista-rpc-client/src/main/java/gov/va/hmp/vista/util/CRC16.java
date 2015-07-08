package gov.va.hmp.vista.util;

import java.util.zip.Checksum;

/**
 * Implements CRC-16-ANSI as in VistA Kernel
 *
 * @see CRC16^XLFCRC
 */
public class CRC16 implements Checksum {

    private static int POLYNOMIAL = 0xA001;

    private int sum = 0;

    @Override
    public void update(int b) {
        int r = sum;
        r ^= b;
        for (int j = 0; j < 8; j++) {
            if ((r % 2) != 0) {
                r = (r / 2) ^ POLYNOMIAL;
            } else {
                r = r / 2;
            }
        }
        sum = r;
    }

    @Override
    public void update(byte[] b, int off, int len) {
        for (int i = off; i < off + len; i++)
            update((int) b[i]);
    }

    public void update(byte[] b) {
        update(b, 0, b.length);
    }

    @Override
    public long getValue() {
        return sum;
    }

    @Override
    public void reset() {
        sum = 0;
    }
}
