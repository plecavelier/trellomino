Datas = function() {
	this._organizations = {};
	this._members = {};
}

Datas.prototype.addOrganization = function(organization) {
	this._organizations[organization._id] = organization;
}

Datas.prototype.getOrganization = function(idOrganization) {
	return this._organizations[idOrganization];
}

Datas.prototype.getOrganizations = function() {
	return this._organizations;
}

Datas.prototype.organizationExists = function(idOrganization) {
	return idOrganization in this._organizations;
}

Datas.prototype.addMember = function(member) {
	this._members[member._id] = member;
}

Datas.prototype.getMember = function(idMember) {
	return this._members[idMember];
}

Datas.prototype.getMembers = function() {
	return this._members;
}

Datas.prototype.memberExists = function(idMember) {
	return idMember in this._members;
}