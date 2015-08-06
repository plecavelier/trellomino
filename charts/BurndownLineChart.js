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
			"color" : this.colors['marine']
		}, {
			"name" : "Estimate",
			"data" : timelines[0].total("estimate"),
			"color" : this.colors['orange']
		}, {
			"name" : "Remain",
			"data" : timelines[0].total("remain"),
			"color" : this.colors['green']
		}, {
			"name" : "Spent",
			"data" : timelines[0].total("spent"),
			"color" : this.colors['blue']
		} ]
	});
}