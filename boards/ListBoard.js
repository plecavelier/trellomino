ListBoard = function() {
}

ListBoard.prototype.charts = function(times, workUnit) {

	var getLabelId = function(time) {
		if (time.getCard().getLabels().length == 0) {
			return null;
		} else {
			return time.getCard().getLabels()[0].getId();
		}
	};
	var getLabelName = function(time) {
		if (time.getCard().getLabels().length == 0) {
			return "No label";
		} else {
			return time.getCard().getLabels()[0].getName();
		}
	};
	var getLabelColor = function(time) {
		if (time.getCard().getLabels().length == 0) {
			return null;
		} else {
			return time.getCard().getLabels()[0].getColor();
		}
	};
	var getCardId = function(time) {
		return time.getCard().getId();
	};
	var getCardName = function(time) {
		return time.getCard().getName();
	};
	return [ [ {
		name : "List result",
		width : "20%",
		chart : new ResultColumnChart(times, {}, workUnit)
	}, {
		name : "Burndown chart of list",
		width : "80%",
		chart : new BurndownLineChart(times, {}, workUnit)
	} ], [ {
		name : "Labels distribution",
		width : "50%",
		chart : new SpentPieChart(times, {
			getId : getLabelId,
			getName : getLabelName,
			getColor : getLabelColor
		}, workUnit)
	}, {
		name : "Result by label",
		width : "50%",
		chart : new ResultBarChart(times, {
			getId : getLabelId,
			getName : getLabelName,
			getColor : getLabelColor
		}, workUnit)
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