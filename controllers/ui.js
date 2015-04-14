"use strict";

const ipAddressPattern = /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/;

// simple logger system
const logger = {
	handler : null , 
	report : [] , 
	template : {
		warnning : (function(){
			let element = document.createElement("span");
				element.style.color = "red";
			return element;
		})()
	} , 
	info : function(msg) {
		if (handler) {
			handler.appendChild(document.createTextNode(msg));
			return msg;
		}
	} , 
	error : function(msg) {
		if (handler) {
			let warn = this.template.warnning.cloneNode();
			warn.appendChild(document.createTextNode(msg));
			handler.appendChild(warn);
			return msg;
		}
	}
};

// for a sweet calling eg. work with logger system.
String.prototype.sweetAlert = function() {
	sweetAlert(this);
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

	// bind user scripts to ui for user select.
	let frage = document.createDocumentFragment();
	let option_template = document.createElement("option");
	let option = option_template.cloneNode();
	for (let s in UserScript) {
		option = option_template.cloneNode();
		option.setAttribute("value" , s);
		option.appendChild(document.createTextNode(s));
		frage.appendChild(option);
	}

	$user_scripts.append(frage);

	/**
	* create auto action job.
	**/
	function autoAction() {
		//FIXME simply get all data from ui , need a completed data check here.
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
			timeout : +(UserData.Timeout)
		};

		// check selected user script exist
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

		let callback = function __callback() {
			let user_tag = user_tags.shift();
			info = UserData[user_tag];

			if (!info) {
				if (user_tags.length > 0) {
					logger.error(user_tag + "'s record is not found.");
					__callback();
					return;
				}
				else {
					logger.info("All task completed.").sweetAlert();
					return;
				}
			};

			(factory.create({
				host : info.IP , 
				port : 23 , 
				data : info
			})).start(__callback);
		};

		callback();
	}

	/**
	* validate all of user inputs
	* @returns {Boolean}
	**/
	function validate() {
		let result = {
			validate : true , 
			message : []
		};

		if (! $user_name.val()) {
			result.message.push("username");
		};

		if (! $user_password.val()) {
			result.message.push("password");
		};

		if (! $super_password.val()) {
			result.message.push("superpassword");
		};

		if (! $user_scripts.val()) {
			result.message.push("script");
		};

		if (! $user_tags.val()) {
			result.message.push("sn");
		};

		if (result.message.length) {
			result.validate = false;
		}

		return result;
	}

	$("#ui\\.clearList").bind("click" , function(){
		sweetAlert("clear list");
	})

	$("#ui\\.startBackup").bind("click" , function(){
		let check = validate();
		if (check.validate) {
			autoAction();
		}
		else {
			sweetAlert("Error:" + check.message.join(","));
		}
	})

	$("#ui\\.breakBackup").bind("click" , function(){
		sweetAlert("break right now");
	})
});