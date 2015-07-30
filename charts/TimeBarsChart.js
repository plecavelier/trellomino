TimeBarsChart = function(times, getId, getName) {
	this._times = times;
	this._getId = getId;
	this._getName = getName;
}

TimeBarsChart.prototype.render = function(containerId) {
	
	var categories = [];
	var categoriesOrder = {};
	
	var colors = {
		"sky" : "#7cb5ec",
		"marine" : "#434348",
		"green" : "#90ed7d",
		"orange" : "#f7a35c",
		"blue" : "#8085e9",
		"pink" : "#f15c80",
		"yellow" : "#e4d354",
		"turquoise" : "#2b908f",
		"red" : "#f45b5b",
		"cyan" : "#91e8e1"
		
	}
	
	var datas = {
		"spent" : [],
		"remaining" : [],
		"delta" : [],
		"delta_negative" : [],
		"delta_positive" : [],
		"delta_positive_spent" : []
	}
	
	var remainingCards = [];
	
	var thiz = this;
	$.each(this._times, function(index, time) {
		var id = thiz._getId(time);
		if (!(id in categoriesOrder)) {
			categories.push(thiz._getName(time));
			categoriesOrder[id] = categories.length - 1;
			
			datas['spent'].push(0);
			datas['remaining'].push(0);
			datas['delta'].push(0);
			datas['delta_negative'].push(0);
			datas['delta_positive'].push(0);
			datas['delta_positive_spent'].push(0);
		}
		
		var order = categoriesOrder[id];
		datas['spent'][order] += time.getSpent();
		if ($.inArray(time.getCard().getId(), remainingCards) == -1) {
			remainingCards.push(time.getCard().getId());
			datas['remaining'][order] += time.getCard().getRemaining();
		}
		datas['delta'][order] += time.getDelta();
	});
	
	$.each(categoriesOrder, function(index, order) {
		if (datas['delta'][order] < 0) {
			datas['delta_negative'][order] = -1 * datas['delta'][order];
		} else if (datas['remaining'][order] >= datas['delta'][order]) {
			datas['remaining'][order] -= datas['delta'][order];
			datas['delta_positive'][order] = datas['delta'][order];
		} else {
			datas['delta_positive'][order] = datas['remaining'][order];
			datas['delta_positive_spent'][order] = datas['delta'][order] - datas['delta_positive'][order];
			datas['spent'][order] -= datas['delta_positive_spent'][order];
			datas['remaining'][order] = 0;
		}
	});
	
	var series = [
		{
			name : "Gain",
			data : datas['delta_negative'],
			color : colors['green']
		},{
			name : "Remaining loss",
			data : datas['delta_positive'],
			color : colors['orange']
		},{
			name : "Loss",
			data : datas['delta_positive_spent'],
			color : colors['red']
		},{
			name : "Remaining",
			data : datas['remaining'],
			color : colors['blue']
		},{
			name : "Spent",
			data : datas['spent'],
			color : colors['marine']
		}
	];

	$("#" + containerId).highcharts({
		chart: {
			type: 'bar'
		},
		title: {
			text: ''
		},
		xAxis: {
			categories: categories
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Hours'
			}
		},
		tooltip : {
			valueSuffix : ' hours'
		},
		legend: {
			reversed: true
		},
		plotOptions: {
			series: {
				stacking: 'normal'
			}
		},
		series: series
	});
}