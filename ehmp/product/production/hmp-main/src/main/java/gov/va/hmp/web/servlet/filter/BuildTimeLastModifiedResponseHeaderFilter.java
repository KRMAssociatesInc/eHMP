package gov.va.hmp.web.servlet.filter;

import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.NoSuchMessageException;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Locale;

/**
 * Servlet filter that sets the Last-Modified and Expired HTTP Response Headers based on build time embedded in
 * properties file.
 * <p/>
 * By default, this filter will look in the Spring {@link org.springframework.core.env.Environment} for a build time
 * string using the key specified by the 'buildTimePropertyKey' property of this bean with the format specified by the
 * 'buildTimeDateFormat' property and then set the "Last-Modified" HTTP Response header to the build time.  Also by
 * default, the "Expires" HTTP Response header will be set to 1 year after the build time, unless the version string in
 * the Spring {@link org.springframework.core.env.Environment} looked up by "versionPropertyKey" contains the substring
 * "SNAPSHOT", in which case it sets the "Expires" header to Jan 1st, 1970.
 * <p/>
 * Example usage in web.xml of servlet application: <code> <filter> <filter-name>buildTimeLastModifiedFilter</filter-name>
 * <filter-class>gov.va.hmp.web.servlet.filter.BuildTimeLastModifiedResponseHeaderFilter</filter-class> </filter>
 * ... <filter-mapping> <filter-name>buildTimeLastModifiedFilter</filter-name> <url-pattern>/logo.png</url-pattern>
 * </filter-mapping> </code>
 */
public class BuildTimeLastModifiedResponseHeaderFilter extends GenericFilterBean {

    static final Logger LOG = LoggerFactory.getLogger(BuildTimeLastModifiedResponseHeaderFilter.class);

    static final String LAST_MODIFIED_HTTP_RESPONSE_HEADER = "Last-Modified";
    static final String EXPIRES_HTTP_RESPONSE_HEADER = "Expires";

    static final String DEFAULT_VERSION_PROPERTY_KEY = "app.version";
    static final String DEFAULT_BUILDTIME_KEY = "app.buildtime";

    static final String DEFAULT_BUILDTIME_DATE_FORMAT_KEY = "app.buildtime.format";

    static final String DEFAULT_BUILDTIME_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss Z";

    static final long MILLISECONDS_IN_ONE_YEAR = 1000L * 60L * 60L * 24L * 365L;

    private String versionPropertyKey = DEFAULT_VERSION_PROPERTY_KEY;
    private String buildTimePropertyKey = DEFAULT_BUILDTIME_KEY;
    private String buildTimeDateFormatKey = DEFAULT_BUILDTIME_DATE_FORMAT_KEY;

    private String buildTimeDateFormatPattern = DEFAULT_BUILDTIME_DATE_FORMAT;
    private DateTimeFormatter dateFormat;

    @Override
    protected void initFilterBean() throws ServletException {
        super.initFilterBean();

        Assert.hasText(versionPropertyKey);
        Assert.hasText(buildTimePropertyKey);
        Assert.hasText(buildTimeDateFormatKey);

        try {
            String buildTimeDateFormatPattern = WebApplicationContextUtils.getWebApplicationContext(this.getServletContext()).getMessage(buildTimeDateFormatKey, new Object[]{}, Locale.getDefault());
            dateFormat = DateTimeFormat.forPattern(buildTimeDateFormatPattern);
        } catch (NoSuchMessageException e) {
            dateFormat = DateTimeFormat.forPattern(buildTimeDateFormatPattern);
        }
    }

    public void doFilter(ServletRequest req, ServletResponse res, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;

        Long buildTimeMillis = null;

        String buildTimeString = WebApplicationContextUtils.getWebApplicationContext(getServletContext()).getEnvironment().getProperty(getBuildTimePropertyKey());
        if (StringUtils.hasText(buildTimeString)) {
            try {
                buildTimeMillis = dateFormat.parseMillis(buildTimeString);
                response.setDateHeader(LAST_MODIFIED_HTTP_RESPONSE_HEADER, buildTimeMillis);
//            } catch (ImportException e) {
//                LOG.warn("Unable to set {} header because '{}' didn't match format '{}': {}", new Object[] {LAST_MODIFIED_HTTP_RESPONSE_HEADER, buildTimeString, buildTimeDateFormat, e.getMessage()});
            } catch (IllegalArgumentException e) {
                LOG.warn("Unable to set {} header because '{}' didn't match format '{}': {}", new Object[]{LAST_MODIFIED_HTTP_RESPONSE_HEADER, buildTimeString, buildTimeDateFormatKey, e.getMessage()});
            }
        } else {
            LOG.warn("Unable to set {} header because '{}' property from Spring Environment is empty.", LAST_MODIFIED_HTTP_RESPONSE_HEADER, getBuildTimePropertyKey());
        }

        String versionString = WebApplicationContextUtils.getWebApplicationContext(getServletContext()).getEnvironment().getProperty(getVersionPropertyKey());

        if (StringUtils.hasText(versionString) && isSnapshotBuild(versionString)) {
            response.setDateHeader(EXPIRES_HTTP_RESPONSE_HEADER, 0);
        } else {
            if (buildTimeMillis != null) {
                response.setDateHeader(EXPIRES_HTTP_RESPONSE_HEADER, buildTimeMillis + MILLISECONDS_IN_ONE_YEAR);
            } else {
                LOG.warn("Unable to set {} header because '{}' property from Spring Environment is malformed or missing and build time is unknown.", EXPIRES_HTTP_RESPONSE_HEADER, getBuildTimePropertyKey());
            }
        }

        filterChain.doFilter(req, response);
    }

    protected boolean isSnapshotBuild(String versionString) {
        return versionString.indexOf("SNAPSHOT") != -1;
    }

    public String getBuildTimePropertyKey() {
        return buildTimePropertyKey;
    }

    public void setBuildTimePropertyKey(String buildTimePropertyKey) {
        this.buildTimePropertyKey = buildTimePropertyKey;
    }

    public String getVersionPropertyKey() {
        return versionPropertyKey;
    }

    public void setVersionPropertyKey(String versionPropertyKey) {
        this.versionPropertyKey = versionPropertyKey;
    }

    public String getBuildTimeDateFormatKey() {
        return buildTimeDateFormatKey;
    }

    public void setBuildTimeDateFormatKey(String buildTimeDateFormatKey) {
        this.buildTimeDateFormatKey = buildTimeDateFormatKey;
    }

    public String getBuildTimeDateFormat() {
        return this.buildTimeDateFormatPattern;
    }
}