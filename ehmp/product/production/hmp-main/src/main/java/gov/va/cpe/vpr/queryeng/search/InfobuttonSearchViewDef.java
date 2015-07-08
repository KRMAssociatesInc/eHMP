package gov.va.cpe.vpr.queryeng.search;

import gov.va.cpe.vpr.queryeng.ViewDef;
import gov.va.cpe.vpr.queryeng.ViewParam.RequiredParam;
import gov.va.cpe.vpr.queryeng.RenderTask;
import gov.va.cpe.vpr.ws.link.OpenInfoButtonLinkGenerator;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component(value = "gov.va.cpe.vpr.queryeng.search.InfobuttonSearchViewDef")
@Scope("prototype")
public class InfobuttonSearchViewDef extends ViewDef {
	public InfobuttonSearchViewDef() {
		declareParam(new RequiredParam("url"));
		
		// first run lucene query (roughly same query as DocSearchFrame)
		addQuery(new AbstractQuery("href", "#{getParamStr('url')}") {
			@Override
			public void exec(RenderTask task) throws Exception {
				String url = evalQueryString(task, getQueryString());
				task.addAll(OpenInfoButtonLinkGenerator.fetchInfobuttonURL(url,
						1000, 5000, null));
			}
		});
	}
}
