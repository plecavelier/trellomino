TodoChart = function(times, settings, workUnit) {
	Chart.call(this, times, settings, workUnit);
}

TodoChart.prototype = new Chart();

TodoChart.prototype.isTimeline = false;

TodoChart.prototype.hasSeries = false;

TodoChart.prototype.subrender = function(containerId, timelines) {
	$("#" + containerId).html("<div class=\"todo\">Working Progress</div>");
}