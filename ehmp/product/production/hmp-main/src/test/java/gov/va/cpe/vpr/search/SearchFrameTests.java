package gov.va.cpe.vpr.search;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;

import gov.va.cpe.vpr.frameeng.CallEvent;
import gov.va.cpe.vpr.frameeng.FrameAction;
import gov.va.cpe.vpr.frameeng.FrameJob;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.FrameRegistry;
import gov.va.cpe.vpr.frameeng.FrameRegistry.StaticFrameLoader;
import gov.va.cpe.vpr.frameeng.FrameRunner;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.search.PatientSearch.SearchMode;
import gov.va.cpe.vpr.search.PatientSearch.SuggestItem;
import gov.va.cpe.vpr.search.PatientSearch.SummaryItem;
import gov.va.cpe.vpr.search.SearchFrame.AnnotatedSearchFrame;

import java.util.HashMap;
import java.util.Map;

import gov.va.hmp.auth.HmpUserDetails;
import org.junit.BeforeClass;
import org.junit.Test;

public class SearchFrameTests {
	public static SuggestItem suggestion = new SuggestItem("query", "display", "category");
	public static SuggestItem browse = new SuggestItem("query", "display", "category");
	public static SummaryItem result = new SummaryItem("uid");
	public static FooAction action = new FooAction();
	
	public static FrameRegistry reg;
	public static FrameRunner runner;
	@BeforeClass
	public static void setup() throws Exception {
		reg = new FrameRegistry(new StaticFrameLoader(
				new TestAnnotatedFrame1(), new TestAnnotatedFrame2(),
				new TestAnnotatedFrame3(), new TestAnnotatedFrame4()));
		reg.load();
		runner = new FrameRunner(reg);
//		runner.setTimeoutMS(10000000);
	}
	
	// test an annotated frame where it runs different methods depending on the trigger
	public static class TestAnnotatedFrame1 extends AnnotatedSearchFrame {
		@Override
		protected void doInit(FrameJob task) throws Exception {
			// do nothing
		}
		
		@AnnotatedSearchFrame.SearchSuggestions
		public void doSuggestion(PatientSearch search, FrameTask task) {
			assertTrue(search.isSuggestOnly());
			task.addAction(suggestion);
		}
		
		@AnnotatedSearchFrame.SearchResults
		public void doSearch(PatientSearch search, FrameTask task) {
			assertFalse(search.isSuggestOnly());
			task.addAction(result);
		}
		
		@AnnotatedSearchFrame.SearchBrowse
		public void doBrowse(PatientSearch search, FrameTask task) {
			assertTrue(search.isSearchMode(SearchMode.BROWSE));
			task.addAction(browse);
		}
		
	}
	
	// this is to test the default behavior of the annotated frame w/o any actual annotations
	public static class TestAnnotatedFrame2 extends AnnotatedSearchFrame {
		@Override
		protected void doInit(FrameJob task) throws Exception {
			// do nothing
		}
		
		@Override
		public void exec(PatientSearch search, FrameTask task) throws FrameException {
			assertFalse(search.isSuggestOnly());
			task.addAction(result);
		}
	}
	
	// test annotation behavior at the class level
	@AnnotatedSearchFrame.SearchSuggestions
	public static class TestAnnotatedFrame3 extends AnnotatedSearchFrame {
		@Override
		protected void doInit(FrameJob task) throws Exception {
			// do nothing
		}
		
		@Override
		public void exec(PatientSearch search, FrameTask task) throws FrameException {
			assertTrue(search.isSuggestOnly());
			task.addAction(suggestion);
		}
	}
	
	// test annotation behavior for multiple method annotations
	
	public static class TestAnnotatedFrame4 extends AnnotatedSearchFrame {
		@Override
		protected void doInit(FrameJob task) throws Exception {
			// do nothing
		}
		
		@AnnotatedSearchFrame.SearchSuggestions
		@AnnotatedSearchFrame.SearchResults
		public void runBoth(PatientSearch search, FrameTask task) throws FrameException {
			// return appropriate action
			if (search.isSearchMode(SearchMode.SUGGEST)) {
				task.addAction(suggestion);
			} else if (search.isSearchMode(SearchMode.SEARCH)){
				task.addAction(result);
			}
		}
	}
	
