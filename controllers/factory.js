"use strict";

const telnet = require("telnet-client");
const format = require("string-template")

class AutoAction {
	constructor(param) {
		this.hooks = {};
		this.options = param.options;
		/**
		* @type {[{"expect" : String , "command" : String}]}
		*/
		this.script = param.script;
		this.callback = param.callback;
		// user data record eg. SN,IP,PORT
		this.data = param.data;

		this.client = new telnet();

		// bind task information into orign telnet objects
		this.autoaction = this;

		this.client.on("ready" , function dotask(prompt){
			let autoaction = this.autoaction;
			let task = autoaction.script.shift();

			if (task) {
				let expect = task.expect ? task.expect : autoaction.options.shellPrompt;
				if (prompt.search(task.expect) != -1) {
					let command = task.command;
					command = command.replace(/\$\{VARS_/g,"{var");
					command = format(command , autoaction.data);
					command = command.replace(/\$\{IMPORTS_/g,"{imp");
					command = format(command , autoaction.data);
					this.exec(task.command , dotask);
				}
				else {
					autoaction.callback.apply(this , ["notexpect"]);
				}
			}
			else {
				if (autoaction.script.length === 0) {
					autoaction.callback.apply(this , ["completed"]);
				}
				else {
					autoaction.callback.apply(this , ["scripterror"]);
				}
			}
		});

		this.client.on("timeout" , function(){
			let autoaction = this.autoaction;
			if (autoaction.hooks.ontimeout) {
				autoaction.hooks.ontimeout.apply(this);
			};

			autoaction.callback.apply(this , ["timeout"])
		});

		this.client.on("close" , function(){
			let autoaction = this.autoaction;
			if (autoaction.hooks.onclose) {
				autoaction.hooks.onclose.apply(this);
			};

			autoaction.callback.apply(this , ["close"]);
		});
	};

	hook(hooks) {
		this.hooks = hooks;
	}

	start(callback) {
		this.callback = callback;
		this.client.connect(this.options);
	};
}

class Factory {
	constructor(param) {
		this.script = param.script;
		this.pre_options = param.options;
		this.callback = param.callback;
	};

	create(options) {
		let record = options.data;
		let user_data = {};
		delete options.data;

		for (let name in record) {
			user_data["imp" + name.toUpperCase()] = record[name];
		};

		let full_options = Object.create(this.pre_options);

		for (let i in options) {
			full_options[i] = options[i];
		}

		for (let name in full_options) {
			user_data["var" + name.toUpperCase()] = full_options[name];
		}

		let callback = function(){};
		if (full_options.callback) {
			callback = full_options.callback;
			delete full_options.callback;
		}		

		return new AutoAction({
			script : [].concat(this.script) , 
			options : full_options , 
			data : user_data , 
			callback : callback
		});
	};
}