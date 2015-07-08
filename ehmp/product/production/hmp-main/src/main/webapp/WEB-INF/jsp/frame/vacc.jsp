<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="gov.va.cpe.vpr.Immunization"%>
<%@ page import="org.springframework.data.domain.Page"%>

<html>
<head>
    <title>Vaccinations</title>
    <g:render template="/layouts/detail"/>
</head>

<%
	Page<Immunization> immuninzations = dao.findAllByPID(Immunization.class, pid, null);
%>

<body>
<p>Pneum Vacc Compliance/Goal Status <span class="label label-important">DUE NOW</span></p>
<table class="hmp-labeled-values">
	<tr>
		<td>Mitigating Reason</td>
		<td>
			<input type="radio" name="mit"> Scheduled for future visit<br>
			<input type="radio" name="mit"> Patient Refuses<br>
			<input type="radio" name="mit"> Medically inappropriate<br>
			<input type="radio" name="mit"> Done outside the VA<br>
			<input type="radio" name="mit"> Other...<br>
		</td>
	</tr>
	<tr>
		<td>New Comment</td>
		<td><textarea></textarea></td>
	</tr>
	<tr>
    	<td colspan="2" align="center"><input type="submit" value="Submit"/></td>
    </tr>
</table>


</body>
</html>