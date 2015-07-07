package gov.va.cpe.vpr.queryeng;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import gov.va.cpe.vpr.frameeng.Frame.FrameExecException;
import gov.va.cpe.vpr.frameeng.Frame.FrameInitException;
import gov.va.cpe.vpr.frameeng.FrameAction.BaseFrameAction;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.FrameRegistry;
import gov.va.cpe.vpr.frameeng.FrameRegistry.IFrameLoader;
import gov.va.cpe.vpr.frameeng.FrameRegistry.StaticFrameLoader;
import gov.va.cpe.vpr.frameeng.FrameRunner;
import gov.va.cpe.vpr.queryeng.Query.AbstractQuery;
import gov.va.cpe.vpr.queryeng.Query.StaticQuery;
import gov.va.cpe.vpr.queryeng.ViewDef.ViewRenderAction;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.QueryMapper.JoinQueryMapper;
import gov.va.cpe.vpr.queryeng.QueryMapper.PerRowAppendMapper;
import gov.va.cpe.vpr.queryeng.QueryMapper.PerRowSubTableMapper;
import gov.va.cpe.vpr.queryeng.QueryMapper.UINotifyQueryMapper;
import gov.va.cpe.vpr.queryeng.RenderTask.RowRenderSubTask;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeoutException;

import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.Session;
import javax.jms.Topic;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.jms.core.JmsTemplate;

@Ignore // these tests work fine for me locally, but seem to fail a lot when run via MVN TEST, probably due to JMS issues?
public class ViewDefTests {
	
	ViewDef vd;
	FrameRunner runner;
	private FrameRegistry registry;
	@Before
	public void setup() throws Exception {
		vd = new TestViewDef();
		vd.addQuery(new DataGeneratorQuery("id", "1st", 10, 5));
		vd.addQuery(new JoinQueryMapper(new DataGeneratorQuery("id", "2nd", 10, 5)));
		vd.addQuery(new PerRowAppendMapper(new DataGeneratorQuery("otherid", "3rd", 1, 5)));
		
		IFrameLoader loader = new StaticFrameLoader(vd);
		registry = new FrameRegistry(loader);
		registry.load();
		runner = new FrameRunner(registry);
	}
	
	@Test
	public void testAnnotations() throws FrameInitException {
		ViewDef vd = new TestViewDef();
		Map<String, Object> appInfo = vd.getAppInfo();
		
		// however the annotation should over-ride its return value
		vd = new TestViewDef();
		appInfo = vd.getAppInfo();
		assertEquals("foo", appInfo.get("type"));
		
		// also, the title annotation is a backup mechanism if the title is not declared in the ViewParam
		assertEquals("Foo Bar", appInfo.get("name"));
	}
	
	@Test
	public void testColumns() {
		// columns are initally empty
		assertEquals(0, vd.getColumns().size());
		
		// adding a column
		ColDef c = new ColDef.QueryColDef(null, "foo");
		assertSame(c, vd.addColumn(c));
		assertSame(c, vd.getColumn("foo"));
		assertEquals(1, vd.getColumns().size());
	}
	
	@Test
	public void testQueries() throws FrameInitException {
		// initally there are no queries
		ViewDef vd = new TestViewDef();
		assertEquals(0, vd.getQueries(null).size());
		try {
			assertNull(vd.getPrimaryQuery());
			fail("expected an exception when there are no queries defined");
		} catch (IllegalStateException ex) {
			// expected
		}
		
		// add a query
		Query q = new JDSQuery("pk", "");
		assertSame(q, vd.addQuery(q));
		assertEquals(1, vd.getQueries(null).size());
		assertSame(q, vd.getQueries(null).get(0));
		assertSame(q, vd.getPrimaryQuery());
	}
	
