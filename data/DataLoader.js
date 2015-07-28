DataLoader = function(callback) {
	this._datas = new Datas();
	this._progress = new DataProgress(callback, this._datas);
}

DataLoader.prototype.load = function() {
	var thiz = this;

	thiz._progress.addTasks(1);
	console.log("Get member me");
	Trello.get("members/me", {
		"fields" : "",
		"boards" : "organization,members",
		"board_fields" : "name",
		"board_organization" : true,
		"board_organization_fields" : "displayName"
	}, function(result) {
		console.log("Get member me success");

		var myOrganization = new Organization("my", "My Boards");
		thiz._datas.addOrganization(myOrganization);

		$.each(result.boards, function(index, board) {
			
			if ("organization" in board) {
				if (!thiz._datas.organizationExists(board.organization.id)) {
					var organizationData = new Organization(
							board.organization.id,
							board.organization.displayName);
					thiz._datas.addOrganization(organizationData);
				}
			}

			thiz._progress.addTasks(2);
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
				
				var idOrganization = result.idOrganization != null ? result.idOrganization : 'my';
				
				if (thiz._datas.organizationExists(idOrganization)) {
					
					var organizationData = thiz._datas.getOrganization(idOrganization);
					var boardData = new Board(result.id, result.name);
					organizationData.addBoard(boardData);
					
					$.each(result.lists, function(index, list) {
						var listData = new List(list.id, list.name, list.pos);
						boardData.addList(listData);
					});
					
					$.each(result.labels, function(index, label) {
						var labelData = new Label(label.id, label.name, label.color);
						boardData.addLabel(labelData);
					});
					
					$.each(result.cards, function(index, card) {
						var cardData = new Card(card.id, card.name);
						var listData = boardData.getList(card.idList);
						listData.addCard(cardData);
						boardData.addCard(cardData);
					});
					
					thiz._loadTimes(boardData, 0);
				} else {
					thiz._progress.removeTasks(1);
				}
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

DataLoader.prototype._loadTimes = function(boardData, page) {
	var thiz = this;
	
	console.log("Get board actions " + boardData.getId());
	Trello.get("boards/" + boardData.getId() + "/actions", {
		filter : "commentCard",
		fields : "data,date",
		member : false,
		memberCreator : true,
		memberCreator_fields : "username,fullName",
		page : page,
		limit : 1000
	}, function(result) {
		console.log("Get board actions " + boardData.getId() + " success");
		$.each(result, function(index, action) {
			if (boardData.cardExists(action.data.card.id)) {
				var timeData = new Time(action.id, action.date, action.data.text);
				if (timeData.isTime()) {
					var cardData = boardData.getCard(action.data.card.id);
					cardData.addTime(timeData);
					
					var memberData;
					if (thiz._datas.memberExists(action.memberCreator.id)) {
						memberData = thiz._datas.getMember(action.memberCreator.id);
					} else {
						memberData = new Member(action.memberCreator.id, action.memberCreator.username, 
								action.memberCreator.fullName);
						thiz._datas.addMember(memberData);
					}
					
					timeData.setMemberCreator(memberData);
				}
			}
		});
		
		if (result.length == 1000) {
			thiz._loadTimes(boardData, page + 1);
		} else {
			thiz._progress.removeTasks(1);
		}
		
	}, function() {
		console.log("Get board actions " + boardData.getId() + " failed");
	});
}