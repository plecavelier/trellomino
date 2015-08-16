SpentPieChart = function(times, settings, workUnit) {
	Chart.call(this, times, settings, workUnit);
}

SpentPieChart.prototype = new Chart();

SpentPieChart.prototype.isTimeline = false;

SpentPieChart.prototype.hasSeries = true;

SpentPieChart.prototype.subrender = function(containerId, timelines) {
	
	var thiz = this;

	var data = [];
	$.each(timelines, function(index, timeline) {
		var serieData = {};
		serieData.name = timeline.getName();
		var color = timeline.getColor();
		if (color != null) {
			serieData.color = thiz.color(color);
		}
		serieData.y = thiz.round(timeline.sum("spent"));
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
							pointFormat : '<b>{point.y:.1f}</b>' + this.getworkUnitSuffix() + ' (<b>{point.percentage:.1f}%</b>)'
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
							name : this.getworkUnitText(),
							colorByPoint : true,
							data : data
						} ]
					});
}