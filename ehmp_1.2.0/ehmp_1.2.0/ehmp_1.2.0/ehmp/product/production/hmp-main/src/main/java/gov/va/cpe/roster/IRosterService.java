package gov.va.cpe.roster;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface IRosterService {
    Page<Roster> getRosters(Pageable pageable);

    List<RosterPatient> getRosterPatients(String rosterUid);

    List<Roster> getRostersForPatient(String pid);

    Roster updateRoster(String[] definition);
    
    String deleteRoster(String rosterUid);

    List<Map<String, Object>> searchRosterSource(String src, String search);
}
