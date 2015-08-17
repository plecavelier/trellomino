MainBoard = function() {
}

MainBoard.prototype.charts = function(times, workUnit) {
	var getOrganizationId = function(time) {
		return time.getCard().getBoard().getOrganization().getId();
	};
	var getOrganizationName = function(time) {
		return time.getCard().getBoard().getOrganization().getName();
	};
	var getMemberId = function(time) {
		if (time.getMember() != null) {
			return time.getMember().getId();
		} else {
			return null;
		}
	};
	var getMemberName = function(time) {
		if (time.getMember() != null) {
			return time.getMember().getFullName();
		} else {
			return null;
		}
	};
	return [ [ {
		name : "Global result",
		width : "20%",
		chart : new ResultColumnChart(times, {}, workUnit)
	}, {
		name : "Burndown chart",
		width : "80%",
		chart : new BurndownLineChart(times, {}, workUnit)
	} ], [ {
		name : "Spent by organization",
		width : "50%",
		chart : new SpentLineChart(times, {
			getId : getOrganizationId,
			getName : getOrganizationName
		}, workUnit)
	}, {
		name : "Result by organization",
		width : "50%",
		chart : new ResultBarChart(times, {
			getId : getOrganizationId,
			getName : getOrganizationName
		}, workUnit)
	} ], [ {
		name : "Members timesheet",
		width : "100%",
		chart : new TimesheetChart(times, {
			getId : getMemberId,
			getName : getMemberName
		}, workUnit)
	} ] ]
}