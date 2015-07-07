package gov.va.cpe.vpr;

import gov.va.cpe.vpr.frameeng.IFrameEvent;
import gov.va.cpe.vpr.sync.MessageDestinations;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.apache.activemq.ActiveMQSession;
import org.apache.activemq.MessageAvailableConsumer;
import org.apache.activemq.MessageAvailableListener;
import org.apache.activemq.broker.jmx.TopicViewMBean;
import org.apache.activemq.pool.PooledSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.jms.support.converter.MessageConversionException;
import org.springframework.jms.support.converter.SimpleMessageConverter;
import org.springframework.security.web.session.HttpSessionDestroyedEvent;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.PostConstruct;
import javax.jms.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Second attempt at JMS-based UI Notify/Push/Broadcast Service.
 *
 * Utilizes spring DeferredResult's and HTTP long-polling techniques.
 * Intended for higher throughput, as messages are received in batches, waiting a minimum time
 * to eagerly fetch as many messages as it can (up to a limit) and then deliver them all to
 * 0+ waiting listeners.
 *
 * A separate topic subscription (MessageConsumer) is created for each clientid, so
 * each clientid will get a copy of every broadcast message since the clientid was first seen.
 * Messages have a default time-to-live of 30s, messages that cannot be delivered in 30s will expire.
 *
 * Controllers should register a DeferredResult via the registerUIListener(...) method and they can
 * optionally specify a message filter.  If a message does not pass the filter, it will be silently
 * ignored (for that clientid, but may still be delivered to a different clientid with a different filter)
 *
 * Messages can be targeted to specific waiting listeners via message
 * headers (currently PID, JSESSIONID, JOBID).  Messages are not persistent or durable currently,
 * but if it is unable to deliver a message anywhere, it will attempt redelivery up to a defined TTL.
 *
 * Each message consumer is tracked by sessionid, so when a session expires, it should cleanup all consumers.
 *
 * TODO: Switching this to websockets when Spring 4.0 is released might simplify things greatly.
 * TODO: unit testing load
 *
 * @author brian
 */
@Service
public class BroadcastService implements IBroadcastService, MessageAvailableListener, ApplicationListener<HttpSessionDestroyedEvent> {

    private static final Logger LOGGER = LoggerFactory.getLogger(BroadcastService.class);

    // hold all the waiting poll requests and mapped consumers
	private Map<String, MessageAvailableConsumer> jmsClientToConsumer = new ConcurrentHashMap<String, MessageAvailableConsumer>();
	private Map<MessageConsumer, DeferredResult<ModelAndView>> jmsConsumerToResult = new ConcurrentHashMap<MessageConsumer, DeferredResult<ModelAndView>>();
	private Map<DeferredResult<ModelAndView>, IBroadcastMessageFilter> jmsResultToFilter = new ConcurrentHashMap<DeferredResult<ModelAndView>,IBroadcastMessageFilter>();

	// JMS object handles
	private ActiveMQSession consumerSess;
	private Connection consumerConn;
	private Destination consumerDest;
	private MessageProducer producer;
	private ActiveMQSession producerSess;
	private Connection producerConn;
	private Destination producerDest;
	private SimpleMessageConverter converter = new SimpleMessageConverter();
	private Object consumerLock = new Object();
	private Object producerLock = new Object();

	// TODO: Springify these settings/defaults?
	private int maxMessagesPerResponse = 10; // the max messages to batch up before sending to the client
	private long minEagerFetchTimeMS = 250; // in order to get more messages per response cycle, wait at least this long for more messages to be available
	private boolean defaultPersist = false; // by default, messages are non-persistent
	private int defaultTTL = 30000; // default 30s time-to-live

    @Autowired
    TopicViewMBean uiNotifyTopicMBean;

	@Autowired
	ConnectionFactory fact;

	@PostConstruct
    protected void initJMSConsumer() {
		try {
			consumerConn = fact.createConnection();
			consumerConn.start(); // ensure its open
			
			// for test case vs production
			Session sess = consumerConn.createSession(false, Session.AUTO_ACKNOWLEDGE);
			if (sess instanceof PooledSession) {
				consumerSess = ((PooledSession) sess).getInternalSession();
			} else if (sess instanceof ActiveMQSession) {
				consumerSess = (ActiveMQSession) sess;
			}
			
			consumerDest = sess.createTopic(MessageDestinations.UI_NOTIFY_TOPIC);
		} catch (JMSException e) {
		}
	}

