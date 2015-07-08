package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.queryeng.ViewDef.CachedViewDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer.QueryFieldTransformer.NumberParserTransformer;
import gov.va.cpe.vpr.queryeng.query.QueryDefTransformer.QueryFieldTransformer.ReplaceTransformer;
import gov.va.cpe.vpr.util.SVGBuilder;
import gov.va.cpe.vpr.util.SVGBuilder.SVGPath;
import gov.va.hmp.healthtime.PointInTime;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
@Component(value="gov.va.cpe.vpr.queryeng.LabTrendViewDef2")
@Scope("prototype")
public class LabTrendViewDef2 extends CachedViewDef {
	
	public LabTrendViewDef2() throws IOException {
		// declare the view parameters
		declareParam(new ViewParam.PatientIDParam());
		declareParam(new ViewParam.ViewInfoParam(this, "Lab Trend2"));
		declareParam(new ViewParam.DateRangeParam("range", "-10Y"));
		declareParam(new ViewParam.PerRowParams()); // injects row.* param values (including row.typeCode)
		declareParam(new ViewParam.RequiredParam("filter_typeCodes"));
		declareParam(new ViewParam.SimpleViewParam("filter_typeCodes"));
		declareParam(new ViewParam.SimpleViewParam("row.typeCode"));
		declareParam(new ViewParam.AsArrayListParam("filter_typeCodesAry", "filter_typeCodes", "row.typeCode"));
		
		QueryDef qry = new QueryDef();
		// TODO: only fetch the necessary fields from JDS
		qry.usingIndex("lab-lnc-code", ":filter_typeCodesAry");
		qry.where("observed").between(":range.startHL7", ":range.endHL7");
		qry.fields().include("uid", "observed", "result", "units", "interpretationCode", "low", "high");
		qry.fields().transform(new NumberParserTransformer("result", true));
		qry.fields().transform(new NumberParserTransformer("low", true));
		qry.fields().transform(new NumberParserTransformer("high", true));
		qry.fields().transform(new ReplaceTransformer("interpretationCode", "urn:hl7:observation-interpretation:",""));
		Query q1 = addQuery(new JDSQuery("observed", qry)); //, "vpr/{pid}/index/lab-lnc-code?range={filter_typeCodes}&filter=between(observed,\"{range.startHL7}\",\"{range.endHL7}\")")
		addColumn(new ColDef.HealthTimeColDef(q1, "observed"));
	}
	
	/**
	 * TODO: if there are >1 measurement per week (for outpt), then
	 * merge them into a single value, using a candlestick-ish mechanism
	 */
	public static class SVGSparklineRender {
		private Float yMin = null, yMax = null;
		private Float refRangeLo = null, refRangeHi = null;
		public String buildSVG(RenderTask task) {
			int yearsBack = 3;
			List<Float> vals = new ArrayList<Float>(task.size());
			List<PointInTime> obs = new ArrayList<PointInTime>(task.size());
			
			// scan for the min/max vals and changes in reference range
			for (Map<String, Object> row : task) {
				PointInTime observed = new PointInTime(row.get("observed").toString());
				Number result = (Number) row.get("result");
				Number lo = (Number) row.get("low");
				Number hi = (Number) row.get("high");
				
				if (result == null || observed == null) continue; // TODO: what to do with non-numeric results
				vals.add(result.floatValue());
				obs.add(observed);
				
				// keep track of min/max values
				if (yMin == null || result.floatValue() < yMin) {
					yMin = result.floatValue();
				}
				if (yMax == null || result.floatValue() > yMax) {
					yMax = result.floatValue();
				}
				
				// keep track of ref range
				// TODO: what about shifts in reference range?
				if (lo != null && refRangeLo == null) {
					refRangeLo = lo.floatValue();
				}
				if (hi != null && refRangeHi == null) {
					refRangeHi = hi.floatValue();
				}
			}
			
			// adjust yMin, yMax with ref range (if it exists)
			if (refRangeLo != null) {
				yMin = Math.min(yMin, refRangeLo.floatValue());
			}
			if (refRangeHi != null) {
				yMax = Math.max(yMax, refRangeHi.floatValue());
			}
			
			// If there is no data, construct an arbitrary yMin, yMax so we get an empty graph
			if (yMin == null) yMin = 0f;
			if (yMax == null) yMax = 10f;
			
			PointInTime to = PointInTime.today();
			PointInTime from = to.subtractYears(yearsBack);
			SVGBuilder svg = new SVGBuilder(from, to, (yearsBack * 365), 30, 200, yMin, yMax);
			svg.drawYearLines();
			
			// Draw ref range
			if (refRangeLo != null && refRangeHi != null) {
				svg.rect(from, to, refRangeHi.floatValue(), refRangeLo.floatValue())
					.attr("title", refRangeLo + "-" + refRangeHi + ";" + yMin + "-" + yMax)
					.attr("class", "ref");
			}
				
			// plot the lines and draw circles (if any)
			if (obs.size() > 0) {
				float val = vals.get(0);
				String cls = (!isAbnormal(val)) ? "point" : "point-abnormal";
				SVGPath path = svg.path(obs.get(0), val);
				svg.circ(obs.get(0), val, 3).attr("class", cls);
				for (int i=1; i < obs.size(); i++) {
					val = vals.get(i);
					cls = (!isAbnormal(val)) ? "point" : "point-abnormal";
					path.lineTo(obs.get(i), val);
					svg.circ(obs.get(i), val, 3).attr("class", cls).attr("title", val);
					
				}
			}
			
			
			return svg.toString(); 
		}
		
		private boolean isAbnormal(float val) {
			if (refRangeLo == null || refRangeHi == null) return false;
			return (val < refRangeLo.floatValue() || val > refRangeHi.floatValue());
		}
	}
	
	/* TODO: Make SVGSparklineRender a view?
	public static class SVGRendererView extends AbstractView {
		@Override
		protected void renderMergedOutputModel(Map<String, Object> model,
				HttpServletRequest request, HttpServletResponse response)
				throws Exception {
			Resource resource = (Resource) model.get(modelKey);
			resourceConverter.write(resource, null,
					new ServletServerHttpResponse(response));
		}
	}
	*/
}
