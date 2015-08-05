ResultBarChart = function(times, settings) {
	ResultBarColumnChart.call(this, times, settings);
}

ResultBarChart.prototype = new ResultBarColumnChart();

ResultBarChart.prototype.hasSeries = true;

ResultBarChart.prototype.type = "bar";