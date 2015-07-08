package gov.va.hmp.vista.rpc.support;

import gov.va.hmp.vista.rpc.RpcEvent;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcListener;
import gov.va.hmp.vista.rpc.conn.AnonymousConnectionSpec;
import gov.va.hmp.vista.util.RpcUriUtils;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

import static java.util.Collections.reverse;

public class InMemoryRpcLog implements RpcListener {

    /**
     * The default cap on the the overall maximum number of RPCs that can
     * logged at one time.
     *
     * @see #getMaxTotal
     * @see #setMaxTotal
     */
    public static final int DEFAULT_MAX_TOTAL = 300;

    private Queue<RpcEvent> events = new ConcurrentLinkedQueue<RpcEvent>();
    private int maxTotal = DEFAULT_MAX_TOTAL;
    private boolean allEnabled = false;
    private Map<String, Stack<RpcEvent>> eventsByAuthority = new HashMap<String, Stack<RpcEvent>>();
    private List<RpcLogFilter> filters = null;

    @Override
    public synchronized void onRpc(RpcEvent rpcEvent) {
        if (isEnabledFor(rpcEvent)) log(rpcEvent);
    }

    private boolean isEnabledFor(RpcEvent rpcEvent) {
        if (!isLoggable(rpcEvent)) return false;
        if (isAllEnabled()) return true;
        return isEnabledFor(rpcEvent.getHost(), rpcEvent.getRequest().getCredentials());
    }

    private boolean isLoggable(RpcEvent rpcEvent) {
        if (filters == null || filters.isEmpty()) {
            return true;
        } else {
            for (RpcLogFilter filter : filters) {
                if (!filter.isLoggable(rpcEvent)) return false;
            }
            return true;
        }
    }

    public boolean isEnabledFor(RpcHost host, String credentials) {
        if (AnonymousConnectionSpec.ANONYMOUS.equalsIgnoreCase(credentials)) return false;
        return eventsByAuthority.containsKey(RpcUriUtils.toAuthority(host, credentials));
    }

    private void log(RpcEvent rpcEvent) {
        events.add(rpcEvent);
        String authority = toAuthority(rpcEvent);
        if (eventsByAuthority.containsKey(authority)) {
            Stack<RpcEvent> events = eventsByAuthority.get(authority);
            events.push(rpcEvent);
        }
        removeOverflow();
    }

    private void removeOverflow() {
        while (events.size() > getMaxTotal()) {
            RpcEvent e = events.poll();  // removes head of queue
            String authority = toAuthority(e);
            if (eventsByAuthority.containsKey(authority)) {
                Stack<RpcEvent> events = eventsByAuthority.get(authority);
                events.remove(e);
            }
        }
    }

    private String toAuthority(RpcEvent rpcEvent) {
        return RpcUriUtils.toAuthority(rpcEvent.getHost(), rpcEvent.getRequest().getCredentials());
    }

    public boolean isAllEnabled() {
        return allEnabled;
    }

    public synchronized void setAllEnabled(boolean allEnabled) {
        this.allEnabled = allEnabled;
    }

    public void enableForAll() {
        setAllEnabled(true);
    }

    public void disableForAll() {
        setAllEnabled(false);
    }

    public synchronized void enableFor(RpcHost host, String credentials) {
        String authority = RpcUriUtils.toAuthority(host, credentials);
        List<RpcEvent> events = eventsByAuthority.get(authority);
        if (events == null) {
            eventsByAuthority.put(authority, new Stack<RpcEvent>());
        }
    }

    public synchronized void disableFor(RpcHost host, String credentials) {
        String authority = RpcUriUtils.toAuthority(host, credentials);
        eventsByAuthority.remove(authority);
    }

    public synchronized void clear(RpcHost host, String credentials) {
        String authority = RpcUriUtils.toAuthority(host, credentials);
        List<RpcEvent> events = eventsByAuthority.get(authority);
        if (events != null) events.clear();
    }

    public synchronized void clear() {
        eventsByAuthority.clear();
        events.clear();
    }

    public List<RpcEvent> getRpcEvents() {
        List<RpcEvent> rpcs = new ArrayList<RpcEvent>(events);
        reverse(rpcs);
        return Collections.unmodifiableList(rpcs);
    }

    public List<RpcEvent> getRpcEvents(RpcHost host, String credentials) {
        List<RpcEvent> events = eventsByAuthority.get(RpcUriUtils.toAuthority(host, credentials));
        if (events == null) return Collections.emptyList();
        events = new ArrayList<RpcEvent>(events);
        reverse(events);
        return Collections.unmodifiableList(events);
    }

    public void setMaxTotal(int maxTotal) {
        this.maxTotal = maxTotal;
        removeOverflow();
    }

    public int getMaxTotal() {
        return maxTotal;
    }

    public void setFilters(List<RpcLogFilter> filters) {
        this.filters = filters;
    }
}
