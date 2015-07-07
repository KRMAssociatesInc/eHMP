package gov.va.hmp.app;

import gov.va.hmp.module.PatientDataDisplayType;

import java.util.List;

public interface IPageService {
    List<Page> getPages(PatientDataDisplayType type);
    List<Page> getPages();
    Page getPage(String uid);
}
