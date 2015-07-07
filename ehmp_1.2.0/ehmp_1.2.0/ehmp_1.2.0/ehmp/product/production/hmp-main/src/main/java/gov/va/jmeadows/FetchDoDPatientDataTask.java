package gov.va.jmeadows;

import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.med.jmeadows.webservice.JMeadowsException_Exception;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;

/**
 * Fetch DoD Patient Data Task
 */
public class FetchDoDPatientDataTask implements Callable<List<VistaDataChunk>> {
    private static final Logger LOG = LoggerFactory.getLogger(FetchDoDPatientDataTask.class);
    private Object jMeadowsService;
    private String methodName;
    private Object[] params;
    private Class[] paramTypes;

    public FetchDoDPatientDataTask(Object classObj, String methodName, Object[] params) {
        this.jMeadowsService = classObj;
        this.methodName = methodName;
        if (params != null && params.length > 0) {
            this.params = params;
            paramTypes = new Class[params.length];
            for (int i=0; i < params.length; i++) {
                paramTypes[i] = params[i].getClass();
            }
        }
    }

    public List<VistaDataChunk> call() {
        if (jMeadowsService != null && methodName != null && params != null && paramTypes != null) {
            try {
                Class fetchDataClass = jMeadowsService.getClass();
                Method fetchDataMethod = fetchDataClass.getMethod(methodName, paramTypes);
                return (List<VistaDataChunk>) fetchDataMethod.invoke(jMeadowsService, params);
            } catch (NoSuchMethodException nsme) {
                LOG.error("invalid method", nsme);
                throw new RuntimeException(nsme.getCause());
            } catch (IllegalAccessException iae) {
                LOG.error("invalid access", iae);
                throw new RuntimeException(iae.getCause());
            } catch (InvocationTargetException ite) {
                LOG.error("invocation error", ite);
                throw new RuntimeException(ite.getCause());
            }
        }
        return Collections.<VistaDataChunk>emptyList();
    }

}
