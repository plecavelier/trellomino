MainController = function(dataManager) {
	this._dataManager = dataManager;
	this._datas = dataManager.getDatas();
	this._org = null;
	this._board = null;
	this._list = null;
	this._member = null;
	this._label = null;
	this._workUnit = null;
	this._workUnits = ["hours", "days"];
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
	this._updateTitle();
	this._updateBoard();
}

MainController.prototype._initHeader = function() {
	var thiz = this;
	
	var logOut = this._logOut;
	$("#logOut").bind("click", logOut);
	
	$("#toMain").bind("click", function() {
		thiz._toMain(thiz);
	});

	$.each(this._workUnits, function(index, item) {
		$("#workUnit-" + item).on("click", function(e) {
			thiz._changeWorkUnit(item);
			thiz._update();
		});
	});
	if (localStorage.getItem("workUnit") != null) {
		this._changeWorkUnit(localStorage.getItem("workUnit"));
	} else {
		this._changeWorkUnit("hours");
	}
}

MainController.prototype._updateHeader = function() {

	var memberMenu = $("#memberMenu");
	var orgMenu = $("#orgMenu");
	var boardMenu = $("#boardMenu");
	var listMenu = $("#listMenu");
	var labelMenu = $("#labelMenu");

	memberMenu.toggle(true);
	orgMenu.toggle(true);
	boardMenu.toggle(this._org != null);
	listMenu.toggle(this._board != null);
	labelMenu.toggle(this._board != null);

	this._completeMenu(memberMenu, "member", this._datas.getMembers());
	this._completeMenu(orgMenu, "org", this._datas.getOrganizations());
	if (this._org != null) {
		this._completeMenu(boardMenu, "board", this._org.getBoards());
	}
	if (this._board != null) {
		this._completeMenu(listMenu, "list", this._board.getLists());
	}
	if (this._board != null) {
		this._completeMenu(labelMenu, "label", this._board.getLabels());
	}
}

MainController.prototype._completeMenu = function(menu, type, values) {
	var thiz = this;
	menu.find(".dropdown-menu").empty();
	var html = '';
	$.each(values, function(index, value) {
		html = '<li><a href="#">' + value.getDisplayedLabel() + '</a></li>';
		var li = $(html);
		li.find("a").on("click", function(e) {
			switch (type) {
			case "org":
				thiz._org = value;
				thiz._board = null;
				thiz._list = null;
				thiz._member = null;
				thiz._label = null;
				break;

			case "board":
				thiz._board = value;
				thiz._list = null;
				thiz._member = null;
				thiz._label = null;
				break;

			case "list":
				thiz._list = value;
				thiz._member = null;
				thiz._label = null;
				break;

			case "member":
				thiz._member = value;
				thiz._org = null;
				thiz._board = null;
				thiz._list = null;
				thiz._label = null;
				break;

			case "label":
				thiz._label = value;
				thiz._member = null;
				thiz._list = null;
				break;
			}
			thiz._update();
		});
		menu.find(".dropdown-menu").append(li);
	});
}

MainController.prototype._updateTitle = function() {
	if (this._label != null) {
		$("#title .glyphicon").attr("class", "glyphicon glyphicon-tag");
		$("#title h1").html("Label " + this._label.getDisplayedLabel());
	} else if (this._list != null) {
		$("#title .glyphicon").attr("class", "glyphicon glyphicon-align-justify");
		$("#title h1").html("List " + this._list.getDisplayedLabel());
	} else if (this._board != null) {
		$("#title .glyphicon").attr("class", "glyphicon glyphicon-th");
		$("#title h1").html("Board " + this._board.getDisplayedLabel());
	} else if (this._org != null) {
		$("#title .glyphicon").attr("class", "glyphicon glyphicon-home");
		$("#title h1").html("Organization " + this._org.getDisplayedLabel());
	} else if (this._member != null) {
		$("#title .glyphicon").attr("class", "glyphicon glyphicon-user");
		$("#title h1").html("Member " + this._member.getDisplayedLabel());
	} else {
		$("#title .glyphicon").attr("class", "glyphicon glyphicon-home");
		$("#title h1").html("Organizations");
	}
}

MainController.prototype._updateBoard = function() {
	var times = this._filter();
	var board = this._chooseBoard();

	var charts = board.charts(times, this._workUnit);
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
			html += '<div class="board-chart" id="chart_' + chartIndex
				+ '"></div>';
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
	if (this._label != null) {
		return new LabelBoard();
	} else if (this._list != null) {
		return new ListBoard();
	} else if (this._board != null) {
		return new BoardBoard();
	} else if (this._org != null) {
		return new OrganizationBoard();
	} else if (this._member != null) {
		return new MemberBoard();
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
					if (thiz._label != null && (card.getLabels().length == 0
							|| card.getLabels()[0].getId() != thiz._label.getId())) {
						return;
					}
					$.each(card.getTimes(), function(index, time) {
						if (thiz._member != null && (time.getMember() == null
								|| time.getMember().getId() != thiz._member.getId())) {
							return;
						}
						times.push(time);
					});
				});
			});
		});
	});
	return this._dataManager.sortTimes(times);
}

MainController.prototype._changeWorkUnit = function(workUnit) {
	localStorage.setItem("workUnit", workUnit);
	this._workUnit = workUnit;
	$.each(this._workUnits, function(index, item) {
		$("#workUnit-" + item + " .glyphicon").attr("class", "glyphicon glyphicon-none");
	});
	$("#workUnit-" + workUnit + " .glyphicon").attr("class", "glyphicon glyphicon-ok");
}

MainController.prototype._toMain = function(thiz) {
	thiz._org = null;
	thiz._board = null;
	thiz._list = null;
	thiz._member = null;
	thiz._label = null;
	thiz._update();
}

MainController.prototype._logOut = function() {
	localStorage.removeItem("trello_token");
	document.location.href = "index.html";
}