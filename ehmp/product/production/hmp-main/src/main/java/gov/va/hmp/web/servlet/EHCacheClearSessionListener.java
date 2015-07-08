package gov.va.hmp.web.servlet;

import net.sf.ehcache.CacheManager;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

/**
 * Simple class to nuke any session id prefixed EHCache's when the session expires
 */
public class EHCacheClearSessionListener implements HttpSessionListener {
	@Override
	public void sessionCreated(HttpSessionEvent se) {
		// dont care
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent se) {
		CacheManager manager = CacheManager.create();
		for (String name : manager.getCacheNames()) {
			if (name.endsWith(":" + se.getSession().getId())) {
				// this cache is session-scoped with the current session, nuke it.
				manager.removeCache(name);
			}
		}
	}
}