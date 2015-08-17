ResultBarColumnChart = function(times, settings, workUnit) {
	Chart.call(this, times, settings, workUnit);
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
		color : this.color("lime")
	}, {
		name : "Estim. loss",
		data : this.round(datas['estimLoss']),
		color : this.color("orange")
	}, {
		name : "Loss",
		data : this.round(datas['loss']),
		color : this.color("red")
	}, {
		name : "Remain",
		data : this.round(datas['remain']),
		color : this.color("blue")
	}, {
		name : "Spent",
		data : this.round(datas['spent']),
		color : this.color("marine")
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
				text : this.getworkUnitText()
			},
			stackLabels : {
				enabled : true,
				style: {
					fontWeight: 'bold',
					color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
				},
				formatter : function() {
					var spent = 0;
					var remain = 0;
					var loss = 0;
					var estimLoss = 0;
					if (('4,' + this.x) in this.points) {
						spent = this.points['4,' + this.x][1] - this.points['4,' + this.x][0];
					}
					if (('3,' + this.x) in this.points) {
						remain = this.points['3,' + this.x][1] - this.points['3,' + this.x][0];
					}
					if (('2,' + this.x) in this.points) {
						loss = this.points['2,' + this.x][1] - this.points['2,' + this.x][0];
					}
					if (('1,' + this.x) in this.points) {
						estimLoss = this.points['1,' + this.x][1] - this.points['1,' + this.x][0];
					}
					var total = spent + remain + loss + estimLoss;
					if (total == 0) {
						return "";
					}
					var percent = Math.floor((spent + loss) / total * 100);
					return percent + "%";
				}
			}
		},
		tooltip : {
			valueSuffix : this.getworkUnitSuffix()
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