LabelBoard = function() {
}

LabelBoard.prototype.charts = function(times, workUnit) {
	var getCardId = function(time) {
		return time.getCard().getId();
	};
	var getCardName = function(time) {
		return time.getCard().getName();
	};
	return [ [ {
		name : "Label result",
		width : "20%",
		chart : new ResultColumnChart(times, {}, workUnit)
	}, {
		name : "Burndown chart of label",
		width : "80%",
		chart : new BurndownLineChart(times, {}, workUnit)
	} ], [ {
		name : "Result by card",
		width : "100%",
		chart : new ResultBarChart(times, {
			getId : getCardId,
			getName : getCardName,
			dynamicHeight : true
		}, workUnit)
	} ] ]
}