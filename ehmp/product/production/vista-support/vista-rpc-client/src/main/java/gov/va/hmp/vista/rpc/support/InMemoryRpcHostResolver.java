package gov.va.hmp.vista.rpc.support;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcHostResolver;
import gov.va.hmp.vista.rpc.broker.conn.VistaIdNotFoundException;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class InMemoryRpcHostResolver implements Map<String, RpcHost>, RpcHostResolver {

    private Map<String, RpcHost> hosts;

    public InMemoryRpcHostResolver() {
        this(new HashMap<String, RpcHost>());
    }

    public InMemoryRpcHostResolver(Map<String, RpcHost> hosts) {
        this.hosts = hosts;
    }

    @Override
    public RpcHost resolve(String vistaId) throws VistaIdNotFoundException {
        if (!hosts.containsKey(vistaId)) throw new VistaIdNotFoundException(vistaId);
        return hosts.get(vistaId);
    }

    @Override
    public int size() {
        return hosts.size();
    }

    @Override
    public boolean isEmpty() {
        return hosts.isEmpty();
    }

    @Override
    public boolean containsKey(Object o) {
        return hosts.containsKey(o);
    }

    @Override
    public boolean containsValue(Object o) {
        return hosts.containsValue(o);
    }

    @Override
    public RpcHost get(Object o) {
        return hosts.get(o);
    }

    @Override
    public RpcHost put(String s, RpcHost rpcHost) {
        return hosts.put(s, rpcHost);
    }

    @Override
    public RpcHost remove(Object o) {
        return hosts.remove(o);
    }

    @Override
    public void putAll(Map<? extends String, ? extends RpcHost> map) {
        hosts.putAll(map);
    }

    @Override
    public void clear() {
        hosts.clear();
    }

    @Override
    public Set<String> keySet() {
        return hosts.keySet();
    }

    @Override
    public Collection<RpcHost> values() {
        return hosts.values();
    }

    @Override
    public Set<Entry<String, RpcHost>> entrySet() {
        return hosts.entrySet();
    }
}
