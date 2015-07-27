var LIMIT = 1000;

var opts = {
	type : "redirect",
	name : "trellomino",
	persist : true,
	interactive : true,
	success : function(result) {
		console.log("Trello authorization success. trello_token = "
			+ localStorage.trello_token);
		start();
	},
	error : function(result) {
		console.log("Trello authorization failed");
	}
};







var controller = {
		
	org : null,
	board : null,
	list : null,
	member : null,
	label : null,
	
	start : function(data) {
		this.data = data;
		console.log("Start controller");

		this.initHeader();
	},
	
	initHeader : function() {
		
		var orgSelect = $("#org");
		var boardSelect = $("#board");
		var listSelect = $("#list");
		var memberSelect = $("#member");
		var labelSelect = $("#label");
		
		var thiz = this;
		
		orgSelect.change(function() {
			thiz.org = null;
			thiz.board = null;
			thiz.list = null;
			thiz.member = null;
			thiz.label = null;
			var value = $(this).val();
			if (value != "") {
				thiz.org = thiz.data.orgs[value];
			}
			thiz.updateHeader();
		});

		boardSelect.change(function() {
			thiz.board = null;
			thiz.list = null;
			thiz.member = null;
			thiz.label = null;
			var value = $(this).val();
			if (value != "") {
				thiz.board = thiz.org.boards[value];
			}
			thiz.updateHeader();
		});

		listSelect.change(function() {
			thiz.list = null;
			var value = $(this).val();
			if (value != "") {
				thiz.list = thiz.board.lists[value];
			}
			thiz.updateHeader();
		});

		memberSelect.change(function() {
			thiz.member = null;
			var value = $(this).val();
			if (value != "") {
				thiz.member = thiz.data.members[value];
			}
			thiz.updateHeader();
		});

		labelSelect.change(function() {
			thiz.label = null;
			var value = $(this).val();
			if (value != "") {
				thiz.label = thiz.board.labels[value];
			}
			thiz.updateHeader();
		});

		this.updateHeader();
	},
	
	clearValues() {
		this.org = null;
		this.board = null;
		this.list = null;
		this.member = null;
		this.label = null;
	},
	
	updateHeader : function() {
		
		var orgSelect = $("#org");
		var boardSelect = $("#board");
		var listSelect = $("#list");
		var memberSelect = $("#member");
		var labelSelect = $("#label");
			
		orgSelect.toggle(true);
		boardSelect.toggle(this.org != null);
		listSelect.toggle(this.board != null);
		memberSelect.toggle(true);
		labelSelect.toggle(this.board != null);
		
		this.completeSelect(orgSelect, this.org, data.orgs, "name", "Organizations");
		if (this.org != null) {
			this.completeSelect(boardSelect, this.board, this.org.boards, "name", "Boards");
		}
		if (this.board != null) {
			this.completeSelect(listSelect, this.list, this.board.lists, "name", "Lists");
		}
		var members;
		if (this.board != null) {
			members = this.board.members;
		} else if (this.org != null) {
			members = this.org.members;
		} else {
			members = this.data.members;
		}
		this.completeSelect(memberSelect, this.member, members, "fullName", "Members");
		if (this.board != null) {
			this.completeSelect(labelSelect, this.label, this.board.labels, "name", "Labels");
		}
	},
	
	completeSelect : function(select, selectedValue, values, property, noneLabel) {
		var html = '<option value="">' + noneLabel + '</option>';
		$.each(values, function(index, value) {
			html += '<option value="' + value.id + '">' + value[property] + '</option>';
		});
		select.html(html);
		if (selectedValue == null) {
			select.val("");
		} else {
			select.val(selectedValue.id);
		}
	}
}




$(function() {
	console.log("Trello authorization");
	Trello.setKey("b4f016843d4809b7087762d32c87377d");
	Trello.authorize(opts);
});

var callback = function(data) {
	alert("finish");
	controller.start(data);
}

var percent = {

	number : 0,
	tasks : 0,
	
	start : function(tasks) {
		this.number = tasks;
		console.log("==== Start " + tasks + " ====");
	},
	
	finish : function(data) {
		console.log("==== Finish ====");
		this.tasks++;
		$("#percent").html(Math.round((this.tasks / this.number) * 100));
		if (this.tasks == this.number) {
			callback(data);
		}
	}
}

