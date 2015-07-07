package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.queryeng.query.JDSQuery;

import java.util.List;

public abstract class CohortFilterQuery extends QueryMapper {
	
	public CohortFilterQuery(Query q) {
		super(q);
	}

	/**
	 * The simpliest Cohort to start with, just a JDS query for all patients with an alert.
	 * @author brian
	 */
	public static class AlertPatientCohort extends JoinQueryMapper {
		public AlertPatientCohort() {
			super(new JDSQuery("uid", "/vpr/all/index/alert"), "pid", JOIN_TYPE.INTERSECT);
		}
	}
	
	public static class GenericCohortFilter extends JoinQueryMapper {

		private String pidField;

		public GenericCohortFilter(String pidField, Query q) {
			super(q, pidField);
			this.pidField = pidField;
		}
		
		@Override
		public void exec(RenderTask task) throws Exception {
			// get the pid list
			RenderTask parent = ((RenderTask) task.getParentContext());
			List<Object> values = parent.getResults().getFieldValues(this.pidField);
			
			// build the JDS query, Task and execute it
			RenderTask task2 = new RenderTask(parent, this.q);
			task2.setParam("pid", values);
			this.q.exec(task2);
			
			// now perform the intersection join
			this.intersectJoin(task2);
		}
	}
}
