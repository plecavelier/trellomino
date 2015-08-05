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
		series : data
	});
}