var data = {};
function start() {
	console.log("Get member me");
	Trello.get("members/me", {
		"fields" : "",
		"boards" : "organization,members",
		"board_fields" : "name",
		"board_organization" : true,
		"board_organization_fields" : "displayName"
	}, function(result) {
		console.log("Get member me success");
		console.log(result);
		
		data.orgs = {};
		data.members = {};
		
		data.orgs['my'] = {};
		data.orgs['my'].id = "my";
		data.orgs['my'].name = "My Boards";
		data.orgs['my'].boards = {};
		data.orgs['my'].members = {};
		
		console.log(data);
		
		percent.start(result.boards.length * 2);
		
		console.log("===== Boards =====");
		console.log(result.boards);
		
		$.each(result.boards, function(index, board) {
			
			if ("organization" in board) {
				if (!(board.organization.id in data.orgs)) {
					var dataOrg = {};
					dataOrg = {};
					dataOrg.id = board.organization.id;
					dataOrg.name = board.organization.displayName;
					dataOrg.boards = {};
					dataOrg.members = {};
					data.orgs[board.organization.id] = dataOrg;
				}
			}
			
			console.log("Get board " + board.id);
			
			Trello.get("boards/" + board.id, {
				"fields" : "name,idOrganization",
				"lists" : "all",
				"list_fields" : "name,pos",
				"labels" : "all",
				"cards" : "all",
				"card_fields" : "name,idLabels,idList"
			}, function(result) {
				console.log("Get board " + board.id + " success");
				console.log(result);
				
				var idOrg = result.idOrganization != null ? result.idOrganization : 'my';
				
				if (idOrg in data.orgs) {
					var orgData = data.orgs[idOrg];
					var dataBoard = {};
					dataBoard.id = result.id;
					dataBoard.name = result.name;
					dataBoard.org = orgData;
					dataBoard.lists = {};
					dataBoard.labels = {};
					dataBoard.cards = {};
					dataBoard.members = {};
					orgData.boards[dataBoard.id] = dataBoard;
					
					$.each(result.lists, function(index, list) {
						var dataList = {};
						dataList.id = list.id;
						dataList.pos = list.pos;
						dataList.name = list.name;
						dataList.board = dataBoard;
						dataList.cards = {};
						dataList.members = {};
						dataBoard.lists[dataList.id] = dataList;
					});
					
					$.each(result.labels, function(index, label) {
						var dataLabel = {};
						dataLabel.id = label.id;
						dataLabel.name = label.name;
						dataLabel.color = label.color;
						dataLabel.board = dataBoard;
						dataBoard.labels[dataLabel.id] = dataLabel;
					});

					console.log(result.cards);
					$.each(result.cards, function(index, card) {
						var dataList = dataBoard.lists[card.idList];
						var dataCard = {};
						dataCard.id = card.id;
						dataCard.name = card.name;
						dataCard.actions = {};
						dataCard.members = {};
						dataCard.list = dataList;
						dataList.cards[dataCard.id] = dataCard;
						dataBoard.cards[dataCard.id] = dataCard;
					});
					
					substart(dataBoard, data, 0);
				} else {
					percent.finish(data);
				}
				
				percent.finish(data);
				
			}, function() {
				console.log("Get board " + board.id + " failed");
			});
		});

	}, function() {
		console.log("Get member me failed");
	});
}

// TODO : Revoir récursivité avec dates
function substart(dataBoard, data, page) {
	console.log("Get board actions " + dataBoard.id + ", page " + page);
	
	Trello.get("boards/" + dataBoard.id + "/actions", {
		filter : "commentCard",
		fields : "data,date",
		member : false,
		memberCreator : true,
		memberCreator_fields : "username,fullName",
		page : page,
		limit : LIMIT
	}, function(result) {
		console.log("Get board actions " + dataBoard.id + " success");
		console.log(result);

		$.each(result, function(index, action) {
			// TODO Plus for Trello regexp
			var match = true;
			if (action.data.card.id in dataBoard.cards && match) {
				var dataCard = dataBoard.cards[action.data.card.id];
				
				var dataAction = {};
				dataAction.id = action.id;
				dataAction.date = action.date;
				dataAction.text = action.data.text;
				dataAction.card = dataCard;
				dataCard.actions[dataAction.id] = dataAction;
				
				if (!(action.memberCreator.id in data.members)) {
					var dataMember = {};
					dataMember.id = action.memberCreator.id;
					dataMember.name = action.memberCreator.username;
					dataMember.fullName = action.memberCreator.fullName;
					data.members[dataMember.id] = dataMember;
				}
				
				dataAction.member = data.members[action.memberCreator.id];
				dataAction.card.members[dataAction.member.id] = dataAction.member;
				dataAction.card.list.members[dataAction.member.id] = dataAction.member;
				dataAction.card.list.board.members[dataAction.member.id] = dataAction.member;
				dataAction.card.list.board.org.members[dataAction.member.id] = dataAction.member;
			}
		});
		
		if (result.length == LIMIT) {
			substart(dataBoard, data.members, page + 1);
		} else {
			display(data);
			percent.finish(data);
		}
		
	}, function() {
		console.log("Get board actions " + dataBoard.id + " failed");
	});
}

function display(data) {
	var html = "";
	html += "<div>+ Members</div>";
	$.each(data.members, function(index, member) {
		html += "<div style=\"margin-left: 10px\">- " + member.fullName + "</div>";
	});
	html += "<div>+ Orgs</div>";
	$.each(data.orgs, function(index, org) {
		html += "<div style=\"margin-left: 10px\">- " + org.name + "</div>";
		html += "<div style=\"margin-left: 20px\">+ Boards</div>";
		$.each(org.boards, function(index, board) {
			html += "<div style=\"margin-left: 30px\">- " + board.name + "</div>";
			html += "<div style=\"margin-left: 40px\">+ Labels</div>";
			$.each(board.labels, function(index, label) {
				html += "<div style=\"margin-left: 50px\">- " + label.name + "</div>";
			});
			html += "<div style=\"margin-left: 40px\">+ Lists</div>";
			$.each(board.lists, function(index, list) {
				html += "<div style=\"margin-left: 50px\">- " + list.name + "</div>";
				html += "<div style=\"margin-left: 60px\">+ Cards</div>";
				$.each(list.cards, function(index, card) {
					html += "<div style=\"margin-left: 70px\">- " + card.name + "</div>";
					html += "<div style=\"margin-left: 80px\">+ Actions</div>";
					$.each(card.actions, function(index, action) {
						html += "<div style=\"margin-left: 90px\">- " + action.text + "</div>";
					});
				});
			});
		});
	});
	$("#display").html(html);
}