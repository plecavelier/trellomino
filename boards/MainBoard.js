MainBoard = function() {
}

MainBoard.prototype.charts = function(times) {
	var getOrganizationId = function(time) {
		return time.getCard().getBoard().getOrganization().getId();
	};
	var getOrganizationName = function(time) {
		return time.getCard().getBoard().getOrganization().getName();
	};
	return [ [ {
		name : "Global result",
		width : "20%",
		chart : new ResultColumnChart(times)
	}, {
		name : "Burndown chart",
		width : "80%",
		chart : new BurndownLineChart(times)
	} ], [ {
		name : "Spent by organization",
		width : "50%",
		chart : new SpentLineChart(times, {
			getId : getOrganizationId,
			getName : getOrganizationName
		})
	}, {
		name : "Result by organization",
		width : "50%",
		chart : new ResultBarChart(times, {
			getId : getOrganizationId,
			getName : getOrganizationName
		})
	} ] ]
}