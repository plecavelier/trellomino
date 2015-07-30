List = function(id, name, pos) {
	this._id = id;
	this._name = name;
	this._pos = pos;
	this._cards = {};
	this._board = null;
}

List.prototype.getId = function() {
	return this._id;
}

List.prototype.getName = function() {
	return this._name;
}

List.prototype.getCards = function() {
	return this._cards;
}

List.prototype.addCard = function(card) {
	this._cards[card._id] = card;
	card._list = this;
}

List.prototype.getSelectLabel = function() {
	return this._name;
}