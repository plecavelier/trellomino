SpentLineChart = function(times, settings) {
	Chart.call(this, times, settings);
}

SpentLineChart.prototype = new Chart();

SpentLineChart.prototype.isTimeline = true;

SpentLineChart.prototype.hasSeries = true;

SpentLineChart.prototype.subrender = function(containerId, timelines) {

	var data = [];
	$.each(timelines, function(index, timeline) {
		var serieData = {};
		serieData.name = timeline.getName();
		var color = timeline.getColor();
		if (color != null) {
			serieData.color = color;
		}
		serieData.data = timeline.get("spent");
		data.push(serieData);
	});

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
			min : 0,
			title : {
				text : 'Hours'
			}
		},
		tooltip : {
			valueSuffix : ' hours'
		},
		plotOptions : {
			line : {
				marker : {
					radius : 3
				}
			}
		},
		legend : {
			layout : 'vertical',
			align : 'right',
			verticalAlign : 'middle',
			borderWidth : 0
		},
		series : data
	});
}