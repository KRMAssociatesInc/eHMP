package gov.va.hmp.healthtime.jackson;

import com.fasterxml.jackson.databind.module.SimpleModule;
import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.PointInTime;

public class HealthTimeModule extends SimpleModule {
    public HealthTimeModule() {
        super("HealthTimeModule", ModuleVersion.instance.version());

        addDeserializer(PointInTime.class, new PointInTimeDeserializer());
        addDeserializer(IntervalOfTime.class, new IntervalOfTimeDeserializer());

        addSerializer(PointInTime.class, new PointInTimeSerializer());
        addSerializer(IntervalOfTime.class, new IntervalOfTimeSerializer());
    }
}
