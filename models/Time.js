Time = function(id, date, text) {
	this._id = id;
	this._commentDate = new Date(date);
	this._date = new Date(date);
	this._isTime = false;
	this._spent = null;
	this._estimateDelta = null;
	this._memberCreator = null;
	this._username = null;
	this._card = null;
	this._parseTimes(text);
	
	this._remaining = 0;
	this._delta = 0;
}

Time.prototype.getId = function() {
	return this._id;
}

Time.prototype.getCard = function() {
	return this._card;
}

Time.prototype.setCard = function(card) {
	this._card = card;
}

Time.prototype.getEstimateDelta = function() {
	return this._estimateDelta;
}

Time.prototype.getCommentDate = function() {
	return this._commentDate;
}

Time.prototype.getDate = function() {
	return this._date;
}

Time.prototype.isTime = function() {
	return this._isTime;
}

Time.prototype.getMember = function(member) {
	if (this._username != null) {
		var member = this._card.getBoard().getOrganization().getDatas().getMemberByName(this._username);
		if (member == null) {
			var fictiveMember = new Member(this._username, this._username, this._username);
			this._card.getBoard().getOrganization().getDatas().addMember(fictiveMember);
			return fictiveMember;
		}
		return member;
	}
	return this._memberCreator;
}

Time.prototype.setMemberCreator = function(memberCreator) {
	this._memberCreator = memberCreator;
}

Time.prototype.getSpent = function() {
	return this._spent;
}

Time.prototype.getRemaining = function() {
	return this._remaining;
}

Time.prototype.setRemaining = function(remaining) {
	this._remaining = remaining;
}

Time.prototype.getDelta = function() {
	return this._delta;
}

Time.prototype.setDelta = function(delta) {
	this._delta = delta;
}

Time.prototype._parseTimes = function(text) {
	var regexp = new RegExp('plus!( *@[a-zA-Z0-9]+)?( *-[0-9]+d)? *(-?[0-9]+\.?[0-9]*)/(-?[0-9]+\.?[0-9]*)', 'i');
	var match = regexp.exec(text);
	if (match) {
		this._isTime = true;
		this._spent = parseFloat(match[3]);
		this._estimateDelta = parseFloat(match[4]);
		
		if (match[1]) {
			this._username = match[1].trim().substring(1);
		}
	}
}