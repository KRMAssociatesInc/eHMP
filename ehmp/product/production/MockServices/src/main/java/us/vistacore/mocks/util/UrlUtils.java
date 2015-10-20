package us.vistacore.mocks.util;

/**
 * Utilities for URL manipulation.
 */
public final class UrlUtils {

    // This is a utility class that should never be instantiated.
    private UrlUtils() {}

    public static String fixHttps(String uri) {
        return uri.replace("http://", "https://");
    }

}
