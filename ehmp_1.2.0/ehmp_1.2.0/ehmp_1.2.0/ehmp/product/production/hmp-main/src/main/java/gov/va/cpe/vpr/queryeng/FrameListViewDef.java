package gov.va.cpe.vpr.queryeng;

import com.codahale.metrics.Snapshot;
import gov.va.cpe.vpr.frameeng.FrameRegistry;
import gov.va.cpe.vpr.frameeng.FrameStats;
import gov.va.cpe.vpr.frameeng.IFrame;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.Iterator;
import java.util.concurrent.TimeUnit;

@Component(value = "gov.va.cpe.vpr.queryeng.FrameListViewDef") 
@HMPAppInfo(value="gov.va.cpe.nonpatientviewdef", title="Frame List")
@Scope("prototype")
public class FrameListViewDef extends ViewDef {
	
	@Autowired
	public FrameListViewDef(final FrameRegistry registry) {
		declareParam(new ViewParam.SimpleViewParam("filter"));
		declareParam(new ViewParam.SortParam("type", false));
		
		// fetch the frames from the frame registry
        addQuery(new AbstractQuery("id", null) {
				@Override
				public void exec(RenderTask task) throws Exception {
					Iterator<IFrame> itr = registry.iterator();
					String filter = task.getParamStr("filter");
					while (itr.hasNext()) {
						IFrame frame = itr.next();
						
						// apply filter (if any)
						if (filter != null) {
							if (!frame.getID().toLowerCase().contains(filter.toLowerCase()) &&
								!frame.getName().toLowerCase().contains(filter.toLowerCase())) {
								continue; // no match, continue
							}
						}
						
						FrameStats stats = frame.getStats();
						Snapshot shot = stats.getSnapshot();
						
						task.add(Table.buildRow("id", frame.getID(), "name", frame.getName(), "class", frame.getClass(), "meta", frame.getMeta(),
								"resource", frame.getResource(), "type", frame.getAppInfo().get("type"),
								"runCount", stats.getCount(), 
								"runMin", TimeUnit.MICROSECONDS.toMillis(shot.getMin()), 
								"runMax", TimeUnit.MICROSECONDS.toMillis(shot.getMax()), 
								"runAvg", TimeUnit.MICROSECONDS.toMillis(Math.round(shot.getMean())),
								"runSum", stats.getRuntimeSum(),
								"selfLink", "/frame/info?uid=" + frame.getID()));
					}
					
					
				}
			}
        );
    }
}
