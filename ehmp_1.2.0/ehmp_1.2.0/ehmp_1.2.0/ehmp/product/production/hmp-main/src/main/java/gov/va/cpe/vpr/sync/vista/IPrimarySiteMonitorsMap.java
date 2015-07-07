package gov.va.cpe.vpr.sync.vista;

import java.util.HashMap;

public interface IPrimarySiteMonitorsMap 
{

	public HashMap<String, PrimarySiteMonitor> getPrimarySiteMonitors();
	
	public void setPrimarySiteMonitors(
			HashMap<String, PrimarySiteMonitor> primarySiteMonitors);
	
	public String getEnabledPrimarySiteId();
}