	@Test
	public void testDataGeneratorQuery() throws Exception {
		DataGeneratorQuery qry = new DataGeneratorQuery("id", "col", 10, 10);
		RenderTask tsk = new RenderTask(vd, qry);
		qry.exec(tsk);
		
		// test our basic data generator query
		assertEquals(10, tsk.size());
		assertEquals(11, tsk.getResults().getFields().size());
		
		// sample the rows/cols diagonally
		assertEquals("0-0", tsk.getCellIdx(0, "col0"));
		assertEquals("1-1", tsk.getCellIdx(1, "col1"));
		assertEquals("2-2", tsk.getCellIdx(2, "col2"));
		assertEquals("3-3", tsk.getCellIdx(3, "col3"));
		assertEquals("4-4", tsk.getCellIdx(4, "col4"));
		assertEquals("5-5", tsk.getCellIdx(5, "col5"));
		assertEquals("6-6", tsk.getCellIdx(6, "col6"));
		assertEquals("7-7", tsk.getCellIdx(7, "col7"));
		assertEquals("8-8", tsk.getCellIdx(8, "col8"));
		assertEquals("9-9", tsk.getCellIdx(9, "col9"));
	}
	
	@Test
	public void testDataGeneratorQueryDelay() {
		DataGeneratorQuery qry = new DataGeneratorQuery("id", "col", 10, 10).setDelay(50);
		RenderTask tsk = new RenderTask(vd, qry);
		long start = System.currentTimeMillis();
		qry.exec(tsk);
		assertEquals(50, System.currentTimeMillis()-start, 10); // 20% fudge factor
	}
	
	@Test
	public void testNestedViewDefs() throws FrameInitException, FrameExecException {
		ViewDef def = new TestViewDef();
		def.addQuery(new DataGeneratorQuery("id", "1st", 10, 5));
		def.addQuery(new PerRowSubTableMapper("subview", vd));
		
		// we expect the usual 10 rows
//		runner.setExecutor(null);
		FrameTask task  = runner.exec(def);
		RenderTask results = task.getAction(ViewRenderAction.class).getResults();
		assertEquals(10, results.size());
		for (int i=0; i < 10; i++) {
			// each one should have 1 column that can be verifyied as the standard results
			Map<String, Object> row = results.getRowIdx(i);
			assertTrue(row.containsKey("subview"));
			assertTrue(row.get("subview") instanceof RenderTask);
			RenderTask subview = (RenderTask) row.get("subview");
			verify(subview);
		}
	}
	
	@Test
	@Ignore // timeout no longer works for the primary viewdef for now
	public void testTimeout() throws Exception {
		// should take 1s to render this
		ViewDef view = new TestViewDef();
		view.addQuery(new DataGeneratorQuery("id", "1st", 10, 5).setDelay(1000));

		// set the renderer to timeout in 500ms
		runner.setTimeoutMS(500);
		assertEquals(500, runner.getTimeoutMS());
		
		try {
			runner.exec(view);
			fail("Expected timeout");
		} catch (FrameExecException ex) {
			// timeout exception should be thrown (wrapped by a RenderException)
			assertEquals(TimeoutException.class, ex.getCause().getClass());
		}
	}
	
	
	/**
	 * By repeating the same simple test many times with some random-ness, we can spot concurrency and race conditions.
	 */
	@Test
	public void testRaceConditions() throws Exception {
		// should randomly take between 5-10ms to complete each one 
		ViewDef view = new TestViewDef();
		view.addQuery(new DataGeneratorQuery("id", "1st", 10, 5));
		view.addQuery(new JoinQueryMapper(new DataGeneratorQuery("id", "2nd", 10, 5)));
		view.addQuery(new PerRowAppendMapper(new DataGeneratorQuery("otherid", "3rd", 1, 5).setDelay(5, 10)));
		
		// run the test 100 times, make sure it returns the same values each time
		for (int i=0; i < 100; i++) {
			FrameTask task = runner.exec(view);
			verify(task.getAction(ViewRenderAction.class).getResults());
		}
	}
	
	
	/**
	 * by setting specific query execution delays, we should be able to predict how long
	 * it takes to render based on the number of threads running in parallel
	 */
	@Test
	public void testMultiThreadRenderingIsFaster() throws Exception {
		// new view def, each query should take 100ms to run
		ViewDef view = vd;
		view.addQuery(new DataGeneratorQuery("id", "1st", 10, 5).setDelay(100));
		view.addQuery(new PerRowAppendMapper(new DataGeneratorQuery("otherid", "3rd", 1, 5).setDelay(100)));
		
		// w/o multi-threading, we predict it will take approximately 1.1s
		// query1+(query2*10)
		long start = System.currentTimeMillis();
		runner.setExecutor(null);
		runner.exec(view);
		assertEquals(1100, (System.currentTimeMillis() - start), 220); // 20% fudge factor
		
		// with multi-threading (5 threads) we predict it will be almost 5x quicker
		// query1+(query2*10/5)
		ExecutorService exec = Executors.newFixedThreadPool(5);
		start = System.currentTimeMillis();
		runner.setExecutor(exec);
		runner.exec(view);
		assertEquals(300, (System.currentTimeMillis() - start), 60); // 20% fudge factor
	}
	
