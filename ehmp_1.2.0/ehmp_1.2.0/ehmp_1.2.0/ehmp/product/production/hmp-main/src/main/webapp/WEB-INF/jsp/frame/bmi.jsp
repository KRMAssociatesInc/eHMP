<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="gov.va.cpe.vpr.Auxiliary"%>
<%@ page import="org.springframework.data.domain.Page"%>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<!DOCTYPE html>
<html>
<head>
    <title>BMI</title>
    <g:render template="/layouts/detail"/>
</head>

<%
	Auxiliary aux = null;
    int goal = 25;
    List comments = new ArrayList();

	Page rslt = dao.findAllByPID(Auxiliary.class, pid, null);
	if(!rslt.getContent().isEmpty()) {
        aux = rslt.getContent().get(0);
        Map<String, Object> bmiGoal = aux.getGoals().get("bmi");
        if (bmiGoal != null) {
            if (bmiGoal.containsKey("value")) {
                goal = (Integer) bmiGoal.get("value");
            }
            if (bmiGoal.containsKey("comments")) {
                comments = (List) bmiGoal.get("comments");
            }
        }
    }
%>

<body>

<form>
<div>
	BMI goal: <input type="text" name="bmi" id="BMIGoalID" value="${goal}" size="2">
	<input type="button" value="Save Patient Goal" onClick="submitGoal('bmi', this.form.bmi.value, ${pid});">
	<input type="button" value="Clear Patient Goal" onClick="submitGoal('bmi', null, ${pid});"><br/>
	<c:forEach var="comment" items="${comments}">
        <li><b>${comment.dtm}:</b> ${comment.text}</li>
    </c:forEach>
	<br/>New Comment:
	<input type="text" onBlur="submitGoal('bmi', null, ${pid}, this.value)" size="40">
</div>
</form>

<div id="sparkLineID" style="background-color: red;"></div>
<div id="chartTargetID" style="float: left;"></div>
<script type="text/javascript">

	function submitGoal(name, value, pid, comment) {
		Ext.Ajax.request({url: '/patient/goal', params: {pid: pid, goal: name, value: value, comment: comment}});
	}
	
	Ext.onReady(function() {
		var sparkcfg = {
			chart: {height: 20, width: 100, renderTo: 'sparkLineID'},
			title: {text: null},
			credits: {enabled: false},
			legend: {enabled: false},
			xAxis: {type: 'datetime', labels: {enabled: false}},
			yAxis: {min: 18, max: 35, labels: {enabled: false}}
		};

		var notes = [];
        <c:forEach var="comment" items="${comments}">
            notes.push({marker: {symbol: 'url(/images/icons/report.png)'}, x: gov.va.hmp.util.HL7DTMFormatter.UTC('${comment.dtm}'), y: ${goal}, name: '${comment.text}'});
        </c:forEach>
		var cfg = {
			chart: {
				height: 250,
				width: 700,
	            renderTo: 'chartTargetID',
	            zoomType: 'x'
	        },
	        credits: {enabled: false},
	        title: {text: 'BMI Trend'},
	        legend: { enabled: false },
	        xAxis: {
	            type: 'datetime',
	            dateTimeLabelFormats: {
	                second: '%m/%d/%Y',
	                minute: '%m/%d/%Y',
	                hour: '%m/%d/%Y',
	                day: '%m/%d/%Y',
	                week: '%m/%d/%Y',
	                month: '%m/%d/%Y',
	                year: '%m/%d/%Y'
	            },
	            labels: {rotation: 45, align: 'left'}
            },
	        yAxis: [{// BMI
	        	min: 18,
	        	title: {
	        		text: 'BMI'
	        	},
	        	labels: {
					style: {
                        color: '#4572A7'
                    }
	        	},
	        	style: {
	        		color: '#4572A7'
        		},
        		plotBands: [{
                    from: 18,
                    to: ${goal},
                    color: 'rgba(68, 170, 213, 0.5)',
                    label: {
                        text: 'BMI Goal Range',
                        style: {
                            color: '#606060'
                        }
                    }
                }]
	        },{
	        	labels: {enabled: false},
	        	tooltip: {
		        	formatter: function() {
		        		if (this.point.name) return this.point.name;
		        		return this.point.y;
		        	}
	        	}
	        }],
	        series: [{name: 'notes', type: 'scatter', data: notes, yAxis: 1}]
		};
		
		var chart = new Highcharts.Chart(cfg);
		
		Ext.Ajax.request({
			url: '/vpr/view/render?view=gov.va.cpe.vpr.queryeng.BMIViewDef&range=2000..NOW&row.count=1000&pid=${pid}',
			success: function(resp) {
				var data = Ext.JSON.decode(resp.responseText).data;
				
				var bmi = [];
				for (var i in data) {
					var obs = gov.va.hmp.util.HL7DTMFormatter.UTC(data[i].observed);
					if (data[i].BMI) {
						bmi.push([obs,data[i].BMI]);
					}
				}
				
		        bmi.sort(function(i1, i2) {
		        	return i1[0] - i2[0];
		        });				
		        
				chart.addSeries({name: 'BMI', zIndex: 10, type: 'line', data: bmi});
			}
		});
	});
</script>
</body>
</html>