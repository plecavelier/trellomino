Organization = function(id, name) {
	this._id = id;
	this._name = name;
	this._boards = {};
	this._members = {};
}

Organization.prototype.getId = function() {
	return this._id;
}

Organization.prototype.addBoard = function(board) {
	this._boards[board._id] = board;
	board._organization = this;
}

Organization.prototype.getMembers = function() {
	return this._members;
}

Organization.prototype.getBoards = function() {
	return this._boards;
}

Organization.prototype.getBoard = function(idBoard) {
	return this._boards[idBoard];
}

Organization.prototype.getSelectLabel = function() {
	return this._name;
}