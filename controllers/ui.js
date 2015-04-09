"use strict";

const ipAddressPattern = /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/;

$(function(){
	let $user_name = $("#user\\.name");
	let $user_password = $("#user\\.password");
	let $need_enpassword = $("#options\\.need_en_password");
	let $en_password = $("#user\\.en_password");

	/**
	* validate all of user inputs
	* @returns {Boolean}
	**/
	function validate() {
		return true;
	}

	function autoAction() {
		let connection_common = {
			username : "" , 
			password : "" , 
			shellPrompt: "/ #" , 
			timeout : 1500
		};

		let connection_info = {
			host : "127.0.0.1" , 
			port : 3000
		};

		let task_callback = function() {
			;
		}

		let user_script = [];

		// using user script to initial factory
		let factory = new Factory({
			script : user_script , 
			options : connection_common , 
			callback: task_callback
		});

		let auto_action = factory.create(connection_info);

		auto_action.start();
	}

	$("#ui\\.addToListButton").bind("click" , function(){
		alert("add to list");
	})

	$("#ui\\.importListData").bind("click" , function(){
		alert("import list data");
	})

	$("#ui\\.deleteSelected").bind("click" , function(){
		alert("delete selected");
	})

	$("#ui\\.clearList").bind("click" , function(){
		alert("clear list");
	})

	$("#ui\\.startBackup").bind("click" , function(){
		if (validate()) {
			autoAction();
		};
	})

	$("#ui\\.breakBackup").bind("click" , function(){
		alert("break right now");
	})
});