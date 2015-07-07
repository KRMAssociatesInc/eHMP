package gov.va.cpe.vpr.dao.multi;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
import com.google.common.base.Stopwatch;
import gov.va.cpe.vpr.dao.RoutingDataStore;
import gov.va.cpe.vpr.pom.IDataStoreDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.dao.InvalidDataAccessResourceUsageException;
import org.springframework.util.ClassUtils;

import java.util.Map;
import java.util.SortedMap;
import java.util.concurrent.TimeUnit;

public class DefaultRoutingDataStore implements RoutingDataStore, EnvironmentAware {

    private Environment environment;
    private SortedMap<String, IDataStoreDAO> dataStores;
    private MetricRegistry metrics;

    private static final Logger LOGGER = LoggerFactory.getLogger(DefaultRoutingDataStore.class);


    public Environment getEnvironment() {
        return environment;
    }

    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @Required
    public void setDataStores(SortedMap<String, IDataStoreDAO> dataStores) {
        this.dataStores = dataStores;
    }

    @Required
    public void setMetrics(MetricRegistry metrics) {
        this.metrics = metrics;
    }

    @Override
    public <T extends IPOMObject> T save(T entity) {
        for (Map.Entry<String, IDataStoreDAO> dataStoreEntry : dataStores.entrySet()) {
            String dataSource = dataStoreEntry.getKey();
            if (!environment.acceptsProfiles(dataSource)) continue;

            IDataStoreDAO dao = dataStoreEntry.getValue();
            if (dao == null) {
                throw new InvalidDataAccessResourceUsageException("No implementation of IDataStoreDAO registered under key '" + dataStoreEntry.getKey() + "'");
            } else {
                Timer.Context timer = metrics.timer(metrics.name("vpr.persist", ClassUtils.getShortNameAsProperty(entity.getClass()), dataSource)).time();
                Stopwatch stopwatch = new Stopwatch().start();
                dao.save(entity);
                LOGGER.debug("TIME ELAPSED saving " + entity.getUid() + " to " + dataStoreEntry.getKey() + " : " + stopwatch.elapsed(TimeUnit.MILLISECONDS));
                timer.stop();
            }
        }
        return entity;
    }

    @Override
    public <T extends IPOMObject> void delete(T entity) {
        for (Map.Entry<String, IDataStoreDAO> dataStoreEntry : dataStores.entrySet()) {
            String dataSource = dataStoreEntry.getKey();
            if (!environment.acceptsProfiles(dataSource)) continue;

            IDataStoreDAO dao = dataStoreEntry.getValue();
            if (dao == null) {
                throw new InvalidDataAccessResourceUsageException("No implementation of IDataStoreDAO registered under key '" + dataStoreEntry.getKey() + "'");
            } else {
                Timer.Context timer = metrics.timer(metrics.name("vpr.delete", ClassUtils.getShortNameAsProperty(entity.getClass()), dataSource)).time();
                dao.delete(entity);
                timer.stop();
            }
        }
    }
}
