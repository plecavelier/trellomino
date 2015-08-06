MainController = function(dataManager) {
	this._dataManager = dataManager;
	this._datas = dataManager.getDatas();
	this._org = null;
	this._board = null;
	this._list = null;
	this._member = null;
	this._label = null;
}

MainController.prototype.start = function() {
	console.log("Start controller");
	
	this._initHeader();
	
	$("#progress").hide();
	$("#page").show();
	this._showColors();
	this._update();
}

MainController.prototype._update = function() {
	this._updateHeader();
	this._updateBoard();
}

MainController.prototype._initHeader = function() {
	
	var orgSelect = $("#orgSelect");
	var boardSelect = $("#boardSelect");
	var listSelect = $("#listSelect");
	var memberSelect = $("#memberSelect");
	var labelSelect = $("#labelSelect");
	
	var thiz = this;
	
	orgSelect.change(function() {
		thiz._org = null;
		thiz._board = null;
		thiz._list = null;
		thiz._member = null;
		thiz._label = null;
		var value = $(this).val();
		if (value != "") {
			thiz._org = thiz._datas.getOrganization(value);
		}
		thiz._update();
	});

	boardSelect.change(function() {
		thiz._board = null;
		thiz._list = null;
		thiz._member = null;
		thiz._label = null;
		var value = $(this).val();
		if (value != "") {
			thiz._board = thiz._org.getBoard(value);
		}
		thiz._update();
	});

	listSelect.change(function() {
		thiz._list = null;
		var value = $(this).val();
		if (value != "") {
			thiz._list = thiz._board.getList(value);
		}
		thiz._update();
	});

	memberSelect.change(function() {
		thiz._member = null;
		var value = $(this).val();
		if (value != "") {
			thiz._member = thiz._datas.getMember(value);
		}
		thiz._update();
	});

	labelSelect.change(function() {
		thiz._label = null;
		var value = $(this).val();
		if (value != "") {
			thiz._label = thiz._board.getLabel(value);
		}
		thiz._update();
	});
}

MainController.prototype._updateHeader = function() {
	
	var orgSelect = $("#orgSelect");
	var boardSelect = $("#boardSelect");
	var listSelect = $("#listSelect");
	var memberSelect = $("#memberSelect");
	var labelSelect = $("#labelSelect");
		
	orgSelect.toggle(true);
	boardSelect.toggle(this._org != null);
	//listSelect.toggle(this._board != null);
	listSelect.toggle(false);
	//memberSelect.toggle(true);
	memberSelect.toggle(false);
	//labelSelect.toggle(this._board != null);
	labelSelect.toggle(false);
	
	this._completeSelect(orgSelect, this._org, this._datas.getOrganizations(), "Organizations");
	if (this._org != null) {
		this._completeSelect(boardSelect, this._board, this._org.getBoards(), "Boards");
	}
	if (this._board != null) {
		this._completeSelect(listSelect, this._list, this._board.getLists(), "Lists");
	}
	
	this._completeSelect(memberSelect, this._member, this._datas.getMembers(), "Members");
	if (this._board != null) {
		this._completeSelect(labelSelect, this._label, this._board.getLabels(), "Labels");
	}
}

MainController.prototype._completeSelect = function(select, selectedValue, values, noneLabel) {
	console.log("Complete select");
	var html = '<option value="">' + noneLabel + '</option>';
	$.each(values, function(index, value) {
		html += '<option value="' + value.getId() + '">' + value.getSelectLabel() + '</option>';
	});
	select.html(html);
	if (selectedValue == null) {
		select.val("");
	} else {
		select.val(selectedValue.getId());
	}
}

MainController.prototype._updateBoard = function() {
	var times = this._filter();
	var board = this._chooseBoard();
	
	var charts = board.charts(times);
	var chartsToRender = [];
	
	var html = "";
	var chartIndex = 0;
	$.each(charts, function(index, row) {
		html += '<div class="board-row">';
		$.each(row, function(index, column) {
			var style = "width" in column ? "width: " + column.width : "";
			html += '<div class="board-col" style="' + style + '">';
			html += '<div class="board-widget">';
			html += '<div class="board-header">';
			html += '<h3>' + column.name + '</h3>';
			html += '</div>';
			html += '<div id="chart_' + chartIndex + '"></div>';
			html += '</div>';
			html += '</div>';
			chartIndex++;
			
			chartsToRender.push(column.chart);
		});
		html += '</div>';
	});
	$("#board").html(html);
	
	$.each(chartsToRender, function(index, chart) {
		chart.render("chart_" + index);
	});
}

MainController.prototype._chooseBoard = function() {
	if (this._list != null) {
		return new ListBoard();
	} else if (this._board != null) {
		return new BoardBoard();
	} else if (this._org != null) {
		return new OrganizationBoard();
	} else {
		return new MainBoard();
	}
}

MainController.prototype._filter = function() {
	var thiz = this;
	var times = [];
	$.each(this._datas.getOrganizations(), function(index, org) {
		if (thiz._org != null && thiz._org.getId() != org.getId()) {
			return;
		}
		$.each(org.getBoards(), function(index, board) {
			if (thiz._board != null && thiz._board.getId() != board.getId()) {
				return;
			}
			$.each(board.getLists(), function(index, list) {
				if (thiz._list != null && thiz._list.getId() != list.getId()) {
					return;
				}
				$.each(list.getCards(), function(index, card) {
					$.each(card.getTimes(), function(index, time) {
						times.push(time);
					});
				});
			});
		});
	});
	return this._dataManager.sortTimes(times);
}

MainController.prototype._showColors = function() {
	var html = "<div>";
	$.each((new Chart()).colors, function(index, color) {
		html += '<div title="' + index + '" class="color" style="background: ' + color + '" />';
	});
	html += "</div><div>";
	$.each((new Chart()).trelloColors, function(index, color) {
		html += '<div title="' + index + '" class="color" style="background: ' + color + '" />';
	});
	html += "</div>";
	$("#colors").html(html);
}