TimeBarsChart = function(cards, getId, getName) {
	this._cards = cards;
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
	
	var thiz = this;
	$.each(this._cards, function(index, card) {
		var id = thiz._getId(card);
		if (!(id in categoriesOrder)) {
			categories.push(thiz._getName(card));
			categoriesOrder[id] = categories.length - 1;
			
			series[0].data.push(0);
			series[1].data.push(0);
			series[2].data.push(0);
			series[3].data.push(0);
		}
		
		var order = categoriesOrder[id];
		series[3].data[order] += card.getSpent();
		series[2].data[order] += card.getRemaining();
		series[1].data[order] += card.getDelta();
		series[0].data[order] += card.getDelta();
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