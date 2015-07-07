package gov.va.cpe.vpr.frameeng;

import static org.junit.Assert.*;

import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.PatientEvent;

import org.junit.Test;


@SuppressWarnings({"rawtypes","unchecked"})
public class IFrameTriggerTests {
	
	private static class TestFrameTrigger1 extends IFrameTrigger {
		protected TestFrameTrigger1(Class eventClass, Class eventSourceClass) {
			super(eventClass, eventSourceClass);
		}

		@Override
		protected boolean doEval(IFrameEvent event) {
			return false;
		}
	}
	
	private static class TestFrameTrigger2 extends IFrameTrigger<IFrameEvent<?>> {
		protected TestFrameTrigger2(Class<?> eventSourceClass) {
			super(IFrameEvent.class, eventSourceClass);
		}

		@Override
		protected boolean doEval(IFrameEvent event) {
			return false;
		}
	}
	
	private static class TestFrameTrigger3<T extends IPatientObject> extends IFrameTrigger<PatientEvent<T>> {
		protected TestFrameTrigger3(Class<?> eventSourceClass) {
			super(PatientEvent.class, eventSourceClass);
		}

		@Override
		protected boolean doEval(PatientEvent<T> event) {
			return false;
		}
	}

	
	@Test
	public void testGenericReflectionKungFu() {
		
		// test creating an inline class w/o any superclass
		IFrameTrigger trig = new IFrameTrigger(null, null) {
			protected boolean doEval(IFrameEvent event) {
				return false;
			}
		};			
		assertNull(trig.eventClass);
		assertNull(trig.sourceClass);
		assertSame(IFrameTrigger.class, trig.getClass().getGenericSuperclass());

		// test creating an non-inline class w/o any superclass
		trig = new TestFrameTrigger1(null, null);
		assertNull(trig.eventClass);
		assertNull(trig.sourceClass);
		assertSame(IFrameTrigger.class, trig.getClass().getGenericSuperclass());
		
		// test a in-line class w only a event class (missing half of the generic)
		trig = new IFrameTrigger<IFrameEvent<?>>(IFrameEvent.class, null) {
			protected boolean doEval(IFrameEvent<?> event) {
				return false;
			}
		};			
		assertSame(IFrameEvent.class, trig.eventClass);
		assertNull(trig.sourceClass);

		// inline class w/ event class and wildcard generic
		trig = new IFrameTrigger<IFrameEvent<?>>(IFrameEvent.class, null) {
			protected boolean doEval(IFrameEvent event) {
				return false;
			}
		};			
		
		assertSame(IFrameEvent.class, trig.eventClass);
		assertNull(trig.sourceClass);
		
		// non-inline class w/ event class and wildcard generic
		trig = new TestFrameTrigger2(null);
		assertSame(IFrameEvent.class, trig.eventClass);
		assertNull(trig.sourceClass);
		
		// fully specified, in-line trigger
		trig = new IFrameTrigger<PatientEvent<Medication>>(PatientEvent.class, Medication.class) { 
			@Override
			protected boolean doEval(PatientEvent<Medication> event) {
				return false;
			}
		};
		
		assertSame(PatientEvent.class, trig.eventClass);
		assertSame(Medication.class, trig.sourceClass);
		
		// fully specifed (via constructor which overrides generics)
		trig = new IFrameTrigger(PatientEvent.class, Medication.class) {
			protected boolean doEval(IFrameEvent event) {
				return false;
			}
		};
		assertSame(PatientEvent.class, trig.eventClass);
		assertSame(Medication.class, trig.sourceClass);
		
		trig = new TestFrameTrigger3<Medication>(Medication.class);
		assertSame(PatientEvent.class, trig.eventClass);
		assertSame(Medication.class, trig.sourceClass);

	}

}
