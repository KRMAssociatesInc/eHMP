package gov.va.cpe.vpr;

import static org.junit.Assert.*;
import gov.va.cpe.vpr.IBroadcastMessageFilter.PIDMessageFilter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.servlet.ModelAndView;

import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.JMSException;

public class BroadcastServiceTests {
	private static ConnectionFactory FACT;
	private static BroadcastService svc;
	
	@BeforeClass
	public static void beforeclass() throws JMSException {
		// setup JMS topic/connection/session
		String brokerURL = "vm://hmp-test-broadcast?waitForStart=1000&broker.persistent=false&broker.deleteAllMessagesOnStartup=true&broker.useJmx=true";
		FACT = new ActiveMQConnectionFactory(brokerURL);
		Connection conn = FACT.createConnection();
		conn.start();
		svc = new BroadcastService();
		svc.fact = FACT;
		svc.initJMSConsumer();
	}
	
	private class TestResultHandler<T> implements DeferredResult.DeferredResultHandler {
		private T ret;
		
		@Override
		public void handleResult(Object result) {
			if (result instanceof ModelAndView) {
				ModelAndView mv = (ModelAndView) result;
				Object obj = mv.getModelMap().get("data");
				if (obj instanceof List) {
					ret = (T) ((List) obj).get(0);
				} else {
					ret = (T) obj;
				}
			}
		}
		
		public T getData() {
			return ret;
		}
	}
	
	@Test
    @Ignore("Timing sensitive test")
    public void basicTest() throws JMSException, InterruptedException {
		String msg = new String("hello world");
		
		// register listener with 0 timeout, should return immediately
		TestResultHandler<String> handler = new TestResultHandler<>();
		DeferredResult<ModelAndView> result = new DeferredResult<>(250L, "[]");
		result.setResultHandler(handler);
		svc.registerUIListener("sess-1234", "client-1234", result, null);
		
		// send something
		svc.broadcastMessage(msg);
		
		// will not be immediately available due to eager fetch
		assertNull(handler.getData());
		assertFalse(result.isSetOrExpired());
		
		// wait 300ms
		Thread.currentThread().sleep(500);
		
		// result should be available now
		assertTrue(result.isSetOrExpired());
		Object data = handler.getData();
		
		// should equal the input
		assertEquals(msg, data);
		assertSame(msg, data);
    }
	
	// TODO: Test the eager fetch
	// TODO: Test a DeferredResult with 0 timeout (should not need to sleep the thread)
	// TODO: Test sending a message with a TTL
	// TODO: test at the controller level
	
	@Test
	public void testPIDTarget() throws JMSException, InterruptedException {
		// register listener with 0 timeout, should return immediately
		TestResultHandler<String> handler = new TestResultHandler<>();
		DeferredResult<ModelAndView> result = new DeferredResult<>(10L, "[]");
		result.setResultHandler(handler);
		PIDMessageFilter filter = new PIDMessageFilter("666");
		svc.registerUIListener("sess-1234", "client-1234", result, filter);
		
		// send message for patient 666
		String msg = "fi fy fo fum";
		Map<String, Object> headers = new HashMap<>();
		headers.put("pid", "666");
		svc.broadcastMessage(msg, headers);
		
		Thread.currentThread().sleep(500);
		
		// should get it
		assertEquals(msg, handler.getData());
	}
	
	@Test
	public void testPIDFilter() throws JMSException, InterruptedException {
		// register listener with 0 timeout, should return immediately
		TestResultHandler<String> handler = new TestResultHandler<>();
		DeferredResult<ModelAndView> result = new DeferredResult<>(10L, "[]");
		result.setResultHandler(handler);
		PIDMessageFilter filter = new PIDMessageFilter("666");
		svc.registerUIListener("sess-1234", "client-1234", result, filter);
		
		// send message for patient 229
		String msg = "fi fy fo fum";
		Map<String, Object> headers = new HashMap<>();
		headers.put("pid", "229");
		svc.broadcastMessage(msg, headers);
		
		Thread.currentThread().sleep(500);
		
		// should NOT get it
		assertNull(msg, handler.getData());
	}

}
