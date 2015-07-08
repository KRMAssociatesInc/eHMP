package gov.va.cpe.vpr.sync.msg;

import com.codahale.metrics.MetricRegistry;
import gov.va.cpe.vpr.sync.MessageDestinations;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.jms.listener.SessionAwareMessageListener;
import org.springframework.jms.support.converter.SimpleMessageConverter;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import java.util.Map;

public class SyncMessageDispatcher implements SessionAwareMessageListener {

    public static final String MESSAGE_PROCESSING_METER = MessageDestinations.COMMAND_QUEUE;

    private static Logger LOGGER = LoggerFactory.getLogger(SyncMessageDispatcher.class);

    private SimpleMessageConverter messageConverter = new SimpleMessageConverter();
    private Map<String, SessionAwareMessageListener> actionToProcessorMap;
    private MetricRegistry metricRegistry;

    @Autowired
    public void setMetricRegistry(MetricRegistry metricRegistry) {
        this.metricRegistry = metricRegistry;
    }

    @Required
    public void setActionToProcessorMap(Map<String, SessionAwareMessageListener> actionToProcessorMap) {
        this.actionToProcessorMap = actionToProcessorMap;
    }

    @Override
    public void onMessage(Message message, Session session) {
        try {
            metricRegistry.meter(MESSAGE_PROCESSING_METER).mark();

            String command = message.getStringProperty(SyncMessageConstants.COMMAND);
            if (actionToProcessorMap.containsKey(command)) {
//                Map msg = (Map) messageConverter.fromMessage(message);
                actionToProcessorMap.get(command).onMessage(message, session);
            }
        } catch (JMSException e) {
            LOGGER.error("Unable to dispatch JMS message to converter", e);
        }
    }
}
