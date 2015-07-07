package gov.va.hmp.app;

import gov.va.hmp.module.PatientDataDisplayType;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class PageService implements IPageService {
    @Override
    public List<Page> getPages(PatientDataDisplayType type) {
        return Collections.emptyList();
    }

    @Override
    public List<Page> getPages() {
        return Collections.emptyList();
    }

    @Override
    public Page getPage(String uid) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }
}
