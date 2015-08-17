DataManager = function() {
	// Init datas
	this._datas = new Datas();
	var thiz = this;
}

DataManager.prototype.getDatas = function() {
	return this._datas;
}

DataManager.prototype.load = function(callback) {
	var thiz = this;

	var realCallback = function() {
		thiz._finalizeLoad();
		callback(thiz._datas);
	}
	this._progress = new DataProgress(realCallback, this._datas);

	thiz._progress.addTasks(1);
	console.log("Get member me");
	
	// Get my boards and their organization from Trello API
	Trello.get("members/me", {
		"fields" : "",
		"boards" : "organization,members,open",
		"board_fields" : "name,closed",
		"board_organization" : true,
		"board_organization_fields" : "displayName"
	}, function(result) {
		console.log("Get member me success");

		// Add fictive organization "My boards" to datas
		var myOrganization = new Organization("my", "My Boards");
		thiz._datas.addOrganization(myOrganization);

		$.each(result.boards, function(index, board) {
			
			if (board.closed) {
				return;
			}
			
			if ("organization" in board) {
				if (!thiz._datas.organizationExists(board.organization.id)) {
					// Add organization to datas
					var organizationData = new Organization(
							board.organization.id,
							board.organization.displayName);
					thiz._datas.addOrganization(organizationData);
				}
			}

			thiz._progress.addTasks(2);
			console.log("Get board " + board.id);
			
			// Get lists, labels and cards of board from Trello API
			Trello.get("boards/" + board.id, {
				"fields" : "name,idOrganization,prefs",
				"lists" : "all",
				"list_fields" : "name,pos",
				"labels" : "all",
				"cards" : "all",
				"card_fields" : "name,idLabels,idList"
			}, function(result) {
				console.log("Get board " + board.id + " success");
				
				// Define organization ID ("my" if null)
				var organizationExists = result.idOrganization != null&& thiz._datas.organizationExists(result.idOrganization);
				var idOrganization = organizationExists ? result.idOrganization : 'my';
				var organizationData = thiz._datas.getOrganization(idOrganization);
				
				// Add board to organization
				var boardData = new Board(result.id, result.name, result.prefs.background);
				organizationData.addBoard(boardData);
				
				$.each(result.lists, function(index, list) {
					// Add list to board
					var listData = new List(list.id, list.name, list.pos);
					boardData.addList(listData);
				});
				
				$.each(result.labels, function(index, label) {
					// Add label to board
					var labelData = new Label(label.id, label.name, label.color);
					boardData.addLabel(labelData);
				});
				
				$.each(result.cards, function(index, card) {
					// Add card to list and board
					var cardData = new Card(card.id, card.name);
					var listData = boardData.getList(card.idList);
					listData.addCard(cardData);
					boardData.addCard(cardData);
					
					$.each(card.idLabels, function(index, idLabel) {
						// Add label to board
						var label = boardData.getLabel(idLabel);
						cardData.addLabel(label);
					});
				});
				
				thiz._loadTimes(boardData, 0);
					
				thiz._progress.removeTasks(1);
				
			}, function() {
				console.log("Get board " + board.id + " failed");
			});
		});

		thiz._progress.removeTasks(1);
		
	}, function() {
		console.log("Get member me failed");
	});
}

