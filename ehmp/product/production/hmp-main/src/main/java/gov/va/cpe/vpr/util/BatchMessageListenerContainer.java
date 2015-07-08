package gov.va.cpe.vpr.util;

import org.springframework.jms.connection.ConnectionFactoryUtils;
import org.springframework.jms.connection.JmsResourceHolder;
import org.springframework.jms.connection.SingleConnectionFactory;
import org.springframework.jms.listener.DefaultMessageListenerContainer;
import org.springframework.jms.support.JmsUtils;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import javax.jms.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Custom extention to DefaultMessageListenerContainer that supports eager fetching of smallish batches of messages.
 * 
 * Got the idea from Spring Batch and http://sleeplessinslc.blogspot.com/2010/04/batchmessagelistenercontainer-using.html
 * but updated with some slightly different semantics and updated to be based on Spring 3.2.3 
 * 
 * @author brian
 */
public class BatchMessageListenerContainer extends DefaultMessageListenerContainer {
	private int batchSize = 10;
	private long receiveTimeout = 1000;
	private final MessageListenerContainerResourceFactory transactionalResourceFactory = new MessageListenerContainerResourceFactory();

	public void setReceiveTimeout(long receiveTimeout) {
		this.receiveTimeout = receiveTimeout;
	}

	public void setBatchSize(int batchSize) {
		this.batchSize = batchSize;
	}
	
	/**
	 * Eagarly fetch messages off the queue until either maxMessages are fetched or timoutAt is reached.
	 * @throws JMSException 
	 */
	protected List<Message> eagarReceive(MessageConsumer consumer, int maxMessages) throws JMSException {
		List<Message> messages = new ArrayList<Message>();
		long timeoutAt = System.currentTimeMillis() + this.receiveTimeout;
		long timeout = this.receiveTimeout;
		do {
			Message message = consumer.receive(timeout);
			if (message != null) messages.add(message);
			timeout = timeoutAt - System.currentTimeMillis();
		} while (messages.size() < maxMessages && timeout > 0);
		
		return messages;
	}
	  
	// Main overriden methods -------------------------------------------------
	
