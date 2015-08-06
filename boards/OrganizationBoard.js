OrganizationBoard = function() {
}

OrganizationBoard.prototype.charts = function(times) {
	var getBoardId = function(time) {
		return time.getCard().getBoard().getId();
	};
	var getBoardName = function(time) {
		return time.getCard().getBoard().getName();
	};
	var getBoardColor = function(time) {
		return time.getCard().getBoard().getColor();
	};
	return [ [ {
		name : "Organization result",
		width : "20%",
		chart : new ResultColumnChart(times)
	}, {
		name : "Burndown chart of organization",
		width : "80%",
		chart : new BurndownLineChart(times)
	} ], [ {
		name : "Spent by board",
		width : "50%",
		chart : new SpentLineChart(times, {
			getId : getBoardId,
			getName : getBoardName,
			getColor : getBoardColor
		})
	}, {
		name : "Result by board",
		width : "50%",
		chart : new ResultBarChart(times, {
			getId : getBoardId,
			getName : getBoardName
		})
	} ] ]
}