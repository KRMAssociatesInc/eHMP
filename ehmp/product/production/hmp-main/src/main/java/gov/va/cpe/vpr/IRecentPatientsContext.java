package gov.va.cpe.vpr;

import java.util.List;
import java.util.Map;

public interface IRecentPatientsContext {
    List<Map<String, Object>> getPats(String userId);

    void addForUser(String userId, Map<String, Object> patRec);

    void clearForUser(String uid);
}
