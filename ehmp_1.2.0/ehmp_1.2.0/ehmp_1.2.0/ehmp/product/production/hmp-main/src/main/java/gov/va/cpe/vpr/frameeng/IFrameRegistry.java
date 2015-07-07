package gov.va.cpe.vpr.frameeng;

import java.util.List;

public interface IFrameRegistry {
    IFrame findByID(String id);

    List<IFrame> findAllByClass(Class<? extends IFrame> clazz);
}
