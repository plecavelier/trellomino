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
		"remain" : [],
		"estimGain" : [],
		"estimLoss" : [],
		"loss" : []
	}
	$.each(timelines, function(index, timeline) {
		categories.push(timeline.getName());

		datas['spent'].push(timeline.sum("spent"));
		datas['remain'].push(timeline.sum("remain"));
		datas['estimGain'].push(0);
		datas['estimLoss'].push(0);
		datas['loss'].push(0);

		var delta = timeline.sum("estimate") - timeline.sum("sold");

		if (delta < 0) {
			datas['estimGain'][index] = -1 * delta;
		} else if (datas['remain'][index] >= delta) {
			datas['remain'][index] -= delta;
			datas['estimLoss'][index] = delta;
		} else {
			datas['estimLoss'][index] = datas['remain'][index];
			datas['loss'][index] = delta - datas['estimLoss'][index];
			datas['spent'][index] -= datas['loss'][index];
			datas['remain'][index] = 0;
		}
	});

	var series = [ {
		name : "Gain",
		data : datas['estimGain'],
		color : this.colors['green']
	}, {
		name : "Remaining loss",
		data : datas['estimLoss'],
		color : this.colors['orange']
	}, {
		name : "Loss",
		data : datas['loss'],
		color : this.colors['red']
	}, {
		name : "Remaining",
		data : datas['remain'],
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