	@PostConstruct
	protected void initJMSProducer() {
		try {
			producerConn = fact.createConnection();
			producerConn.start(); // ensure its open
			
			// for test case vs production
			Session sess = producerConn.createSession(false, Session.AUTO_ACKNOWLEDGE);
			if (sess instanceof PooledSession) {
				producerSess = ((PooledSession) sess).getInternalSession();
			} else if (sess instanceof ActiveMQSession) {
				producerSess = (ActiveMQSession) sess;
			}
			
			producerDest = sess.createTopic(MessageDestinations.UI_NOTIFY_TOPIC);
			producer = sess.createProducer(this.producerDest);
		} catch (JMSException e) {
		}
	}

	private ActiveMQSession getJMSProducerSession() throws JMSException {
		if (producerSess != null && !producerSess.isClosed()) {
			return producerSess;
		}
		resetProducer();
		return producerSess;
	}

	private void resetProducer() throws JMSException {
    	initJMSProducer();
    }

    private void resetConsumers() throws JMSException {
		initJMSConsumer();
		// for now we don't rebuild maps ... just clear them
		jmsClientToConsumer.clear();
		jmsConsumerToResult.clear();
		jmsResultToFilter.clear();
    }

    private MessageAvailableConsumer createNewConsumer() throws JMSException {
    	MessageAvailableConsumer c = null;
    	if (consumerSess != null) {
    		c = (MessageAvailableConsumer) consumerSess.createConsumer(consumerDest);
    		c.setAvailableListener(this);
    	}
    	return c;
	}


	// Message polling functions (topic/Consumer style) -----------------------

	/**
	 * Called by ActiveMQ when new messages are available to consume.
	 */
	@Override
	public void onMessageAvailable(MessageConsumer consumer) {
		DeferredResult<ModelAndView> result = jmsConsumerToResult.get(consumer);
		if (result != null && !result.isSetOrExpired()) {
			try {
				List<Message> msgs = eagerReceive(consumer, jmsResultToFilter.get(result), this.maxMessagesPerResponse, this.minEagerFetchTimeMS);
				sendMessageResults(msgs, result);
			} catch (MessageConversionException | JMSException e) {
				LOGGER.error("onMessageAvailable threw an exception while eagarReceiving ...", e.getMessage());
				// TODO: How to roll back?
				e.printStackTrace();
			}
		}
	}

	/**
	 * Eagerly fetch messages off the queue until either maxMessages are fetched or timoutAt is reached.
	 * @throws JMSException
	 */
	protected List<Message> eagerReceive(MessageConsumer consumer, IBroadcastMessageFilter filter, int maxMessages, long receiveTimeout) throws JMSException {
		List<Message> messages = new ArrayList<Message>();
		long timeoutAt = System.currentTimeMillis() + receiveTimeout;
		long timeout = receiveTimeout;
		do {
			Message message = consumer.receive(timeout);
			if (message != null && (filter == null || filter.include(message))) {
				messages.add(message);
			}
			timeout = timeoutAt - System.currentTimeMillis();
		} while (messages.size() < maxMessages && timeout > 0);
		return messages;
	}

	@Override
	public void onApplicationEvent(HttpSessionDestroyedEvent event) {
		expireSessionConsumers(event.getId());
	}

	/** When a session expires, use this to clear all the consumers for that session */
	public void expireSessionConsumers(String jsessionid) {
		for (String key : jmsClientToConsumer.keySet()) {
			if (key.startsWith(jsessionid + ":")) {
				MessageAvailableConsumer consumer = jmsClientToConsumer.get(key);
				jmsClientToConsumer.values().remove(consumer);
				jmsConsumerToResult.remove(consumer);
				LOGGER.info("Closing broadcast consumer for expired session: " + consumer);
				try {
					consumer.close();
				} catch (JMSException e) {
					LOGGER.error("Could not close broadcast consumer",e);
				}
			}
		}
	}

	@Override
    public void clearResult(DeferredResult<?> result) {
		//jmsClientToConsumer.values().remove(result);
		jmsConsumerToResult.values().remove(result);
		jmsResultToFilter.remove(result);
	}

	public void clearResult(MessageConsumer consumer) {
		jmsClientToConsumer.values().remove(consumer);
		jmsResultToFilter.remove(jmsConsumerToResult.get(consumer));
		jmsConsumerToResult.remove(consumer);
	}

