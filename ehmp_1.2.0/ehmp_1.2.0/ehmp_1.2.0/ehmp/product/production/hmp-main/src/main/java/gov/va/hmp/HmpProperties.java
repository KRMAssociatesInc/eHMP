package gov.va.hmp;

import org.springframework.core.env.Environment;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.*;

public class HmpProperties {
    public static final String HMP_HOME_ENVIRONMENT_VARIABLE_NAME = "HMP_HOME";
    public static final String HMP_HOME_SYSTEM_PROPERTY_NAME = "hmp.home";
    public static final String HMP_PROPERTIES_FILE_NAME = "hmp.properties";

    public static final String DEVELOPMENT_PROFILE = "development";

    public static final String VERSION = "hmp.version";
    public static final String BUILD_DATE = "hmp.build.date";
    public static final String BUILD_NUMBER = "hmp.build.number";

    public static final String SETUP_COMPLETE = "hmp.setup.complete";
    public static final String SERVER_ID = "hmp.server.id";
    public static final String PROPERTIES_ENCRYPTED = "hmp.properties.encrypted";
    public static final String SERVER_HOST = "hmp.server.host";
    public static final String SERVER_PORT_HTTP = "hmp.server.port.http";
    public static final String SERVER_PORT_HTTPS = "hmp.server.port.https";
    public static final String SERVER_URL = "hmp.server.url";
    public static final String ACTIVEMQ_BROKER_URL = "activemq.broker.url";
    public static final String ACTIVEMQ_DATA_DIR = "activemq.data.dir";
    public static final String EHCACHE_DATA_DIR = "ehcache.disk.store.dir";
    public static final String HMP_DATA_DIR = "hmp.data.dir";
    public static final String JDS_URL = "jds.url";
    public static final String SOLR_URL = "solr.url";
    public static final String INFO_BUTTON_URL = "openinfobutton.url";
    public static final String JIRA_USERNAME = "jira.username";
    public static final String JIRA_PASSWORD = "jira.password";
    public static final String JIRA_HOST = "jira.host";
    public static final String JIRA_PROJECT = "jira.project";
    public static final String ASYNC_BATCH_SIZE = "async.batch.size";
    public static final String SYNC_MAX_RETRY_HOURS="sync.max.retry.hours";
    public static final String SYNC_PAUSE_BEFORE_RETRY_SECONDS = "sync.pause.before.retry.seconds";
    public static final String SYNC_RETRY_ON_VISTA_ERROR_ATTEMPTS = "sync.retry.on.vista.error.attempts";

    public static final String HDR_BASEURL = "hdr.base.url";
    public static final String HDR_ENABLED = "hdr.enabled";
    public static final String HDR_RETRY_COUNT = "hdr.retrycount";
    public static final String HDR_URLSTYLE = "hdr.url.style";

    public static final String LOW_PRIV_USER = "low.priv.user";

    /**
     * jMeadows settings
     */
    public static final String DOD_JMEADOWS_ENABLED = "dod.jmeadows.enabled";
    public static final String JMEADOWS_URL = "jmeadows.url";
    public static final String JMEADOWS_TIMEOUT_MS = "jmeadows.timeoutMS";
    public static final String JMEADOWS_USER_IEN = "jmeadows.user.ien";
    public static final String JMEADOWS_USER_NAME = "jmeadows.user.name";
    public static final String JMEADOWS_USER_SITE_CODE = "jmeadows.user.site.code";
    public static final String JMEADOWS_USER_SITE_NAME = "jmeadows.user.site.name";
    public static final String JMEADOWS_PARALLELISM = "jmeadows.parallelism";
    public static final String JMEADOWS_RETRY_COUNT = "jmeadows.retrycount";

    /**
     * DoD document settings
     */
    public static final String DOD_DOC_SERVICE_ENABLED = "dod.doc.service.enabled";
    public static final String DOC_RETRIEVE_MAX_THREADS = "doc.retrieve.max.threads";
    public static final String DOC_RETRIEVE_TIMEOUT_MS = "doc.retrieve.timeout.ms";
    public static final String DOC_CONVERT_OFFICE_HOME = "doc.convert.office.home";
    public static final String DOC_CONVERT_MAX_THREADS = "doc.convert.max.threads";
    public static final String DOC_CONVERT_TIMEOUT_MS = "doc.convert.timeout.ms";
    public static final String DOC_STORE_FILE_PATH = "doc.store.file.path";
    public static final String DOC_STORE_SERVICE_PATH = "doc.store.service.path";

    /**
     * VLER eHealth Exchange settings
     */
    public static final String VLER_ENABLED = "vler.enabled";
    public static final String VLER_DOC_QUERY_URL = "vler.doc.query.url";
    public static final String VLER_DOC_QUERY_TIMEOUT_MS = "vler.doc.query.timeout.ms";
    public static final String VLER_DOC_RETRIEVE_URL = "vler.doc.retrieve.url";
    public static final String VLER_DOC_RETRIEVE_TIMEOUT_MS = "vler.doc.retrieve.timeout.ms";
    public static final String VLER_DOC_RETRIEVE_MAX_THREADS = "vler.doc.retrieve.max.threads";
    public static final String VLER_SYSTEM_USER_NAME = "vler.system.user.name";
    public static final String VLER_SYSTEM_USER_SITE_CODE = "vler.system.user.site.code";
    public static final String VLER_RETRY_COUNT = "vler.retry.count";

    /**
     * VLER DAS settings
     */
    public static final String VLER_DAS_ENABLED = "vlerdas.enabled";
    public static final String VLER_DAS_BASE_URL = "vlerdas.baseUrl";
    public static final String VLER_DAS_RETRY_COUNT = "vlerdas.retrycount";

    public static Map<String, String> getProperties(Environment environment) {
        return getProperties(environment, false);
    }

    public static Map<String, String> getProperties(Environment environment, boolean includeSensitive) {
        Map<String, String> props = new HashMap<String, String>();
        for (String prop : HmpProperties.getPropertyNames(includeSensitive)) {
            props.put(prop, environment.getProperty(prop));
        }
        return Collections.unmodifiableMap(props);
    }

    public static Set<String> getPropertyNames() {
        return getPropertyNames(false);
    }

    public static Set<String> getPropertyNames(boolean includeSensitive) {
        HashSet<String> s = new HashSet<String>();
        Field[] fields = HmpProperties.class.getFields();
        for (Field f : fields) {
            if (Modifier.isPublic(f.getModifiers()) && Modifier.isStatic(f.getModifiers()) && Modifier.isFinal(f.getModifiers()) && String.class.isAssignableFrom(f.getType())) {
                try {
                    String propertyName = f.get(null).toString();
                    if (isSensitive(propertyName)) {
                        if (includeSensitive) s.add(propertyName);
                    } else {
                        s.add(propertyName);
                    }
                } catch (IllegalAccessException e) {
                    // NOOP: shouldn't ever happen because we're only examining public fields
                }
            }
        }
        return Collections.unmodifiableSet(s);
    }


    private static boolean isSensitive(String propertyName) {
        String[] disallowed = new String[]{"password", "username", "credent", "passwd", "usrname"};
        for (String s : disallowed) {
            if (propertyName.toLowerCase().indexOf(s) >= 0) {
                return true;
            }
        }
        return false;
    }
}
