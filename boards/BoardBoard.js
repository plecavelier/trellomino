BoardBoard = function() {
}

BoardBoard.prototype.charts = function(times) {

	var getListId = function(time) {
		return time.getCard().getList().getId();
	};
	var getListName = function(time) {
		return time.getCard().getList().getName();
	};
	var getLabelId = function(time) {
		if (time.getCard().getLabels().length == 0) {
			return null;
		} else {
			return time.getCard().getLabels()[0].getId();
		}
	};
	var getLabelName = function(time) {
		if (time.getCard().getLabels().length == 0) {
			return null;
		} else {
			return time.getCard().getLabels()[0].getName();
		}
	};
	var getLabelColor = function(time) {
		if (time.getCard().getLabels().length == 0) {
			return null;
		} else {
			return time.getCard().getLabels()[0].getRealColor();
		}
	};
	return [ [ {
		name : "Board result",
		width : "20%",
		chart : new ResultColumnChart(times)
	}, {
		name : "Burndown chart of board",
		width : "80%",
		chart : new BurndownLineChart(times)
	} ],/* [ {
		name : "Spent by list",
		width : "50%",
		chart : new SpentLineChart(times, {
			getId : getListId,
			getName : getListName
		})
	}, {
		name : "Result by list",
		width : "50%",
		chart : new ResultBarChart(times, {
			getId : getListId,
			getName : getListName
		})
	} ],*/ [ {
		name : "Labels distribution",
		width : "50%",
		chart : new SpentPieChart(times, {
			getId : getLabelId,
			getName : getLabelName,
			getColor : getLabelColor
		})
	}, {
		name : "Result by label",
		width : "50%",
		chart : new ResultBarChart(times, {
			getId : getLabelId,
			getName : getLabelName,
			getColor : getLabelColor
		})
	} ] ]
}