	@Override
    public void clearResult(String sessid, String clientid) {
		String key = sessid + ":" + clientid;
		MessageConsumer consumer = jmsClientToConsumer.get(key);
		DeferredResult<?> result = jmsConsumerToResult.get(consumer);
		jmsConsumerToResult.remove(consumer);
		jmsClientToConsumer.remove(key);
		jmsResultToFilter.remove(result);
	}

	@Override
    public Map<String, Object> getServiceStats() {
		Map<String, Object> ret = new HashMap<String, Object>();
		ret.put("longPollsWaiting", jmsConsumerToResult.size());
		ret.put("queueSize", uiNotifyTopicMBean.getQueueSize());
		ret.put("enqueueCount", uiNotifyTopicMBean.getEnqueueCount());
		ret.put("dequeueCount", uiNotifyTopicMBean.getDequeueCount());
		ret.put("averageEnqueueTime", uiNotifyTopicMBean.getAverageEnqueueTime());
		ret.put("consumerCount", uiNotifyTopicMBean.getConsumerCount());
		ret.put("inFlightCount", uiNotifyTopicMBean.getInFlightCount());
		ret.put("clientIDs", jmsClientToConsumer.keySet());
		return ret;
	}

    @Override
    public void registerUIListener(String jsessid, String clientid, DeferredResult<ModelAndView> result, IBroadcastMessageFilter filter) throws JMSException {
		assert jsessid != null && clientid != null && result != null;
		String key = jsessid + ":" + clientid;
		result.onCompletion(new CompleteHandler(result));
		if (filter != null) jmsResultToFilter.put(result, filter);

		// if this is the first time the session/clientid is seen, create a new MessageConsumer for it
		MessageAvailableConsumer consumer = jmsClientToConsumer.get(key);
		if (consumer == null) {
			// get the ActiveMQ-specific MessageConsumer which support the availability listener
			try {
				consumer = createNewConsumer();
			} catch (Exception e) { // Sometimes we have a Pool is Closed JMSException on createConsumer(dest)
				// for now we have the new client NOT fire reset process!!
				consumerSess = null;	 // just mark something went wrong that
				LOGGER.error("Something went wrong when creating Consumer for the new client ...  No recovery tried.", e);
				throw new JMSException("Something went wrong when creating Consumer ...  Next time try to register ..");
			}
			jmsClientToConsumer.put(key,consumer);
		}

		// if there is already a DeferredResult for this session/client combo, end it
		DeferredResult<ModelAndView> existingResult = jmsConsumerToResult.get(consumer);
		if (existingResult != null && !existingResult.isSetOrExpired()) {
			/* 9/24/13 BEB: this isn't necessarily an error, canceling a previous request may make this appear duplicate.
			existingResult.setErrorResult(new HttpServerErrorException(HttpStatus.CONFLICT, "Client ID '"+clientid+"' already in use."));
			*/
		}

		List<Message> msgs = null;
		try {
			msgs = eagerReceive(consumer, filter, this.maxMessagesPerResponse, this.minEagerFetchTimeMS);
		} catch(Exception e) { // Sometimes we have a Consumer is Closed exception on eagerReceive.
			synchronized (consumerLock) {
				MessageAvailableConsumer c = jmsClientToConsumer.get(key);
				if ( c != null ) { // if consumer exists for this client, reset maps (first thread after mqueue connection got stale)
					LOGGER.warn("Error on "+MessageDestinations.UI_NOTIFY_TOPIC+ "; Resetting Maps ...");
					resetConsumers();
				}
				// else ... another thread already reset maps
			}
			try {
				consumer = createNewConsumer();
				msgs = eagerReceive(consumer, filter, this.maxMessagesPerResponse, this.minEagerFetchTimeMS);
				jmsClientToConsumer.put(key,consumer);
				LOGGER.warn(MessageDestinations.UI_NOTIFY_TOPIC + " consumer recovered successfully.");
			} catch(Exception e2) {
				LOGGER.error("Tried to recover JMS consumer and failed", e2);
				throw new JMSException("Something went wrong while createNewConsumer/eagerReceiving ... " + e2.getMessage());
			}
		}
		jmsConsumerToResult.put(consumer, result);

		// see if there are results on the topic that we can send right away
		if (!msgs.isEmpty()) {
			sendMessageResults(msgs, result);
		}
	}

