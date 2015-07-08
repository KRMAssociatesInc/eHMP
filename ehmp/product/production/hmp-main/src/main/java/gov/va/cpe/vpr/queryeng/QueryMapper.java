package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.frameeng.CallEvent;
import gov.va.cpe.vpr.frameeng.IFrame;
import gov.va.cpe.vpr.queryeng.Query.AbstractQuery;
import gov.va.cpe.vpr.sync.MessageDestinations;
import gov.va.cpe.vpr.queryeng.RenderTask.RowRenderSubTask;
import org.springframework.beans.factory.BeanFactoryUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.jms.core.SessionCallback;
import org.springframework.jms.support.destination.DestinationResolver;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;

import javax.jms.*;
import java.util.*;

/**
 * mapper strategies
 * 0) PrimaryQueryMapper: source becomes target row (optional copy==AppendMapper)
 * 1) AppendMapper: append rows to existing results (turns out to be the same as RIGHT OUTER JOIN)
 * 2) MergeQueryMapper: merge two table rows w/ (JOIN, UNION, etc)
 * 3) PerRowAppendMapper: execute query once per source row, append additional columns/fields to row (may only return 1 row)
 * 4) PerRowInvertMapper: execute query once per source row, row to column inversion
 * 5) PerRowSubTableMapper: execute query once per source row, results become nested table (nested ViewDefQuery)
 * 6) DefaultTableMapper: Backwards-compatible, if results are null/empty then PrimaryQueryMapper, else MergeQueryMapper; Honors QueryMode param
 * 
 * TODO: Should the QueryMapper hold the queries it maps instead of registering a mapper onto each query?
 * TODO: How to decide if a query should be run?
 * -- could the mapper evaluate the desired field list and not run if none of the fields exist?
 * -- requires that fields be registered in the query?
 * TODO: Do we need to support complex joins (more than one field)?
 * TODO: How do we declare dependencies in a multi-threaded environment (IE one query must finish before another can begin?)
 * @author brian
 */
public abstract class QueryMapper extends AbstractQuery {
	protected Query q;
	
	public QueryMapper(Query q) {
		super(q.getPK(), null);
		this.q = q;
	}
	
	protected QueryMapper(Query q, String pk) {
		super(pk, null);
		this.q = q;
	}

	public abstract static class QueryTransformer extends QueryMapper {
		public QueryTransformer(Query q) {
			super(q);
		}
		
		@Override
		public void exec(RenderTask task) throws Exception {
			this.q.exec(task);
			for (String pkval : task.getResults().getPKValues()) {
				Map<String, Object> row = new HashMap<String, Object>(task.getRow(pkval));
				row = mapRow(row, task);
				if (row == null) {
					task.remove(task.getRow(pkval));
				} else {
					task.getResults().clearRow(pkval);
					task.appendRow(pkval, row);
				}
			}
			
		}
		
		public abstract Map<String, Object> mapRow(Map<String, Object> row, RenderTask task);
	}
	
	public static class FieldPrefixTransformer extends QueryTransformer {
		private String prefix;
		public FieldPrefixTransformer(Query q, String prefix) {
			super(q);
			this.prefix = prefix;
		}

		@Override
		public Map<String, Object> mapRow(Map<String, Object> row, RenderTask task) {
			Iterator<String> itr = row.keySet().iterator();
			Map<String, Object> map = new HashMap<String, Object>();
			while (itr.hasNext()) {
				String key = itr.next();
				map.put(this.prefix + key, row.get(key));
				itr.remove();
			}
			row.putAll(map);
			return row;
		}
	}
	
	// append mapper is idential to RIGHT OUTER JOIN
	public static class AppendMapper extends JoinQueryMapper {
		public AppendMapper(Query q) {
			super(q);
		}
	}
	
	/**
	 * Similar to a SQL UNION query.  Simply appends the nested queries results into the parent query results (if any)
	 * @author brian
	 */
	public static class UnionQueryMapper extends QueryMapper {
		public UnionQueryMapper(Query q) {
			super(q);
		}

		@Override
		public void exec(RenderTask task) throws Exception {
			this.q.exec(task);
			
			if (task.getParentContext() instanceof RenderTask) {
				Table results = ((RenderTask) task.getParentContext()).getResults();
				results.addAll(task);
			}
		}
	}
	
	public static class JoinQueryMapper extends QueryMapper {
		public static enum JOIN_TYPE {LEFT_OUTER, RIGHT_OUTER, INTERSECT}
		
		private String fkey;
		private JOIN_TYPE joinType = JOIN_TYPE.LEFT_OUTER;

		public JoinQueryMapper(Query q) {
			super(q);
		}
		
		public JoinQueryMapper(Query q, String targetField) {
			super(q);
			this.fkey = targetField;
		}
		
		public JoinQueryMapper(Query q, String targetField, JOIN_TYPE join) {
			super(q);
			this.fkey = targetField;
			this.joinType = join;
		}
		
		@Override
		public void exec(RenderTask ctx) throws Exception {
			this.q.exec(ctx);
			
			if (joinType == JOIN_TYPE.RIGHT_OUTER) {
				rightOuterJoin(ctx);
			} else if (joinType == JOIN_TYPE.INTERSECT) {
				intersectJoin(ctx);
			} else {
				leftOuterJoin(ctx);
			}
		}
		
