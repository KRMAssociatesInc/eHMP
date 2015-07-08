package gov.va.cpe.test.mock.jms;

import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.springframework.jms.core.BrowserCallback;

import javax.jms.QueueBrowser;
import javax.jms.Session;
import java.io.Serializable;

public class ReturnsBrowserCallbackArgument<T> implements Answer<T>, Serializable {

    private Session session;
    private QueueBrowser queueBrowser;

    public ReturnsBrowserCallbackArgument(Session session, QueueBrowser queueBrowser) {
        this.session = session;
        this.queueBrowser = queueBrowser;
    }

    @Override
    public T answer(InvocationOnMock invocation) throws Throwable {
        BrowserCallback<T> callback = getBrowserCallback(invocation);
        return callback.doInJms(session, queueBrowser);
    }

    private BrowserCallback<T> getBrowserCallback(InvocationOnMock invocation) {
        Object[] args = invocation.getArguments();
        for (Object arg : args) {
            if (arg instanceof BrowserCallback) {
                return (BrowserCallback<T>) arg;
            }
        }
        throw new IllegalArgumentException("At least on argument to mock must be of type " + BrowserCallback.class.getName());
    }
}
