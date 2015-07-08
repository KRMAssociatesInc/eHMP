package gov.va.cpe.vpr;

import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.servlet.ModelAndView;

import javax.jms.JMSException;
import java.util.Map;

public interface IBroadcastService {
    void broadcastMessage(Object message);

    void broadcastMessage(Object message, Map<String, Object> msgHeaders);

    void broadcastMessage(Object message, boolean peristent, int ttlMS, Map<String, Object> msgHeaders) throws JMSException;

    void clearResult(DeferredResult<?> result);

    void clearResult(String sessid, String clientid);

    Map<String, Object> getServiceStats();

    void registerUIListener(String jsessid, String clientid, DeferredResult<ModelAndView> result, IBroadcastMessageFilter filter) throws JMSException;
}
