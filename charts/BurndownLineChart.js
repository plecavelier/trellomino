BurndownLineChart = function(times, settings, workUnit) {
	Chart.call(this, times, settings, workUnit);
}

BurndownLineChart.prototype = new Chart();

BurndownLineChart.prototype.isTimeline = true;

BurndownLineChart.prototype.hasSeries = false;

BurndownLineChart.prototype.subrender = function(containerId, timelines) {

	$("#" + containerId).highcharts({
		chart: {
			type: 'spline'
		},
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
				text : this.getworkUnitText()
			}
		},
		plotOptions : {
			spline : {
				marker : {
					enabled : false
				}
			}
		},
		tooltip : {
			shared : true,
			crosshairs : true
		},
		legend : {
			layout : 'vertical',
			align : 'right',
			verticalAlign : 'middle',
			borderWidth : 0
		},
		series : [ {
			"name" : "Sold",
			"data" : this.round(timelines[0].total("sold")),
			"color" : this.color("marine")
		}, {
			"name" : "Estimate",
			"data" : this.round(timelines[0].total("estimate")),
			"color" : this.color("orange")
		}, {
			"name" : "Remain",
			"data" : this.round(timelines[0].total("remain")),
			"color" : this.color("lime")
		}, {
			"name" : "Spent",
			"data" : this.round(timelines[0].total("spent")),
			"color" : this.color("blue")
		} ]
	});
}