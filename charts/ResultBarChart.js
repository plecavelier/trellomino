ResultBarChart = function(times, settings, workUnit) {
	ResultBarColumnChart.call(this, times, settings, workUnit);
}

ResultBarChart.prototype = new ResultBarColumnChart();

ResultBarChart.prototype.hasSeries = true;

ResultBarChart.prototype.type = "bar";