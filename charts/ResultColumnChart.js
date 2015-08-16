ResultColumnChart = function(times, settings, workUnit) {
	ResultBarColumnChart.call(this, times, settings, workUnit);
}

ResultColumnChart.prototype = new ResultBarColumnChart();

ResultColumnChart.prototype.hasSeries = false;

ResultColumnChart.prototype.type = "column";