package gov.va.cpe.vpr.search;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.sql.SQLException;

import org.mockito.Mockito;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import gov.va.cpe.vpr.frameeng.FrameRegistry;
import gov.va.cpe.vpr.frameeng.FrameRunner;
import gov.va.cpe.vpr.frameeng.IFrame;
import gov.va.cpe.vpr.frameeng.FrameRegistry.IFrameLoader;
import gov.va.cpe.vpr.frameeng.FrameRegistry.StaticFrameLoader;
import gov.va.cpe.vpr.pom.jds.JdsGenericDAO;
import gov.va.cpe.vpr.search.frame.GoldSearchFrame;
import gov.va.cpe.vpr.search.frame.LOINCSearchFrame;
import gov.va.cpe.vpr.termeng.H2TermDataSource;
import gov.va.cpe.vpr.termeng.ITermDataSource;
import gov.va.cpe.vpr.termeng.LuceneSearchDataSource;
import gov.va.cpe.vpr.termeng.TermEng;
import gov.va.hmp.access.PermitAllPolicyDecisionPoint;
import gov.va.hmp.auth.HmpUserContext;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.healthtime.HealthTimePrinterSetHolder;

/**
 * This is a frame runner that is useful in test suites because it loads/initializes all of the
 * pre-requisite resources needed by search frames including:
 * 
 * 1) termdbs, 2) mock user context 3) policy engine (permit all)
 * 
 * @author brian
 */
public class SolrTestFrameRunner extends FrameRunner {
	private IFrameLoader loader;
	private ITermDataSource[] dsns;
	private static TermEng eng = null;
    private HmpUserContext userContext;
    private AuthenticationTrustResolver mockTrustResolver;
    private HmpUserDetails mockUser;
    private Authentication mockAuthentication;
	
	public SolrTestFrameRunner() {
		super(new FrameRegistry(new StaticFrameLoader()));
		this.getRegistry().setFrameContext(this);
		this.loader = this.getRegistry().getFrameLoaders().get(0);
	}
	
	public void add(IFrame... frames) {
		for (IFrame f : frames) {
			this.loader.add(f);
		}
	}
	
	public void init() throws Exception {
		this.initTermEng();
		this.initFrameRunner();
		this.initUserContext();
		this.initPolicyEngine();
	}
	
	private void initUserContext() {
		// setup mock user context
	    mockTrustResolver = mock(AuthenticationTrustResolver.class);
	    mockUser = mock(HmpUserDetails.class, Mockito.withSettings().extraInterfaces(HealthTimePrinterSetHolder.class));
	    mockAuthentication = mock(Authentication.class);
	    
	    // setup mock authentication context
	    SecurityContextHolder.getContext().setAuthentication(mockAuthentication);
	    when(mockAuthentication.isAuthenticated()).thenReturn(true);
	    when(mockAuthentication.getPrincipal()).thenReturn(mockUser);
	    when(mockTrustResolver.isAnonymous(mockAuthentication)).thenReturn(false);
	    
	    // create and register
	    userContext = new HmpUserContext(mockTrustResolver);
	    addResource(userContext);
	}
    
	
	private void initPolicyEngine() {
	    // placeholder policy needed to prevent NPEs
	    addResource(new PermitAllPolicyDecisionPoint());
	}
	
	@Override
	public void close() throws IOException {
		super.close();
		eng.close();
		eng = null;
	}
	
	private void initTermEng() throws ClassNotFoundException, SQLException, IOException {
		String url = "jdbc:h2:" + System.getProperty("user.dir") + "/data/termdb-1.UMLS2013AA.20140225-%s/termdb;ACCESS_MODE_DATA=r";
		String lucene = System.getProperty("user.dir") + "/data/termdb-1.UMLS2013AA.20140225-%s/lucene";
		
		// Initialize termdb data sources
		dsns = new ITermDataSource[] {
				new LuceneSearchDataSource(new H2TermDataSource(String.format(url, "sctdb")), String.format(lucene, "sctdb"), false),
				new LuceneSearchDataSource(new H2TermDataSource(String.format(url, "lncdb")), String.format(lucene, "sctdb"), false),
				new LuceneSearchDataSource(new H2TermDataSource(String.format(url, "drugdb")), String.format(lucene, "sctdb"), false),
				new LuceneSearchDataSource(new H2TermDataSource(String.format(url, "icddb")), String.format(lucene, "sctdb"), false)
		};
		eng = TermEng.createInstance(dsns);
		addResource(eng);
	}
	
	private void initFrameRunner() throws Exception {
		// add an empty DAO resource so the frames will initialize
		addResource(new JdsGenericDAO());
		
		// setup all the test frames in the frame loader
		add(new LOINCSearchFrame());
		add(new GoldSearchFrame.DocsSearchFrame());
		add(new GoldSearchFrame.GenericSearchFrame());
		add(new GoldSearchFrame.OrderSearchFrame());
		add(new GoldSearchFrame.SuggestSearchFrame());
		add(new GoldSearchFrame.TasksSearchFrame());
		add(new GoldSearchFrame.VitalsSearchFrame());
//		add(new GoldSearchFrame.WholeDomainSearchFrame());
		
		// reload the registry
		getRegistry().load();
	}
	
}