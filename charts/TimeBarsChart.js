TimeBarsChart = function(times, getId, getName) {
	this._times = times;
	this._getId = getId;
	this._getName = getName;
}

TimeBarsChart.prototype.render = function(containerId) {
	
	var categories = [];
	var categoriesOrder = {};
	
	var series = [
		{
			name : "Delta +",
			data : []
		},{
			name : "Delta -",
			data : []
		},{
			name : "Remaining",
			data : []
		},{
			name : "Spent",
			data : []
		}
	];
	
	var remainingCards = [];
	
	var thiz = this;
	$.each(this._times, function(index, time) {
		var id = thiz._getId(time);
		if (!(id in categoriesOrder)) {
			categories.push(thiz._getName(time));
			categoriesOrder[id] = categories.length - 1;
			
			series[0].data.push(0);
			series[1].data.push(0);
			series[2].data.push(0);
			series[3].data.push(0);
		}
		
		var order = categoriesOrder[id];
		series[3].data[order] += time.getSpent();
		if ($.inArray(time.getCard().getId(), remainingCards) == -1) {
			remainingCards.push(time.getCard().getId());
			series[2].data[order] += time.getCard().getRemaining();
		}
		series[1].data[order] += time.getDelta();
		series[0].data[order] += time.getDelta();
	});
	
	$.each(categoriesOrder, function(index, order) {
		var delta = series[0].data[order];
		if (delta > 0) {
			series[1].data[order] = 0;
		} else if (delta < 0) {
			series[0].data[order] = 0;
			series[2].data[order] -= delta;
		}
	});

	$("#" + containerId).highcharts({
		chart: {
			type: 'bar'
		},
		title: {
			text: 'Stacked bar chart'
		},
		xAxis: {
			categories: categories
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Total fruit consumption'
			}
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