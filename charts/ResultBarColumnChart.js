ResultBarColumnChart = function(times, settings) {
	Chart.call(this, times, settings);
}

ResultBarColumnChart.prototype = new Chart();

ResultBarColumnChart.prototype.isTimeline = false;

ResultBarColumnChart.prototype.hasSeries = true;

ResultBarColumnChart.prototype.subrender = function(containerId, timelines) {

	var thiz = this;

	var categories = [];
	var datas = {
		"spent" : [],
		"remaining" : [],
		"gain" : [],
		"remainingLoss" : [],
		"loss" : []
	}
	$.each(timelines, function(index, timeline) {
		categories.push(timeline.getName());

		datas['spent'].push(timeline.sum("spent"));
		datas['remaining'].push(timeline.last("remaining"));
		datas['gain'].push(0);
		datas['remainingLoss'].push(0);
		datas['loss'].push(0);

		var delta = timeline.sum("delta");

		if (delta < 0) {
			datas['gain'][index] = -1 * delta;
		} else if (datas['remaining'][index] >= delta) {
			datas['remaining'][index] -= delta;
			datas['remainingLoss'][index] = delta;
		} else {
			datas['remainingLoss'][index] = datas['remaining'][index];
			datas['loss'][index] = delta - datas['remainingLoss'][index];
			datas['spent'][index] -= datas['loss'][index];
			datas['remaining'][index] = 0;
		}
	});

	var series = [ {
		name : "Gain",
		data : datas['gain'],
		color : this.colors['green']
	}, {
		name : "Remaining loss",
		data : datas['remainingLoss'],
		color : this.colors['orange']
	}, {
		name : "Loss",
		data : datas['loss'],
		color : this.colors['red']
	}, {
		name : "Remaining",
		data : datas['remaining'],
		color : this.colors['blue']
	}, {
		name : "Spent",
		data : datas['spent'],
		color : this.colors['marine']
	} ];

	$("#" + containerId).highcharts({
		chart : {
			type : thiz.type
		},
		title : {
			text : ''
		},
		xAxis : {
			categories : categories
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
		legend : {
			reversed : true
		},
		plotOptions : {
			series : {
				stacking : 'normal'
			}
		},
		series : series
	});
}