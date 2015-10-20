package gov.va.hmp.healthtime;

public class ImprecisePointInTimeException extends RuntimeException {
    private PointInTime t;

    public ImprecisePointInTimeException(PointInTime t) {
        super("the point in time '" + t.toString() + "' was not precise enough to support the requested operation");
        this.t = t;
    }

    public PointInTime getPointInTime() {
        return t;
    }
}
