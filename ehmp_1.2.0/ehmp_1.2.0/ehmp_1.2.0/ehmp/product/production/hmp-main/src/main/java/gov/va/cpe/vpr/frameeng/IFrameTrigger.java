package gov.va.cpe.vpr.frameeng;

import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.Observation;
import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.VitalSign;
import gov.va.cpe.vpr.frameeng.FrameJob.FrameTask;
import gov.va.cpe.vpr.frameeng.IFrameEvent.InvokeEvent;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.pom.PatientEvent;
import gov.va.cpe.vpr.pom.PatientEvent.Change;
import gov.va.cpe.vpr.termeng.TermEng;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

/**
 * This class represents the base class/interface for all triggers.
 * It is also responsible for basic event/trigger matching (level 0), which just tests that the EventClass is compatible with the TriggerClass.
 * Further levels of checking are to be performed by sub-classes (via the doEval(...)) method.
 * 
 * First level sub-classes of this class tend to define the major execution modalities:
 * - Sync exec: Webservices, etc. specifially calling upon a frame
 * - Async exec: Data-driven (event-based)
 * - Call exec:  One frame delegating to another frame
 * - clock exec:  time-driven invokation
 * 
 * TODO: need to account for variables in triggers (canndidate drug classes, etc.), so probably need some sort of SPEL thing like ViewDefs
 * 
 * @author brian
 */
public abstract class IFrameTrigger<T extends IFrameEvent<?>>  {
	protected Class<T> eventClass;
	protected Class<?> sourceClass;

	protected IFrameTrigger(Class eventClass, Class<?> sourceClass) {
		this.eventClass = eventClass;
		this.sourceClass = sourceClass;
	}
	
	public Class<T> getEventClass() {
		return eventClass;
	}
	
	public Class<?> getSourceClass() {
		return sourceClass;
	}
	
	/**
	 * This is some ugly reflection kung-fu to infer which event class and event source class to trigger on
	 * based on the generics specified when creating an instance.
	 * 
	 * This is merely a convienence method so that if you want to trigger on meds, you can say:
	 * <pre>new IFrameTrigger<PatientEvent<Medication>()</pre>
	 * instead of:
	 * <pre>new IFrameTrigger(PatientEvent.class, Medication.class)</pre>
	 *
	 * NOTE: this isn't being used.  It wasn't very reliable and wasn't ultimately that helpful, 
	 * all IFrameTrigger sub-classes must expicitely declare their eventClass and eventClass source
	 */
	@SuppressWarnings("unchecked")
	protected void inferGenericEventClass() {
		// determine event class (if not specified)
		if (this.eventClass == null) {
			Type superType = getClass().getGenericSuperclass();
			if (superType instanceof ParameterizedType) {
				ParameterizedType genericClass = (ParameterizedType) superType;
				Type[] eventTypes = genericClass.getActualTypeArguments();
				if (eventTypes != null && eventTypes.length == 1) {
					if (eventTypes[0] instanceof ParameterizedType) {
						ParameterizedType ptype = (ParameterizedType) eventTypes[0];
						this.eventClass = (Class<T>) ptype.getRawType();
						
						// determine event source class (if not specified)
						Type[] eventSourceTypes = ptype.getActualTypeArguments();
						if (this.sourceClass == null && eventSourceTypes != null && eventSourceTypes.length == 1) {
							if (eventSourceTypes[0] instanceof Class) {
								this.sourceClass = (Class<?>) eventSourceTypes[0];
							}
						}
					} else if (eventTypes[0] instanceof Class) {
						this.eventClass = (Class<T>) eventTypes[0];
					}
				}
			} else if (superType instanceof Class && superType != IFrameTrigger.class) {
				this.eventClass = (Class<T>) superType;
			}
		}
	}
	
	public boolean isTriggerOf(FrameTask task) {
		return task.getFrameTrigger() == this;
	}
	
	public T getEventOf(FrameTask task) {
		if (isTriggerOf(task)) {
			return (T) task.getTriggerEvent();
		}
		return null;
	}
	
	public boolean eval(IFrameEvent<?> event) {
		Object src = event.getSource();
		if (eventClass == null || !eventClass.isAssignableFrom(event.getClass())) {
			return false;
		} else if (sourceClass != null && (src == null || !sourceClass.isAssignableFrom(event.getSourceClass()))) {
			return false;
		}
		
		return doEval((T) event);
	}
	
	protected abstract boolean doEval(T event);
	
