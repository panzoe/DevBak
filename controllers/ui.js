"use strict";

const ipAddressPattern = /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/;

$(function(){
	let $user_name = $("#user\\.name");
	let $user_password = $("#user\\.password");
	let $super_password = $("#user\\.super_password");
	let $user_scripts = $("#ui\\.script_list");
	let $user_tags = $("#ui\\.user_tags");
	let $file_picker = $("#com\\.picker");

	// wait app load from DevBak.scripts
	let $$script_list = null;
	let $$import_data = null;

	// enable select components
	$("select").select2({dropdownCssClass: 'dropdown-inverse'});

	let frage = document.createDocumentFragment();
	let option_template = document.createElement("option");
	let option = option_template.cloneNode();
	for (let s in UserScript) {
		option = option_template.cloneNode();
		option.setAttribute("value" , s);
		option.appendChild(document.createTextNode(s));
		frage.appendChild(option);
	}
	option.setAttribute("selected" , "selected");
	$user_scripts.append(frage);

	/**
	* validate all of user inputs
	* @returns {Boolean}
	**/
	function validate() {
		return true;
	}

	function autoAction() {
		let user_name = $user_name.val();
		let pass_word = $user_password.val();
		let super_password = $super_password.val();
		//let 

		let connection_common = {
			username : user_name , 
			password : password , 
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