"use strict";

const ipAddressPattern = /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/;

const logger = {
	handler : null , 
	cache : {
		warnning : document.createElement("<span style='color:red'>");
	} , 
	info : function(msg) {
		if (handler) {
			handler.appendChild(document.createTextNode(msg));
		}
	} , 
	error : function(msg) {
		if (handler) {
			let warn = this.cache.warnning.cloneNode();
			warn.appendChild(document.createTextNode(msg));
			handler.appendChild(warn);
		}
	}
};

$(function(){
	let $user_name = $("#user\\.name");
	let $user_password = $("#user\\.password");
	let $super_password = $("#user\\.super_password");
	let $user_scripts = $("#ui\\.script_list");
	let $user_tags = $("#ui\\.user_tags");

	// wait app load from DevBak.scripts
	let $$script_list = null;
	let $$import_data = null;

	logger.handler = document.getElementById("ui.logger");

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
	//option.setAttribute("selected" , "selected");
	$user_scripts.append(frage);

	function autoAction() {
		let user_name = $user_name.val();
		let pass_word = $user_password.val();
		let super_password = $super_password.val();
		let user_script = $user_scripts.val();
		let user_tags = $user_tags.val().split(",");

		let connection_common = {
			username : user_name , 
			password : pass_word , 
			superpassword : super_password , 
			shellPrompt: UserData.ShellPrompt , 
			timeout : 1500
		};

		if (! UserScript[user_script]) {
			sweetAlert("Error: no script.");
		};

		user_script = [].concat(UserScript[user_script].actions);
		let info = null;

		// using user script to initial factory
		let factory = new Factory({
			script : user_script , 
			options : connection_common
		});

		let callback = function() {
			let user_tag = user_tags.shift();
			info = UserData[user_tag];

			if (!info) {
				if (user_tags.length > 0) {
					logger.error(user_tag + "'s record is not found.");
					callback();
					return;
				}
				else {
					sweetAlert("All task completed.");
					return;
				}
			};

			(factory.create({
				host : info.IP , 
				port : 23 , 
				data : info
			})).start(callback);
		};

		callback();
	}

	/**
	* validate all of user inputs
	* @returns {Boolean}
	**/
	function validate() {
		if (! $user_name.val()) {
			sweetAlert("Error: username");
			return false;
		}

		if (! $user_password.val()) {
			sweetAlert("Error: password");
			return false;
		}

		if (! $super_password.val()) {
			sweetAlert("Error: superpassword");
			return false;
		}

		if (! $user_scripts.val()) {
			sweetAlert("Error: script");
			return false;
		}

		if (! $user_tags.val()) {
			sweetAlert("Error: sn");
			return false;
		}

		return true;
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