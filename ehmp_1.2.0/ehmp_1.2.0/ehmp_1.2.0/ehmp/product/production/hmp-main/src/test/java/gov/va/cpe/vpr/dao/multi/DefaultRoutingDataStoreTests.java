package gov.va.cpe.vpr.dao.multi;

import com.codahale.metrics.MetricRegistry;
import gov.va.cpe.vpr.pom.IDataStoreDAO;
import gov.va.cpe.test.mockito.ReturnsArgument;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.sync.vista.Foo;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.env.Environment;

import java.util.HashMap;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.CoreMatchers.sameInstance;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

public class DefaultRoutingDataStoreTests {

    private IDataStoreDAO fooMockDao;
    private IDataStoreDAO barMockDao;
    private SortedMap<String, IDataStoreDAO> daosByDataSource;
    private DefaultRoutingDataStore dataStore;

    @Before
    public void setUp() throws Exception {
        fooMockDao = mock(IDataStoreDAO.class);
        barMockDao = mock(IDataStoreDAO.class);

        daosByDataSource = new TreeMap<String, IDataStoreDAO>();
        daosByDataSource.put("foo", fooMockDao);
        daosByDataSource.put("bar", barMockDao);

        dataStore = new DefaultRoutingDataStore();
        dataStore.setEnvironment(mock(Environment.class));
        dataStore.setDataStores(daosByDataSource);
        dataStore.setMetrics(new MetricRegistry());
    }

    @Test
    public void testSaveDelegatesToConfiguredDaos() throws Exception {
        when(dataStore.getEnvironment().acceptsProfiles("foo")).thenReturn(true);
        when(dataStore.getEnvironment().acceptsProfiles("bar")).thenReturn(true);

        Foo foo = new Foo();

        dataStore.save(foo);

        verify(fooMockDao).save(foo);
        verify(barMockDao).save(foo);
    }

    @Test
    public void testSaveDelegatesToConfiguredDaosBasedOnActiveSpringProfiles() throws Exception {
        when(dataStore.getEnvironment().acceptsProfiles("foo")).thenReturn(true);
        when(dataStore.getEnvironment().acceptsProfiles("bar")).thenReturn(false);

        Foo foo = new Foo();

        dataStore.save(foo);

        verify(fooMockDao).save(foo);
        verifyZeroInteractions(barMockDao);
   }
}