	// send a broadcast message -----------------------------------------------

	/** Same as broadcastMessage(Object, null) */
    @Override
    public void broadcastMessage(final Object message) {
    	broadcastMessage(message, null);
    }

    /** same as broadcastMessage(Object, this.defaultPersist, this.defaultTTL, msgHeaders) */
    @Override
    public void broadcastMessage(Object message, Map<String, Object> msgHeaders) {
        try {
    	    broadcastMessage(message, this.defaultPersist, this.defaultTTL, msgHeaders);
        } catch (JMSException ex) {
            throw new RuntimeException(ex);
        }
    }

    /**
     * Primary method for broadcasting a message.  Uses a simple message converter to convert the
     * object into a JMSMessage, so it can handle String, Map, Message and Serializable fairly well.
     *
     * Message Headers can also be applied to the message, these can be used for filtering/targeting
     * messages to specific listeners, currently they include PID, JSESSIONID and JOBID.  There are other
     * headers are recognized by JMS/ActiveMQ for transaction demarcation, delayed scheduling, etc.
     *
     * Messages are not persistent or durable, meaning they wont survive server restarts, session timouts, etc.
     * But this does mean that sending objects through the queue is fairly efficient.
     *
     * @param message
     * @param msgHeaders
     * @throws JMSException
     */
    @Override
    public void broadcastMessage(Object message, boolean peristent, int ttlMS, final Map<String, Object> msgHeaders) throws JMSException {
    	ActiveMQSession session = null;
    	synchronized (producerLock) {
    		session = getJMSProducerSession();
    	}
    	
    	/* new style */
    	// create the message, set the JMS headers
    	Message jmsmsg = converter.toMessage(message, session);
		if (msgHeaders != null && !msgHeaders.isEmpty()) {
			for (String key : msgHeaders.keySet()) {
				Object val = msgHeaders.get(key);
				if (val != null) {
					jmsmsg.setObjectProperty(key, val);
				}
			}
		}

		synchronized (producerLock) {
			try {
				// send the message
				producer.send(this.producerDest, jmsmsg, (peristent) ? DeliveryMode.PERSISTENT : DeliveryMode.NON_PERSISTENT, Message.DEFAULT_PRIORITY, ttlMS);
			} catch(Exception e) { // Sometimes we have a Consumer is Closed exception on eagerReceive.
                LOGGER.warn("Error on " + MessageDestinations.UI_NOTIFY_TOPIC + " producer; Recovering...");
                resetProducer();
                try {
					producer.send(this.producerDest, jmsmsg, (peristent) ? DeliveryMode.PERSISTENT : DeliveryMode.NON_PERSISTENT, Message.DEFAULT_PRIORITY, ttlMS);
					LOGGER.warn(MessageDestinations.UI_NOTIFY_TOPIC + " producer recovered successfully.");
				} catch(Exception e2) {
					LOGGER.error("Tried to recover JMS producer and failed", e2);
				}
			}
		}
	}

    /** Returns the actual message results to the waiting client via DeferredResult.setResult() */
	private void sendMessageResults(List<Message> msgs, DeferredResult<ModelAndView> result) throws MessageConversionException, JMSException {
		if (msgs == null) msgs = Collections.emptyList();
		List<Object> data = new ArrayList<Object>();
		for (Message msg : msgs) {
			// TODO: Probably should implement a custom MessageConverter for this instead
			Object obj = converter.fromMessage(msg);
			if (obj instanceof IFrameEvent) {
				 Map<String, Object> newobj = new HashMap<String, Object>();
				 for (Enumeration<?> e = msg.getPropertyNames(); e.hasMoreElements();) {
					 String key = (String) e.nextElement();
					 newobj.put(key, msg.getObjectProperty(key));
				 }
				 newobj.put("event", obj);
				 obj = newobj;
			}
			data.add(obj);
		}

		Map<String, Object> ret = new HashMap<String, Object>();
		ret.put("size", msgs.size());
		ret.put("data", data);
		result.setResult(ModelAndViewFactory.contentNegotiatingModelAndView(ret));
	}

    // Subclassess ------------------------------------------------------------

    class CompleteHandler implements Runnable {
		private DeferredResult<?> result;

		public CompleteHandler(DeferredResult<?> result) {
			this.result = result;
		}

		@Override
		public void run() {
			clearResult(this.result);
		}
	}
}
