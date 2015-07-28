MainController = function(datas) {
	this._datas = datas;
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
	listSelect.toggle(this._board != null);
	memberSelect.toggle(true);
	labelSelect.toggle(this._board != null);
	
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
	var boardContent = board.html();
	$("#board").html(boardContent);
	$.each(charts, function(index, chart) {
		chart.render(index);
	});
}

MainController.prototype._chooseBoard = function() {
	return new OrganizationsBoard();
}

MainController.prototype._filter = function() {
	var times = [];
	$.each(this._datas.getOrganizations(), function(index, org) {
		$.each(org.getBoards(), function(index, board) {
			$.each(board.getLists(), function(index, list) {
				$.each(list.getCards(), function(index, card) {
					card.calculate();
					$.each(card.getTimes(), function(index, time) {
						times.push(time);
					});
				});
			});
		});
	});
	return times;
}