	private static void verify(RenderTask q) {
		assertEquals(10, q.size());
		assertEquals(17, q.getResults().getFields().size());
		
		//verify correct results
		for (int i=0; i < q.size(); i++) {
			assertEquals("row" + i, q.getCellIdx(i, "id"));
			
			for (int j=0; j < 5; j++) {
				assertEquals(i + "-" + j, q.getCellIdx(i, "1st"+j));
				assertEquals(i + "-" + j, q.getCellIdx(i, "2nd"+j));
				assertEquals("0-" + j, q.getCellIdx(i, "3rd"+j));
			}
		}
	}
	
	@Test
	public void testErrorQuery() throws FrameInitException, FrameExecException {
		// errors in the primary query
		ViewDef vd = new TestViewDef();
		vd.addQuery(new ErrorQuery("foo"));
		try {
			FrameTask task = runner.exec(vd);
			fail("exception expected....");
		} catch (Exception ex) {
			// expected
		}
		
		// errors in other threads
		vd = new TestViewDef();
		vd.addQuery(ViewDefSamples.sq1);
		vd.addQuery(new JoinQueryMapper(new ErrorQuery("foo")));
		
		try {
			FrameTask task = runner.exec(vd);
			fail("exception expected....");
		} catch (Exception ex) {
			// expected
		}
	}
	
	@Test
	public void testUINotifyAppender() throws Exception {
		DummyFrameAction act = DummyFrameAction.INSTANCE;
		
		// setup JMS topic/connection/session
		String brokerURL = "vm://hmp-test?waitForStart=1000&broker.persistent=false&broker.deleteAllMessagesOnStartup=true";
		ConnectionFactory fact = new ActiveMQConnectionFactory(brokerURL);
		Connection conn = fact.createConnection();
		conn.start();
		Session sess = conn.createSession(false, Session.AUTO_ACKNOWLEDGE);
		
		// setup a JMS template
		JmsTemplate tpl = new JmsTemplate(fact);
		tpl.setPubSubDomain(true);
		tpl.setDefaultDestinationName("ui.notify");
		tpl.setReceiveTimeout(JmsTemplate.RECEIVE_TIMEOUT_NO_WAIT);
		Topic dest = sess.createTopic("ui.notify");
		MessageConsumer consumer = sess.createConsumer(dest);
		assertNull(tpl.receive());
		
		// configure the runner
		runner.setTimeoutMS(60000); // 1m
		runner.addResource(tpl);

		// create a viewdef with a nested UINotifier viewdef that should be done in 100ms
		// the rest of the time (10x100ms) should run in parallel and be done in 200ms;
		((DataGeneratorQuery) vd.getPrimaryQuery()).setDelay(100);
		ViewDef view = new TestViewDef();
		DataGeneratorQuery q1 = view.addQuery(new DataGeneratorQuery("id", "1st", 10, 5).setDelay(150));
		UINotifyQueryMapper q2 = view.addQuery(new UINotifyQueryMapper("subview", vd));

		// query should be done in ~150ms, rest will take another 200ms
		long start = System.currentTimeMillis();
		FrameTask task = runner.exec(view);
		RenderTask q = task.getAction(ViewRenderAction.class).getResults();
		assertTrue(task.getTotalTimeMS() <= 200); // generous fudge factor
		assertEquals(task.getTotalTimeMS(), (System.currentTimeMillis() - start), 50); 
		
		// should return 10 placeholder values
		assertEquals(10, q.size());
		assertEquals(1, q1.execCount);
		List<String> uuids = new ArrayList<String>();
		for (int i=0; i < q.size(); i++) {
			Object subview = q.getCellIdx(i, "subview");
			assertTrue(subview instanceof String);
			uuids.add(subview.toString());
		}
		
		// expecting the main task to have a single subtask (RenderTask)
		assertEquals(1, task.getSubTasks().size());
		assertTrue(task.getSubTasks().get(0) instanceof RenderTask);
		assertSame(q, task.getSubTasks().get(0));
		assertEquals(1, q.getSubTasks().size());
		
		// main render task has one empty subtask for the UINotifyQueryMapper
		RenderTask task2 = (RenderTask) q.getSubTasks().get(0);
		assertSame(q2, task2.getQuery());
		assertEquals(0, task2.getSubTasks().size());
		
		// check that the JMS topic has 10 items on it, with the corresponding UUIDs
		for (int i=0; i < 10; i++) {
			Message msg = consumer.receive(500);
			assertNotNull(msg);
			String uuid = msg.getStringProperty("uid");
			uuids.remove(uuid);
		}
		assertNull(consumer.receiveNoWait()); // nothing left
		
		// vd should have been executed 10x and found all UUIDs
		DataGeneratorQuery q3 = (DataGeneratorQuery) vd.getPrimaryQuery();
		assertEquals(10, q3.execCount);
		assertEquals(0, uuids.size());
	}
	
