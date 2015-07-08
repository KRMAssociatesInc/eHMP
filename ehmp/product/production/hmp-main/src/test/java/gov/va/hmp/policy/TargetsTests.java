package gov.va.hmp.policy;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import gov.va.hmp.access.DecisionRequest;
import gov.va.hmp.access.ITarget;
import gov.va.hmp.access.MatchResult;
import gov.va.hmp.access.Targets;
import org.junit.Test;

import java.util.Map;

public class TargetsTests {
    @Test
    public void testTargetMatchValueOf() throws Exception {
        assertThat(MatchResult.valueOf(true).getValue(), is(MatchResult.Value.MATCH));
        assertThat(MatchResult.valueOf(false).getValue(), is(MatchResult.Value.NO_MATCH));
    }

    @Test
    public void testAnyTarget() throws Exception {
        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("testAction");

        assertThat(Targets.anyTarget().evaluate(mockRequest).getValue(), is(MatchResult.Value.MATCH));
    }

    @Test
    public void testNoneTarget() throws Exception {
        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("testAction");

        assertThat(Targets.noneTarget().evaluate(mockRequest).getValue(), is(MatchResult.Value.NO_MATCH));
    }

    @Test
    public void testDefaultTargetAllAnyMatchers() throws Exception {
        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("testAction");

        assertThat(Targets.with(Targets.anySubjects(Map.class), Targets.anyAction(String.class), Targets.anyResource(Map.class)).evaluate(mockRequest).getValue(), is(MatchResult.Value.MATCH));
    }

    @Test
    public void testDefaultTargetMissingMatchersResultsInIndeterminate() throws Exception {
        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("testAction");

        ITarget target = new Targets.DefaultTarget(null, null, null);
        assertThat(target.evaluate(mockRequest).getValue(), is(MatchResult.Value.INDETERMINATE));

        target = new Targets.DefaultTarget(Targets.anySubject(), null, null);
        assertThat(target.evaluate(mockRequest).getValue(), is(MatchResult.Value.INDETERMINATE));

        target = new Targets.DefaultTarget(null, Targets.anyAction(), null);
        assertThat(target.evaluate(mockRequest).getValue(), is(MatchResult.Value.INDETERMINATE));

        target = new Targets.DefaultTarget(null, null, Targets.anyResource());
        assertThat(target.evaluate(mockRequest).getValue(), is(MatchResult.Value.INDETERMINATE));
    }

    @Test
    public void testMatchActionString() throws Exception {
        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("testAction");

        ITarget target = Targets.with(Targets.anySubjects(Map.class), Targets.equalTo("foo"), Targets.anyResource(Map.class));
        assertThat(target.evaluate(mockRequest).getValue(), is(MatchResult.Value.NO_MATCH));
        target = Targets.with(Targets.anySubjects(Map.class), Targets.equalTo("testAction"), Targets.anyResource(Map.class));
        assertThat(target.evaluate(mockRequest).getValue(), is(MatchResult.Value.MATCH));
    }

    @Test
    public void testMatchActionMapEntry() throws Exception {
        DecisionRequest<Map, String, Map> mockRequest = MocksFactory.createMockDecisionRequest("foo", "bar");

        ITarget target = Targets.with(Targets.anySubjects(Map.class), Targets.hasEntry("foo", "baz"), Targets.anyResource(Map.class));
        assertThat(target.evaluate(mockRequest).getValue(), is(MatchResult.Value.NO_MATCH));
        target = Targets.with(Targets.anySubjects(Map.class), Targets.hasEntry("foo", "bar"), Targets.anyResource(Map.class));
        assertThat(target.evaluate(mockRequest).getValue(), is(MatchResult.Value.MATCH));
    }

    @Test
    public void testActionAndResourceMapEntries() throws Exception {
        DecisionRequest<Map, Map, Map> mockRequest = MocksFactory.createMockDecisionRequest("actionId", "7", "status", "unsigned");
        ITarget target = Targets.with(Targets.anySubjects(Map.class), Targets.hasEntry("actionId", "7"), Targets.hasEntry("status", "unsigned"));
        assertThat(target.evaluate(mockRequest).getValue(), is(MatchResult.Value.MATCH));
    }
}