		protected void intersectJoin(RenderTask ctx) {
			// first loop through results, index the field values
			Set<Object> vals = new HashSet<Object>();
			for (int i=0; i < ctx.getResults().size(); i++) {
				vals.add(ctx.getResults().getCellIdx(i, this.fkey));
			}
			
			// then, remove any row in the parent results that is not in vals set
			RenderTask parentResults = (RenderTask) ctx.getParentContext();
			for (int i=0; i < parentResults.size(); i++) {
				Object val = parentResults.getCellIdx(i, this.fkey);
				if (!vals.contains(val)) {
					parentResults.getResults().remove(i--);
				}
			}
		}
		
		protected void leftOuterJoin(RenderTask ctx) {
			// this is LEFT OUTER JOIN
			RenderTask parentResults = (RenderTask) ctx.getParentContext();
			this.fkey = (this.fkey == null) ? parentResults.getPK() : this.fkey;
			for (int i=0; i < parentResults.size(); i++) {
				Map<String, Object> row = parentResults.getRowIdx(i);
				Object pkval = row.get(this.fkey);
				if (pkval == null) continue;
				
				// TODO: Error if no pkval? (invalid FK)
				Map<String, Object> mergerow = ctx.getRow(pkval.toString());
				if (mergerow == null) continue;
				parentResults.appendRow((String) row.get(parentResults.getPK()), mergerow);
			}
		}
		
		protected void rightOuterJoin(RenderTask ctx) {
			// this is RIGHT OUTER JOIN
			RenderTask parentResults = (RenderTask) ctx.getParentContext();
			this.fkey = (this.fkey == null) ? parentResults.getPK() : this.fkey;
			for (int i=0; i < ctx.size(); i++) {
				Object pkval = ctx.getCellIdx(i, this.fkey);
				
				Map<String, Object> row = parentResults.getRow(pkval.toString());
				if (row != null) {
					row.putAll(ctx.getRowIdx(i));
				} else {
					parentResults.add(ctx.getRowIdx(i));
				}
			}
		}
	}

	public static class PerRowAppendMapper extends QueryMapper {
		public PerRowAppendMapper(Query q) {
			super(q);
		}
		
		protected void mapRow(RowRenderSubTask ctx) throws Exception {
			if (ctx.size() == 1) {
				Map<String, Object> row = ctx.getRowIdx(0);
				ctx.getParentContext().getResults().appendRowIdx(ctx.getRowIdx(), row);
			} else if (ctx.size() > 1) {
				throw new UnsupportedOperationException("PerRowAppendMapper can only handle queries that return 1 row for now.");
			}
		}
		
		@Override
		public void exec(RenderTask ctx) throws Exception {
			// if a row index was specified, just run that row
			if (ctx instanceof RowRenderSubTask) {
				this.q.exec(ctx);
				mapRow((RowRenderSubTask) ctx);
				return;
			}
			
			// otherwise, loop through parent results, create a sub-task to execute for each row
			RenderTask parentctx = (RenderTask) ctx.getParentContext();
			for (int i=0; i < parentctx.size(); i++) {
				RowRenderSubTask subtask = ctx.addSubTask(new RowRenderSubTask(parentctx, this, i)); 
			}
		}
	}

	public static class PerRowSubTableMapper extends PerRowAppendMapper {
		private String field;

		public PerRowSubTableMapper(String field, Query q) {
			super(q);
			this.field = field;
		}
		
		protected void mapRow(RowRenderSubTask ctx) throws Exception {
			ctx.getParentContext().getResults().appendRowIdx(ctx.getRowIdx(), Table.buildRow(this.field, ctx));
		}
	}
	
	public static class SpringViewRenderQuery extends QueryMapper {
		private List<ViewResolver> resolvers = null;
		private String viewName;
		
		public SpringViewRenderQuery(String field, String viewName, Query q) {
			super(q, field);
			this.viewName = viewName;
		}

		@Override
		public void exec(RenderTask task) throws Exception {
			if (resolvers == null) {
				ApplicationContext ctx = task.getResource(ApplicationContext.class);
				Map<String, ViewResolver> beans = BeanFactoryUtils.beansOfTypeIncludingAncestors(ctx, ViewResolver.class, true, false);
				resolvers = new ArrayList<ViewResolver>(beans.values());
			}
			
			// create a nested task and run it
//			RenderTask subtask = new RenderTask(task, this.q);
			this.q.exec(task);
			
			// resolve the view (using ViewResolvers which only work in the DispacherServlet thread)
			View view = resolveView(this.viewName);
			if (view == null) {
				throw new IllegalArgumentException("Unable to resolve view name: " + this.viewName);
			}

			// setup the model 
			Map<String,Object> model = new HashMap<String,Object>();
			model.put("view", viewName);
			model.put("viewdef", task.getViewDef());
			model.put("params", task.getParams());
			model.put("task", task);
			
			// Setup a request/response mechanism to render the view
            MockHttpServletRequest httpReq = new MockHttpServletRequest();
			MockHttpServletResponse httpResp = new MockHttpServletResponse();
			view.render(model, httpReq, httpResp);

			// write the results to the task
			String result = httpResp.getContentAsString().trim();
			if (result != null && !result.isEmpty()) task.add(Table.buildRow(getPK(), result));
		}
		
		
		private View resolveView(String viewName) throws Exception {
			for (ViewResolver vr : resolvers) {
				View v = vr.resolveViewName(viewName, LocaleContextHolder.getLocale());
				if (v != null) {
					return v;
				}
			}
			return null;
		}
	}
	
