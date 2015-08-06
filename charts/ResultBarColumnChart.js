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
		name : "Estim. gain",
		data : this.round(datas['estimGain']),
		color : this.colors['green']
	}, {
		name : "Estim. loss",
		data : this.round(datas['estimLoss']),
		color : this.colors['orange']
	}, {
		name : "Loss",
		data : this.round(datas['loss']),
		color : this.colors['red']
	}, {
		name : "Remain",
		data : this.round(datas['remain']),
		color : this.colors['blue']
	}, {
		name : "Spent",
		data : this.round(datas['spent']),
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
			},
			stackLabels : {
				enabled : true,
				style: {
					fontWeight: 'bold',
					color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
				},
				formatter : function() {
					var spent = this.points['4,' + this.x][1] - this.points['4,' + this.x][0];
					var remain = this.points['3,' + this.x][1] - this.points['3,' + this.x][0];
					var loss = this.points['2,' + this.x][1] - this.points['2,' + this.x][0];
					var estimLoss = this.points['1,' + this.x][1] - this.points['1,' + this.x][0];
					var total = spent + remain + loss + estimLoss;
					var percent = Math.floor((spent + loss) / total * 100);
					return percent + "%";
				}
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