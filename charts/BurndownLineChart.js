BurndownLineChart = function(times, settings) {
	Chart.call(this, times, settings);
}

BurndownLineChart.prototype = new Chart();

BurndownLineChart.prototype.isTimeline = true;

BurndownLineChart.prototype.hasSeries = false;

BurndownLineChart.prototype.subrender = function(containerId, timelines) {

	$("#" + containerId).highcharts({
		title : {
			text : ''
		// center
		},
		subtitle : {
			text : ''
		},
		xAxis : {
			type : 'datetime'
		},
		yAxis : {
			title : {
				text : 'Hours'
			},
			plotLines : [ {
				value : 0,
				width : 1,
				color : '#808080'
			} ]
		},
		tooltip : {
			valueSuffix : ' hours'
		},
		legend : {
			layout : 'vertical',
			align : 'right',
			verticalAlign : 'middle',
			borderWidth : 0
		},
		series : [ {
			"name" : "Spent",
			"data" : timelines[0].getValues("totalSpent")
		}, {
			"name" : "First estimate",
			"data" : timelines[0].getValues("totalFirstEstimate")
		}, {
			"name" : "Estimate",
			"data" : timelines[0].getValues("estimate")
		}, {
			"name" : "Remaining",
			"data" : timelines[0].getValues("remaining")
		} ]
	});
}