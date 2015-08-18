MemberBoard = function() {
}

MemberBoard.prototype.charts = function(times, workUnit) {
	var getRowId = function(time) {
		return time.getCard().getBoard().getOrganization().getId() + "_"
				+ time.getCard().getBoard().getId();
	};
	var getRowName = function(time) {
		return time.getCard().getBoard().getOrganization().getName() + " - "
				+ time.getCard().getBoard().getName();
	};
	return [ [ {
		name : "Member timesheet",
		width : "100%",
		chart : new TimesheetChart(times, {
			getId : getRowId,
			getName : getRowName
		}, workUnit)
	} ] ]
}