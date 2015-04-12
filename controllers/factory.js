"use strict";

const telnet = require("telnet-client");

class AutoAction {
	constructor(param) {
		this.hooks = {};
		this.options = param.options;
		/**
		* @type {[{"expect" : String , "command" : String}]}
		*/
		this.script = param.script;
		this.callback = param.callback;
		this.data = param.data;

		this.client = new telnet();

		// bind task information into orign telnet objects
		this.autoaction = this;

		this.client.on("ready" , function(prompt){
			let autoaction = this.autoaction;
			let task = autoaction.script.shift();

			if (!task) {
				autoaction.callback.apply(this , ["completed"]);
			}
			else {
				if (task.expect && prompt.search(task.expect) == -1) {
					autoaction.callback.apply(this , ["notexpect"]);
				}
				else {
					this.exec(task.command , function(response){
						;
					});
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
		let full_options = Object.create(this.pre_options);

		for (let i in options) {
			full_options[i] = options[i];
		}

		let callback = function(){};
		if (full_options.callback) {
			callback = full_options.callback;
			delete full_options.callback;
		}		

		return new AutoAction({
			script : [].concat(this.script) , 
			options : full_options , 
			data : options.data , 
			callback : callback
		});
	};
}