SpentPieChart = function(times, settings) {
	Chart.call(this, times, settings);
}

SpentPieChart.prototype = new Chart();

SpentPieChart.prototype.isTimeline = false;

SpentPieChart.prototype.hasSeries = true;

SpentPieChart.prototype.subrender = function(containerId, timelines) {

	var data = [];
	$.each(timelines, function(index, timeline) {
		var serieData = {};
		serieData.name = timeline.getName();
		var color = timeline.getColor();
		if (color != null) {
			serieData.color = color;
		}
		serieData.y = timeline.sum("spent");
		data.push(serieData);
	});

	$("#" + containerId)
			.highcharts(
					{
						chart : {
							plotBackgroundColor : null,
							plotBorderWidth : null,
							plotShadow : false,
							type : 'pie'
						},
						tooltip : {
							pointFormat : '<b>{point.y:.1f}</b> hours (<b>{point.percentage:.1f}%</b>)'
						},
						title : {
							text : ''
						},
						plotOptions : {
							pie : {
								allowPointSelect : true,
								cursor : 'pointer',
								dataLabels : {
									enabled : true,
									format : '{point.name}: {point.percentage:.1f} %',
									style : {
										color : (Highcharts.theme && Highcharts.theme.contrastTextColor)
												|| 'black'
									}
								}
							}
						},
						series : [ {
							name : "Hours",
							colorByPoint : true,
							data : data
						} ]
					});
}