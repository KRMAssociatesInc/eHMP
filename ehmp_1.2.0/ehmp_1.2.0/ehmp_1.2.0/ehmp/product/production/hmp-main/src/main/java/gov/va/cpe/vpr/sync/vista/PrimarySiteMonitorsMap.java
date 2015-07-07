package gov.va.cpe.vpr.sync.vista;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

public class PrimarySiteMonitorsMap implements IPrimarySiteMonitorsMap
{
    private HashMap<String,PrimarySiteMonitor> primarySiteMonitors;

    @Override
	public HashMap<String, PrimarySiteMonitor> getPrimarySiteMonitors() {
		return primarySiteMonitors;
	}

	@Override
	public void setPrimarySiteMonitors(
			HashMap<String, PrimarySiteMonitor> primarySiteMonitors) {
		this.primarySiteMonitors = primarySiteMonitors;
	}
	
	@Override
	//check which primary site is available
	public String getEnabledPrimarySiteId()
    {        
       String siteId=null;       
       Iterator<Entry<String, PrimarySiteMonitor>> i=primarySiteMonitors.entrySet().iterator();

       if(i!=null)
       {
             while(i.hasNext())
             {
                  Map.Entry<String, PrimarySiteMonitor> monitor=i.next();
                 
                  if(!monitor.getValue().isDataStreamDisabled())
                  {
                       siteId=monitor.getKey();
                  }
             }
       }
       
       return siteId;

    }
}
