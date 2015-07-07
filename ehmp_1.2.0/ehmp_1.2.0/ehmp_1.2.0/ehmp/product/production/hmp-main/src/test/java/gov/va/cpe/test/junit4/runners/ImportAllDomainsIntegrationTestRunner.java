package gov.va.cpe.test.junit4.runners;

import org.junit.runner.Runner;
import org.junit.runner.notification.RunNotifier;
import org.junit.runners.Suite;
import org.junit.runners.model.InitializationError;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ImportAllDomainsIntegrationTestRunner extends Suite {

    private static Class<?>[] getAnnotatedClasses(Class<?> klass) throws InitializationError {
        SuiteClasses annotation = klass.getAnnotation(SuiteClasses.class);
        if (annotation == null)
            throw new InitializationError(String.format("class '%s' must have a SuiteClasses annotation", klass.getName()));
        return annotation.value();
    }

    private ArrayList<Runner> runners = new ArrayList<Runner>();

    /**
     * Called reflectively on classes annotated with <code>@RunWith(SyncPatientRunner.class)</code>
     *
     * @param klass the root class
     * @throws InitializationError
     */
    public ImportAllDomainsIntegrationTestRunner(Class<?> klass) throws Throwable {
        super(klass, Collections.<Runner>emptyList());

        String connectionUri = getConnectionUri(klass);
        int timeout = getTimeout(klass);
        String[] dfns = getPatientDfns(klass);
        Class<?>[] parserTestClasses = getAnnotatedClasses(klass);

        VistaSessionManager.startSession(timeout);
        for (Class<?> parserTestClass : parserTestClasses) {
            runners.add(new ImporterIntegrationTestRunner(parserTestClass, connectionUri, timeout, dfns));
        }
    }

    @Override
    protected List<Runner> getChildren() {
        return runners;
    }

    @Override
    public void run(RunNotifier notifier) {
        super.run(notifier);
        VistaSessionManager.stopSession();
    }

    private static String[] getPatientDfns(Class<?> klass) throws InitializationError {
        AnnotationFinder annotationFinder = new AnnotationFinder(klass);
        TestPatient ptConfig = annotationFinder.find(TestPatient.class);
        TestPatients ptsConfig = annotationFinder.find(TestPatients.class);
        if (ptConfig == null && ptsConfig == null)
            throw new InitializationError(TestPatient.class.getSimpleName() + " or " + TestPatients.class.getSimpleName() + " annotation must be placed over your test class for this runner: "
                    + klass.getSimpleName());
        if (ptConfig != null)
            return new String[]{ptConfig.dfn()};
        else
            return ptsConfig.dfns();
    }

    private static String getConnectionUri(Class<?> klass) throws InitializationError {
        ImportTestSession sessionConfig = getSessionConfig(klass);
        return sessionConfig.connectionUri();
    }

    private static int getTimeout(Class<?> klass) throws InitializationError {
        ImportTestSession sessionConfig = getSessionConfig(klass);
        return sessionConfig.rpcTimeout();
    }

    private static ImportTestSession getSessionConfig(Class<?> klass) throws InitializationError {
        AnnotationFinder annotationFinder = new AnnotationFinder(klass);
        ImportTestSession sessionConfig = annotationFinder.find(ImportTestSession.class);
        if (sessionConfig == null)
            throw new InitializationError(ImportTestSession.class.getSimpleName() + " annotation must be placed over your test class for this runner: "
                    + klass.getSimpleName());
        return sessionConfig;
    }
}