	public static class PatientEventTrigger<T extends IPatientObject> extends IFrameTrigger<PatientEvent<T>> {
		protected List<PatientEvent.Type> excludeEventTypes;

		/**
		 * Default constructor, trigger on any PatientEvent of the specified type, but by default
		 * ignore RELOAD events.
		 * 
		 * @param objectType
		 */
		public PatientEventTrigger(Class<T> objectType) {
			this(objectType, Arrays.asList(PatientEvent.Type.RELOAD));
		}

		/**
		 * Trigger on any PatientEvent of the specified type, may use IPatientObject.class to include any type.
		 * 
		 * if eventType's is specified, then additionally filter on PatientEvent.Type as well (ie: created, updated, reload, etc)
		 * 
		 * @param objectType
		 * @param eventTypes (may be null)
		 */
		public PatientEventTrigger(Class<T> objectType, List<PatientEvent.Type> excludeEventTypes) {
			super(PatientEvent.class, objectType);
			this.excludeEventTypes = excludeEventTypes;
		}

		@Override
		protected boolean doEval(PatientEvent<T> event) {
			// if excludeEventTypes were specified, match against that.
			if (this.excludeEventTypes != null) {
				for (PatientEvent.Type type : this.excludeEventTypes) {
					if (type == event.getType()) {
						return false;
					}
				}
			}
			
			return true;
		}
	}
	
	public static class PatientObjectFieldChangedTrigger<T extends IPatientObject> extends PatientEventTrigger<T> {
		private List<String> fields;

		public PatientObjectFieldChangedTrigger(Class<T> objectType, String... fields) {
			this(objectType, Arrays.asList(fields));
		}

		
		public PatientObjectFieldChangedTrigger(Class<T> objectType, List<String> fields) {
			super(objectType);
			this.fields = fields;
		}

		@Override
		protected boolean doEval(PatientEvent<T> event) {
			// event field test
			if (fields == null || fields.isEmpty()) {
				return true;
			} else {
				for (Change change : event.getChanges()) {
					if (fields.contains(change.FIELD)) {
						return true;
					}
				}
			}

			return false;
		}
		
	}
	
	public static class NewVitalSignTrigger extends PatientEventTrigger<VitalSign> {
		private String codeOrName;

		public NewVitalSignTrigger(String codeOrName) {
			super(VitalSign.class);
			this.codeOrName = codeOrName;
		}
		
		@Override
		protected boolean doEval(PatientEvent<VitalSign> event) {
			VitalSign vs = event.getSource();
			String code = POMUtils.nvl(vs.getTypeCode());
			String name = POMUtils.nvl(vs.getTypeName());
			if (code.equals(this.codeOrName) || name.equals(this.codeOrName)) {
				return true;
			}
			
			return false;
		}
	}
	
	public static class LabResultTrigger extends PatientEventTrigger<Result> {
		private String testCodeOrName;
		
		public LabResultTrigger(String testCodeOrName) {
			super(Result.class);
			this.testCodeOrName = testCodeOrName;
		}

		@Override
		protected boolean doEval(PatientEvent<Result> event) {
			IPatientObject obj = event.getSource();
			if (obj == null || !obj.getClass().isAssignableFrom(Result.class)) {
				return false;
			}
			
			Result vs = (Result) obj;
			String code = POMUtils.nvl(vs.getTypeCode());
			String name = POMUtils.nvl(vs.getTypeName());
			if (code.equals(this.testCodeOrName) || name.equals(this.testCodeOrName)) {
				return true;
			}
			
			return false;
		}
		
	}
	
	public static class LabResultRangeTrigger extends LabResultTrigger {

		private Double gteValue;
		private Double lteValue;

		public LabResultRangeTrigger(String testCodeOrName, Double gteValue) {
			super(testCodeOrName);
			this.gteValue = gteValue;
		}
		
		/**
		 * Only trigger if the test result is numeric and between the lo and hi values specified.
		 */
		public LabResultRangeTrigger(String testCodeOrName, Double lo, Double hi) {
			super(testCodeOrName);
			this.gteValue = lo;
			this.lteValue = hi;
		}

