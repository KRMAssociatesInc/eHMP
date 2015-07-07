package gov.va.cpe.vpr.vistasvc;

import gov.va.hmp.HmpProperties;
import org.junit.rules.TemporaryFolder;

import java.io.IOException;

public class EhCacheTestUtils {
    public static TemporaryFolder ehcacheDiskStoreDir;

    // sets up a temporary location for ehcache's diskStore
    public static void setUp() throws IOException {
        ehcacheDiskStoreDir = new TemporaryFolder();
        ehcacheDiskStoreDir.create();
        System.setProperty(HmpProperties.EHCACHE_DATA_DIR, ehcacheDiskStoreDir.getRoot().getCanonicalPath());
    }

    // deletes the temporary location for ehcache's diskStore
    public static void tearDown() {
        if (ehcacheDiskStoreDir != null)
            ehcacheDiskStoreDir.delete();
        ehcacheDiskStoreDir = null;
    }
}
