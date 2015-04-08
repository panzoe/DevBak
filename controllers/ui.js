"use strict";

const telnet = require("telnet-client");
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

	function newConnection(param) {
		let client = new telnet();

		client.on("ready" , (function(){
			let caller = param;
			return function(prompt){
				console.log("connection " + caller.name + " ready.");
				caller.onready();
			}
		})());

		client.on("timeout" , (function(){
			let caller = param;
			return function(){
				console.log("connection " + caller.name + " timeout.");
				caller.ontimeout();
			}
		})());

		client.on("close" , (function(){
			let caller = param;
			return function(){
				console.log("connection " + caller.name + " closed.");
				caller.onclose();
			}
		})());

		return client;
	}

	function startBackupTasks() {
		let client = newConnection({
			name : "localhost" , 
			onready : function(prompt) {
				;
			} , 
			ontimeout : function() {
				;
			} , 
			onclose : function() {
				;
			}
		});

		client.connect({
			host : "127.0.0.1" , 
			port : 3000 ,
			shellPrompt: "/ #" , 
			timeout : 1500
			// removeEcho : 4
		});
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
			startBackupTasks();
		};
	})

	$("#ui\\.breakBackup").bind("click" , function(){
		alert("break right now");
	})
});