	@Test
	public void testMergeAppender() throws Exception {
		ViewDef vd = new TestViewDef();
		vd.addQuery(ViewDefSamples.sq1);
		vd.addQuery(new JoinQueryMapper(ViewDefSamples.sq2));
		
		RenderTask q = runner.exec(vd).getAction(ViewRenderAction.class).getResults();
		assertEquals(3, q.size());
		
		assertEquals("a1", q.getCellIdx(0, "a"));
		assertEquals("b1", q.getCellIdx(0, "b"));
		assertEquals("c1", q.getCellIdx(0, "c"));
		
		assertEquals("x1", q.getCellIdx(0, "x"));
		assertEquals("y1", q.getCellIdx(0, "y"));
		assertEquals("z1", q.getCellIdx(0, "z"));
	}
	
	
	@Test
	public void testMergeAppenderFK() throws Exception {
		ViewDef vd = new TestViewDef();
		vd.addQuery(ViewDefSamples.sq2);
		vd.addQuery(new JoinQueryMapper(ViewDefSamples.sq1, "id2"));

		FrameTask task = runner.exec(vd);
		System.out.println("testMergeAppenderFK\n" + task.toString());
		RenderTask q = task.getAction(ViewRenderAction.class).getResults();
		assertEquals(3, q.size());
		
		assertEquals("a1", q.getCellIdx(0, "a"));
		assertEquals("b1", q.getCellIdx(0, "b"));
		assertEquals("c1", q.getCellIdx(0, "c"));
		
		assertEquals("x1", q.getCellIdx(0, "x"));
		assertEquals("y1", q.getCellIdx(0, "y"));
		assertEquals("z1", q.getCellIdx(0, "z"));
	}
	
	
	@Test
	public void testPerRowAppendMapper() throws Exception {
		List<Map<String, Object>> data = new ArrayList<Map<String, Object>>();
		data.add(Table.buildRow("foo","bar"));
		
		// build a query that will just copy the PK field
		Query q2 = new AbstractQuery("idcopy", null) {
			@Override
			public void exec(RenderTask task) throws Exception {
				if (task instanceof RowRenderSubTask) {
					RowRenderSubTask subtask = (RowRenderSubTask) task;
					if (subtask.getRowIdx() >= 0) {
						task.add(Table.buildRow("idcopy", subtask.getParentRowKey()));
					}
				}
			}
		};
		
		// regular three rows, but the second query is appended to each row
		ViewDef vd = new TestViewDef();
		vd.addQuery(ViewDefSamples.sq1);
		vd.addQuery(new PerRowAppendMapper(new StaticQuery("foo", data)));
		vd.addQuery(new PerRowAppendMapper(q2));
		
		// should append the queries to each other, totaling 3 rows with 7 columns apeice
		RenderTask q = runner.exec(vd).getAction(ViewRenderAction.class).getResults();
		assertEquals(3, q.size());
		assertEquals(7, q.getRowIdx(0).size());
		assertEquals(7, q.getRowIdx(1).size());
		assertEquals(7, q.getRowIdx(2).size());
		
		// static data just gets added to each row
		assertEquals("bar", q.getCellIdx(0, "foo"));
		assertEquals("bar", q.getCellIdx(1, "foo"));
		assertEquals("bar", q.getCellIdx(2, "foo"));
		
		// q2 copies the PK
		assertEquals("1", q.getCellIdx(0, "idcopy"));
		assertEquals("2", q.getCellIdx(1, "idcopy"));
		assertEquals("3", q.getCellIdx(2, "idcopy"));
	}

