ListBoard = function() {
}

ListBoard.prototype.charts = function(times, workUnit) {
	var getCardId = function(time) {
		return time.getCard().getId();
	};
	var getCardName = function(time) {
		return time.getCard().getName();
	};
	return [ [ {
		name : "Result by card",
		width : "100%",
		chart : new ResultBarChart(times, {
			getId : getCardId,
			getName : getCardName
		}, workUnit)
	} ] ]
}