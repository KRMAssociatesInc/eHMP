package gov.va.cpe.vpr;

import java.util.Map;

/**
 * This is the start of an interface to define AVIVA Apps that can run on the platform.
 * 
 * All controllers are pretty much apps, but AvivaApps are the registered top-level apps that
 * have security, and links on the AppBar.
 */
public interface HMPApp {

	/**
	 * Returns all the apps metadata.  Should contain at least the following keys:
	 * code= Unique App Code (probably a gov.va.xxx-ish string)
	 * name= App Name (Only displayed in the app bar)
	 * url= URL to link to the app (could be on the same server or not)
	 * menu= The Menu Title (will group like apps under the same menu in the AppBar)
	 */
	public Map<String, Object> getAppInfo();
}