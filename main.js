var opts = {
	type : "redirect",
	name : "trellomino",
	persist : true,
	interactive : true,
	success : function(result) {
		console.log("Trello authorization success. trello_token = "
			+ localStorage.trello_token);
		
		var callbackLoad = function(datas) {
			var controller = new MainController(datas);
			controller.start();
		}
		
		var dataLoader = new DataLoader(callbackLoad);
		dataLoader.load();
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