	/**
	 * Copied from org.springframework.jms.listener.AbstractPollingMessageListenerContainer (ver 3.2.3)
	 */
	protected boolean doReceiveAndExecute(Object invoker, Session session, MessageConsumer consumer, TransactionStatus status) throws JMSException {
		Connection conToClose = null;
		Session sessionToClose = null;
		MessageConsumer consumerToClose = null;
		try {
			Session sessionToUse = session;
			boolean transactional = false;
			if (sessionToUse == null) {
				sessionToUse = ConnectionFactoryUtils.doGetTransactionalSession(
						getConnectionFactory(), this.transactionalResourceFactory, true);
				transactional = (sessionToUse != null);
			}
			if (sessionToUse == null) {
				Connection conToUse;
				if (sharedConnectionEnabled()) {
					conToUse = getSharedConnection();
				}
				else {
					conToUse = createConnection();
					conToClose = conToUse;
					conToUse.start();
				}
				sessionToUse = createSession(conToUse);
				sessionToClose = sessionToUse;
			}
			MessageConsumer consumerToUse = consumer;
			if (consumerToUse == null) {
				consumerToUse = createListenerConsumer(sessionToUse);
				consumerToClose = consumerToUse;
			}
			// START: enhancments over AbstractPollingMessageListenerContainer
			List<Message> messages = eagarReceive(consumerToUse, this.batchSize);
			if (!messages.isEmpty()) {
				
				for (Message message : messages) {
					if (logger.isDebugEnabled()) {
						logger.debug("Received message of type [" + message.getClass() + "] from consumer [" +
								consumerToUse + "] of " + (transactional ? "transactional " : "") + "session [" +
								sessionToUse + "]");
					}
				}
				
				messageReceived(invoker, sessionToUse);
				boolean exposeResource = (!transactional && isExposeListenerSession() && !TransactionSynchronizationManager.hasResource(getConnectionFactory()));
				if (exposeResource) {
					TransactionSynchronizationManager.bindResource(getConnectionFactory(), new LocallyExposedJmsResourceHolder(sessionToUse));
				}

                try {
                    doExecuteListener(sessionToUse, messages);
                } catch (Exception ex) {
                    if (status != null) {
                        if (logger.isDebugEnabled()) {
                            logger.debug("Rolling back transaction because of listener exception thrown: " + ex);
                        }
                        status.setRollbackOnly();
                    }
                    handleListenerException(ex);
                    // Rethrow JMSException to indicate an infrastructure problem
                    // that may have to trigger recovery...
                    if (ex instanceof JMSException) {
                        throw (JMSException) ex;
                    }
                } finally {
                    if (exposeResource) {
                        TransactionSynchronizationManager.unbindResource(getConnectionFactory());
                    }
                }
                // Indicate that a message has been received.
				return true;
			} else {
				if (logger.isTraceEnabled()) {
					logger.trace("Consumer [" + consumerToUse + "] of " + (transactional ? "transactional " : "") +
							"session [" + sessionToUse + "] did not receive a message");
				}
				noMessageReceived(invoker, sessionToUse);
				// Nevertheless call commit, in order to reset the transaction timeout (if any).
				// However, don't do this on Tibco since this may lead to a deadlock there.
				if (shouldCommitAfterNoMessageReceived(sessionToUse)) {
					commitIfNecessary(sessionToUse, null);
				}
				// Indicate that no message has been received.
				return false;
			}
			
			// END: enhancments over AbstractPollingMessageListenerContainer
			/* THis is what I modified in AbstractPollingMessageListenerContainer
			Message message = receiveMessage(consumerToUse);
			if (message != null) {
				if (logger.isDebugEnabled()) {
					logger.debug("Received message of type [" + message.getClass() + "] from consumer [" +
							consumerToUse + "] of " + (transactional ? "transactional " : "") + "session [" +
							sessionToUse + "]");
				}
				messageReceived(invoker, sessionToUse);
				boolean exposeResource = (!transactional && isExposeListenerSession() &&
						!TransactionSynchronizationManager.hasResource(getConnectionFactory()));
				if (exposeResource) {
					TransactionSynchronizationManager.bindResource(
							getConnectionFactory(), new LocallyExposedJmsResourceHolder(sessionToUse));
				}
				try {
					doExecuteListener(sessionToUse, message);
				}
				catch (Throwable ex) {
					if (status != null) {
						if (logger.isDebugEnabled()) {
							logger.debug("Rolling back transaction because of listener exception thrown: " + ex);
						}
						status.setRollbackOnly();
					}
					handleListenerException(ex);
					// Rethrow JMSException to indicate an infrastructure problem
					// that may have to trigger recovery...
					if (ex instanceof JMSException) {
						throw (JMSException) ex;
					}
				}
				finally {
					if (exposeResource) {
						TransactionSynchronizationManager.unbindResource(getConnectionFactory());
					}
				}
				// Indicate that a message has been received.
				return true;
			}
			else {
				if (logger.isTraceEnabled()) {
					logger.trace("Consumer [" + consumerToUse + "] of " + (transactional ? "transactional " : "") +
							"session [" + sessionToUse + "] did not receive a message");
				}
				noMessageReceived(invoker, sessionToUse);
				// Nevertheless call commit, in order to reset the transaction timeout (if any).
				// However, don't do this on Tibco since this may lead to a deadlock there.
				if (shouldCommitAfterNoMessageReceived(sessionToUse)) {
					commitIfNecessary(sessionToUse, message);
				}
				// Indicate that no message has been received.
				return false;
			}
			*/
		}
		finally {
			JmsUtils.closeMessageConsumer(consumerToClose);
			JmsUtils.closeSession(sessionToClose);
			ConnectionFactoryUtils.releaseConnection(conToClose, getConnectionFactory(), true);
		}
	}
	