	/**
	 * Similar to UINotifyQueryMapper, but instead of executing the viewdef and queing the results,
	 * it only pushes the call event so the ViewDef is executed later. 
	 */
	public static class UIListenQueryMapper extends QueryMapper {
		private String field;
		private JmsTemplate tpl;
		private Destination VPRworkQ;
		private Destination UInotifyQ;

		public UIListenQueryMapper(String field, Query q) {
			super(q);
			this.field = field;
		}

		@Override
		public void exec(RenderTask ctx) throws Exception {
			// initalize JMS (first time)
			if (tpl == null) {
				tpl = ctx.getResource(JmsTemplate.class);
				tpl.execute(new SessionCallback<Object>() {
					@Override
					public Object doInJms(Session session) throws JMSException {
						DestinationResolver destResolve = tpl.getDestinationResolver();
						VPRworkQ = destResolve.resolveDestinationName(session, MessageDestinations.IMPORT_QUEUE, false);
						UInotifyQ = destResolve.resolveDestinationName(session, MessageDestinations.UI_NOTIFY_TOPIC, false);
						return null;
					}
				});
			}
			
			// otherwise, loop through parent results, create a sub-task to execute for each row
			RenderTask parentctx = (RenderTask) ctx.getParentContext();
			for (int i=0; i < parentctx.size(); i++) {
				
				// generate+return the placeholder UUID value right away 
				final String uuid = UUID.randomUUID().toString();
				parentctx.getResults().appendRowIdx(i, Table.buildRow(this.field, uuid));
				
				// push call event onto UI.notify queue
				Map<String, Object> params = ctx.getParams();
				params.put("ui.notify.uuid", uuid);
				final String pid = ctx.getParamStr("pid");
				final CallEvent<IFrame> evt = new CallEvent<IFrame>(ctx.getFrame().getID(), ctx.getFrame(), params);
				tpl.send(this.VPRworkQ, new MessageCreator() {
					@Override
					public Message createMessage(Session session) throws JMSException {
						ObjectMessage msg = session.createObjectMessage(evt);
						msg.setStringProperty("type", "callevent");
						msg.setStringProperty("pid", pid);
						msg.setStringProperty("uuid", uuid);
						msg.setJMSPriority(7); // 0-9, (0-4 are gredations of normal, 5-9 gredations of expedited priority)
						msg.setJMSReplyTo(UInotifyQ);
						return msg;
					}
				});
			}
		}
	}

    public static class UINotifyQueryMapper extends QueryMapper {
		private String field;
		
		public UINotifyQueryMapper(String field, Query q) {
			super(q);
			this.field = field;
		}
		
		protected void mapRow(final RowRenderSubTask ctx) {
			final JmsTemplate tpl = ctx.getResource(JmsTemplate.class);
			final ViewDef def = ctx.getViewDef();
			final String pid = ctx.getParamStr("pid");
			final String uuid = ctx.getParamStr("ui.notify.uuid");
			
			tpl.send(MessageDestinations.UI_NOTIFY_TOPIC, new MessageCreator() {
				@Override
				public Message createMessage(Session session) throws JMSException {
					Message msg = session.createObjectMessage(ctx.getResults());
					msg.setStringProperty("type", "rendertask");
                    msg.setStringProperty("eventName", "viewdefUpdate");
					msg.setStringProperty("viewdef.id", def.getID());
					msg.setStringProperty("viewdef.name", def.getName());
					msg.setStringProperty("pid", pid);
					msg.setStringProperty("uid", uuid);
					msg.setJMSPriority(7); // 0-9, (0-4 are gredations of normal, 5-9 gredations of expedited priority)
					return msg;
				}
			});

		}
		
		@Override
		public void exec(RenderTask ctx) throws Exception {
			// if a row index was specified, just run that row
			if (ctx instanceof RowRenderSubTask) {
				this.q.exec(ctx);
				mapRow((RowRenderSubTask) ctx);
				return;
			}
			
			// otherwise, loop through parent results, create a sub-task to execute for each row
			RenderTask parentctx = (RenderTask) ctx.getParentContext();
			for (int i=0; i < parentctx.size(); i++) {
				RenderTask subtask = new RowRenderSubTask(parentctx, this, i);
				String uuid = UUID.randomUUID().toString();
				subtask.setParam("ui.notify.uuid", uuid);
				
				// return the placeholder UUID value right away, execute the subtask w/o adding it to the parent. 
				parentctx.getResults().appendRowIdx(i, Table.buildRow(this.field, uuid));
				subtask.exec();
			}
		}
    }    
}