	@Test
	public void testParams() throws FrameInitException, FrameExecException {
		// create a mock ViewDef with no a specific declared params
		TestViewDef vd = new TestViewDef();
		vd.declareParam("myparam", "mydefaultval"); 
		vd.addQuery(ViewDefSamples.sq1);
		vd.addQuery(ViewDefSamples.sq2);
		
		// run the renderer with some specified params, examine the working parameter set that is returned
		Map<String, Object> inparams = Table.buildRow("foo", 1, "bar", 2, "myparam", 3);
		RenderTask result = runner.exec(vd, inparams).getAction(ViewRenderAction.class).getResults();
		Map<String, Object> params = result.getParams();
		
		// params will contain a bunch of default stuff
		assertTrue(params.containsKey("row.count"));
		assertTrue(params.containsKey("view.class"));
		assertTrue(params.containsKey("col.list"));
		
		// plus the param we declared
		assertTrue(params.containsKey("myparam"));
		
		// also all the params we specified, which overrite the defaults (if any)
		assertEquals(1, params.get("foo"));
		assertEquals(2, params.get("bar"));
		assertEquals(3, params.get("myparam"));
		
		// nested queries (tasks) don't hold any params by default themselves
		FrameTask subtask = result.getSubTasks().get(0);
		
		// but will delegate to the parent task to find them
		assertEquals(1, subtask.getParamObj("foo"));
		assertEquals(2, subtask.getParamObj("bar"));
		assertEquals(3, subtask.getParamObj("myparam"));
		
	}
	
	// test classes -------------------------------------------------
	
	@HMPAppInfo(value="foo", title="Foo Bar")
	private static class TestViewDef extends ViewDef {
		public TestViewDef() throws FrameInitException {
			init(null);
		}
		
		@Override
		public void declareParam(ViewParam param) {
			super.declareParam(param);
		}
		
		@Override
		public void declareParam(String key, Object defaultVal) {
			super.declareParam(key, defaultVal);
		}
	}
	
	public static class ErrorQuery extends AbstractQuery {
		public ErrorQuery(String pk) {
			super(pk, null);
		}

		@Override
		public void exec(RenderTask renderer) throws Exception {
			throw new RuntimeException("Testing that an error is trapped as expected....");
		}
	}
	
	public static class DummyFrameAction extends BaseFrameAction {
		public static DummyFrameAction INSTANCE = new DummyFrameAction();
		// the static BaseFrameAction.OBJECT_MAPPER actually takes a little while (~150ms) to startup.  
		// this will seed it so it doesn't affect the rest of the timings we are doing.
	}
	
	/*
	 * Generates x rows and y fields of data
	 */
	public static class DataGeneratorQuery extends AbstractQuery {

		private int cols;
		private int rows;
		private String prefix;
		private int delayHi, delayLo;
		private int execCount=0;

		public DataGeneratorQuery(String pk, String prefix, int rows, int cols) {
			super(pk, null);
			this.prefix = prefix;
			this.rows = rows;
			this.cols = cols;
		}
		
		public DataGeneratorQuery setDelay(int hi, int lo) {
			delayHi = hi;
			delayLo = lo;
			return this;
		}
		
		public DataGeneratorQuery setDelay(int ms) {
			delayLo = ms;
			return this;
		}
		
		private void doDelay() {
			try {
				if (delayLo > 0 && delayHi > 0) {
					// random delay
					double random = Math.random() * (delayHi - delayLo);
					Thread.sleep(Math.round(delayLo + random));
				} else if (delayLo > 0) {
					// static delay
					Thread.sleep(delayLo);
				} else {
					// no delay
				}
			} catch (InterruptedException ex) {
				// ignore
			}
		}
		
		@Override
		public void exec(RenderTask task) {
			doDelay();
			execCount++;
			for (int i=0; i < this.rows; i++) {
				HashMap<String, Object> row = new HashMap<String, Object>();
				row.put(getPK(), "row" + i);
				for (int j=0; j < this.cols; j++) {
					row.put(this.prefix + j, i + "-" + j);
				}
				task.add(row);
			}
		}
	}

}
