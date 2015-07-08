package gov.va.cpe.test.junit4.runners;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import org.junit.runner.Runner;
import org.junit.runner.notification.RunNotifier;
import org.junit.runners.BlockJUnit4ClassRunner;
import org.junit.runners.Suite;
import org.junit.runners.model.FrameworkMethod;
import org.junit.runners.model.InitializationError;
import org.junit.runners.model.Statement;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static java.lang.String.format;

public class ImporterIntegrationTestRunner extends Suite {

    private VprExtract extractConfig;
    private ArrayList<Runner> runners = new ArrayList<Runner>();
    private String connectionUri;
    private String ptDfn;
    private PatientDemographics pt;
    private boolean ownsSession = true;

    private static String[] getPatientDfns(Class<?> testClass) throws InitializationError {
        AnnotationFinder annotationFinder = new AnnotationFinder(testClass);
        TestPatient ptConfig = annotationFinder.find(TestPatient.class);
        TestPatients ptsConfig = annotationFinder.find(TestPatients.class);
        if (ptConfig == null && ptsConfig == null)
            throw new InitializationError(TestPatient.class.getSimpleName() + " or " + TestPatients.class.getSimpleName() + " annotation must be placed over your test class for this runner: "
                    + testClass.getSimpleName());
        if (ptConfig != null)
            return new String[]{ptConfig.dfn()};
        else
            return ptsConfig.dfns();
    }

    private static String getConnectionUri(Class<?> testClass) throws InitializationError {
        ImportTestSession sessionConfig = getSessionConfig(testClass);
        return sessionConfig.connectionUri();
    }

    private static int getTimeout(Class<?> testClass) throws InitializationError {
        ImportTestSession sessionConfig = getSessionConfig(testClass);
        return sessionConfig.rpcTimeout();
    }

    private static ImportTestSession getSessionConfig(Class<?> testClass) throws InitializationError {
        AnnotationFinder annotationFinder = new AnnotationFinder(testClass);
        ImportTestSession sessionConfig = annotationFinder.find(ImportTestSession.class);
        if (sessionConfig == null)
            throw new InitializationError(ImportTestSession.class.getSimpleName() + " annotation must be placed over your test class for this runner: "
                    + testClass.getSimpleName());
        return sessionConfig;
    }

    private static VprExtract getExtractConfig(Class<?> testClass) throws InitializationError {
        VprExtract fragmentConfig = new AnnotationFinder(testClass).find(VprExtract.class);
        if (fragmentConfig == null)
            throw new InitializationError(VprExtract.class.getSimpleName() + " annotation must be placed over your test class for this runner: "
                    + testClass.getSimpleName());
        return fragmentConfig;
    }

    public ImporterIntegrationTestRunner(Class<?> testClass) throws Throwable {
        this(testClass, getConnectionUri(testClass), getTimeout(testClass), getPatientDfns(testClass));
    }

    public ImporterIntegrationTestRunner(Class<?> testClass, String connectionUri, int timeout, String[] dfns) throws Throwable {
        super(testClass, Collections.<Runner>emptyList());
        for (String dfn : dfns) {
            runners.add(new ImporterIntegrationTestRunner(testClass, connectionUri, timeout, dfn, null));
        }
    }

    public ImporterIntegrationTestRunner(Class<?> testClass, String connectionUri, int timeout, String dfn, PatientDemographics pt) throws Throwable {
        super(testClass, Collections.<Runner>emptyList());
        this.connectionUri = connectionUri;
        this.ptDfn = dfn;
        this.pt = pt;
        extractConfig = getExtractConfig(testClass);

        if (VistaSessionManager.getRpcTemplate() == null) {
            VistaSessionManager.startSession(timeout);
            ownsSession = true;
        }

        List<VistaDataChunk> chunks = fetchChunks();
        for (int i = 0; i < chunks.size(); i++)
            runners.add(new VistaDataChunkTestRunner(getTestClass().getJavaClass(), Collections.unmodifiableList(chunks), i));

    }

    private String getConnectionUri() {
        return connectionUri;
    }

    private String getDomain() {
        return extractConfig.domain();
    }

    final List<VistaDataChunk> fetchChunks() {
        if (pt == null)
            pt = ImportIntegrationTestUtils.fetchPatient(VistaSessionManager.getRpcTemplate(), getConnectionUri(), ptDfn);
        return ImportIntegrationTestUtils.fetchChunks(VistaSessionManager.getRpcTemplate(), getConnectionUri(), ptDfn, getDomain(), pt);
    }

    @Override
    protected List<Runner> getChildren() {
        return runners;
    }

    @Override
    public void run(RunNotifier notifier) {
        super.run(notifier);
        if (ownsSession) VistaSessionManager.stopSession();
    }

    @Override
    protected String getName() {
        return format("%s[ptDFN=%s]", super.getName(), ptDfn);
    }

    static class VistaDataChunkTestRunner extends BlockJUnit4ClassRunner {

        private List<VistaDataChunk> chunks;
        private int indexOfChunkUnderTest;

        public VistaDataChunkTestRunner(Class<?> testClass, List<VistaDataChunk> chunks, int chunkIndex) throws InitializationError {
            super(testClass);

            this.chunks = chunks;
            this.indexOfChunkUnderTest = chunkIndex;
        }

        @Override
        protected Object createTest() throws Exception {
            return getTestClass().getOnlyConstructor().newInstance(constructorParams());
        }

        private Object[] constructorParams() throws Exception {
            return new Object[]{getChunk()};
        }

        private VistaDataChunk getChunk() {
            return chunks.get(indexOfChunkUnderTest);
        }

        @Override
        protected String getName() {
            return String.format("%s|%s|%s[%d/%d]", getChunk().getLocalPatientId(), getChunk().getDomain(), super.getName(), indexOfChunkUnderTest + 1, chunks.size());
        }

        @Override
        protected String testName(final FrameworkMethod method) {
            return String.format("%s|%s|%s[%d/%d]", getChunk().getLocalPatientId(), getChunk().getDomain(), method.getName(), indexOfChunkUnderTest + 1, chunks.size());
        }

        @Override
        protected void validateConstructor(List<Throwable> errors) {
            validateOnlyOneConstructor(errors);
        }
    }

    @Override
    protected Statement classBlock(RunNotifier notifier) {
        return childrenInvoker(notifier);
    }
}