	@Test
	public void testAnnoatedSearchFrame() throws Exception {
        HmpUserDetails user = mock(HmpUserDetails.class);

		// execute a suggest
		Map<String, Object> params = new HashMap<>();
		PatientSearch search = new PatientSearch(user, "foo", "123", SearchMode.SUGGEST);
		InvokeEvent<PatientSearch> evt = new InvokeEvent<PatientSearch>(SearchFrame.ENTRY_POINT_SEARCH, search, params);
		
		// correct suggestion returned, 3 frame should respond to it
		FrameJob job = runner.exec(evt);
		assertEquals(3, job.getActions().size());
		assertSame(job.getActions().get(0), suggestion);
		assertSame(job.getActions().get(1), suggestion);
		assertSame(job.getActions().get(2), suggestion);
		
		// execute a search, 3 frames should respond to it
		search = new PatientSearch(user, "foo", "123", SearchMode.SEARCH);
        evt = new InvokeEvent<PatientSearch>(SearchFrame.ENTRY_POINT_SEARCH, search, params);
		job = runner.exec(evt);
		assertEquals(3, job.getActions().size());
		assertSame(job.getActions().get(0), result);
		assertSame(job.getActions().get(1), result);
		assertSame(job.getActions().get(2), result);
		
		// browse is targeted, 
		search = new PatientSearch(user, "foo", "123", SearchMode.BROWSE);
        CallEvent<?> evt2 = new CallEvent<PatientSearch>("gov.va.cpe.vpr.search.SearchFrameTests$TestAnnotatedFrame1", search, params);
		job = runner.exec(evt2);
		assertEquals(1, job.getActions().size());
		assertSame(job.getActions().get(0), browse);
	}
	
	public static class FooAction implements FrameAction {
		// dummy action
	}
	
	public static class TestSearchFrame extends SearchFrame {
		
		@Override
		protected void doInit(FrameJob task) throws Exception {
			// do nothing
		}

		@Override
		public void exec(PatientSearch search, FrameTask task) throws FrameException {
			task.addAction(action);
		}
		
		@Override
		protected void browse(PatientSearch search, FrameTask task) throws FrameException {
			task.addAction(browse);
		}
		
		@Override
		protected void search(PatientSearch search, FrameTask task) throws FrameException {
			task.addAction(result);
		}
		
		@Override
		protected void suggest(PatientSearch search, FrameTask task) throws FrameException {
			task.addAction(suggestion);
		}
		
	}
	
	@Test
	public void testSearchFrame() throws Exception {
        HmpUserDetails user = mock(HmpUserDetails.class);

		// execute a suggest
		Map<String, Object> params = new HashMap<>();
		PatientSearch search = new PatientSearch(user, "foo", "123", SearchMode.SUGGEST);
		InvokeEvent<PatientSearch> evt = new InvokeEvent<PatientSearch>(SearchFrame.ENTRY_POINT_SEARCH, search, params);
		
		FrameRegistry reg = new FrameRegistry(new StaticFrameLoader(new TestSearchFrame()));
		reg.load();
		FrameRunner runner = new FrameRunner(reg);
	
		// correct suggestion returned, 3 frame should respond to it
		FrameJob job = runner.exec(evt);
		assertEquals(2, job.getActions().size());
		assertSame(job.getActions().get(0), action);
		assertSame(job.getActions().get(1), suggestion);
		
		// correct suggestion returned, 3 frame should respond to it
		search = new PatientSearch(null, "foo", "123", SearchMode.SEARCH);
        evt = new InvokeEvent<PatientSearch>(SearchFrame.ENTRY_POINT_SEARCH, search, params);
		job = runner.exec(evt);
		assertEquals(2, job.getActions().size());
		assertSame(job.getActions().get(0), action);
		assertSame(job.getActions().get(1), result);
		
		// correct suggestion returned, 3 frame should respond to it
		search = new PatientSearch(null, "foo", "123", SearchMode.BROWSE);
        CallEvent<?> evt2 = new CallEvent<PatientSearch>("gov.va.cpe.vpr.search.SearchFrameTests$TestSearchFrame", search, params);
		job = runner.exec(evt2);
		assertEquals(2, job.getActions().size());
		assertSame(job.getActions().get(0), action);
		assertSame(job.getActions().get(1), browse);
		
	}
}