	protected void doExecuteListener(Session session, List<Message> messages)
			throws JMSException {
		if (!isAcceptMessagesWhileStopping() && !isRunning()) {
			if (logger.isWarnEnabled()) {
				logger.warn("Rejecting received messages because of the listener container "
						+ "having been stopped in the meantime: " + messages);
			}
			rollbackIfNecessary(session);
			throw new JMSException(
					"Rejecting received messages as listener container is stopping");
		}

		@SuppressWarnings("unchecked")
		SessionAwareBatchMessageListener<Message> lsnr = (SessionAwareBatchMessageListener<Message>) getMessageListener();

		try {
			lsnr.onMessages(session, messages);
		} catch (JMSException ex) {
			rollbackOnExceptionIfNecessary(session, ex);
			throw ex;
		} catch (RuntimeException ex) {
			rollbackOnExceptionIfNecessary(session, ex);
			throw ex;
		} catch (Error err) {
			rollbackOnExceptionIfNecessary(session, err);
			throw err;
		}

		for (Message m : messages) {
			commitIfNecessary(session, m);
		}
	}

	@Override
	protected void checkMessageListener(Object messageListener) {
		if (!(messageListener instanceof SessionAwareBatchMessageListener)) {
			throw new IllegalArgumentException(
					"Message listener needs to be of type ["
							+ SessionAwareBatchMessageListener.class.getName()
							+ "]");
		}
	}

	@Override
	protected void validateConfiguration() {
		if (batchSize <= 0) {
			throw new IllegalArgumentException(
					"Property batchSize must be a value greater than 0");
		} else if (receiveTimeout <= 0) {
			throw new IllegalArgumentException("Property receiveTimeout must have a value greater than 0");
		}
	}
	  
	/** Copied from org.springframework.jms.listener.AbstractPollingMessageListenerContainer.class (ver 3.2.3) */
	protected boolean isSessionLocallyTransacted(Session session) {
		if (!super.isSessionLocallyTransacted(session)) {
			return false;
		}
		JmsResourceHolder resourceHolder =
				(JmsResourceHolder) TransactionSynchronizationManager.getResource(getConnectionFactory());
		return (resourceHolder == null || resourceHolder instanceof LocallyExposedJmsResourceHolder ||
				!resourceHolder.containsSession(session));
	}
	  
	public interface SessionAwareBatchMessageListener<M extends Message>{
	  /**
	   * Perform a batch action with the provided list of {@code messages}.
	   * 
	   * @param session JMS {@code Session} that received the messages
	   * @param messages List of messages to be processed as a unit of work
	   * @throws JMSException JMSException thrown if there is an error performing the operation.
	   */
	  public void onMessages(Session session, List<M> messages) throws JMSException;
	}
  
	/** Copied and adapted from org.springframework.jms.listener.AbstractPollingMessageListenerContainer (ver 3.2.3) */
	private class MessageListenerContainerResourceFactory implements ConnectionFactoryUtils.ResourceFactory {

		public Connection getConnection(JmsResourceHolder holder) {
			return BatchMessageListenerContainer.this.getConnection(holder);
		}

		public Session getSession(JmsResourceHolder holder) {
			return BatchMessageListenerContainer.this.getSession(holder);
		}

		public Connection createConnection() throws JMSException {
			if (BatchMessageListenerContainer.this.sharedConnectionEnabled()) {
				Connection sharedCon = BatchMessageListenerContainer.this.getSharedConnection();
				return new SingleConnectionFactory(sharedCon).createConnection();
			}
			else {
				return BatchMessageListenerContainer.this.createConnection();
			}
		}

		public Session createSession(Connection con) throws JMSException {
			return BatchMessageListenerContainer.this.createSession(con);
		}

		public boolean isSynchedLocalTransactionAllowed() {
			return BatchMessageListenerContainer.this.isSessionTransacted();
		}
	}
		
	/** copied from: org.springframework.jms.listener.LocallyExposedJmsResourceHolder (ver 3.2.3) */
	class LocallyExposedJmsResourceHolder extends JmsResourceHolder {

		public LocallyExposedJmsResourceHolder(Session session) {
			super(session);
		}

	}
}