package gov.va.hmp.app;

import gov.va.hmp.module.PatientDataDisplayType;

import java.util.List;

public interface IMenuService {
    Menu getMainMenu();
    List<Menu> getMenus(PatientDataDisplayType type);
    List<Menu> getMenus();
    Menu getMenu(String uid);
}
