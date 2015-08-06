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
			}
		},
		plotOptions : {
			line : {
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
			"data" : timelines[0].total("sold"),
			"color" : this.color("marine")
		}, {
			"name" : "Estimate",
			"data" : timelines[0].total("estimate"),
			"color" : this.color("orange")
		}, {
			"name" : "Remain",
			"data" : timelines[0].total("remain"),
			"color" : this.color("lime")
		}, {
			"name" : "Spent",
			"data" : timelines[0].total("spent"),
			"color" : this.color("blue")
		} ]
	});
}