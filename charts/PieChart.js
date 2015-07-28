PieChart = function(cards, getId, getName) {
	this._cards = cards;
	this._getId = getId;
	this._getName = getName;
}

PieChart.prototype.render = function(containerId) {
	
	var data = {};
	var thiz = this;
	$.each(this._cards, function(index, card) {
		var id = thiz._getId(card);
		if (!(id in data)) {
			data[id] = {};
			data[id].name = thiz._getName(card);
			data[id].y = 0;
		}
		data[id].y += card.getSpent();
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