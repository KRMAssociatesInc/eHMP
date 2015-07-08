package gov.va.cpe.vpr.queryeng;

import gov.va.cpe.vpr.Medication;
import gov.va.cpe.vpr.queryeng.ColDef.ActionColDef;
import gov.va.cpe.vpr.queryeng.query.JDSQuery;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.ws.link.OpenInfoButtonLinkGenerator;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Component(value = "gov.va.cpe.vpr.queryeng.MedsTabViewDef")
@Scope("prototype")
public class MedsTabViewDef extends ViewDef {
    @Autowired
    public MedsTabViewDef(OpenInfoButtonLinkGenerator linkgen, Environment env) {
    	this.domainClasses.add(Medication.class.getSimpleName());
        // declare the view parameters
        declareParam(new ViewParam.ViewInfoParam(this, "Medications"));
        declareParam(new ViewParam.PatientIDParam());
        declareParam(new ViewParam.DateRangeParam("range", "2000..NOW"));
        declareParam(new ViewParam.AsArrayListParam("filter.typeCodes"));
        declareParam(new ViewParam.AsArrayListParam("filter_kind"));
        declareParam(new ViewParam.SimpleViewParam("filter_qname"));
        declareParam(new ViewParam.ENUMParam("filter_status", null, "ACTIVE", "PENDING", "DISCONTINUED", "EXPIRED").addMeta("multiple", true).addMeta("title", "Status filter"));
        declareParam(new ViewParam.QuickFilterParam("qfilter_status", "", "ACTIVE", "PENDING", "DISCONTINUED", "EXPIRED"));
        declareParam(new ViewParam.AsArrayListParam("filter_status", "filter_status", "qfilter_status"));
        declareParam(new ViewParam.AsArrayListParam("filter_class_code"));
        
        declareParam(new ViewParam.SortParam("overallStart", false));

        // list of fields that are not displayable as columns and a default user column set/order
        String displayCols = "rowactions,name,dose,doseInfo,vaStatus,renewBy,overallStart,overallStop,facility";
        String requireCols = "rowactions,facility,overallStart,overallStop";
        String hideCols = "uid,pid,selfLink,history,doseChange,lastDoseChange,lastDose,ingredientName";
        String sortCols = ""; // At least until we are able to figure out some sort of back-end solution for the data source, paging, and sorting/grouping on complex stuff like this view def.
        String groupCols = "vaStatus,medStatusName,ingredientName,drugClassName";
        declareParam(new ViewParam.ColumnsParam(this, displayCols, requireCols, hideCols, sortCols, groupCols));

        QueryDef qry = new QueryDef("med-qualified-name");
        qry.where("vaStatus").in("?:filter_status");
        qry.where("vaType").in("?:filter_kind");
        qry.where("qualifiedName").is("?:filter_qname");
		qry.where("products[].drugClassCode").in("?:filter_class_code");

		Query q1 = new JDSQuery("uid", qry) {
            @Override
            public void exec(RenderTask task) throws Exception {
                super.exec(task);
                ArrayList<Map<String, Object>> tmp = new ArrayList<Map<String, Object>>();
//                Map<String, Object> doseMap = new HashMap<String, Object>();
                Map<String, ArrayList> medNameList = new HashMap<String, ArrayList>();
                tmp.addAll(task);
                task.removeAll(tmp);

                String medName;
                String uid;
                for (int i = 0; i < tmp.size(); i++) {
                    Map<String, Object> row = tmp.get(i);
                    String vaType = row.get("vaType").toString();
                    if (vaType.equals("V")) continue;

                    Map<String, Object> rowData = new HashMap<String, Object>();
                    medName = row.get("qualifiedName").toString();


                    uid = row.get("uid").toString();
                    rowData.put("name", medName);
                    ArrayList<Map<String, Object>> uidsList = new ArrayList<Map<String, Object>>();
                    ArrayList<Map<String, Object>> doseList = new ArrayList<Map<String, Object>>();
                    if (medNameList.containsKey(medName)) {
                        uidsList = medNameList.get(medName);


                    }
                    rowData.put("uid", uid);
                    rowData.put("vaStatus", row.get("vaStatus").toString());
                    rowData.put("facility", row.get("facilityName").toString());
                    rowData.put("vaType", vaType);
                    rowData.put("kind", row.get("kind").toString());
                    rowData.put("medStatusName", row.get("medStatusName").toString());
                    String ingName = getIngredientName(row);
                    rowData.put("ingredientName", ingName);
                    PointInTime start = null;
                    PointInTime stop = null;
                    if (row.containsKey("overallStart"))
                        start = HL7DateTimeFormat.parse(row.get("overallStart").toString());
                    else start = HL7DateTimeFormat.parse("0000");
                    rowData.put("overallStart", start);
                    if (row.containsKey("overallStop"))
                        stop = HL7DateTimeFormat.parse(row.get("overallStop").toString());
                    else stop = HL7DateTimeFormat.parse("0000");
                    rowData.put("overallStop", stop);
                    ArrayList<Map<String, Object>> dosageList = new ArrayList<Map<String, Object>>();

                    if (!row.containsKey("dosages")) continue;
                    dosageList = (ArrayList) row.get("dosages");
                    buildDoseMap(dosageList, rowData);
//                    rowData.put("doseList", doseMap);
                    if (row.containsKey("lastFilled")) rowData.put("lastFilled",row.get("lastFilled").toString());
                    ArrayList<Map<String, Object>> ordersList = new ArrayList<Map<String, Object>>();
                    if (row.containsKey("orders")) ordersList = (ArrayList) row.get("orders");
                    if (ordersList.size() > 0) {
                        for (int o = 0; o < ordersList.size(); o++) {
                            Map<String, Object> order = ordersList.get(o);
                            String daysSupply = "";
                            String fillsRemaining = "";
                            String quantityOrdered = "";
                            if (order.containsKey("daysSupply")) daysSupply = order.get("daysSupply").toString();
                            if (order.containsKey("fillsRemaining"))
                                fillsRemaining = order.get("fillsRemaining").toString();
                            if (order.containsKey("quantityOrdered"))
                                quantityOrdered = order.get("quantityOrdered").toString();
                            rowData.put("supply", daysSupply);
                            rowData.put("fills", fillsRemaining);
                            rowData.put("quantity", quantityOrdered);
                            if (order.containsKey("successor")) rowData.put("successor",order.get("successor").toString());
                            else rowData.put("successor",null);
                            if (order.containsKey("predecessor")) rowData.put("predecessor",order.get("predecessor").toString());
                            else rowData.put("predecessor",null);
                        }
                    }

                    uidsList.add(rowData);
                    medNameList.put(medName, uidsList);

                }

                Iterator<String> it = medNameList.keySet().iterator();

                while (it.hasNext()) {
                    String name = it.next();
                    ArrayList<Map<String, Object>> valueList = new ArrayList<Map<String, Object>>();
                    if (medNameList.containsKey(name)) {
                        valueList = medNameList.get(name);
                        Map<String, Object> finalMedData = new HashMap<String, Object>();
                        finalMedData = buildMedData(valueList);
                        task.add(finalMedData);
                    }
                }
            }

            private String getIngredientName(Map<String,Object> data) {
            	String result = "";
            	ArrayList<Map<String, Object>> productsList = new ArrayList<Map<String, Object>>();
            	if (!data.containsKey("products")) return result;
            	productsList = (ArrayList) data.get("products");
            	if(productsList!=null && productsList.size()>0) {
            		Map<String, Object> product = new HashMap<String, Object>();
            		product.putAll(productsList.get(0));
            		if (product.containsKey("ingredientName")) result = product.get("ingredientName").toString();
            	}
            	return result;
            }

            private PointInTime determineRenewBy(Map<String,Object> data) {
                Integer fills;
                Integer supply;
                Integer days;
                PointInTime result;
                PointInTime lastFilled;
                String tmp =data.get("vaStatus").toString();
                if (!tmp.equals("ACTIVE")) return null;
                if (!data.containsKey("supply")) return null;
                if (!data.containsKey("fills")) return null;
                if (!data.containsKey("lastFilled")) return null;
                supply = Integer.parseInt(data.get("supply").toString());
                fills = Integer.parseInt(data.get("fills").toString());
                tmp = data.get("lastFilled").toString();
                lastFilled = HL7DateTimeFormat.parse(tmp);
                if (fills >0) days = (supply * fills);
                else days = supply;
                result = lastFilled.addDays(days);
                return result;
            }
            private Map<String, Object> buildMedData(ArrayList<Map<String, Object>> dataList) {
                Map<String, Object> value = new HashMap<String, Object>();
                ArrayList<Map<String, Object>> history = new ArrayList<Map<String, Object>>();
                ArrayList<Map<String, Object>> doseList = new ArrayList<Map<String, Object>>();
                boolean lastStatusIsPending = false;
                for (int i = 0; i < dataList.size(); i++) {
                    Map<String, Object> hist = new HashMap<String, Object>();
                    Map<String, Object> doseMap = new HashMap<String, Object>();
                    ArrayList<Map<String, Object>> doseTemp = new ArrayList<Map<String, Object>>();
                    if (i == 0) {
                        value.putAll(dataList.get(i));
                        hist=buildHistMap(value);
                        history.add(hist);
                        if (value.containsKey("doseList")) {
                            doseTemp = (ArrayList) value.get("doseList");
                            doseList.addAll(doseTemp);
                        }
                    } else {
                        Map<String, Object> tmp = new HashMap<String, Object>();
                        tmp.putAll(dataList.get(i));
                        if ((value != null) && (tmp != null)) {
                            if (tmp.containsKey("doseList")) {
                                doseTemp = (ArrayList) tmp.get("doseList");
                                doseList.addAll(doseTemp);
                            }
                            String status = tmp.get("vaStatus").toString();
                            if (status.equals("PENDING")) {
                                lastStatusIsPending = true;
                            } else {
                                lastStatusIsPending = false;
                                compareDoseMap(value, tmp, false);
                            }


                            hist=buildHistMap(tmp);
                            history.add(hist);
                        }

                    }

                }
                if (doseList.size()>0) value.put("doseList",doseList);
                if ((lastStatusIsPending) && (history.size() > 1)) {

                    value.put("vaStatus", "PENDING");
                    Map<String, Object> tmp = new HashMap<String, Object>();
                    tmp.putAll(history.get(history.size() -1 ));
                    compareDoseMap(value, tmp, true);
                    value.put("overallStop", null);
//                    Collections.reverse(history);
                    ArrayList<Map<String, Object>> temp = new ArrayList<Map<String, Object>>();
                        temp.addAll(history);
                        history.clear();
                        history.add(temp.get(temp.size()-1));
                        for (int i = 0; i < temp.size()-1; i ++) {
                            history.add(temp.get(i));
                        }

                } else {
                    if (value.get("overallStart").toString().equals("0000")) value.put("overallStart", null);
                    if (value.get("overallStop").toString().equals("0000")) value.put("overallStop", null);
                }
                value.put("history",history);
                PointInTime renewBy;
                renewBy = determineRenewBy(value);
                value.put("renewBy", renewBy);
//                value.put("doseList", value.get("doseList"));
                return value;
            }

            private Map<String, Object> buildHistMap(Map<String, Object> data) {
                Map<String, Object> hist = new HashMap<String, Object>();
                String tmp = data.get("overallStart").toString();
                if (tmp.equals("0000")) hist.put("overallStart", null);
                else hist.put("overallStart",tmp);
                tmp = data.get("overallStop").toString();
                if (tmp.equals("0000")) hist.put("overallStop", null);
                else hist.put("overallStop",tmp);
                hist.put("uid",data.get("uid").toString());
                hist.put("dose",data.get("dose")==null?"":data.get("dose").toString());
                hist.put("vaStatus",data.get("vaStatus").toString());
                return hist;
            }

            private void buildDoseMap(ArrayList dosageList, Map<String, Object> data) {
//                Map<String, Object> doseValues = new HashMap<String, Object>();
                ArrayList<Map<String, Object>> doseValues = new ArrayList<Map<String, Object>>();
                String relStart = "";
                String relStop = "";
                String uid = "";
                for (int d = 0; d < dosageList.size(); d++) {
                    Map<String, Object> doseTemp = new HashMap<String, Object>();
                    String medDose = "";
                    String start = "0000";
                    String stop = "0000";

                    Map<String, Object> row = (Map) dosageList.get(d);
                    relStart = row.get("relativeStart").toString();
                    relStop = row.get("relativeStop").toString();
                    uid = data.get("uid").toString();
                    doseTemp.put("uid",uid);
                    doseTemp.put("relativeStart",relStart);
                    doseTemp.put("relativeStop",relStop);

                    if (row.containsKey("start")) start = row.get("start").toString();
                    if (row.containsKey("stop")) stop = row.get("stop").toString();
                    if (d == 0) {
                        medDose = row.get("dose").toString();


                        data.put("dose", medDose);
                        data.put("doseStart", HL7DateTimeFormat.parse(start));
                        data.put("doseStop", HL7DateTimeFormat.parse(stop));
                        buildDoseList(data, doseTemp);
                        doseValues.add(doseTemp);


                    } else {
                        String dose = row.get("dose").toString();

                        if (!medDose.contentEquals(dose)) {
                            Map<String, Object> doseMap = new HashMap<String, Object>();
                            doseMap.putAll(data);
                            doseMap.put("dose", dose);
                            doseMap.put("doseStart", HL7DateTimeFormat.parse(start));
                            doseMap.put("doseStop", HL7DateTimeFormat.parse(stop));
                            buildDoseList(doseMap, doseTemp);
                            doseValues.add(doseTemp);
                            String status = doseMap.get("vaStatus").toString();
                            compareDoseMap(data, doseMap, false);

                        }
                    }
                }
                data.put("doseList", doseValues);
            }

            private void buildDoseList(Map<String, Object> data, Map<String, Object> dataMap) {
                dataMap.put("dose", data.get("dose").toString());
                dataMap.put("doseStart", data.get("doseStart").toString());
                dataMap.put("doseStop", data.get("doseStop").toString());
            }

            public boolean isFloat( String input )  {
                try {
                        Float.parseFloat(input);
                        return true;
                }
                catch(Exception e) {
                    return false;
                }
            }

            private void compareDoseMap(Map<String, Object> data, Map<String, Object> comparison, boolean lastPass) {
                String originalDose = "";
                String newDose = "";
                String status = data.get("vaStatus").toString();
                if (status.equals("ACTIVE")) {
                    if (data.containsKey("dose")) newDose = data.get("dose").toString();
                    if (comparison.containsKey("dose")) originalDose = comparison.get("dose").toString();
                } else {
                    if (data.containsKey("dose")) originalDose = data.get("dose").toString();
                    if (comparison.containsKey("dose")) newDose = comparison.get("dose").toString();
                }
                if (originalDose.equals(newDose)) {
                    setDates(data, comparison, originalDose, true, lastPass);
                    return;
                }

                String[] oDose = originalDose.split("\\s+");
                String[] nDose = newDose.split("\\s+");
                String temp = nDose[0].toString();
                if (!isFloat(temp)) {
                    data.put("doseChange", "u");
                    setDates(data, comparison, originalDose, false, lastPass);
                    return;
                }
                Float nDoseFloat = new Float(temp);
                temp = "";
                temp = oDose[0].toString();
                if (!isFloat(temp)) {
                    data.put("doseChange", "u");
                    setDates(data, comparison, originalDose, false, lastPass);
                    return;
                }
                Float oDoseFloat = new Float(temp);
                if (nDoseFloat > oDoseFloat)
                    data.put("doseChange", "i");
                else if (nDoseFloat < oDoseFloat)
                    data.put("doseChange", "d");
                else data.put("doseChange", "u");
                setDates(data, comparison, originalDose, false, lastPass);
            }

            private void setDates(Map<String, Object> data, Map<String, Object> comparison, String originalDose, Boolean doseMatch, boolean lastPass) {
                String compStatus = comparison.get("vaStatus").toString();
                String start = "";
                String stop = "";
                String dateChange = "0000";

                PointInTime dStartDate;
                PointInTime dStopDate;
                PointInTime cStartDate;
                PointInTime cStopDate;

                if (lastPass) {
                    data.put("lastDose",originalDose);
                    stop = data.get("overallStop").toString();
                    if (stop.equals("0000")) stop = data.get("doseStop").toString();
                    data.put("lastDoseChange", stop);

                    data.put("overallStop", null);
                    String dose = comparison.get("dose").toString();
                    data.put("dose", dose);
                    String uid = comparison.get("uid").toString();
                    data.put("uid", uid);
                    return;
                }

                start = data.get("overallStart").toString();
                if (start.equals("0000")) start = data.get("doseStart").toString();
                stop = data.get("overallStop").toString();
                if (stop.equals("0000")) stop = data.get("doseStop").toString();

                dStartDate = HL7DateTimeFormat.parse(start);
                dStopDate = HL7DateTimeFormat.parse(stop);

                start = comparison.get("overallStart").toString();
                if (start.equals("0000")) start = comparison.get("doseStart").toString();
                stop = comparison.get("overallStop").toString();
                if (stop.equals("0000")) stop = comparison.get("doseStart").toString();

                cStartDate = HL7DateTimeFormat.parse(start);
                cStopDate = HL7DateTimeFormat.parse(stop);

                if (cStartDate.compareTo(dStartDate) < 0) data.put("overallStart", cStartDate.toString());
                if (cStopDate.compareTo(dStopDate) > 0) data.put("overallStop", cStopDate.toString());

                if (compStatus.equals("PENDING")) {
                        //currently pendings come at the end of list because of lack of a date. This forces a display to be the pending order.
                        String uid = comparison.get("uid").toString();
                        data.put("uid",uid);
                        data.put("vaStatus",compStatus);
                        if (!doseMatch) data.put("lastDose",originalDose);
                        return;
                    }

                if (doseMatch) return;
                PointInTime lastDateChange;
                if (data.containsKey("lastDoseChange")) dateChange = data.get("lastDoseChange").toString();
                lastDateChange = HL7DateTimeFormat.parse((dateChange));
                if (cStopDate.compareTo(lastDateChange) > 0) {
                    data.put("lastDoseChange", cStopDate);
                    data.put("lastDose",originalDose);
                } else if (cStartDate.compareTo(lastDateChange) > 0) {
                    data.put("lastDoseChange", cStartDate);
                    data.put("lastDose",originalDose);
                } else if (dStartDate.compareTo(lastDateChange) > 0) {
                    data.put("lastDoseChange", dStartDate);
                    data.put("lastDose",originalDose);
                }
                return;
            }
        };

        addQuery(q1);
//        addColumns(q1, "uid", "pid", "summary", "overallStart", "overallStop", "facility", "kind", "vaStatus", "medStatusName", "ingredientName", "drugClassName");
//        addColumns(q1, "uid", "pid", "name", "dose", "doseChange", "lastDoseChange", "lastDose","renewBy","overallStart", "overallStop", "facility", "kind", "vaStatus", "medStatusName", "ingredientName", "drugClassName");
        addColumns(q1, "uid", "pid", "name", "dose","doseChange", "lastDoseChange", "lastDose","renewBy","overallStart", "overallStop", "facility", "kind", "vaStatus", "medStatusName", "ingredientName", "drugClassName");

        getColumn("name").setMetaData("text", "Name");
        getColumn("name").setMetaData("minWidth", 200);
        getColumn("name").setMetaData("flex", 1);
        addColumn(new ColDef.HealthTimeColDef(q1, "renewBy"));
        addColumn(new ColDef.HealthTimeColDef(q1, "overallStart"));
        getColumn("overallStart").setMetaData("text", "Start Date").setMetaData("width", 75);

        addColumn(new ColDef.HealthTimeColDef(q1, "overallStop")).setMetaData("detailfield", "infobtnurl");
        getColumn("overallStop").setMetaData("text", "Stop Date").setMetaData("width", 75);


//        getColumn("dose").setMetaData("text", "Dose");
//        getColumn("doseChange").setMetaData("text", "Dose Change");
        addColumn(new ColDef.HealthTimeColDef(q1, "lastDoseChange"));
//        getColumn("lastDoseChange").setMetaData("text", "Last Dose Change");
//        getColumn("lastDose").setMetaData("text", "Last Dose");

        //               "<tpl if=\"(interpretation == \'N\')==false\"><div style=\"float: right; color: red; font-weight: bold;\">" +
//        addColumn(new ColDef.TemplateColDef("doseInfo", "<span title='{doseChange}'>" +
        addColumn(new ColDef.TemplateColDef("doseInfo", "<tpl if=\"doseChange == 'd'\">&darr; {[PointInTime.format(values.lastDoseChange)]} {lastDose} TEST</tpl>" +
                                            "<tpl if=\"doseChange == 'i'\">&uarr; {[PointInTime.format(values.lastDoseChange)]} {lastDose}</tpl>" +
                                            "<tpl if=\"doseChange == 'u'\">? {[PointInTime.format(values.lastDoseChange)]} {lastDose}</tpl>"
                                            ));


		getColumn("doseInfo").setMetaData("text", "Dose History");
		getColumn("doseInfo").setMetaData("width", 90);
        getColumn("renewBy").setMetaData("text", "Renew By");
        getColumn("dose").setMetaData("text", "Dose");
        getColumn("vaStatus").setMetaData("text", "VA Status");
        getColumn("medStatusName").setMetaData("text", "HITSP Status");
        getColumn("facility").setMetaData("text", "Facility");

        addQuery(new QueryMapper.PerRowAppendMapper(new FrameQuery("uid", "viewdefactions", Medication.class)));
        addColumn(new DomainClassSelfLinkColDef("selfLink", Medication.class)).setMetaData("detailloader", "html");
        addColumn(new ActionColDef("rowactions"));
    }

    private String buildXtype(String dose) {
        String result;
        result = dose;
        return result;
    }
}



