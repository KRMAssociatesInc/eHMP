package gov.va.hmp.app;

import java.util.Map;

public interface IAppService {
    Map<String, Object> getApps();
    Map<String, Object> getMainMenu();
    Map<String, Object> getApp(String code);
    Map<String, Object> getApps(String type);
}