		@Override
		protected boolean doEval(PatientEvent<Result> event) {
			if (!super.doEval(event)) {
				return false;
			}
				
			// check the value range
			Result vs = event.getSource();
			String result = vs.getResult();
			if (result == null) return false;
			
			try {
				int resultInt = Integer.parseInt(result);
				if (this.gteValue != null && resultInt < gteValue) {
					return false;
				} else if (this.lteValue != null && resultInt > lteValue) {
					return false;
				}
				return true;
			} catch (NumberFormatException ex) {
				// not an integer
			}
			
			try {
				float resultFloat = Float.parseFloat(result);
				if (this.gteValue != null && resultFloat < gteValue) {
					return false;
				} else if (this.lteValue != null && resultFloat > lteValue) {
					return false;
				}
				return true;
			} catch (NumberFormatException ex) {
				// not an float
			}
			
			return false;
		}
		
	}
	
	/**
	 * Intent is for CallTrigger to be used for directly executing a known frame, or for one 
	 * frame to call/delegate to another. They sharing context or pass a specific object to the target.
	 *  
	 * TODO:Another case might be if you have a full patient object, you could pass it into a frame with a call event?!?
	 * TODO: Make specifying frame option? Could invoke frames based on source object signature? 
	 * TODO: maybe "includeTrigger" might be a more meaningful/appropriate name?
	 */
	public static class CallTrigger<T> extends IFrameTrigger<CallEvent<T>> {
		private Frame frame;

		public CallTrigger(Frame frame) {
			super(CallEvent.class, null);
			assert frame != null;
			this.frame = frame;
		}
		
		public CallTrigger(Frame frame, Class<T> sourceClass) {
			super(CallEvent.class, sourceClass);
			assert frame != null;
			this.frame = frame;
		}

		@Override
		protected boolean doEval(CallEvent<T> event) {
			return this.frame == event.getFrame()
					|| (this.frame.getID().equals(event.getFrameID()));
		}
		
		@Override
		public String toString() {
			return super.toString() + "[Frame: " + this.frame.getID() + "]";
		}
	}
	
	/**
	 * Intent would be for an external invocation of this frame (web service call, etc).
	 * This is generally indiciative of sync calls to a specific frame, results would likely be serialized before returning to user.
	 * TODO: this would be the default trigger for ViewDefs
	 * @author brian
	 *
	 */
	public static class InvokeTrigger<T> extends IFrameTrigger<InvokeEvent<T>> {
		private String entryPoint;
		private Frame frame;
		
		public InvokeTrigger(Frame frame, Class<T> objectType, String entryPoint) {
			super(InvokeEvent.class, objectType);
			assert entryPoint != null;
			assert frame != null;
			this.frame = frame;
			this.entryPoint = entryPoint;
		}

		@Override
		protected boolean doEval(InvokeEvent<T> event) {
			String frameID = event.getFrameID();
			return this.entryPoint.equals(event.getEntryPoint())
					&& (frameID == null || this.frame.getID().equals(frameID));
		}
	}
	
	/**
	 * Trigger on a specific type of medication based on RxNorm code(s).
	 * TODO: vocab namespace translation?
	 */
	public static class MedOrderedTrigger extends PatientEventTrigger<Medication> {
		private List<String> rxncodes;
		
		public MedOrderedTrigger(List<String> rxncodes) {
			super(Medication.class, null);
			this.rxncodes = rxncodes;
		}


		public MedOrderedTrigger(String... rxncodes) {
			this(Arrays.asList(rxncodes));
		}

		@Override
		protected boolean doEval(PatientEvent<Medication> event) {
			if (this.rxncodes == null || this.rxncodes.isEmpty()) {
				return true;
			}
			Medication med = event.getSource();
			Set<String> codes = med.getRXNCodes();
			
			for (String rxn : this.rxncodes) {
				if (codes.contains(rxn)) {
					return true;
				}
			}
			
			return false;
		}
	}
	
	public static class NewObsTrigger extends PatientEventTrigger<Observation> {
		private static TermEng eng;
		private List<String> codes;

		public NewObsTrigger(String... codes) {
			super(Observation.class);
			this.codes = Arrays.asList(codes);
		}
		
		@Override
		protected boolean doEval(PatientEvent<Observation> event) {
			if (this.eng == null) {
				eng = TermEng.getInstance();
			}
			return eng.isa(event.getSource().getTypeCode(), codes);
		}
	}

	public static abstract class WrapperTrigger<T extends IFrameEvent<?>> extends IFrameTrigger<T> {
		private IFrameTrigger<?> trig;

		public WrapperTrigger(IFrameTrigger<?> trig) {
			super(trig.getEventClass(), trig.getSourceClass());
			this.trig = trig;
		}

		@Override
		protected boolean doEval(T event) {
			return trig.eval(event) && doSecondardyEval(event);
		}
		
		protected abstract boolean doSecondardyEval(T event);
	}
}