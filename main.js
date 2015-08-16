var opts = {
	type : "redirect",
	name : "Trellomino",
	expiration : "never",
	persist : true,
	interactive : true,
	success : function(result) {
		console.log("Trello authorization success. trello_token = "
			+ localStorage.trello_token);
		
		var dataManager = new DataManager();
		
		var callbackLoad = function(datas) {
			var controller = new MainController(dataManager);
			controller.start();
		}
		
		dataManager.load(callbackLoad);
	},
	error : function(result) {
		console.log("Trello authorization failed");
	}
};

$(function() {
	console.log("Trello authorization");
	Trello.setKey("b4f016843d4809b7087762d32c87377d");
	Trello.authorize(opts);
});