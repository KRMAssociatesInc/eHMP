package gov.va.cpe.vpr.frameeng;

import gov.va.cpe.vpr.frameeng.FrameRunner.DefaultFrameActionRunner;
import gov.va.cpe.vpr.frameeng.FrameRunner.JDSSaveActionRunner;
import gov.va.cpe.vpr.frameeng.FrameRunner.PatientObjectActionRunner;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.PatientEvent;
import gov.va.cpe.vpr.pom.jds.JdsTemplate;
import gov.va.cpe.vpr.sync.MessageDestinations;
import gov.va.cpe.vpr.sync.SyncMessageConstants;
import gov.va.cpe.vpr.sync.SyncMessageUtils;
import gov.va.cpe.vpr.sync.msg.ErrorLevel;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessagePostProcessor;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;
import java.util.HashMap;
import java.util.Map;

/**
 * THis is a wrapper arounda  frame runner that recives JMS messages and runs then in the frame runner.
 * 
 * This is intended primarily for asyncronous frame/event execution.  For syncronous execution, use the FrameRunner directly.
 * 
 * Should handle:
 * - Transactions
 * - Error handling
 * - Multi-threaded (multiple consumers)
 * 
 * 
 * TODO: Due to the message grouping that we will ultimately need, the Spring JMS features may not work and we may need to write a direct
 * JMS consumer.
 * TODO: How to inject clock events?
 * 
 */
public class FrameEng implements MessageListener, ApplicationContextAware {
	private IGenericPatientObjectDAO dao; 
	private IPatientDAO patdao;
	private FrameRunner runner;
	private JmsTemplate jms;

	@Autowired
	public FrameEng(FrameRegistry registry, JmsTemplate jms, JdsTemplate tpl, IGenericPatientObjectDAO dao, IPatientDAO patdao) {
		this.dao = dao;
		this.jms = jms;
		this.patdao = patdao;
		this.runner = new FrameRunner(registry, new JDSSaveActionRunner(tpl), new DefaultFrameActionRunner(), new PatientObjectActionRunner(dao));
	}
	
	public FrameRunner getRunner() {
		return this.runner;
	}
	
	@Override
	public void setApplicationContext(ApplicationContext ctx) throws BeansException {
		this.runner.setApplicationContext(ctx);
	}

	/**
	 * TODO: make this more transactional.
	 */
	@Override
	public void onMessage(Message msg) {
		if (msg instanceof ObjectMessage) {
			try {
				Object obj = ((ObjectMessage) msg).getObject();
				IFrameEvent<?> evt = null;
				if (obj instanceof PatientEvent) {
					// patient events must be reconsituted first
					evt = (PatientEvent<?>) obj;
					((PatientEvent<?>) evt).reconsitute(dao, patdao);
				} else if (obj instanceof IFrameEvent) {
					evt = (IFrameEvent<?>) obj;
				}
				
				if (evt != null) {
					runner.exec((IFrameEvent<?>) obj);
				}
			} catch (Exception e) {
				sendErrorMessage(new HashMap<String, Object>(), e);
				System.err.println("Error processing event: ");
				e.printStackTrace();
			}
		}
	}
	
	private void sendErrorMessage(final Map<String, Object> msg, Throwable t) {
		final String pid = (String) msg.get(SyncMessageConstants.PATIENT_ID);
		jms.convertAndSend(MessageDestinations.ERROR_QUEUE, SyncMessageUtils.createErrorMessage(msg, t, ErrorLevel.ERROR), new MessagePostProcessor() {
			@Override
			public Message postProcessMessage(Message message) throws JMSException {
				message.setStringProperty(SyncMessageConstants.PATIENT_ID, pid);
				return message;
			}
		});
	}
	
}
