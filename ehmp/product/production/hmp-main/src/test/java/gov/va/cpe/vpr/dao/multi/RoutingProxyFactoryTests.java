package gov.va.cpe.vpr.dao.multi;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.hamcrest.core.IsInstanceOf.instanceOf;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;

public class RoutingProxyFactoryTests {

    private Foo bar;
    private Foo baz;
    private Map<String,Foo> delegateDaos;

    @Before
    public void setUp() throws Exception {
        bar = mock(Foo.class);
        baz = mock(Foo.class);

        delegateDaos = new HashMap<String, Foo>();
        delegateDaos.put("bar", bar);
        delegateDaos.put("baz", baz);
    }

    @Test
    public void testConstructAndIsSingleton() throws Exception {
        RoutingProxyFactory<Foo> fooProxyFactory = new RoutingProxyFactory<Foo>(Foo.class, delegateDaos);
        assertThat(fooProxyFactory.isSingleton(), is(true));
        assertThat((Class<Foo>) fooProxyFactory.getObjectType(), equalTo(Foo.class));

        Foo foo = fooProxyFactory.getObject();
        Foo foo2 = fooProxyFactory.getObject();

        assertThat(foo, sameInstance(foo2));
    }

    public static interface Foo {
        String foo(String arg);
    }
}
