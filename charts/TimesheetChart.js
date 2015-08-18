TimesheetChart = function(times, settings, workUnit) {
	Chart.call(this, times, settings, workUnit);
}

TimesheetChart.prototype = new Chart();

TimesheetChart.prototype.isTimeline = true;

TimesheetChart.prototype.hasSeries = true;

TimesheetChart.prototype.subrender = function(containerId, timelines) {
	
	var thiz = this;
	
	var maxDate = new Date();
	maxDate.setHours(0, 0, 0, 0);
	var minDate = new Date(maxDate);
	minDate.setDate(minDate.getDate() - 28);

	var total = {};

	var html = '<div class="timesheet"><table>';
	html += '<tr><th>&#160;</th>';
	for (var currentDate = new Date(minDate); currentDate <= maxDate; currentDate
			.setDate(currentDate.getDate() + 1)) {		
		var day = currentDate.getDate().toString();
		if (day.length == 1) {
			day = '0' + day;
		}
		var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		var dayName = days[currentDate.getDay()];
		var weekendClass = currentDate.getDay() == 0 || currentDate.getDay() == 6 ? "weekend" : "";
		
		html += '<th class="' + weekendClass + '">' + dayName + ' ' + day + '</th>';

		total[currentDate.getTime()] = 0;
	}
	html += '</tr>';
	$.each(timelines, function(index, timeline) {
		var oddEven = index % 2 == 0 ? "odd" : "even";
		var name = timeline.getName();
		html += '<tr class="' + oddEven + '">';
		html += '<td class="serie">' + name + '</td>';
		for (var currentDate = new Date(minDate); currentDate <= maxDate; currentDate
				.setDate(currentDate.getDate() + 1)) {			
			var item = timeline.getItem(currentDate);
			var spent = item != null ? item.get("spent") : 0;
			var displaySpent = spent == 0 ? "-" : thiz.round(spent);
			var weekendClass = currentDate.getDay() == 0 || currentDate.getDay() == 6 ? "weekend" : "";
			
			html += '<td class="' + weekendClass + '">' + displaySpent + '</td>';

			total[currentDate.getTime()] += spent;
		}
		html += '</tr>';
	});
	html += '<tr class="total"><td>&#160;</td>';
	for (var currentDate = new Date(minDate); currentDate <= maxDate; currentDate
			.setDate(currentDate.getDate() + 1)) {
		
		var displaySpent = total[currentDate.getTime()] == 0 ? "-" : thiz.round(total[currentDate.getTime()]);
		
		var weekendClass = currentDate.getDay() == 0 || currentDate.getDay() == 6 ? "weekend" : "";
		
		html += '<td class="' + weekendClass + '">' + displaySpent + '</td>';
		
		total[currentDate.getTime()] = 0;
	}
	html += "</tr>";
	html += '</table></div>';

	$("#" + containerId).html(html);
}