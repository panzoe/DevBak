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
		this.data = {};
		for (let tdx in param.data) {
			this.data["var" + tdx.toUpperCase()] = param.data[tdx];
		}

		this.vars = {};
		for (let jdx in this.options) {
			this.vars["imp" + jdx.toUpperCase()] = this.options[jdx];
		}

		this.client = new telnet();

		// bind task information into orign telnet objects
		this.client.autoaction = this;

		let __callback_or_log_it = function(param) {
			if (param.callback) {
				param.callback.apply(param.owner , param.parameters);
			}
			else {
				param.logger.apply(logger , param.info);
			}
		};

		this.client.on("ready" , function dotask(prompt){
			logger.log(prompt);

			let autoaction = this.autoaction;
			let task = autoaction.script.shift();

			if (task) {
				let expect = task.expect ? task.expect : autoaction.options.shellPrompt;
				if (prompt.search(task.expect) != -1) {
					let command = task.command;
					command = command.replace(/\$\{VARS_/g,"{var");
					command = format(command , autoaction.vars);
					command = command.replace(/\$\{IMPORTS_/g,"{imp");
					command = format(command , autoaction.data);
					
					logger.log(task.command);

					this.exec(command , dotask);
				}
				else {
					__callback_or_log_it({
						owner : this , 
						callback : autoaction.callback , 
						parameters : ["notexpect"] , 
						logger : logger.info , 
						info : ["telnet server return a not expect shell prompt."]
					});
				}
			}
			else {
				if (autoaction.script.length === 0) {
					__callback_or_log_it({
						owner : this , 
						callback : autoaction.callback , 
						parameters : ["completed"] , 
						logger : logger.error , 
						info : ["task completed."]
					});
				}
				else {
					__callback_or_log_it({
						owner : this , 
						callback : autoaction.callback , 
						parameters : ["scripterror"] , 
						logger : logger.warn , 
						info : ["user script's format may be in wrong way."]
					});
				}
			}
		});

		this.client.on("timeout" , function(){
			let autoaction = this.autoaction;
			if (autoaction.hooks.ontimeout) {
				autoaction.hooks.ontimeout.apply(this);
			};

			__callback_or_log_it({
				owner : this , 
				callback : autoaction.callback , 
				parameters : ["timeout"] , 
				logger : logger.info , 
				info : ["a telnet connection timeout."]
			});
		});

		this.client.on("close" , function(){
			let autoaction = this.autoaction;
			if (autoaction.hooks.onclose) {
				autoaction.hooks.onclose.apply(this);
			};

			__callback_or_log_it({
				owner : this , 
				callback : autoaction.callback , 
				parameters : ["close"] , 
				logger : logger.info , 
				info : ["a telnet connection closed."]
			});
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