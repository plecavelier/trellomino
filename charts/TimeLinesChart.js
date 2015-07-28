TimeLinesChart = function(cards, getId, getName) {
	this._cards = cards;
	this._getId = getId;
	this._getName = getName;
}

TimeLinesChart.prototype.render = function(containerId) {
	
	// Min date & max date
	var maxDate = new Date();
	maxDate.setHours(0, 0, 0, 0);
	var minDate = new Date(maxDate.getTime());
	minDate.setDate(minDate.getDate() - 30);
	
	// Categories & init empty serie
	var emptySerie = [];
	var position = {};
	var index = 0;
	for (var currentDate = new Date(minDate); currentDate <= maxDate; currentDate.setDate(currentDate.getDate() + 1)) {
		var date = new Date(currentDate);
		emptySerie.push([date.getTime(), 0]);
		position[date.getTime()] = index;
		index++;
	}
	
	//var copiedObject = jQuery.extend(true, {}, originalObject)

	// Create series
	var series = {};
	var thiz = this;
	$.each(this._cards, function(index, card) {
		$.each(card.getTimes(), function(index, time) {
			var id = thiz._getId(card);
			if (!(id in series)) {
				series[id] = {};
				series[id].name = thiz._getName(card);
				series[id].data = $.extend(true, [], emptySerie);
			}
			var day = new Date(time.getDate());
			day.setHours(0, 0, 0, 0);
			series[id].data[position[day.getTime()]][1] += time.getSpent();
		});
	});

	$("#" + containerId).highcharts(
			{
				title : {
					text : 'Monthly Average Temperature',
					x : -20
				// center
				},
				subtitle : {
					text : 'Source: WorldClimate.com',
					x : -20
				},
				xAxis : {
					type: 'datetime'
				},
				yAxis : {
					title : {
						text : 'Temperature (°C)'
					},
					plotLines : [ {
						value : 0,
						width : 1,
						color : '#808080'
					} ]
				},
				tooltip : {
					valueSuffix : '°C'
				},
				legend : {
					layout : 'vertical',
					align : 'right',
					verticalAlign : 'middle',
					borderWidth : 0
				},
				series : Object.keys(series).map(function(key) {
					return series[key]
				})
			});
}