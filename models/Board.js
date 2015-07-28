Board = function(id, name) {
	this._id = id;
	this._name = name;
	this._lists = {};
	this._labels = {};
	this._cards = {};
	this._organization = null;
}

Board.prototype.getId = function() {
	return this._id;
}

Board.prototype.getName = function() {
	return this._name;
}

Board.prototype.addList = function(list) {
	this._lists[list._id] = list;
	list._board = this;
}

Board.prototype.getList = function(idList) {
	return this._lists[idList];
}

Board.prototype.getLists = function() {
	return this._lists;
}

Board.prototype.addLabel = function(label) {
	this._labels[label._id] = label;
	label._board = this;
}

Board.prototype.cardExists = function(idCard) {
	return idCard in this._cards;
}

Board.prototype.getCard = function(idCard) {
	return this._cards[idCard];
}

Board.prototype.addCard = function(card) {
	this._cards[card._id] = card;
	card._board = this;
}

Board.prototype.getLabels = function() {
	return this._labels;
}

Board.prototype.getLabel = function(idLabel) {
	return this._labels[idLabel];
}

Board.prototype.getSelectLabel = function() {
	return this._name;
}