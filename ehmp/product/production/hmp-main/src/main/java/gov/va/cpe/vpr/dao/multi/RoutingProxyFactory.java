package gov.va.cpe.vpr.dao.multi;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.Map;

public class RoutingProxyFactory<T> implements FactoryBean<T>, EnvironmentAware {

    private Environment environment;
    private Class<T> daoInterface;
    private Map<String, T> targetDaos;
    private T routingProxy;

    public RoutingProxyFactory(Class<T> daoInterface, Map<String, T> targetDaos) {
        this.daoInterface = daoInterface;
        this.targetDaos = targetDaos;
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @Override
    public T getObject() throws Exception {
        if (routingProxy == null) {
            routingProxy = (T) Proxy.newProxyInstance(this.getClass().getClassLoader(), new Class<?>[] { daoInterface }, new Moo());
        }
        return routingProxy;
    }

    @Override
    public Class<?> getObjectType() {
        return daoInterface;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }

    class Moo implements InvocationHandler {
        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            return null;  //To change body of implemented methods use File | Settings | File Templates.
        }
    }
}
