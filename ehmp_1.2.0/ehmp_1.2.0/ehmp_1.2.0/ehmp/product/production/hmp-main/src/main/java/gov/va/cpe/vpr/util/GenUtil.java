package gov.va.cpe.vpr.util;

import gov.va.cpe.vpr.pom.DraftablePOMObject;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.PointInTimeFormat;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GenUtil {
	public static String formatDate(Object inDt) {
		if(inDt==null) {
			return "";
		}
		PointInTime pit = new PointInTime(inDt.toString());
		return PointInTimeFormat.forPrecision(pit.getPrecision()).print(pit);
	}
	
	/**
	 * Calc BMI consistent with CPRS to two decimal places.
	 * @param lbs
	 * @param inches
	 * @return
	 */
	public static String calcBMI(BigDecimal lbs, BigDecimal inches) {
		BigDecimal bmi = BigDecimal.valueOf(lbs.doubleValue() / 2.2).divide(BigDecimal.valueOf(inches.doubleValue() * inches.doubleValue() / 1550.0031000062), 2, BigDecimal.ROUND_HALF_UP);
		return bmi.toString();
	}
	
	public static List<? extends DraftablePOMObject> draftFilter(List<? extends DraftablePOMObject> vals, boolean showDraft) {
		List<DraftablePOMObject> valsx = new ArrayList<DraftablePOMObject>();
		valsx.addAll(vals);
		
		Map<String, DraftablePOMObject> draftedVals = new HashMap<String, DraftablePOMObject>();
		Map<String, DraftablePOMObject> allVals = new HashMap<String, DraftablePOMObject>();
		
		for(DraftablePOMObject v: vals) {
			allVals.put(v.getUid(), v);
			if(v.getDraft()!=null && v.getDraft().get("sourceUid")!=null && !v.getDraft().get("sourceUid").equals("")) 
			{
				draftedVals.put(v.getUid(), v);
			}
		}
		
		// Figure draft vs. non-draft
		if(showDraft) {
			for(String key: draftedVals.keySet()) {
				Map<String, Object> draftVal = draftedVals.get(key).getDraft();
				if(draftVal!=null && draftVal.get("sourceUid")!=null) {
					DraftablePOMObject st = allVals.get(draftVal.get("sourceUid").toString());
					if(st!=null) {
						valsx.remove(st);
					}
				}
			}
		} else {
			for(String key: draftedVals.keySet()) {
				DraftablePOMObject dt = draftedVals.get(key);
				if(dt!=null) {
					valsx.remove(dt);
				}
			}
		}
		
		return valsx;
	}
}
