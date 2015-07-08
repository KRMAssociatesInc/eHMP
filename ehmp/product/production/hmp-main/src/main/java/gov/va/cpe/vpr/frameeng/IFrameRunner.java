package gov.va.cpe.vpr.frameeng;

import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.PatientEvent;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IFrameRunner {
    FrameJob exec(IFrameEvent<?>... events) throws Frame.FrameInitException, Frame.FrameExecException;

    FrameJob exec(List<IFrameEvent<?>> events) throws Frame.FrameInitException, Frame.FrameExecException;

    FrameJob.FrameTask exec(IFrame frame, Map<String, Object> params) throws Frame.FrameInitException, Frame.FrameExecException;

    FrameJob.FrameTask exec(IFrame frame) throws Frame.FrameInitException, Frame.FrameExecException;

    FrameJob.FrameTask exec(String frameid, Map<String, Object> params) throws Frame.FrameInitException, Frame.FrameExecException;

    void pushEvents(List<PatientEvent<IPatientObject>> events);

    void pushEvent(PatientEvent<?> evt);
    
    void close() throws IOException;
}
