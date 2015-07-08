package gov.va.cpe.vpr.vistasvc;

import gov.va.hmp.vista.rpc.RpcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.ServletContextAware;

import javax.servlet.ServletContext;
import java.util.ArrayList;
import java.util.List;

/**
 * Prototype of a VistAService.  The purpose it to be an intermediary between VPR and VISTA RPCs.
 * Its essentially a layer on top of RpcTemplate that provides: Caching, Queuing, Batching, Async Execution, etc. on RPC's
 * and should prevent tightly coupling between middle-tier services and RPC calls (which CPRS suffers from).<p>
 * 
 * Essentially you use {@link #get(String, CachePolicy)} and {@link #put(String, CachePolicy)} to store and fetch string 
 * blobs by URN with a specified {@link CachePolicy}.  If the object is found according to the specified policy, it is returned,
 * otherwise a registered {@link RPCURNMapper} is used to fetch the result (which is stored in cache before being returned)<p>
 * 
 * <p>Current intentions/goals/ideas (5/17/2012):
 * <li> Hopefully can help enable an offline/detached/battlefield mode (run detached from VistA)
 * <li> Intended mostly for UI RPC's, sync RPC's probably don't need this, and it might be redundant with the queue anyway.
 * <li> To be able to have a drop-in replacement for Services/Controllers that inject an rpcTemplate.
 * <li> In some cases this could replace the service alltogeather so you only need a controller (ParamService has potential, Maybe even RosterService?)
 * <li> Could evolve into a less VistA/RPC specific thing too where this might become the basis of a just-in-time interface to other external source: NwHIN, DOD, HDR/CDW/etc.
 * 
 * <p>Current implementation targets:
 * <li> Roster List + Roster Patients
 * <li> Patient Banner demographics
 * <li> Login screen welcome banner
 * <li> Param Service: 
 * 	1) get rid of DB (relational) table, 
 *  2) if VISTA is unavailable, App is still functional.
 *  3) Get rid of other objects (Param.class, DAO, ParamService, etc.)
 * 
 * <p>TO-DO/Incomplete items:
 * <li> Batching, Queuing, DB Storage, Async storage, online/offline mode
 * <li> How to handle passthrough type things (or should we?); Example: patient search, roster source, etc.
 * <li> how/should we handle stuff that is not simple URI based results?
 * <li> TODO: Extract the session/application caching mechanism into its own class for reusability
 * @see RpcTemplate
 * @author brian
 * @since P19
 */
public class VistAService implements ServletContextAware {
	
	ServletContext ctx;
	RpcTemplate tpl;
	
	private static String KEY_PREFIX = "VISTA_CACHE.";
	private static String TTL_KEY_PREFIX = "VISTA_CACHE_TTL.";
	protected List<RPCURNMapper> resolvers = new ArrayList<RPCURNMapper>();

	@Autowired
	public VistAService(RpcTemplate tpl) {
		this.tpl = tpl;
	}
	
	public RpcTemplate getRPCTemplate() {
		return tpl;
	}
	
	@Override
	public void setServletContext(ServletContext ctx) {
		this.ctx = ctx;
	}
	
	public boolean isOnline() {
		// TODO: Detect if we are detached or have an inactive RPC template....
		// TODO: Maybe there could be a tpl.isConnected() method?
		// TODO: Probably should be able to toggle the online status as well....
		return true;
	}
	
	
	// Resolver/Mapper functions ------------------------------------------------------- 
	public void addResolver(RPCURNMapper r) {
		resolvers.add(r);
	}
	
	public RPCURNMapper getResolverFor(String urn, boolean notFoundError) {
		for (RPCURNMapper r : resolvers) {
			if (r.isKnown(urn)) {
				return r;
			}
		}
		if (notFoundError) {
			throw new RuntimeException("Unable to locate URN Resolver for: " + urn);
		}
		return null;
	}

	// get/put/exec functions -------------------------------------------------------------
	public String get(String urnstr, CachePolicy policy) {
		return get(urnstr, policy, null);
	}

	public String get(String urn, CachePolicy policy, RPCURNMapper resolver) {
		if (resolver == null) {
			resolver = getResolverFor(urn, false);
		}
		if (!isOnline()) policy = policy.offlinePolicy;
		String namespace = resolver.getClass().getSimpleName();
		
		// if the urn is cacheable, look for a cached version (somewhere)
		Object val = CacheMgr.fetch(namespace, urn, policy.cache);
		if (val != null && val.toString().length() > 0) {
			return val.toString();
		}
		
		if (resolver == null) {
			throw new RuntimeException("Unable to locate URN Resolver for: " + urn);
		}
		
		// otherwise try to fetch the value
		val = resolver.fetch(urn, this);
		
		// and stuff it into the cache
		if (val != null && val.toString().length() > 0) {
			CacheMgr.store(namespace, urn, val, policy.cache);
		}
		
		return (val == null) ? null : val.toString();
	}

	public void put(String urn, String val, CachePolicy policy) {
		put(urn, val, policy, null);
	}

	public void put(String urn, String val, CachePolicy policy, RPCURNMapper resolver) {
		if (resolver == null) {
			resolver = getResolverFor(urn, true);
		}
		if (!isOnline()) policy = policy.offlinePolicy;
		String namespace = resolver.getClass().getSimpleName();
		
		// clear the cache for this urn, clear for all modes
		CacheMgr.remove(namespace, urn, policy.cache);
		
		// store to vista (TODO: implement queue/async here)
		resolver.store(urn, val, this);
		
		// also update the cache?
		if (policy.primeOnStore) {
			CacheMgr.store(namespace, urn, val, policy.cache);
		}
	}
	
	public void delete(String urn) {
		delete(urn, null);
	}
	
	public void delete(String urn, RPCURNMapper resolver) {
		if (resolver == null) {
			resolver = getResolverFor(urn, true);
		}
		String namespace = resolver.getClass().getSimpleName();
		
		resolver.delete(urn, this);
		CacheMgr.removeAny(namespace, urn);
	}
	
	/**
	 * This is an inital attempt at incoporating non-URN based resources like patient search.
	 * 
	 * RPCURNMappers may throw a NotImplementedException if they don't support this.
	 */
	public Object exec(String urn, Object params, CachePolicy policy, RPCURNMapper resolver) {
		if (resolver == null) {
			resolver = getResolverFor(urn, true);
		}
		
		// TODO: implement queue/async here
		return resolver.exec(urn, params, this);
	}
}
