package gov.va.hmp.vista.rpc.metrics;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.Timer;
import gov.va.hmp.vista.rpc.RpcEvent;
import gov.va.hmp.vista.rpc.RpcListener;
import gov.va.hmp.vista.rpc.RpcResponse;
import org.springframework.web.util.UriComponents;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

public class VistaRpcElapsedTimeMetricListener implements RpcListener {

    public static final String DEFAULT_METRICS_BASE_NAME = "gov.va.hmp.vista.rpc";

    private String metricsName = DEFAULT_METRICS_BASE_NAME;
    private MetricRegistry metricRegistry;
    private List<Pattern> rpcUriIncludePatterns;

    public VistaRpcElapsedTimeMetricListener(MetricRegistry metricRegistry) {
        this.metricRegistry = metricRegistry;
    }

    public VistaRpcElapsedTimeMetricListener(MetricRegistry metricRegistry, String... rpcNameIncludes) {
        this(metricRegistry);
        this.rpcUriIncludePatterns = new ArrayList(rpcNameIncludes.length);
        for (String rpcName : rpcNameIncludes) {
            this.rpcUriIncludePatterns.add(Pattern.compile(".*" + rpcName + ".*", Pattern.CASE_INSENSITIVE));
        }
    }

    public VistaRpcElapsedTimeMetricListener(MetricRegistry metricRegistry, List<Pattern> rpcUriPatternIncludes) {
        this(metricRegistry);
        this.rpcUriIncludePatterns = rpcUriPatternIncludes;
    }

    @Override
    public void onRpc(RpcEvent rpcEvent) {
        if (!matches(rpcEvent)) return;

        UriComponents uriComponents = rpcEvent.getRequest().getUriComponents();
        String name = MetricRegistry.name(metricsName, rpcEvent.getHost().toHostString() + uriComponents.getPath() + "?" + uriComponents.getQuery());
        Timer timer = metricRegistry.timer(name);
        RpcResponse response = rpcEvent.getResponse();
        if (response != null) {
            timer.update(response.getElapsedMillis(), TimeUnit.MILLISECONDS);
        }
    }

    private boolean matches(RpcEvent rpcEvent) {
        if (rpcUriIncludePatterns == null || rpcUriIncludePatterns.isEmpty()) return true;
        for (Pattern pattern : rpcUriIncludePatterns) {
            if (pattern.matcher(rpcEvent.getRequest().getUriString()).matches()) return true;
        }
        return false;
    }
}
