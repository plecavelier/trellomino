ResultColumnChart = function(times, settings) {
	ResultBarColumnChart.call(this, times, settings);
}

ResultColumnChart.prototype = new ResultBarColumnChart();

ResultColumnChart.prototype.hasSeries = false;

ResultColumnChart.prototype.type = "column";