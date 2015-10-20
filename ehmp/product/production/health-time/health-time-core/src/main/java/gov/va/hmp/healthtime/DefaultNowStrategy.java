package gov.va.hmp.healthtime;

import org.joda.time.LocalDateTime;

public class DefaultNowStrategy implements NowStrategy {
    @Override
    public PointInTime now() {
        return PointInTime.fromLocalDateTime(new LocalDateTime());
    }
}
