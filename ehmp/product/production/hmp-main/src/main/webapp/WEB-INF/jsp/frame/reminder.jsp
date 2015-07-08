<%@ taglib prefix="c" uri="http://struts.apache.org/tags-bean" %>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.fasterxml.jackson.databind.JsonNode"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Map" %>

<html>
<head>
    <title>Reminder</title>
    <%@include file="/WEB-INF/jsp/layouts/detail.jsp" %>
</head>

<body>

<%
	Map<String, Object> p = new HashMap<String, Object>();
    p.put("command", "evaluateReminder");
    p.put("uid", pid);
    p.put("patientId", request.getParameter("dfn")); // TODO: how to get the right "system id" with no user context?

    JsonNode ret = rpc.executeForJson("/VPR UI CONTEXT/VPRCRPC RPC", p);
    String status = ret.get("status").asText();
    String due = ret.get("dueDate").asText();
    String last = ret.get("lastDone").asText();
    String text = ret.get("clinicalMaintenance").asText();
%>
<table class="hmp-labeled-values" border="1">
	<tr>
		<td><i class="icon-warning-sign text-warning pull-left" style="font-size:14px"/></td>
		<td>
			Status: ${status}<br>
			Due: ${due}<br>
			Last: ${last}<br>
		</td>
	</tr>
	<tr>
		<td>&nbsp;</td>
		<td><pre>${text}</pre></td>
	</tr>
</table>
</body>
</html>