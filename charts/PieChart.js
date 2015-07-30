PieChart = function(times, getId, getName, getColor) {
	this._times = times;
	this._getId = getId;
	this._getName = getName;
	this._getColor = getColor;
}

PieChart.prototype.render = function(containerId) {
	
	var data = {};
	var thiz = this;
	$.each(this._times, function(index, time) {
		var id = thiz._getId(time);
		if (!(id in data)) {
			data[id] = {};
			data[id].name = thiz._getName(time);
			data[id].y = 0;
			
			if (!_.isUndefined(thiz._getColor)) {
				var color = thiz._getColor(time);
				if (color != null) {
					data[id].color = color;
				}
			}
		}
		data[id].y += time.getSpent();
	});
	
	$("#" + containerId).highcharts({
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		tooltip: {
			pointFormat: '<b>{point.y:.1f}</b> hours (<b>{point.percentage:.1f}%</b>)'
		},
		title: {
			text: ''
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '{point.name}: {point.percentage:.1f} %',
					style: {
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		series: [{
			name: "Hours",
			colorByPoint: true,
			data: Object.keys(data).map(function(key) {
				return data[key]
			})
		}]
	});
}