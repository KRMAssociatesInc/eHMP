package gov.va.hmp.plugins;

import java.util.List;
import java.util.Map;

public interface IHmpPluginService {
    List<Map<String, Object>> getPlugins();
    void start(Long bundleId);
    void stop(Long bundleId);
    void uninstall(Long bundleId);
}