DataManager.prototype._loadTimes = function(boardData, page) {
	var thiz = this;
	
	console.log("Get board actions " + boardData.getId());
	
	// Get board comments from Trello API
	Trello.get("boards/" + boardData.getId() + "/actions", {
		filter : "commentCard,createCard",
		fields : "data,date,type",
		member : false,
		memberCreator : true,
		memberCreator_fields : "username,fullName",
		page : page,
		limit : 1000
	}, function(result) {
		console.log("Get board actions " + boardData.getId() + " success");
		$.each(result, function(index, action) {
			if (boardData.cardExists(action.data.card.id)) {
				var cardData = boardData.getCard(action.data.card.id);
				
				if (action.type == "createCard") {
					cardData.setCreationDate(new Date(action.date));
					return;
				}
				
				// Parse Plus for Trello comment
				var tokens = thiz._parseComment(action.data.text);
				if (tokens) {
					
					// Date of time
					var date = new Date(action.date);
					if (tokens['days'] != null) {
						date.setDate(date.getDate() + tokens['days']);
						date.setHours(0, 0, 0, 0);
					}
					
					// Date of comment
					var commentDate = new Date(action.date);
					
					// Member creator
					var memberData;
					if (thiz._datas.memberExists(action.memberCreator.id)) {
						memberData = thiz._datas.getMember(action.memberCreator.id);
					} else {
						// Add member to datas if not exists
						memberData = new Member(action.memberCreator.id, action.memberCreator.username, 
								action.memberCreator.fullName);
						thiz._datas.addMember(memberData);
					}
					
					// Add time to card
					var timeData = new Time(action.id, date, commentDate, tokens['left'], tokens['right'], 0, memberData,
							tokens['username']);
					cardData.addTime(timeData);
				}
			}
		});
		
		if (result.length == 1000) {
			thiz._loadTimes(boardData, page + 1);
		} else {
			thiz._progress.removeTasks(1);
		}
		
	}, function() {
		console.log("Get board actions " + boardData.getId() + " failed. Ignore board.");
		thiz._progress.removeTasks(1);
	});
}

DataManager.prototype._finalizeLoad = function() {
	var thiz = this;
	
	// Complete time member
	$.each(this._datas.getAllTimes(), function(index, time) {
		var member
		if (time.getUsername() != null) {
			member = thiz._datas.getMemberByName(this._username);
			if (member == null) {
				// Create fictive member if not exists in datas
				member = new Member(this._username, this._username, this._username);
				thiz._datas.addMember(member);
			}
		} else {
			member = time.getMemberCreator();
		}
		time.setMember(member);
	});
	
	// Set estimate sold
	$.each(this._datas.getAllCards(), function(index, card) {
		
		var sold = thiz._parseSold(card.getName());
		
		// Set card estimate
		if (sold !== false) {
			var sortedTimesByDate = thiz.sortTimes(card.getTimes());
			var id = "sold_" + card.getId();
			var date = new Date(card.getCreationDate());
			var soldTime = null;
			if (sortedTimesByDate.length == 0) {
				soldTime = new Time(id, date, date, 0, sold, sold, null, null);
			} else {
				soldTime = new Time(id, date, date, 0, 0, sold, null, null);
			}
			card.addTime(soldTime);
			card.setSold(sold);
		}
	});
}

DataManager.prototype._isRecurrent = function(cardName) {
	var regexp = new RegExp('\\[R\\]$', 'i');
	return !!regexp.exec(cardName);
}

DataManager.prototype._parseComment = function(comment) {
	var regexp = new RegExp('plus!( *@[a-zA-Z0-9]+)?( *(-[0-9]+)d)? *(-?[0-9]+\.?[0-9]*)/(-?[0-9]+\.?[0-9]*)', 'i');
	var match = regexp.exec(comment);
	if (match) {
		var tokens = {
			"username" : null,
			"days" : null,
			"left" : null,
			"right" : null
		};
		if (match[1]) {
			tokens['username'] = match[1].trim().substring(1);
		}
		if (match[3]) {
			tokens['days'] = parseFloat(match[3]);
		}
		if (match[4]) {
			tokens['left'] = parseFloat(match[4]);
		}
		if (match[5]) {
			tokens['right'] = parseFloat(match[5]);
		}
		return tokens;
	}
	return false;
}

DataManager.prototype._parseSold = function(cardName) {
	var regexp = new RegExp('#([0-9]+)h', 'i');
	var match = regexp.exec(cardName);
	if (match) {
		return parseInt(match[1]);
	}
	return false;
}

DataManager.prototype.sortTimes = function(times) {
	if (!$.isArray(times)) {
		times = Object.keys(times).map(function(key) {
			return times[key];
		});
	}
	times = _.sortBy(times, function(time) {
		return "" + time.getDate().getTime() + "-" + time.getCommentDate().getTime();
	});
	return times/* .reverse() */;
}

DataManager.prototype._getTimeDate = function(time) {
	var date = new Date(time.getDate());
	date.setHours(0, 0, 0, 0);
	return date;
}