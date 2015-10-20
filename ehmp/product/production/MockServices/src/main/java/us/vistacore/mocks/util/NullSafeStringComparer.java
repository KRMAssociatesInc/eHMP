package us.vistacore.mocks.util;

public final class NullSafeStringComparer {

    private NullSafeStringComparer() { }

    public static boolean areEqual(String x, String y) {
        if (x == null) {
            return y == null;
        } else if (y == null) {
            return false;
        } else {
            return x.equals(y);
        }
    }

    public static boolean areNotEqual(String x, String y) {
        return !areEqual(x, y);
    }

}
